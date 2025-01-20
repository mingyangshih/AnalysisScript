const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./classicgame.com_01_18.csv";
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;
let reportResult = [];
let slotRenderEnded = {};
let slotRenderCount = {};
let slotStatus = {};
let slotRenderEndedCPM = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => reportResult.push(data)) //Domain
  .on("end", () => {
    _.each(reportResult, (item) => {
      if (item.action !== "slotRenderEnded") {
        return;
      }
      console.log(item.action);
      //   let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
      //     timeZone: "America/New_York",
      //     year: "numeric",
      //     month: "numeric",
      //     day: "numeric",
      //   });
      //   if (day !== "1/18/2025") {
      //     console.log(day);
      //   }

      createVariantObject(slotRenderCount, item.cd3, 0);
      createVariantObject(slotRenderEnded, item.cd3, {});
      createVariantObject(slotStatus, item.cd3, {});
      createVariantObject(slotRenderEndedCPM, item.cd3, 0);
      slotRenderEndedCPM[`${item.cd3}`] += +item.cd2;
      slotRenderCount[`${item.cd3}`] += 1;
      if (!slotRenderEnded[item.cd3][item.label]) {
        slotRenderEnded[item.cd3][item.label] = 1;
      } else {
        slotRenderEnded[item.cd3][item.label] += 1;
      }
      if (!slotStatus[item.cd3][item.cd26]) {
        slotStatus[item.cd3][item.cd26] = 1;
      } else {
        slotStatus[item.cd3][item.cd26] += 1;
      }
    });
    console.log(slotRenderEnded);
    Object.keys(slotRenderCount).forEach((variant) => {
      console.log(
        `${variant} Avg. CPM: ${
          slotRenderEndedCPM[variant] / slotRenderCount[variant]
        }`
      );
    });
  });
