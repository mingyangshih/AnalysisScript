// cd 26 Ad Status
// cd 4 refresh count
// cm 11 swap count
const xlsx = require("xlsx");
const beforeSlotRequest = xlsx.readFile(
  "./impressionViewable/beforeSlotRequest_207_0321_24hr.xlsx"
);
let beforeSlotRequest_sheet = beforeSlotRequest.SheetNames;
let beforeSlotRequest_response = xlsx.utils.sheet_to_json(
  beforeSlotRequest.Sheets[beforeSlotRequest_sheet[0]]
);
let brfore_refresh_total = {};
brfore_refresh_total["Total Number"] = beforeSlotRequest_response.length;
// console.log(beforeSlotRequest_response[0]);

let ready_slot = [];
let user_have_ad_inview = {};
let bottom_leaderboard = [];

beforeSlotRequest_response.forEach((item) => {
  let tp = item.tp.split(",");
  let sp = item.sp.split(",");
  // tp: [top, bottom, left, right]
  let adSize = `${tp[3] - tp[2]}x${tp[1] - tp[0]}`;
  let detail = {};
  let browserHeight = item["bs"].split("x")[1];
  let inView;
  let user_info = `${item["uuid"]}-${item["ts"]}`;

  if (
    // item["cd26"] == "ready" &&
    item["label"] == "desktop-leaderboard-template" &&
    +item["cd4"] <= 2
  ) {
    if (!user_have_ad_inview[user_info]) {
      user_have_ad_inview[user_info] = 0;
    }

    inView = tp[0] < 0 || browserHeight - tp[0] < 0 ? 0 : 1;
    if (inView == 1) {
      user_have_ad_inview[user_info] += 1;
    }
    detail["pagepath"] = item["pagepath"];
    detail["Ad Type"] = item["cd5"];
    detail["swapCount"] = item["cm11"];
    detail["status"] = item["cd26"];
    detail["inView"] = inView;
    detail["label"] = item.label;
    detail["tp"] = item.tp;
    detail["sp"] = item.sp;
    detail["scrollX"] = sp[0];
    detail["scrollY"] = sp[1];
    detail["adSize"] = adSize;
    detail.bs = item.bs;
    detail["bidder"] = item.cd1;
    detail["refresh_count"] = item.cd4;
    detail["devicecategory"] = item.devicecategory;
    detail["browser"] = item.browser;
    detail["browser_width"] = item.bs.split("x")[0];
    detail["browser_height"] = item.bs.split("x")[1];
    detail["ts"] = new Date(new Number(item["ts"])).toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
    });
    detail["swap position"] = item.cd30;
    detail["swapped"] = item.cd23;
    ready_slot.push(detail);
    if (+tp[0] > +detail["browser_height"]) {
      bottom_leaderboard.push(detail);
    }
  }
});

let user_have_ad_inview_list = [];
Object.keys(user_have_ad_inview).forEach((i) => {
  user_have_ad_inview_list.push({
    uuid_ts: i,
    number_of_ads_inview: user_have_ad_inview[i],
  });
});
console.log(bottom_leaderboard);
const ready_slot_sheet = xlsx.utils.json_to_sheet(ready_slot);
const bottom_leaderboard_sheet = xlsx.utils.json_to_sheet(bottom_leaderboard);
const user_have_ad_inview_sheet = xlsx.utils.json_to_sheet(
  user_have_ad_inview_list
);
// // const size_count_sheet = xlsx.utils.json_to_sheet([size_count])
// const brfore_refresh_total_sheet = xlsx.utils.json_to_sheet([
//   brfore_refresh_total,
// ]);
const beforeSlotRequest_book = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(
  beforeSlotRequest_book,
  bottom_leaderboard_sheet,
  "bottom_leaderboard_sheet"
);
xlsx.utils.book_append_sheet(
  beforeSlotRequest_book,
  ready_slot_sheet,
  "ready_slot_sheet"
);
xlsx.utils.book_append_sheet(
  beforeSlotRequest_book,
  user_have_ad_inview_sheet,
  "user_have_ad_inview_sheet"
);
xlsx.writeFile(
  beforeSlotRequest_book,
  "./impressionViewable/beforeSlotRequest_207_0321_24hr_analysis.xlsx"
);
