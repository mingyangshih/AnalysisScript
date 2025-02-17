const fs = require("fs");
var _ = require("lodash");
const xlsx = require("xlsx");
const csv = require("csv-parser");
// let file = "./hidden/hiddenobjectgames.com_02-03_outstream.csv";
let file = "./hidden/hiddenobjectgames.com_01-21_outstream.csv";
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;
let reportResult = [];
let bidRequestTimes = {};
let gapTime = {};
let browserDis = {};
let cd36 = {};
fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    if (
      data.action == "bidRequested" &&
      data.pagepath.indexOf("/game/") > -1
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
      if (item.pagepath.indexOf("/game/") < 0) {
        return;
      }

      createVariantObject(bidRequestTimes, `${item.cd3}`, {});
      createVariantObject(cd36, `${item.cd3}`, {});
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
    // console.log(bidRequestTimes);
    console.table(bidRequestTimes);
    // console.log(cd36);
    // console.table(gapTime);
    // console.table(browserDis);
    // let output = [];
    // Object.keys(bidRequestTimes).forEach((i) => {
    //   output.push(bidRequestTimes[i]);
    // });
    // const bidRequested = xlsx.utils.json_to_sheet(output);

    // const bidRequested_book = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(bidRequested_book, bidRequested, "After Cal");

    // xlsx.writeFile(bidRequested_book, "./hidden_bidRequested.xlsx");
    // Object.keys(bidRequestTimes).forEach((variant) => {
    //   Object.keys(bidRequestTimes[variant]).forEach((bidder) => {
    //     console.log(
    //       `${variant} ${bidder} Avg. Gap: ${
    //         gapTime[variant][bidder] / 1000 / bidRequestTimes[variant][bidder]
    //       }`
    //     );
    //   });
    // });
  });
