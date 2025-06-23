const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
let _ = require("lodash");
let countryGroup = require("../countryGroup");
let { COUNTRY_GROUP_1, COUNTRY_GROUP_2 } = countryGroup;

// const directory =
//   "/Users/clayton/YollaWork/AnalysisScript/bubbleshooter.net/onVideoStarted";
const directory =
  "/Users/clayton/YollaWork/AnalysisScript/python_script/sudoku/Variant";

// 創建統計對象
const stats = {
  variant: {},
};
let testCPM = 0;

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
        createVariantObject(stats.variant, data.cd3, 0);
        stats.variant[data.cd3] += 1;
      })
      .on("end", () => {
        processedFiles++;
        if (processedFiles === csvFiles.length) {
          console.table(stats.variant);
        }
      })
      .on("error", (error) => {
        console.error(`Error processing file ${file}:`, error);
      });
  });
});
