const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./FG/FG_03-19_case1_12_2_outstream.csv";
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;
let reportResult = [];
let bidResponse = {};
let bidResponseCount = {};
let slotStatus = {};
let bidResponseCPM = {};
let total = {};
fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    if (data.action == "bidResponse" && data.label.indexOf("outstream") > -1) {
      reportResult.push(data);
    }
  }) //Domain
  .on("end", () => {
    _.each(reportResult, (item) => {
      if (item.action !== "bidResponse") {
        return;
      }

      // if (item.pagepath.indexOf("/game/") < 0) {
      //   return;
      // }
      // console.log(item.action);
      // let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
      //   timeZone: "America/New_York",
      //   year: "numeric",
      //   month: "numeric",
      //   day: "numeric",
      // });
      // if (day !== "3/11/2025") {
      //   console.log(day);
      //   return;
      // }
      createVariantObject(total, `${item.cd3}`, 0);
      createVariantObject(bidResponseCount, item.cd3, 0);
      createVariantObject(bidResponse, item.cd3, {});
      createVariantObject(slotStatus, item.cd3, {});
      createVariantObject(bidResponseCPM, item.cd3, 0);
      total[`${item.cd3}`] += 1;
      bidResponseCPM[`${item.cd3}`] += +item.cd2;
      bidResponseCount[`${item.cd3}`] += 1;
      if (!bidResponse[item.cd3][item.label]) {
        bidResponse[item.cd3][item.label] = 1;
      } else {
        bidResponse[item.cd3][item.label] += 1;
      }
      if (!slotStatus[item.cd3][item.cd26]) {
        slotStatus[item.cd3][item.cd26] = 1;
      } else {
        slotStatus[item.cd3][item.cd26] += 1;
      }
    });
    console.log(file);
    console.table(total);
    console.table(bidResponse);
    console.table(bidResponseCPM);
    Object.keys(bidResponseCount).forEach((variant) => {
      console.log(
        `${variant} Avg. CPM: ${
          bidResponseCPM[variant] / bidResponseCount[variant]
        }`
      );
    });
  });
