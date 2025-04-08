const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./FG/FG_[03-18]_case4_beforeSlotRequest.csv";
let reportResult = [];
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;

let beforeSlotRequest = {};
let cd36 = {};
let secondRequest = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    if (data.action == "beforeSlotRequest") {
      reportResult.push(data);
    }
  }) //Domain
  .on("end", () => {
    let sorted = _.sortBy(reportResult, ["uuid", "ts"]);
    _.each(sorted, (item, id) => {
      if (item.action !== "beforeSlotRequest") {
        return;
      }
      createVariantObject(secondRequest, item.cd3, {});
      if (sorted[id - 1]) {
        if (
          sorted[id - 1].cd25 === sorted[id].cd25 &&
          sorted[id - 1].uuid === sorted[id].uuid
        ) {
          if ((+sorted[id].ts - +sorted[id - 1].ts) / 1000 < 5) {
            if (!secondRequest[item.cd3]["secondRequest"]) {
              secondRequest[item.cd3]["secondRequest"] = 1;
            } else {
              secondRequest[item.cd3]["secondRequest"] += 1;
            }
          }
        }
      }
      // let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
      //   timeZone: "America/New_York",
      //   year: "numeric",
      //   month: "numeric",
      //   day: "numeric",
      // });
      // if (day !== "3/9/2025") {
      // console.log(day);
      // return;
      // }

      // if (item.pagepath.indexOf("/game/") < 0) {
      //   return;
      // }

      createVariantObject(beforeSlotRequest, item.cd3, {});
      // createVariantObject(cd36, item.cd3, {});
      if (!beforeSlotRequest[item.cd3][item.label]) {
        beforeSlotRequest[item.cd3][item.label] = 1;
      } else {
        beforeSlotRequest[item.cd3][item.label] += 1;
      }
      // if (!cd36[item.cd3][item.cd36]) {
      //   cd36[item.cd3][item.cd36] = 1;
      // } else {
      //   cd36[item.cd3][item.cd36] += 1;
      // }
    });
    console.log(file);
    console.table(beforeSlotRequest);
    // console.table(cd36);
    // console.table(secondRequest);
  });
