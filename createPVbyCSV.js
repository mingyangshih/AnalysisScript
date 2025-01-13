const fs = require("fs");
const xlsx = require("xlsx");
var _ = require("lodash");
const csv = require("csv-parser");
let pv_628 = "./mahjong/126_mahjong.com_2024-07-02.csv";
// let pv_missing_sites = "./count_pageview/pv_missing_sites 1.csv";
let output = "./count_pageview/pv_missing_sites_with_628_PV.xlsx";
const pv_628_results = [];
const pv_missing_sites_results = [];

// let page_view = {};
let uuid_count = 0;
// function addPV(key) {
//   if (!page_view[key]) {
//     page_view[key] = 1;
//   } else {
//     page_view[key] += 1;
//   }
// }
fs.createReadStream(pv_628)
  .pipe(csv())
  .on("data", (data) => pv_628_results.push(data)) //Domain
  .on("end", () => {
    console.log(pv_628_results.length);
    // fs.createReadStream(pv_missing_sites)
    //   .pipe(csv())
    //   .on("data", (data) => pv_missing_sites_results.push(data)) // domain_name
    //   .on("end", () => {
    //     _.forEach(pv_628_results, (value) => {
    //       _.forEach(pv_missing_sites_results, (value1) => {
    //         if (
    //           value.Domain.toLowerCase() === value1.domain_name.toLowerCase()
    //         ) {
    //           value1.PV_628 = value["Total Events"];
    //         }
    //       });
    //     });
    //     // let sorted_data = _.sortBy(
    //     //   [...YAResults, ...preloadResults],
    //     //   //   [...YAResults],
    //     //   ["uuid", "sessionid", "ts"]
    //     // );
    //     // _.forEach(sorted_data, function (value, key) {
    //     //   if (key == 0) {
    //     //     return true;
    //     //   }
    //     //   if (value.uuid !== sorted_data[key - 1].uuid) {
    //     //     uuid_count += 1;
    //     //   }
    //     //   // Try to get the user only have 1 Event Tracker. Use that whether uuid is different with last row and next row
    //     //   if (
    //     //     value.uuid !== sorted_data[key - 1].uuid &&
    //     //     value.uuid !== sorted_data[key + 1].uuid
    //     //   ) {
    //     //     addPV(value.pagepath);
    //     //     return true;
    //     //   }
    //     //   // if session id different with last row add one page view for last row's page path
    //     //   if (value.sessionid && sorted_data[key - 1].sessionid) {
    //     //     if (value.sessionid !== sorted_data[key - 1].sessionid) {
    //     //       addPV(sorted_data[key - 1].pagepath);
    //     //       return true;
    //     //     }
    //     //   }
    //     //   if (value.pagepath !== sorted_data[key - 1].pagepath) {
    //     //     addPV(sorted_data[key - 1].pagepath);
    //     //   }
    //     // });
    //     // let page_view_output = [];
    //     // _.forEach(page_view, function (value, key) {
    //     //   page_view_output.push({ pagepath: key, pageview: value });
    //     // });
    //     const page_view_sheet = xlsx.utils.json_to_sheet(
    //       pv_missing_sites_results
    //     );
    //     const new_workbook = xlsx.utils.book_new();
    //     xlsx.utils.book_append_sheet(
    //       new_workbook,
    //       page_view_sheet,
    //       "page view"
    //     );
    //     xlsx.writeFile(new_workbook, output);
    //   });
  });
