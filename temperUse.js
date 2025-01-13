const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
const { Parser, parse } = require("json2csv");

let pv = "./freegame.org_pv_08-22_92_93.csv";
let ympbReady = "./freegame.org_ympbReady_08-22_92_93.csv";

let pvData = [];
let ympbReadyData = [];
let outPutData = {};

const pvReadStream = fs.createReadStream(pv);
const ympbReadyReadStream = fs.createReadStream(ympbReady);
// 使用 csv-parser 解析 CSV 数据
pvReadStream
  .pipe(csv())
  .on("data", (data) => pvData.push(data)) //Domain
  .on("end", () => {
    console.log("pvData", pvData.length);
    _.each(pvData, (i) => {
      if (!outPutData[`${i.pagepath}_${i.cd3}`]) {
        outPutData[`${i.pagepath}_${i.cd3}`] = {
          pagepath: i.pagepath,
          ["Case Variant"]: i.cd3,
          pageview: 1,
          ympbReady: 0,
        };
      } else {
        outPutData[`${i.pagepath}_${i.cd3}`].pageview += 1;
      }
    });
    ympbReadyReadStream
      .pipe(csv())
      .on("data", (data) => ympbReadyData.push(data)) //Domain
      .on("end", () => {
        console.log("ympbReadyData", ympbReadyData.length);
        _.each(ympbReadyData, (i) => {
          if (!outPutData[`${i.pagepath}_${i.cd3}`]) {
            outPutData[`${i.pagepath}_${i.cd3}`] = {
              pagepath: i.pagepath,
              ["Case Variant"]: i.cd3,
              ympbReady: 1,
            };
          } else {
            outPutData[`${i.pagepath}_${i.cd3}`].ympbReady += 1;
          }
        });
        let resultData = [];
        _.forEach(outPutData, function (value) {
          value["difference(%)"] =
            ((value.pageview - value.ympbReady) / value.pageview) * 100;
          resultData.push(value);
        });
        // use json2csv chagne to csv
        if (resultData.length > 0) {
          const json2csvParser = new Parser();
          const resultDataCSV = json2csvParser.parse(resultData);
          // save file
          fs.writeFileSync(
            `./freegame.org_pv_ympbReady_08-22_92_93.csv`,
            resultDataCSV
          );
        }
      });
  });
// console.log(resultData);

// readFile();
