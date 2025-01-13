const xlsx = require("xlsx");

const workbook = xlsx.readFile("./adPosition/adPosition_0404_0406_183.xlsx");
let workbook_sheet = workbook.SheetNames;
let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);
workbook_response.forEach((item) => {
  let tpArray = item.tp.split(",");
  let [top, bottom, left, right] = tpArray;
  let adSize = `${tpArray[3] - tpArray[2]}x${tpArray[1] - tpArray[0]}`;
  let adArea = (tpArray[3] - tpArray[2]) * (tpArray[1] - tpArray[0]);
  item.adSize = adSize;
  let bs = item.browsersize.split("x");
  let bs_new = item.bs.split("x");
  let bsArea = bs[0] * bs[1];
  let adCoverPercent = ((adArea / bsArea) * 100).toFixed(0);
  if (item.devicecategory === "Mobile") {
    item.top = top;
    item.bottom = bottom;
    item.left = left;
    item.right = right;
    item.adCoverPercent = adCoverPercent;
    item.exceedTop = Number(tpArray[0]) < 0 ? true : false;
    item.exceedBottom = Number(tpArray[1]) > Number(bs[1]) ? true : false;
    item.exceedWidth =
      Number(tpArray[3]) - Number(tpArray[2]) > Number(bs[0]) ? true : false;
    item.exceedHeight =
      Number(tpArray[1]) - Number(tpArray[0]) > Number(bs[1]) ? true : false;
    item.bsExceedBottom = Number(tpArray[1]) > Number(bs_new[1]) ? true : false;
  }
});
const new_workbook_sheet = xlsx.utils.json_to_sheet(workbook_response);
const new_workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(new_workbook, new_workbook_sheet, "After Cal");
xlsx.writeFile(new_workbook, "./adPosition/adPosition_0404_0406_183.xlsx");
