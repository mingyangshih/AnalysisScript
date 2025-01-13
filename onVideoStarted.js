const fs = require("fs");
const xlsx = require("xlsx");
let _ = require("lodash");
let countryGroup = require("./countryGroup");
let { COUNTRY_GROUP_1, COUNTRY_GROUP_2 } = countryGroup;
const csv = require("csv-parser");
let onVideoStarated = "./hidden_onVideoStarted_12-30.csv";

let datas = [];
let caseOutstream = {};
let caseOutstreamGroup = {};
let caseOutstreamCPM = {};
function createVariantObject(object, variant, defaultValue) {
  if (!object[variant]) {
    object[variant] = defaultValue;
  }
}
fs.createReadStream(onVideoStarated)
  .pipe(csv())
  .on("data", (data) => datas.push(data))
  .on("end", () => {
    let sorted = _.sortBy(datas, ["cd3"]);
    _.forEach(sorted, (item) => {
      let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      if (day !== "12/30/2024") {
        console.log(day);
      }
      let countryGroup = "OTHERS";
      let { country } = item;
      if (COUNTRY_GROUP_1.indexOf(country) > -1) {
        countryGroup = "COUNTRY_GROUP_1";
      } else if (COUNTRY_GROUP_2.indexOf(country) > -1 || country === "US") {
        countryGroup = "COUNTRY_GROUP_2 + US";
      }
      createVariantObject(caseOutstreamGroup, item.cd3, {});
      createVariantObject(caseOutstreamCPM, `Case${item.cd3}`, 0);
      createVariantObject(caseOutstream, `Case${item.cd3}`, 0);
      caseOutstream[`Case${item.cd3}`] += 1;
      caseOutstreamCPM[`Case${item.cd3}`] += +item.cm5;
      if (!caseOutstreamGroup[item.cd3][countryGroup]) {
        caseOutstreamGroup[item.cd3][countryGroup] = 1;
      } else {
        caseOutstreamGroup[item.cd3][countryGroup] += 1;
      }
    });

    console.log(
      "caseOutstream",
      caseOutstream,
      // "caseOutstreamGroup",
      // caseOutstreamGroup
      "caseOutstreamCPM",
      caseOutstreamCPM
    );
    Object.keys(caseOutstream).forEach((variant) => {
      console.log(
        `${variant}: ${caseOutstreamCPM[variant] / caseOutstream[variant]}`
      );
    });
  });
