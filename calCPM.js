const fs = require("fs");
let _ = require("lodash");
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;
const csv = require("csv-parser");
const file = "./hiddenobjectgames.com_onVideoStarted_01_12.csv";
let reportResult = [];
let CPMAccumulate = {};
let variantEvents = {};
let adUnits = {};
let adUnitStatus = {};
console.log(`==================${file}=============================`);
fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => reportResult.push(data))
  .on("end", () => {
    _.forEach(reportResult, (value) => {
      if (value.label.indexOf("desktop-outstream") > -1) {
        createVariantObject(CPMAccumulate, value.cd3, 0);
        createVariantObject(variantEvents, value.cd3, 0);
        createVariantObject(adUnits, value.cd3, {});
        createVariantObject(adUnitStatus, value.cd3, {});

        CPMAccumulate[value.cd3] += +value.cm5;
        variantEvents[value.cd3] += 1;
        if (!adUnits[value.cd3][value.label]) {
          adUnits[value.cd3][value.label] = 1;
        } else {
          adUnits[value.cd3][value.label] += 1;
        }
        if (!adUnitStatus[value.cd3][value.cd26]) {
          adUnitStatus[value.cd3][value.cd26] = 1;
        } else {
          adUnitStatus[value.cd3][value.cd26] += 1;
        }
      }
    });
    console.log(CPMAccumulate, variantEvents, adUnits, adUnitStatus);
    Object.keys(CPMAccumulate).forEach((variant) => {
      console.log(
        `Case ${variant}-> Average CPM: ${
          CPMAccumulate[variant] / variantEvents[variant]
        }`
      );
    });
  });
