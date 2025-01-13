const xlsx = require("xlsx");
const impressionViewable = xlsx.readFile(
  "./impressionViewable/total_impressionViewable_120_223_analysis.xlsx"
);
const slotRenderEnded = xlsx.readFile(
  "./impressionViewable/total_slotRenderEnded_120_223_analysis.xlsx"
);
let impressionViewable_workbook_sheet = impressionViewable.SheetNames;
let impressionViewable_response = xlsx.utils.sheet_to_json(
  impressionViewable.Sheets[impressionViewable_workbook_sheet[0]]
);
let slotRenderEnded_workbook_sheet = slotRenderEnded.SheetNames;
let slotRenderEnded_response = xlsx.utils.sheet_to_json(
  slotRenderEnded.Sheets[slotRenderEnded_workbook_sheet[0]]
);
let viewabilityRate = [];
// console.log(slotRenderEnded_response[1]);
slotRenderEnded_response.forEach((i, idx) => {
  let cal_rate = {};
  cal_rate.refresh_count = idx;
  let keys = Object.keys(i);
  let impressionViewableData = impressionViewable_response[idx];
  //   console.log(impressionViewableData);
  keys.forEach((key) => {
    if (key !== "refresh_count" && impressionViewableData) {
      let imp_bidder;
      if (!impressionViewableData[key]) {
        imp_bidder = 0;
      } else {
        imp_bidder = impressionViewableData[key];
      }
      let render_bidder = i[key] ? i[key] : 0;
      if (render_bidder != 0) {
        let view_rate = (imp_bidder / render_bidder).toFixed(2) * 100;
        cal_rate[key] = view_rate;
      }
    }
  });
  viewabilityRate.push(cal_rate);
});
const viewabilityRate_sheet = xlsx.utils.json_to_sheet(viewabilityRate);
const viewabilityRate_book = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(
  viewabilityRate_book,
  viewabilityRate_sheet,
  "After Cal"
);
xlsx.writeFile(
  viewabilityRate_book,
  "./impressionViewable/total_viewability_120_223_analysis.xlsx"
);
