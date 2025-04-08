const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./FG/FG_[03-18]_case2_impressionViewable.csv";
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;
let reportResult = [];
let impressionViewable = {};
let impressionCount = {};
let slotStatus = {};
let impressionViewableCPM = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    // if (item.pagepath.indexOf("/game/") < 0) {
    //   return;
    // }
    if (data.action == "impressionViewable") {
      reportResult.push(data);
    }
  }) //Domain
  .on("end", () => {
    _.each(reportResult, (item) => {
      let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      if (day !== "3/18/2025") {
        console.log(day);
        // return;
      }
      createVariantObject(impressionViewableCPM, item.cd3, 0);
      impressionViewableCPM[`${item.cd3}`] += +item.cd2;
      createVariantObject(impressionCount, item.cd3, 0);
      // if (item.cd26 === "dfp_rendered") {
      impressionCount[`${item.cd3}`] += 1;
      // }
      createVariantObject(impressionViewable, item.cd3, {});
      if (!impressionViewable[item.cd3][item.label]) {
        impressionViewable[item.cd3][item.label] = 1;
      } else {
        impressionViewable[item.cd3][item.label] += 1;
      }
      createVariantObject(slotStatus, item.cd3, {});
      if (!slotStatus[item.cd3][item.cd26]) {
        slotStatus[item.cd3][item.cd26] = 1;
      } else {
        slotStatus[item.cd3][item.cd26] += 1;
      }
    });
    console.log(file);
    console.table(impressionViewable);
    console.table(slotStatus);
    // console.table(slotRenderSize);
    // console.table(impressionCount);
    console.table(impressionViewableCPM);
    // Object.keys(impressionCount).forEach((variant) => {
    //   console.log(
    //     `${variant} ${impressionCount[variant]} Avg. CPM: ${
    //       impressionViewableCPM[variant] / impressionCount[variant]
    //     }`
    //   );
    // });
  });
