const fs = require("fs");
const xlsx = require("xlsx");
let _ = require("lodash");
let countryGroup = require("./countryGroup");
let { COUNTRY_GROUP_1, COUNTRY_GROUP_2 } = countryGroup;
const csv = require("csv-parser");
let file = "./hidden_slotRenderEnded_12-30.csv";
let datas = [];
let eachVariantNumber = {};
let eachVariantEmptyNumber = {};
let statusNumber = {};
let countryGroupNumber = {};
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
      // let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
      //   timeZone: "America/New_York",
      //   year: "numeric",
      //   month: "numeric",
      //   day: "numeric",
      // });
      // if (day !== "12/30/2024") {
      //   console.log(day);
      // }
      if (
        item.label.indexOf("leaderboard") > -1 ||
        item.label.indexOf("medrec") > -1
      ) {
        let { country } = item;

        let countryGroup = "OTHERS";
        if (COUNTRY_GROUP_1.indexOf(country) > -1) {
          countryGroup = "COUNTRY_GROUP_1";
        } else if (COUNTRY_GROUP_2.indexOf(country) > -1 || country === "US") {
          countryGroup = "COUNTRY_GROUP_2 + US";
        }
        createVariantObject(eachVariantNumber, item.cd3, 0);
        createVariantObject(eachVariantEmptyNumber, item.cd3, 0);
        createVariantObject(statusNumber, item.cd26, 0);
        createVariantObject(countryGroupNumber, item.cd3, {
          "COUNTRY_GROUP_2 + US": 0,
          OTHERS: 0,
          COUNTRY_GROUP_1: 0,
        });
        countryGroupNumber[item.cd3][countryGroup] += 1;
        eachVariantNumber[item.cd3] += 1;
        statusNumber[item.cd26] += 1;
        //   eachVariantEmptyNumber[item.cd3] += +item.cm4;
        if (item.cd26.indexOf("empty") > -1) {
          eachVariantEmptyNumber[item.cd3] += 1;
        }
      }
    });
    console.log(
      "eachVariantNumber",
      eachVariantNumber,
      "eachVariantEmptyNumber",
      eachVariantEmptyNumber,
      "statusNumber",
      statusNumber
      // "countryGroupNumber",
      // countryGroupNumber
    );
    console.log(
      `================================== ${file} ==================================`
    );
    Object.keys(eachVariantNumber).forEach((variant) => {
      console.log(
        `Empty Rate Case${variant}: ${(
          (eachVariantEmptyNumber[variant] / eachVariantNumber[variant]) *
          100
        ).toFixed(2)}%`
      );
    });
  });
