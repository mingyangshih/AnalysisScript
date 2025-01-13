const xlsx = require("xlsx");
const workbook = xlsx.readFile("./hiddenobject_slotRenderEnded_1210.xlsx");
let workbook_sheet = workbook.SheetNames;

let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);
let vatiantBanner = {};

workbook_response.forEach((item) => {
  if (
    item.cd3 == 18 ||
    item.cd3 == 19 ||
    item.cd3 == 20 ||
    item.cd3 == 21 ||
    item.cd3 == 22
  ) {
    let browserHeight = item["bs"].split("x")[1];
    let browserWidth = item.bs.split("x")[0];
    let tp = item.tp.split(",");
    let adSize = `${tp[3] - tp[2]}x${tp[1] - tp[0]}`;

    let inView;
    inView = +tp[0] < 0 || +browserHeight - +tp[0] <= 0 ? 0 : 1;

    if (!vatiantBanner[item.cd3]) {
      vatiantBanner[item.cd3] = {
        XL: {},
        L: {},
        S: {},
      };
    }
    let browserDistribute = "";
    if (browserWidth >= 1200) {
      browserDistribute = "XL";
    } else if (browserWidth < 1200 && browserWidth >= 992) {
      browserDistribute = "L";
    } else {
      browserDistribute = "S";
    }
    if (item.label.indexOf("medrec") > -1) {
      // if (!vatiantBanner[item.cd3][item.label]) {
      //   vatiantBanner[item.cd3][item.label] = 1;
      // } else {
      //   vatiantBanner[item.cd3][item.label] += 1;
      // }

      if (inView) {
        if (!vatiantBanner[item.cd3][browserDistribute]["inView"]) {
          vatiantBanner[item.cd3][browserDistribute]["inView"] = 1;
        } else {
          vatiantBanner[item.cd3][browserDistribute]["inView"] += 1;
        }
      } else {
        if (!vatiantBanner[item.cd3][browserDistribute]["notInView"]) {
          vatiantBanner[item.cd3][browserDistribute]["notInView"] = 1;
        } else {
          vatiantBanner[item.cd3][browserDistribute]["notInView"] += 1;
        }
      }

      //   if (
      //     !vatiantBanner[item.cd3][browserDistribute][">600"] ||
      //     !vatiantBanner[item.cd3][browserDistribute]["<=600"]
      //   ) {
      //     if (tp[3] - tp[2] > 600) {
      //       vatiantBanner[item.cd3][browserDistribute][">600"] = 1;
      //     } else {
      //       vatiantBanner[item.cd3][browserDistribute]["<=600"] = 1;
      //     }
      //   } else {
      //     if (tp[3] - tp[2] > 600) {
      //       vatiantBanner[item.cd3][browserDistribute][">600"] += 1;
      //     } else {
      //       vatiantBanner[item.cd3][browserDistribute]["<=600"] += 1;
      //     }
      //   }
    }
  }
});
console.log("vatiantBanner", vatiantBanner);
