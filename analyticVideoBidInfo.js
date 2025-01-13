const xlsx = require("xlsx");
const querystring = require("node:querystring");
const workbook = xlsx.readFile("./video_bid_info/video_bid_0119_0121_182.xlsx");
let workbook_sheet = workbook.SheetNames;
let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);
let CPM_list = {
  title: "CPM Sum",
  case: "47, 49",
  appnexus_v: 0,
  appnexus_v2: 0,
  ix_v2: 0,
  openx_v: 0,
  rubicon_v: 0,
  triplelift_v: 0,
  pubmatic_v: 0,
  catchall_v: 0,
};
let Cust_Params_CPM_list = {
  title: "Cust Params CPM Sum",
  case: "47, 49",
  appnexus_v: 0,
  appnexus_v2: 0,
  ix_v2: 0,
  openx_v: 0,
  rubicon_v: 0,
  triplelift_v: 0,
  pubmatic_v: 0,
  catchall_v: 0,
};
let Bidder_Won_Times = {
  title: "Bid Won Times",
  case: "47, 49",
  appnexus_v: 0,
  appnexus_v2: 0,
  ix_v2: 0,
  openx_v: 0,
  rubicon_v: 0,
  triplelift_v: 0,
  pubmatic_v: 0,
  catchall_v: 0,
};
let DFP_video_bidder_47 = {
  title: "DPF Request",
  case: "47",
  appnexus_v: 0,
  appnexus_v2: 0,
  ix_v2: 0,
  openx_v: 0,
  rubicon_v: 0,
  triplelift_v: 0,
  pubmatic_v: 0,
  catchall_v: 0,
};
let Video_bid_response_47 = {
  title: "Bid Response",
  case: "47",
  appnexus_v: 0,
  appnexus_v2: 0,
  ix_v2: 0,
  openx_v: 0,
  rubicon_v: 0,
  triplelift_v: 0,
  pubmatic_v: 0,
  catchall_v: 0,
};

let DFP_video_bidder_49 = {
  title: "DPF Request",
  case: "49",
  appnexus_v: 0,
  appnexus_v2: 0,
  ix_v2: 0,
  openx_v: 0,
  rubicon_v: 0,
  triplelift_v: 0,
  pubmatic_v: 0,
  catchall_v: 0,
};
let Video_bid_response_49 = {
  title: "Bid Response",
  case: "49",
  appnexus_v: 0,
  appnexus_v2: 0,
  ix_v2: 0,
  openx_v: 0,
  rubicon_v: 0,
  triplelift_v: 0,
  pubmatic_v: 0,
  catchall_v: 0,
};

workbook_response.forEach((row, id) => {
  // Timestamp to USA time
  row["ts"] = new Date(new Number(row["ts"])).toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  let DPF_REQUEST = querystring.parse(row["cd18"]);
  let bid_response;
  let highest_bidder;
  let highest_CPM = 0;
  try {
    bid_response = JSON.parse(row["cd19"]);
  } catch (e) {
    // console.log(e);
  }

  let cust_params = querystring.parse(DPF_REQUEST["cust_params"]);
  if (cust_params["hb_pb"]) {
    Cust_Params_CPM_list[cust_params["hb_bidder"]] += new Number(
      cust_params["hb_pb"]
    );
  }

  if (row["cd3"] === "47") {
    workbook_response[id] = {
      ...row,
      ...cust_params,
    };
    Object.keys(DFP_video_bidder_47).forEach((i) => {
      Object.keys(cust_params).forEach((j) => {
        if (`hb_bidder_${i}` === j) {
          DFP_video_bidder_47[cust_params[`hb_bidder_${i}`]] += 1;
        }
      });
      // Bid Response
      Object.keys(bid_response).forEach((j) => {
        Video_bid_response_47[j] += 1;
        if (bid_response[j] > highest_CPM) {
          highest_CPM = bid_response[j];
          highest_bidder = j;
        }
      });
    });
  } else if (row["cd3"] === "49") {
    workbook_response[id] = {
      ...row,
      ...cust_params,
    };
    Object.keys(DFP_video_bidder_49).forEach((i) => {
      Object.keys(cust_params).forEach((j) => {
        if (`hb_bidder_${i}` === j) {
          DFP_video_bidder_49[cust_params[`hb_bidder_${i}`]] += 1;
        }
      });
      Object.keys(bid_response).forEach((j) => {
        Video_bid_response_49[j] += 1;
        if (bid_response[j] > highest_CPM) {
          highest_CPM = bid_response[j];
          highest_bidder = j;
        }
      });
    });
  }
  if (highest_bidder && (row["cd3"] === "49" || row["cd3"] === "47")) {
    CPM_list[highest_bidder] += new Number(highest_CPM) / 1000;
    Bidder_Won_Times[highest_bidder] += 1;
  }

  workbook_response[id] = {
    ...row,
    ...cust_params,
    highest_bidder,
    highest_CPM,
  };
});
console.log(CPM_list, Bidder_Won_Times);
// const new_workbook_sheet = xlsx.utils.json_to_sheet([
//   DFP_video_bidder_47,
//   DFP_video_bidder_49,
//   Video_bid_response_47,
//   Video_bid_response_49,
// ]);
// const new_workbook = xlsx.utils.book_new();
// xlsx.utils.book_append_sheet(new_workbook, new_workbook_sheet, "After Cal");
// xlsx.writeFile(
//   new_workbook,
//   "./video_bid_info/video_bid_0119_0121_182_cal.xlsx"
// );

// const new_workbook_sheet_parsed = xlsx.utils.json_to_sheet(workbook_response);
// const new_workbook_parsed = xlsx.utils.book_new();
// xlsx.utils.book_append_sheet(
//   new_workbook_parsed,
//   new_workbook_sheet_parsed,
//   "Sheet 1"
// );
// xlsx.writeFile(
//   new_workbook_parsed,
//   "./video_bid_info/video_bid_0119_0121_182_parsed.xlsx"
// );

// const average_value_sheet = xlsx.utils.json_to_sheet([
//   CPM_list,
//   Cust_Params_CPM_list,
//   Bidder_Won_Times,
//   DFP_video_bidder_47,
//   DFP_video_bidder_49,
// ]);
// const average_value_book = xlsx.utils.book_new();
// xlsx.utils.book_append_sheet(
//   average_value_book,
//   average_value_sheet,
//   "After Cal"
// );
// xlsx.writeFile(
//   average_value_book,
//   "./video_bid_info/video_bid_0119_0121_182_average.xlsx"
// );
