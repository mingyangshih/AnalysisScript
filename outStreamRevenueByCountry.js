const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
const { Parser, parse } = require("json2csv");

let dir = "./Video_Stats_Data";
async function readFile() {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Error reading the directory:", err);
      return;
    }
    _.each(files, (i, id) => {
      if (i.indexOf("csv") === -1) {
        return true;
      }
      // if (i.indexOf(domain) > -1) {
      //   processFile(`${dir}/${i}`, i);
      // } else {
      //   return true;
      // }
      processFile(`${dir}/${i}`, i);
    });
  });
}

function processFile(filePath, fileName) {
  console.log(fileName);
  const readStream = fs.createReadStream(filePath);
  let CSVData = [];
  // 使用 csv-parser 解析 CSV 数据
  readStream
    .pipe(csv())
    .on("data", (data) => CSVData.push(data)) //Domain
    .on("end", () => {
      let variantData = {};
      let resultData = [];
      _.each(CSVData, (item) => {
        if (item.label.indexOf("outstream") === -1) {
          return true;
        }
        if (item.action === "onVideoStarted") {
          let date = new Date(new Number(item["ts"])).toLocaleString("en-US", {
            timeZone: "America/New_York",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
          if (!variantData[`${date}_${item.cd3}_${item.country}`]) {
            variantData[`${date}_${item.cd3}_${item.country}`] = {
              date,
              variatn: item.cd3,
              hostname: item.hostname,
              domainid: item.domainid,
              cpm: +item.cd2,
              revenue: +item.cd2 / 1000,
              country: item.country,
            };
          } else {
            variantData[`${date}_${item.cd3}_${item.country}`].cpm += +item.cd2;
            variantData[`${date}_${item.cd3}_${item.country}`].revenue +=
              +item.cd2 / 1000;
          }
        }
      });
      _.forEach(variantData, function (value) {
        resultData.push(value);
      });
      // console.log(resultData);
      // use json2csv chagne to csv
      if (resultData.length > 0) {
        const json2csvParser = new Parser();
        const resultDataCSV = json2csvParser.parse(resultData);
        // save file
        fs.writeFileSync(
          `./Video_Stats_Data/result/${fileName.split("_")[0]}.csv`,
          resultDataCSV
        );
      }
    });
  // console.log(resultData);
}
readFile();
