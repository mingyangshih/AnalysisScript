const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./FG/FG_[03-18]_case4_slotRenderEnded.csv";
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;
let reportResult = [];
let slotRenderEnded = {};
let slotRenderCount = {};
let slotStatus = {};
let slotRenderSize = {};
let slotRenderEndedCPM = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    // if (item.pagepath.indexOf("/game/") < 0) {
    //   return;
    // }
    if (data.action == "slotRenderEnded") {
      reportResult.push(data);
    }
  }) //Domain
  .on("end", () => {
    _.each(reportResult, (item) => {
      // if (item.action !== "slotRenderEnded") {
      //   return;
      // }

      // let tpArray = item.tp.split(",");
      // let adWidth = +tpArray[3] - +tpArray[2];
      // let adHeight = +tpArray[1] - +tpArray[0];

      // createVariantObject(slotRenderSize, item.cd3, {
      //   "height > 250": 0,
      //   "height <= 250": 0,
      // });
      // if (adHeight > 250) {
      //   if (item.cd26 === "dfp_rendered") {
      //     slotRenderSize[item.cd3]["height > 250"] += 1;
      //   }
      // } else {
      //   if (item.cd26 === "dfp_rendered") {
      //     slotRenderSize[item.cd3]["height <= 250"] += 1;
      //   }
      // }
      createVariantObject(slotRenderEndedCPM, item.cd3, 0);
      slotRenderEndedCPM[`${item.cd3}`] += +item.cd2;
      createVariantObject(slotRenderCount, item.cd3, 0);
      if (item.cd26 === "dfp_rendered") {
        slotRenderCount[`${item.cd3}`] += 1;
      }
      createVariantObject(slotRenderEnded, item.cd3, {});
      if (!slotRenderEnded[item.cd3][item.label]) {
        slotRenderEnded[item.cd3][item.label] = 1;
      } else {
        slotRenderEnded[item.cd3][item.label] += 1;
      }
      createVariantObject(slotStatus, item.label, {
        dfp_rendered: 0,
        dfp_empty: 0,
        prebid_render: 0,
      });
      if (!slotStatus[item.label][item.cd26]) {
        slotStatus[item.label][item.cd26] = 1;
      } else {
        slotStatus[item.label][item.cd26] += 1;
      }
    });
    console.log(file);
    console.table(slotRenderEnded);
    console.table(slotStatus);
    // console.table(slotRenderSize);
    console.table(slotRenderCount);
    Object.keys(slotRenderCount).forEach((variant) => {
      console.log(
        `${variant} ${slotRenderCount[variant]} Avg. CPM: ${
          slotRenderEndedCPM[variant] / slotRenderCount[variant]
        }`
      );
    });
  });
