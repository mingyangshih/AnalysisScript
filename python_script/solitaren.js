const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
let _ = require("lodash");
let countryGroup = require("../countryGroup");
let { COUNTRY_GROUP_1, COUNTRY_GROUP_2 } = countryGroup;

// const directory =
//   "/Users/clayton/YollaWork/AnalysisScript/bubbleshooter.net/onVideoStarted";
const directory =
  "/Users/clayton/YollaWork/AnalysisScript/python_script/solitairen/Yolla";

// 創建統計對象
const stats = {
  devicecategory: {},
  country: {},
  bs: {},
};
const uuid = {};

function createVariantObject(object, variant, defaultValue) {
  if (!object[variant]) {
    object[variant] = defaultValue;
  }
}

// 讀取目錄中的所有文件
fs.readdir(directory, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  // 過濾出 CSV 文件
  const csvFiles = files.filter((file) => file.endsWith(".csv"));

  // 處理每個文件
  let processedFiles = 0;
  csvFiles.forEach((file) => {
    const filePath = path.join(directory, file);
    console.log(`Processing file: ${file}`);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        const caseKey = `Case${data.cd3}`;
        createVariantObject(stats.devicecategory, caseKey, {});
        createVariantObject(stats.country, caseKey, {});
        createVariantObject(uuid, caseKey, new Set());
        uuid[caseKey].add(data.uuid);
        let country = COUNTRY_GROUP_1.includes(data.country)
          ? "Group1"
          : COUNTRY_GROUP_2.includes(data.country)
          ? "Group2"
          : data.country;
        let width = data.bs.split("x")[0];
        let browserSize = width >= 800 ? ">=800" : "<800";
        createVariantObject(stats.bs, caseKey, {});
        if (stats.bs[caseKey][browserSize] === undefined) {
          stats.bs[caseKey][browserSize] = 0;
        } else {
          stats.bs[caseKey][browserSize] += 1;
        }
        createVariantObject(stats.bs, caseKey, {});
        if (stats.devicecategory[caseKey][data.devicecategory] === undefined) {
          stats.devicecategory[caseKey][data.devicecategory] = 0;
        } else {
          stats.devicecategory[caseKey][data.devicecategory] += 1;
        }
        if (stats.country[caseKey][country] === undefined) {
          stats.country[caseKey][country] = 0;
        } else {
          stats.country[caseKey][country] += 1;
        }
      })
      .on("end", () => {
        processedFiles++;
        if (processedFiles === csvFiles.length) {
          // Convert Set to count for each case
          const uuidCounts = {};
          Object.keys(uuid).forEach((caseKey) => {
            uuidCounts[caseKey] = uuid[caseKey].size;
          });
          console.log("Unique User Counts:");
          console.table(uuidCounts);
          console.table(uuid);
        }
      })
      .on("error", (error) => {
        console.error(`Error processing file ${file}:`, error);
      });
  });
});
