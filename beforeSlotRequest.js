const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file =
  "./bubbleshooter.net/bubbleshooter.net_06-03_beforeSlotRequest_Case1_Case3.csv";
let reportResult = [];
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;

let beforeSlotRequest = {};
let cd36 = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    if (
      data.action == "beforeSlotRequest" &&
      data.label.indexOf("outstream") > -1 &&
      data.cd3 === "3"
    ) {
      reportResult.push(data);
    }
  }) //Domain
  .on("end", () => {
    let sorted = _.sortBy(reportResult, ["uuid", "ts"]);
    _.each(sorted, (item, id) => {
      if (item.action !== "beforeSlotRequest") {
        return;
      }
      if (id === 0) {
        let day = new Date(new Number(item["ts"])).toLocaleString("en-US", {
          timeZone: "America/New_York",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        if (day !== "6/3/2025") {
          console.log(day);
          return;
        }
      }

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
