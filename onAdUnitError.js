const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./hidden/hidden_03-09.csv";
let reportResult = [];
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;

let onAdUnitError = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    if (
      data.action == "onAdUnitError" &&
      data.label.indexOf("outstream") > -1
    ) {
      reportResult.push(data);
    }
  }) //Domain
  .on("end", () => {
    _.each(reportResult, (item, id) => {
      if (item.action !== "onAdUnitError") {
        return;
      }
      let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      if (day !== "3/9/2025") {
        // console.log(day);
        return;
      }
      // if (item.pagepath.indexOf("/game/") < 0) {
      //   return;
      // }
      //   console.log(item.action);
      // createVariantObject(onAdUnitError, item.cd3, {
      //   openx: 0,
      //   pubmatic: 0,
      //   rubicon: 0,
      //   triplelift: 0,
      //   pulsepoint: 0,
      //   ix: 0,
      //   appnexus: 0,
      //   "": 0,
      // });
      createVariantObject(onAdUnitError, item.cd3, 0);
      // createVariantObject(onAdUnitError, item.cd3, {});
      if (item.action === "onAdUnitError") {
        if (item.cd6.indexOf("ima_") > -1) {
          onAdUnitError[item.cd3] += 1;
          if (!onAdUnitError[item.cd3][item.cd6]) {
            // onAdUnitError[item.cd3][item.cd6] = 1;
          } else {
            onAdUnitError[item.cd3][item.cd6] += 1;
          }
        }
      }
    });

    console.log(
      "================onAdUnitError========================================"
    );
    console.table(onAdUnitError);
  });
