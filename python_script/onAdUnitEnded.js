const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
let _ = require("lodash");

// const directory =
//   "/Users/clayton/YollaWork/AnalysisScript/bubbleshooter.net/onVideoStarted";
const directory =
  "/Users/clayton/YollaWork/AnalysisScript/python_script/bubbleshooter.net/onAdUnitEnded";

// 創建統計對象
let total = 0;
let sizeObject = {};

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
        total++;
        if (+data.cm7 > 0) {
          createVariantObject(sizeObject, data.cd37, 0);
          sizeObject[data.cd37]++;
        }
      })
      .on("end", () => {
        processedFiles++;
        if (processedFiles === csvFiles.length) {
          console.table(sizeObject);
        }
      })
      .on("error", (error) => {
        console.error(`Error processing file ${file}:`, error);
      });
  });
});
