const fs = require("fs");
const xlsx = require("xlsx");
let _ = require("lodash");
let countryGroup = require("./countryGroup");
let { COUNTRY_GROUP_1, COUNTRY_GROUP_2 } = countryGroup;
const csv = require("csv-parser");
let file = "./FG/FG_03-19_case4_12_outstream.csv";
let datas = [];
let caseOutstream = {};
let caseOutstreamGroup = {};
let caseOutstreamCPM = {};
let caseBidderGroup = {};
let caseMaxCPM = {};
function createVariantObject(object, variant, defaultValue) {
  if (!object[variant]) {
    object[variant] = defaultValue;
  }
}
fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    if (
      data.action == "onVideoStarted" &&
      data.label.indexOf("outstream") > -1
    ) {
      datas.push(data);
    }
  })
  .on("end", () => {
    let sorted = _.sortBy(datas, ["cd3"]);
    _.forEach(sorted, (item) => {
      if (item.action !== "onVideoStarted") {
        return;
      }
      if (item.label.indexOf("outstream") === -1) {
        return;
      }
      // if (item.pagepath.indexOf("/game/") < 0) {
      //   return;
      // }

      // let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
      //   timeZone: "America/New_York",
      //   year: "numeric",
      //   month: "numeric",
      //   day: "numeric",
      // });
      // if (day !== "3/9/2025") {
      // console.log(day);
      // return;
      // }

      let countryGroup = "OTHERS";
      let { country } = item;
      if (COUNTRY_GROUP_1.indexOf(country) > -1) {
        countryGroup = "COUNTRY_GROUP_1";
      } else if (COUNTRY_GROUP_2.indexOf(country) > -1 || country === "US") {
        countryGroup = "COUNTRY_GROUP_2 + US";
      }
      caseBidderGroup;
      createVariantObject(caseBidderGroup, item.cd3, {});
      createVariantObject(caseOutstreamGroup, item.cd3, {});
      createVariantObject(caseMaxCPM, `Case${item.cd3}`, 0);
      // createVariantObject(caseOutstreamCPM, `Case${item.cd3}`, {
      //   CPM: 0,
      //   "Outstream Revenue": 0,
      // });
      createVariantObject(caseOutstreamCPM, `Case${item.cd3}`, 0);
      createVariantObject(caseOutstream, `Case${item.cd3}`, 0);
      // if (item.cd5 === "Outstream_HYB") {
      caseOutstream[`Case${item.cd3}`] += 1;
      // }

      caseOutstreamCPM[`Case${item.cd3}`] += +item.cd2;
      // caseOutstreamCPM[`Case${item.cd3}`]["Outstream Revenue"] =
      //   caseOutstreamCPM[`Case${item.cd3}`]["CPM"] / 1000;
      if (item.cm5 > caseMaxCPM[`Case${item.cd3}`]) {
        caseMaxCPM[`Case${item.cd3}`] = item.cd2;
      }

      if (!caseOutstreamGroup[item.cd3][countryGroup]) {
        caseOutstreamGroup[item.cd3][countryGroup] = 1;
      } else {
        caseOutstreamGroup[item.cd3][countryGroup] += 1;
      }
      if (!caseBidderGroup[item.cd3][item.cd1]) {
        caseBidderGroup[item.cd3][item.cd1] = 1;
      } else {
        caseBidderGroup[item.cd3][item.cd1] += 1;
      }
    });

    console.table(caseOutstream);
    console.table(caseOutstreamCPM);
    Object.keys(caseOutstream).forEach((variant) => {
      console.log(
        `${variant} Avg. CPM: ${
          caseOutstreamCPM[variant] / caseOutstream[variant]
        }`
      );
    });
  });
