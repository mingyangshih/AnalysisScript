const fs = require("fs");
const xlsx = require("xlsx");
let _ = require("lodash");
let countryGroup = require("./countryGroup");
let { COUNTRY_GROUP_1, COUNTRY_GROUP_2 } = countryGroup;
const csv = require("csv-parser");
let report = "./FG_duration_12-24.csv";
let reportResult = [];

let durationAccu = {};
let durationCountryAccu = {};
let durationCount = {};
let durationCountryCount = {};

function createVariantObject(object, variant, defaultValue) {
  if (!object[variant]) {
    object[variant] = defaultValue;
  }
}
fs.createReadStream(report)
  .pipe(csv())
  .on("data", (data) => reportResult.push(data))
  .on("end", () => {
    _.forEach(reportResult, (value) => {
      let { country } = value;
      let countryGroup = "OTHERS";
      if (COUNTRY_GROUP_1.indexOf(country) > -1) {
        countryGroup = "COUNTRY_GROUP_1";
      } else if (COUNTRY_GROUP_2.indexOf(country) > -1 || country === "US") {
        countryGroup = "COUNTRY_GROUP_2 + US";
      }
      createVariantObject(durationAccu, value.cd3, 0);
      createVariantObject(durationCount, value.cd3, 0);
      createVariantObject(durationCountryAccu, value.cd3, {
        COUNTRY_GROUP_1: 0,
        "COUNTRY_GROUP_2 + US": 0,
        OTHERS: 0,
      });
      createVariantObject(durationCountryCount, value.cd3, {
        COUNTRY_GROUP_1: 0,
        "COUNTRY_GROUP_2 + US": 0,
        OTHERS: 0,
      });
      durationAccu[value.cd3] += +value.value;
      durationCount[value.cd3] += 1;
      durationCountryAccu[value.cd3][countryGroup] += +value.value;
      durationCountryCount[value.cd3][countryGroup] += 1;
    });
    // console.log(durationCount, durationCountryCount);
    Object.keys(durationCount).forEach((variant) => {
      console.log(
        `Avg. Duration: Case${variant} ${(
          durationAccu[variant] /
          1000 /
          durationCount[variant]
        ).toFixed(2)}(s)`
      );
    });
    Object.keys(durationCountryCount).forEach((variant) => {
      Object.keys(durationCountryCount[variant]).forEach((country) => {
        console.log(
          `Avg. Duration: Case${variant} ${country} ${(
            durationCountryAccu[variant][country] /
            1000 /
            durationCountryCount[variant][country]
          ).toFixed(2)}(s)`
        );
      });
    });
  });
