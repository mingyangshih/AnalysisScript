const xlsx = require("xlsx");
// import xlsx from "xlsx";
// import * as xlsx from "xlsx";
const workbook = xlsx.readFile("./actiongame_1204_duration.xlsx");
let workbook_sheet = workbook.SheetNames;

let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);

let variants = {};
let duration = {};
let avgDuration = {};
workbook_response.forEach((i) => {
  if (i.cd3 == 21 || i.cd3 == 22) {
    if (!variants[i.cd3]) {
      variants[i.cd3] = 1;
    } else {
      variants[i.cd3] += 1;
    }
    if (!duration[i.cd3]) {
      duration[i.cd3] = +i.value;
    } else {
      duration[i.cd3] += +i.value;
    }
  }
});
Object.keys(duration).forEach((i) => {
  avgDuration[i] = duration[i] / variants[i];
});
console.log(
  "variants",
  variants,
  "duration",
  duration,
  "avgduration",
  avgDuration
);
