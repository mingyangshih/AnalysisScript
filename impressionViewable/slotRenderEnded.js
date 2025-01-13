// cd 4 refresh count
// cm 11 swap count
const xlsx = require("xlsx");
const slotRenderEnded = xlsx.readFile("./slotRenderEnded_207_0406_0408.xlsx");
let slotRenderEnded_sheet = slotRenderEnded.SheetNames;
let slotRenderEnded_response = xlsx.utils.sheet_to_json(
  slotRenderEnded.Sheets[slotRenderEnded_sheet[0]]
);
// console.log(slotRenderEnded_response.length);
let count_size = [];
let bottom_leaderboard = [];
let user_have_ad_inview = {};
let browser_width_1200 = 0;
slotRenderEnded_response.forEach((item) => {
  let detail = {};
  let tp = item.tp.split(",");
  let sp = item.sp.split(",");
  detail["tp"] = item.tp;
  // tp: [top, bottom, left, right]
  let adSize = `${tp[3] - tp[2]}x${tp[1] - tp[0]}`;
  let browserHeight = item["bs"].split("x")[1];
  let browserWidth = item.bs.split("x")[0];
  let inView;
  let user_info = `${item["uuid"]}-${item["ts"]}`;

  let targeting = JSON.parse(item["cd28"]);

  let regex = /\/game\//;
  // regex.test(item["pagepath"]) && +browserWidth > 992
  if (!regex.test(item["pagepath"])) {
    if (+targeting["yrefreshcount"] <= 2) {
      if (!user_have_ad_inview[user_info]) {
        user_have_ad_inview[user_info] = 0;
      }
      inView = +tp[0] < 0 || +browserHeight - +tp[0] < 0 ? 0 : 1;
      if (inView == 1) {
        user_have_ad_inview[user_info] += 1;
      }
      detail["Variant"] = item["cd3"];
      detail["pagepath"] = item["pagepath"];
      detail["Ad Type"] = item["cd5"];
      detail["status"] = item["cd26"];
      detail["inView"] = inView;
      detail["adSize"] = adSize;
      detail["sp"] = item.sp;
      detail["scrollX"] = sp[0];
      detail["scrollY"] = sp[1];
      detail["count"] = item["cd4"];
      detail["yrefreshcount"] = +targeting["yrefreshcount"];
      detail["YMPB ID"] = item["cd25"];
      detail["label"] = item["label"];
      detail["bidder"] = item["cd1"];
      detail["bs"] = item["bs"];
      detail["browser_width"] = item.bs.split("x")[0];
      detail["browser_height"] = browserHeight;
      detail["ts"] = new Date(new Number(item["ts"])).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
      });
      count_size.push(detail);
      if (+tp[0] > +detail["browser_height"]) {
        bottom_leaderboard.push(detail);
      }
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
const slotRenderEnded_sheet_analysis = xlsx.utils.json_to_sheet(count_size);
const user_have_ad_inview_sheet = xlsx.utils.json_to_sheet(
  user_have_ad_inview_list
);
const bottom_leaderboard_sheet = xlsx.utils.json_to_sheet(bottom_leaderboard);

const slotRenderEnded_book_analysis = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(
  slotRenderEnded_book_analysis,
  slotRenderEnded_sheet_analysis,
  "After Cal"
);
xlsx.utils.book_append_sheet(
  slotRenderEnded_book_analysis,
  user_have_ad_inview_sheet,
  "user_have_ad_inview_sheet"
);
xlsx.utils.book_append_sheet(
  slotRenderEnded_book_analysis,
  bottom_leaderboard_sheet,
  "bottom_leaderboard_sheet"
);
xlsx.writeFile(
  slotRenderEnded_book_analysis,
  "./slotRenderEnded_207_0406_0408_analysis.xlsx"
);
