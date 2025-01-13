const xlsx = require("xlsx");
var _ = require("lodash");
const Yolla_Duration_TCF_Variant = xlsx.readFile(
  "./count_pageview/Yolla_Duration_TCF_Variant205.xlsx"
);
const preload = xlsx.readFile("./count_pageview/Preload205.xlsx");

let Yolla_Duration_TCF_Variant_Sheet = Yolla_Duration_TCF_Variant.SheetNames;
let Yolla_Duration_TCF_Variant_Response = xlsx.utils.sheet_to_json(
  Yolla_Duration_TCF_Variant.Sheets[Yolla_Duration_TCF_Variant_Sheet[0]]
);
let Preload_Sheet = preload.SheetNames;
let Preload_Sheet_response = xlsx.utils.sheet_to_json(
  preload.Sheets[Preload_Sheet[0]]
);

let page_view = {};
let uuid_count = 0;
let sorted_data = _.sortBy(
  [...Yolla_Duration_TCF_Variant_Response, ...Preload_Sheet_response],
  ["uuid", "sessionid", "ts"]
);

_.forEach(sorted_data, function (value, key) {
  if (key == 0) {
    return true;
  }

  if (value.uuid !== sorted_data[key - 1].uuid) {
    uuid_count += 1;
  }
  // Try to get the user only have 1 Event Tracker. Use that whether uuid is different with last row and next row
  if (
    value.uuid !== sorted_data[key - 1].uuid &&
    value.uuid !== sorted_data[key + 1].uuid
  ) {
    addPV(value.pagepath);
    return true;
  }
  // if session id different with last row add one page view for last row's page path
  if (value.sessionid && sorted_data[key - 1].sessionid) {
    if (value.sessionid !== sorted_data[key - 1].sessionid) {
      addPV(sorted_data[key - 1].pagepath);
      return true;
    }
  }

  if (value.pagepath !== sorted_data[key - 1].pagepath) {
    addPV(sorted_data[key - 1].pagepath);
  }
});
function addPV(key) {
  if (!page_view[key]) {
    page_view[key] = 1;
  } else {
    page_view[key] += 1;
  }
}
let page_view_output = [];
_.forEach(page_view, function (value, key) {
  page_view_output.push({ pagepath: key, pageview: value });
});
const page_view_sheet = xlsx.utils.json_to_sheet(page_view_output);
const new_workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(new_workbook, page_view_sheet, "page view");
xlsx.writeFile(new_workbook, "./count_pageview/total_page_view.xlsx");

// const sorted_yolla_Event_205 = xlsx.utils.json_to_sheet(sorted_data);
// const new_workbook = xlsx.utils.book_new();
// xlsx.utils.book_append_sheet(
//   new_workbook,
//   sorted_yolla_Event_205,
//   "Yolla sorted"
// );
// xlsx.writeFile(new_workbook, "./count_pageview/all_sorted_data.xlsx");
