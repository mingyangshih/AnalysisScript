const fs = require("fs");
const xlsx = require("xlsx");
var _ = require("lodash");
const csv = require("csv-parser");
let onVideoStarted = "./hidden_onVideoStarted_12-10.csv";
const datas = [];
let variant = {};
let variantTotal = {};
let variantCount = {};
let variantMax = {};
fs.createReadStream(onVideoStarted)
  .pipe(csv())
  .on("data", (data) => datas.push(data)) //Domain
  .on("end", () => {
    for (let i = 0; i < datas.length; i++) {
      if (!variant[datas[i].cd3]) {
        variant[datas[i].cd3] = {
          "<=15": 0,
          ">15 && <=30": 0,
          ">30 && < 60": 0,
          ">=60": 0,
        };
      }
      if (!variantTotal[datas[i].cd3]) {
        variantTotal[datas[i].cd3] = 0;
      }
      if (!variantCount[datas[i].cd3]) {
        variantCount[datas[i].cd3] = 0;
      }
      if (!variantMax[datas[i].cd3]) {
        variantMax[datas[i].cd3] = 0;
      }

      let duration = +datas[i].cm7;
      variantTotal[datas[i].cd3] += duration;
      variantCount[datas[i].cd3] += 1;
      if (duration > variantMax[datas[i].cd3]) {
        variantMax[datas[i].cd3] = duration;
      }
      if (duration <= 15) {
        variant[datas[i].cd3]["<=15"] += 1;
      } else if (duration > 15 && duration <= 30) {
        variant[datas[i].cd3][">15 && <=30"] += 1;
      } else if (duration > 30 && duration < 60) {
        variant[datas[i].cd3][">30 && < 60"] += 1;
      } else {
        variant[datas[i].cd3][">=60"] += 1;
      }
    }
    console.log("variant", variant);
    console.log("variantTotal", variantTotal);
    console.log("variantCount", variantCount);
    console.log("variantMax", variantMax);
    // console.log(variantTotal, variantCount, variantMax);
    Object.keys(variantTotal).forEach((i) => {
      console.log(`${i} Avg Duration`, variantTotal[i] / variantCount[i]);
    });
  });

// let sorted_data = _.sortBy(combine, ["uuid", "sessionid", "ts"]);
// const combineSheet = xlsx.utils.json_to_sheet(sorted_data);
// const new_workbook = xlsx.utils.book_new();
// xlsx.utils.book_append_sheet(new_workbook, combineSheet, "Combine Sheet");
// xlsx.writeFile(new_workbook, "./Combine Sheet.xlsx");
