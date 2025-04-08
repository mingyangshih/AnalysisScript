const fs = require("fs");
var _ = require("lodash");
const xlsx = require("xlsx");
const csv = require("csv-parser");
// let file = "./hidden/hiddenobjectgames.com_02-03_outstream.csv";
let file = "./FG/FG_03-19_case1_12_outstream.csv";
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;
let reportResult = [];
let bidRequestTimes = {};
let total = {};
let cd36 = {};
fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    if (
      data.action == "bidRequested" &&
      data.label.indexOf("outstream") > -1
      // data.cd1 === "pulsepoint_v"
    ) {
      reportResult.push(data);
    }
  }) //Domain
  .on("end", () => {
    let sorted = _.sortBy(reportResult, ["uuid", "ts"]);
    _.each(sorted, (item, id) => {
      if (item.action !== "bidRequested") {
        return;
      }
      let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      if (day !== "3/19/2025") {
        console.log(day);
        return;
      }
      createVariantObject(total, `${item.cd3}`, 0);
      createVariantObject(bidRequestTimes, `${item.cd3}`, {});
      createVariantObject(cd36, `${item.cd3}`, {});
      total[`${item.cd3}`] += 1;
      if (!bidRequestTimes[`${item.cd3}`][item.label]) {
        bidRequestTimes[`${item.cd3}`][item.label] = 1;
      } else {
        bidRequestTimes[`${item.cd3}`][item.label] += 1;
      }
      if (!cd36[`${item.cd3}`][item.cd36]) {
        cd36[`${item.cd3}`][item.cd36] = 1;
      } else {
        cd36[`${item.cd3}`][item.cd36] += 1;
      }
      // if (!gapTime[`Case ${item.cd3}`][item.cd1]) {
      //   gapTime[`Case ${item.cd3}`][item.cd1] = requestedGap;
      // } else {
      //   gapTime[`Case ${item.cd3}`][item.cd1] += requestedGap;
      // }
      //   }
      // }

      // let browserWidth = +item.bs.split("x")[0];

      // let browserDistribute = "";
      // if (browserWidth >= 1200) {
      //   browserDistribute = "XL";
      // } else if (browserWidth < 1200 && browserWidth >= 992) {
      //   browserDistribute = "L";
      // } else {
      //   browserDistribute = "S";
      // }
      // createVariantObject(browserDis, `Case ${item.cd3}`, {
      //   XL: 0,
      //   L: 0,
      //   S: 0,
      // });
      // browserDis[`Case ${item.cd3}`][browserDistribute] += 1;
    });
    console.log("bidRequestTimes");
    console.log(file);
    console.table(total);
    console.table(bidRequestTimes);
  });
