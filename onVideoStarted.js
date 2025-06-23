const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
let _ = require("lodash");

// const directory =
//   "/Users/clayton/YollaWork/AnalysisScript/bubbleshooter.net/onVideoStarted";
const directory =
  "/home/ubuntu/YAReport/calScripts/bubbleshooter.net/onVideoStarted";

// 創建統計對象
const stats = {
  caseOutstream: {},
  caseOutstreamCPM: {},
  caseOutstreamCPM_cd40_4: {},
  caseOutstreamCPM_cd40_not_4: {},
};
let testCPM = 0;

function createVariantObject(object, variant, defaultValue) {
  if (!object[variant]) {
    object[variant] = defaultValue;
  }
}

// 格式化數字：除以1000並保留兩位小數
function formatNumber(num) {
  return (num / 1000).toFixed(2);
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
        if (
          data.action == "onVideoStarted" &&
          data.label.indexOf("outstream") > -1
        ) {
          const caseKey = `Case${data.cd3}`;

          // 初始化統計對象
          createVariantObject(stats.caseOutstream, caseKey, 0);
          createVariantObject(stats.caseOutstreamCPM, caseKey, 0);
          createVariantObject(stats.caseOutstreamCPM_cd40_4, caseKey, 0);
          createVariantObject(stats.caseOutstreamCPM_cd40_not_4, caseKey, 0);

          // 更新統計
          stats.caseOutstream[caseKey] += 1;
          stats.caseOutstreamCPM[caseKey] += +data.cd2;

          // 根據 cd40 分類累加 cd2
          if (data.cd40 === "4") {
            stats.caseOutstreamCPM_cd40_4[caseKey] += +data.cd2;
            testCPM += +data.cd2;
          } else {
            stats.caseOutstreamCPM_cd40_not_4[caseKey] += +data.cd2;
          }
        }
      })
      .on("end", () => {
        processedFiles++;
        if (processedFiles === csvFiles.length) {
          // 創建整合的表格數據
          const combinedTable = {};

          Object.keys(stats.caseOutstream).forEach((variant) => {
            const count = stats.caseOutstream[variant];
            const totalCPM = stats.caseOutstreamCPM[variant];
            const cpm_cd40_4 = stats.caseOutstreamCPM_cd40_4[variant];
            const cpm_cd40_not_4 = stats.caseOutstreamCPM_cd40_not_4[variant];

            combinedTable[variant] = {
              Count: count,
              "Total CPM (K)": formatNumber(totalCPM),
              "Avg CPM (K)": formatNumber(totalCPM / count),
              "CPM cd40=4 (K)": formatNumber(cpm_cd40_4),
              "Avg CPM cd40=4 (K)": formatNumber(cpm_cd40_4 / count),
              "CPM cd40!=4 (K)": formatNumber(cpm_cd40_not_4),
              "Avg CPM cd40!=4 (K)": formatNumber(cpm_cd40_not_4 / count),
            };
          });

          console.log("\n=== Combined Statistics ===");
          console.table(combinedTable);
        }
      })
      .on("error", (error) => {
        console.error(`Error processing file ${file}:`, error);
      });
  });
});
