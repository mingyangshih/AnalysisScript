const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file =
  "./action/actiongames.com_02-02_onVideoLoaded_onAdUnitError_onPlayerRequestVast.csv";
let reportResult = [];
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;

let onAdUnitError = {};
let onVideoLoaded = {};
let onPlayerRequestVast = {};
let errorCode = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    // if (data.action == "onAdUnitError") {
    //   reportResult.push(data);
    // }
    reportResult.push(data);
  }) //Domain
  .on("end", () => {
    _.each(reportResult, (item, id) => {
      // if (item.action !== "onAdUnitError") {
      //   return;
      // }

      // if (item.pagepath.indexOf("/game/") < 0) {
      //   return;
      // }
      //   console.log(item.action);
      createVariantObject(onAdUnitError, item.cd3, {
        openx: 0,
        pubmatic: 0,
        rubicon: 0,
        triplelift: 0,
        pulsepoint: 0,
        ix: 0,
        appnexus: 0,
        "": 0,
      });
      createVariantObject(onVideoLoaded, item.cd3, {
        openx: 0,
        pubmatic: 0,
        rubicon: 0,
        triplelift: 0,
        pulsepoint: 0,
        ix: 0,
        appnexus: 0,
        "": 0,
      });
      createVariantObject(onPlayerRequestVast, item.cd3, {
        openx: 0,
        pubmatic: 0,
        rubicon: 0,
        triplelift: 0,
        pulsepoint: 0,
        ix: 0,
        appnexus: 0,
        "": 0,
      });

      if (item.action === "onAdUnitError") {
        if (!onAdUnitError[item.cd3][item.cd1]) {
          if (item.cd6.indexOf("ima_") > -1) {
            onAdUnitError[item.cd3][item.cd1] = 1;
          }
        } else {
          if (item.cd6.indexOf("ima_") > -1) {
            onAdUnitError[item.cd3][item.cd1] += 1;
          }
        }
      }
      if (item.action === "onVideoLoaded") {
        if (!onVideoLoaded[item.cd3][item.cd1]) {
          onVideoLoaded[item.cd3][item.cd1] = 1;
        } else {
          onVideoLoaded[item.cd3][item.cd1] += 1;
        }
      }
      if (item.action === "onPlayerRequestVast") {
        if (!onPlayerRequestVast[item.cd3][item.cd1]) {
          onPlayerRequestVast[item.cd3][item.cd1] = 1;
        } else {
          onPlayerRequestVast[item.cd3][item.cd1] += 1;
        }
      }
    });
    console.log(
      "================onPlayerRequestVast=================================="
    );
    console.table(onPlayerRequestVast);
    console.log(
      "================onVideoLoaded========================================"
    );
    console.table(onVideoLoaded);
    console.log(
      "================onAdUnitError========================================"
    );
    console.table(onAdUnitError);
  });
