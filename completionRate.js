const fs = require("fs");
const xlsx = require("xlsx");
let _ = require("lodash");
let countryGroup = require("./countryGroup");
let { COUNTRY_GROUP_1, COUNTRY_GROUP_2 } = countryGroup;
const csv = require("csv-parser");
let file = "./classic_onAdUnitEnded_12-24.csv";
let datas = [];
let complete = {};
let eachVariantNumber = {};

function createVariantObject(object, variant, defaultValue) {
  if (!object[variant]) {
    object[variant] = defaultValue;
  }
}

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => datas.push(data))
  .on("end", () => {
    _.forEach(datas, (item) => {
      let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      if (day !== "12/24/2024") {
        console.log(day);
      }
      createVariantObject(complete, item.cd3, {
        complete: 0,
        notComplete: 0,
      });
      createVariantObject(eachVariantNumber, item.cd3, 0);

      let completeStatus;
      console.log(+item.cm7, +item.cm9);
      if (+item.cm7 - +item.cm9 > 1) {
        completeStatus = "notComplete";
      } else {
        completeStatus = "complete";
      }
      eachVariantNumber[item.cd3] += 1;
      complete[item.cd3][completeStatus] += 1;
    });
    console.log(
      file,
      "==============================================================="
    );
    console.log(
      "Outstream Status",
      complete,
      "Outstream Numbers",
      eachVariantNumber
    );
    Object.keys(complete).forEach((variant) => {
      Object.keys(complete[variant]).forEach((status) => {
        console.log(
          `Case${variant} ${status} Rate:${(
            (complete[variant][status] / eachVariantNumber[variant]) *
            100
          ).toFixed(2)}%`
        );
      });
    });
  });
