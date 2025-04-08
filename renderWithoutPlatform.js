const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./FG/FG_[03-18]_all_RenderWithoutPlatform.csv";
let reportResult = [];
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;

let renderWithoutPlatform = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    // if (data.action == "beforeSlotRequest") {
    reportResult.push(data);
    // }
  }) //Domain
  .on("end", () => {
    let sorted = _.sortBy(reportResult, ["uuid", "ts"]);
    _.each(sorted, (item, id) => {
      //   if (sorted[id - 1]) {
      //     if (
      //       sorted[id - 1].cd25 === sorted[id].cd25 &&
      //       sorted[id - 1].uuid === sorted[id].uuid
      //     ) {
      //       if ((+sorted[id].ts - +sorted[id - 1].ts) / 1000 < 5) {
      //         if (!secondRequest[item.cd3]["secondRequest"]) {
      //           secondRequest[item.cd3]["secondRequest"] = 1;
      //         } else {
      //           secondRequest[item.cd3]["secondRequest"] += 1;
      //         }
      //       }
      //     }
      //   }

      createVariantObject(renderWithoutPlatform, item.cd3, {});
      // createVariantObject(cd36, item.cd3, {});
      if (!renderWithoutPlatform[item.cd3][item.cd5]) {
        renderWithoutPlatform[item.cd3][item.cd5] = 1;
      } else {
        renderWithoutPlatform[item.cd3][item.cd5] += 1;
      }
      // if (!cd36[item.cd3][item.cd36]) {
      //   cd36[item.cd3][item.cd36] = 1;
      // } else {
      //   cd36[item.cd3][item.cd36] += 1;
      // }
    });
    console.log(file);
    console.table(renderWithoutPlatform);
  });
