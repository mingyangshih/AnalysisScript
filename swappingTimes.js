const xlsx = require("xlsx");
const workbook = xlsx.readFile("./hiddenobject_impressionViewable_1209.xlsx");
let workbook_sheet = workbook.SheetNames;

let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);

let vatiantBanner = {};
workbook_response.forEach((item) => {
  if (item.cd3 == 18 || item.cd3 == 19 || item.cd3 == 20) {
    if (!vatiantBanner[item.cd3]) {
      vatiantBanner[item.cd3] = {};
    }
    if (+item.cd31 > 0) {
      if (!vatiantBanner[item.cd3]["swap_times"]) {
        vatiantBanner[item.cd3]["swap_times"] = 1;
      } else {
        vatiantBanner[item.cd3]["swap_times"] += 1;
      }
    } else {
      if (!vatiantBanner[item.cd3]["no_swap_times"]) {
        vatiantBanner[item.cd3]["no_swap_times"] = 1;
      } else {
        vatiantBanner[item.cd3]["no_swap_times"] += 1;
      }
    }
  }
});
console.log("vatiantBanner", vatiantBanner);
