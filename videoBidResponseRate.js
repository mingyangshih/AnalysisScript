const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./hidden/hiddenobjectgames.com_01-21_outstream.csv";
let reportResult = [];
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;

let bidResponse = {};
let bidResponseCpm = {};
let bidResponseCpmDistribution = {};

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    if (data.action == "bidResponse") {
      reportResult.push(data);
    }
  }) //Domain
  .on("end", () => {
    _.each(reportResult, (item) => {
      if (item.action !== "bidResponse") {
        return;
      }
      if (item.pagepath.indexOf("/game/") < 0) {
        return;
      }
      // console.log(item.action);
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
      createVariantObject(bidResponseCpm, item.cd3, {});

      createVariantObject(bidResponseCpmDistribution, item.cd3, {
        ">=0.5": 0,
        ">=0.25&&<0.5": 0,
      });
      if (!bidResponse[item.cd3][item.label]) {
        bidResponse[item.cd3][item.label] = 1;
      } else {
        bidResponse[item.cd3][item.label] += 1;
      }
      if (!bidResponseCpm[item.cd3][item.label]) {
        bidResponseCpm[item.cd3][item.label] = +item.cd2;
      } else {
        bidResponseCpm[item.cd3][item.label] += +item.cd2;
      }

      if (+item.cd2 >= 0.5) {
        bidResponseCpmDistribution[item.cd3][">=0.5"] += 1;
      } else if (+item.cd2 >= 0.25 && +item.cd2 < 0.5) {
        bidResponseCpmDistribution[item.cd3][">=0.25&&<0.5"] += 1;
      } else {
        console.log(item.cd2);
      }
    });

    // console.table(bidResponseCpmDistribution);
    console.log(file);
    console.table(bidResponse);
    console.table(bidResponseCpmDistribution);
    // Object.keys(bidResponse).forEach((variant) => {
    //   Object.keys(bidResponse[variant]).forEach((adunit) => {
    //     console.log(
    //       `${variant} ${adunit} ${bidResponse[variant][adunit]} Avg. CPM: ${
    //         bidResponseCpm[variant][adunit] / bidResponse[variant][adunit]
    //       }`
    //     );
    //   });
    // });
  });
