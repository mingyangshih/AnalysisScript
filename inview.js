const xlsx = require("xlsx");
const workbook = xlsx.readFile("./bubble_net_12_08_8hr.xlsx");
let workbook_sheet = workbook.SheetNames;

let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);
let totalBanner = 0;
let caseInview = {};
let inviewSize = {};
console.log("workbook_response", workbook_response.length);
let notInviewSize = {};
workbook_response.forEach((item) => {
  let browserHeight = item["bs"].split("x")[1];
  let browserWidth = item.bs.split("x")[0];
  let tp = item.tp.split(",");
  let adSize = `${tp[3] - tp[2]}x${tp[1] - tp[0]}`;
  item.adSize = adSize;
  let inView;
  inView = +tp[0] < 0 || +browserHeight - +tp[0] <= 0 ? 0 : 1;
  item.inView = inView;

  if (+browserWidth >= 1200) {
    item.screenSize = "XL";
  } else {
    item.screenSize = "L";
  }

  // if (item.label.indexOf("desktop-leaderboard") > -1) {
  totalBanner += 1;
  if (!caseInview[item.cd3]) {
    caseInview[item.cd3] = {};
  }

  if (!caseInview[item.cd3][item.screenSize]) {
    caseInview[item.cd3][item.screenSize] = 1;
  } else {
    caseInview[item.cd3][item.screenSize] += 1;
  }
  if (inView) {
    if (!caseInview[item.cd3].inView) {
      caseInview[item.cd3].inView = 1;
    } else {
      caseInview[item.cd3].inView += 1;
    }
    // if (item.cd3 == 21 || item.cd3 == 22) {
    if (!inviewSize[item.cd3]) {
      inviewSize[item.cd3] = {};
    }
    if (!inviewSize[item.cd3][item.screenSize]) {
      inviewSize[item.cd3][item.screenSize] = 1;
    } else {
      inviewSize[item.cd3][item.screenSize] += 1;
    }
    // }
  } else {
    if (!caseInview[item.cd3].notInView) {
      caseInview[item.cd3].notInView = 1;
    } else {
      caseInview[item.cd3]["notInView"] += 1;
    }
    // if (item.cd3 == 21 || item.cd3 == 22) {
    if (!notInviewSize[item.cd3]) {
      notInviewSize[item.cd3] = {};
    }
    if (!notInviewSize[item.cd3][item.screenSize]) {
      notInviewSize[item.cd3][item.screenSize] = 1;
    } else {
      notInviewSize[item.cd3][item.screenSize] += 1;
    }
    // }
  }
  // }
});
console.log(
  "totalBanner",
  totalBanner,
  "caseInview",
  caseInview,
  "inviewSize",
  inviewSize,
  "notInviewSize",
  notInviewSize
);
// const slotRenderEnded_sheet = xlsx.utils.json_to_sheet(workbook_response);

// const slotRenderEnded_book = xlsx.utils.book_new();
// xlsx.utils.book_append_sheet(
//   slotRenderEnded_book,
//   slotRenderEnded_sheet,
//   "After Cal"
// );

// xlsx.writeFile(
//   slotRenderEnded_book,
//   "./actiongame_12-04_slotRenderEnded_analysis.xlsx"
// );
