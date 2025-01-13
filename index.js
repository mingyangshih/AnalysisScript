const xlsx = require("xlsx");
const iabCore = require("@iabtechlabtcf/core");
let TCF_VERSION_RELATED_PROPERTY = ["version", "cmpId_", "cmpVersion_"];
let BIDDERS_MAP = {
  10: "IX",
  24: "conversant",
  28: "triplelift",
  32: "Appnexus",
  52: "Rubicon",
  58: "33across",
  69: "OpenX",
  76: "pubmatic",
};
let TCF_PROPERTY = [
  "purposeConsents",
  "purposeLegitimateInterests",
  "publisherConsents",
  "publisherLegitimateInterests",
  "vendorConsents",
  "vendorLegitimateInterests",
];
const workbook = xlsx.readFile("./adPosition_0103.xlsx");
let workbook_sheet = workbook.SheetNames;
let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);
workbook_response.forEach((item) => {
  if (item["cd20"]) {
    let decode_consent_string = iabCore.TCString.decode(item["cd20"]);
    TCF_VERSION_RELATED_PROPERTY.forEach((it) => {
      item[it] = decode_consent_string[it];
    });
    TCF_PROPERTY.forEach((it) => {
      item[it] = decode_consent_string[it].set_.size;
      if (it === "vendorConsents") {
        for (var key in BIDDERS_MAP) {
          let BIDDER = BIDDERS_MAP[key];
          item[BIDDER] = decode_consent_string[it].set_.has(Number(key));
        }
      }
    });
  }
  // console.log(item)
});
const new_workbook_sheet = xlsx.utils.json_to_sheet(workbook_response);
const new_workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(new_workbook, new_workbook_sheet, "Sheet 1");
xlsx.writeFile(new_workbook, "./adPosition_0103.xlsx");
