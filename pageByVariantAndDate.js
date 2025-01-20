const fs = require("fs");
let _ = require("lodash");
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;
const csv = require("csv-parser");
const file = "./MJ_pageview_01-12_01-13.csv";
let reportResult = [];
let variantDatePageview = {};
console.log(`==================${file}=============================`);
fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => reportResult.push(data))
  .on("end", () => {
    _.forEach(reportResult, (value) => {
      let day = new Date(new Number(value["ts"])).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      createVariantObject(variantDatePageview, value.cd3, {});
      if (!variantDatePageview[value.cd3][day]) {
        variantDatePageview[value.cd3][day] = 1;
      } else {
        variantDatePageview[value.cd3][day] += 1;
      }
    });
    console.log("variantDatePageview", variantDatePageview);
  });
