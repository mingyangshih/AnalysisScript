// const xlsx = require("xlsx");
// const workbook = xlsx.readFile("./hiddenobject_slotRenderEnded_1210.xlsx");
// let workbook_sheet = workbook.SheetNames;

const fs = require("fs");
const xlsx = require("xlsx");
var _ = require("lodash");
const csv = require("csv-parser");
let bidResponse = "./hidden_bidResponse_12-06_12-10.csv";
let onVideoStarted = "./hidden_onVideoStarted_12-06_12-10.csv";
let bidResponseDatas = [];
let onVideoStartedDatas = [];
let variant = {};
let count = {};
let gapDistribution = {};
let maxGap = {};
fs.createReadStream(bidResponse)
  .pipe(csv())
  .on("data", (data) => bidResponseDatas.push(data)) //Domain
  .on("end", () => {
    // Calculate Average CPM ====================================
    // bidResponseResults.forEach((item) => {
    //   if (!variant[item.cd3]) {
    //     variant[item.cd3] = 0;
    //   }
    //   if (!count[item.cd3]) {
    //     count[item.cd3] = 0;
    //   }
    //   if (item.label.indexOf("medrec") > -1) {
    //     variant[item.cd3] += +item.cm5;
    //     count[item.cd3] += 1;
    //   }
    // });

    // Object.keys(count).forEach((i) => {
    //   console.log(`${i} Avg CPM`, variant[i] / count[i]);
    // });
    // ===========================================================
    // Calculate bidResponse to VideoStarted Time Gap
    fs.createReadStream(onVideoStarted)
      .pipe(csv())
      .on("data", (data) => onVideoStartedDatas.push(data))
      .on("end", () => {
        let datas = [...bidResponseDatas, ...onVideoStartedDatas];
        let sortedData = _.sortBy(datas, ["uuid", "sessionid", "ts"]);
        for (let i = 0; i < sortedData.length; i++) {
          if (!sortedData[i + 1]) {
            break;
          }
          if (!variant[sortedData[i].cd3]) {
            variant[sortedData[i].cd3] = 0;
          }
          if (!count[sortedData[i].cd3]) {
            count[sortedData[i].cd3] = 0;
          }
          if (!maxGap[sortedData[i].cd3]) {
            maxGap[sortedData[i].cd3] = 0;
          }
          if (!gapDistribution[sortedData[i].cd3]) {
            gapDistribution[sortedData[i].cd3] = 0;
            gapDistribution[sortedData[i].cd3] = {
              "<=5": 0,
              ">5 && <=10": 0,
              ">10 && <=15": 0,
              ">15": 0,
              // ">=6 && <7": 0,
              // ">=7 && <8": 0,
              // ">=8 && <9": 0,
              // ">=9 && <10": 0,
              // ">=10": 0,
            };
          }

          if (sortedData[i].action === "bidResponse") {
            if (
              sortedData[i + 1].action === "onVideoStarted" &&
              sortedData[i].uuid === sortedData[i + 1].uuid &&
              sortedData[i].sessionid === sortedData[i + 1].sessionid
            ) {
              let gap = Math.round(
                (+sortedData[i + 1].ts - +sortedData[i].ts) / 1000
              );
              variant[sortedData[i].cd3] += gap;
              count[sortedData[i].cd3] += 1;
              if (gap > maxGap[sortedData[i].cd3]) {
                maxGap[sortedData[i].cd3] = gap;
              }
              if (gap <= 5) {
                gapDistribution[sortedData[i].cd3]["<=5"] += 1;
              } else if (gap > 5 && gap <= 10) {
                gapDistribution[sortedData[i].cd3][">5 && <=10"] += 1;
              } else if (gap > 10 && gap <= 15) {
                gapDistribution[sortedData[i].cd3][">10 && <=15"] += 1;
              } else {
                gapDistribution[sortedData[i].cd3][">15"] += 1;
              }
              // else if (gap >= 7 && gap < 8) {
              //   gapDistribution[sortedData[i].cd3][">=7 && <8"] += 1;
              // } else if (gap >= 8 && gap < 9) {
              //   gapDistribution[sortedData[i].cd3][">=8 && <9"] += 1;
              // } else if (gap >= 9 && gap < 10) {
              //   gapDistribution[sortedData[i].cd3][">=9 && <10"] += 1;
              // } else {
              //   gapDistribution[sortedData[i].cd3][">=10"] += 1;
              // }
            }
          }
        }
        console.log(
          "variant",
          variant,
          "count",
          count,
          "gapDistribution",
          gapDistribution,
          "maxGap",
          maxGap
        );
        Object.keys(count).forEach((i) => {
          console.log(
            `Case ${i} Avg time between bid response and video start`,
            `${(variant[i] / count[i]).toFixed(2)} (s)`
          );
        });
        // const combineSheet = xlsx.utils.json_to_sheet(sortedData);
        // const new_workbook = xlsx.utils.book_new();
        // xlsx.utils.book_append_sheet(
        //   new_workbook,
        //   combineSheet,
        //   "Combine Sheet"
        // );
        // xlsx.writeFile(new_workbook, "./sortedData_gap_time.xlsx");
      });
  });
