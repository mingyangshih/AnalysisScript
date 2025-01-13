const xlsx = require("xlsx");
const workbook = xlsx.readFile(
  "./impressionViewable/slotRenderEnded_120_223.xlsx"
);
let workbook_sheet = workbook.SheetNames;
let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);
let total_bidders = {};
// console.log(workbook_response[2]);
workbook_response.forEach((i, idx) => {
  let label = i.label;
  let refresh_count = i.cd4;
  let bidder = i.cd1 ? i.cd1 : "empty";

  // console.log(total_bidders[label][refresh_count]);
  if (!total_bidders[refresh_count]) {
    total_bidders[refresh_count] = {
      [bidder]: 1,
    };
  } else {
    if (!total_bidders[refresh_count][bidder]) {
      total_bidders[refresh_count][bidder] = 1;
    } else {
      total_bidders[refresh_count][bidder] += 1;
    }
  }
});
// console.log(total_bidders);
let output = [];
// console.log(Object.keys(total_bidders));
let keys = Object.keys(total_bidders);
keys.forEach((i) => {
  total_bidders[i]["refresh_count"] = i;
  output.push(total_bidders[i]);
});
const total_sheet = xlsx.utils.json_to_sheet(output);
const total_book = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(total_book, total_sheet, "After Cal");
xlsx.writeFile(
  total_book,
  "./impressionViewable/total_slotRenderEnded_120_223_analysis.xlsx"
);
