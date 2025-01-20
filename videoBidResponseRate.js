const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./classicgame.com_01_18.csv";
let reportResult = [];
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;

let bidResponse = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => reportResult.push(data)) //Domain
  .on("end", () => {
    _.each(reportResult, (item) => {
      if (item.action !== "bidResponse") {
        return;
      }
      console.log(item.action);
      // let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
      //   timeZone: "America/New_York",
      //   year: "numeric",
      //   month: "numeric",
      //   day: "numeric",
      // });
      // if (day !== "1/18/2025") {
      //   console.log(day);
      // }
      createVariantObject(bidResponse, item.cd3, {});
      if (!bidResponse[item.cd3][item.label]) {
        bidResponse[item.cd3][item.label] = 1;
      } else {
        bidResponse[item.cd3][item.label] += 1;
      }
    });
    console.log(bidResponse);
  });
