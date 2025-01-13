// dimension4: refresh count
// dimension1: bidder
const xlsx = require("xlsx");
// import xlsx from "xlsx";
// import * as xlsx from "xlsx";
const workbook = xlsx.readFile("./card_game_case64_1120.xlsx");
let workbook_sheet = workbook.SheetNames;
let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);
let output = [];
let bottom_leaderboard = [];
let not_in_view_count = 0;
let browser_width_little_1200 = 0;
workbook_response.forEach((item, idx) => {
  let detail = {};
  let tp = item.tp.split(",");
  let sp = item.sp.split(",");
  detail["tp"] = item.tp;
  // tp: [top, bottom, left, right]
  let adSize = `${tp[3] - tp[2]}x${tp[1] - tp[0]}`;
  let browserHeight = item["bs"].split("x")[1];
  let browserWidth = item.bs.split("x")[0];
  if (+browserWidth <= 1200) {
    browser_width_little_1200 += 1;
  }
  let inView;
  // let targeting = JSON.parse(item["cd28"]);
  let regex = /\/game\//;
  if (regex.test(item["pagepath"])) {
    // if (+targeting["yrefreshcount"] <= 2) {
    inView = +tp[0] < 0 || +browserHeight - +tp[0] < 0 ? 0 : 1;
    if (!inView) {
      not_in_view_count += 1;
    }
    detail["Variant"] = item["cd3"];
    detail["pagepath"] = item["pagepath"];
    detail["inView"] = inView;
    detail["adSize"] = adSize;
    detail["sp"] = item.sp;
    detail["scrollX"] = sp[0];
    detail["scrollY"] = sp[1];
    detail["label"] = item["label"];
    detail["bs"] = item["bs"];
    detail["browser_width"] = browserWidth;
    detail["browser_height"] = browserHeight;
    // detail["ts"] = new Date(new Number(item["ts"])).toLocaleString("en-US", {
    //   timeZone: "America/New_York",
    //   year: "numeric",
    //   month: "numeric",
    //   day: "numeric",
    //   hour: "numeric",
    // });
    output.push(detail);
    // console.log(tp[0], browserHeight);
    if (+tp[0] > +browserHeight) {
      bottom_leaderboard.push(detail);
    }
    // }
  }
});
console.log(
  "Total Game Page ",
  output.length,
  "not_in_view_count ",
  not_in_view_count,
  "browser_width_little_1200 ",
  browser_width_little_1200
);
// console.log([...medrec_slotRenderEnded["desktop-medrec-template"]]);
const slotRenderEnded_sheet = xlsx.utils.json_to_sheet(output);
// const bottom_leaderboard_sheet = xlsx.utils.json_to_sheet(bottom_leaderboard);
const slotRenderEnded_book = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(
  slotRenderEnded_book,
  slotRenderEnded_sheet,
  "After Cal"
);
// xlsx.utils.book_append_sheet(
//   slotRenderEnded_book,
//   bottom_leaderboard_sheet,
//   "bottom_leaderboard_sheet"
// );
xlsx.writeFile(slotRenderEnded_book, "./card_game_case64_1120_analysis.xlsx");
