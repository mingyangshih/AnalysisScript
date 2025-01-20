const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./actiongame.com_01_18.csv";
let reportResult = [];
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;

let beforeSlotRequest = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => reportResult.push(data)) //Domain
  .on("end", () => {
    _.each(reportResult, (item) => {
      if (item.action !== "beforeSlotRequest") {
        return;
      }
      let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      if (day !== "1/18/2025") {
        console.log(day);
      }
      createVariantObject(beforeSlotRequest, item.cd3, {});
      if (!beforeSlotRequest[item.cd3][item.label]) {
        beforeSlotRequest[item.cd3][item.label] = 1;
      } else {
        beforeSlotRequest[item.cd3][item.label] += 1;
      }
    });
    console.log(beforeSlotRequest);
  });
