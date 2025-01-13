const gdprCountries = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "NO",
  "IS",
  "LI",
];
const xlsx = require("xlsx");
const workbook = xlsx.readFile("./pageview_country/pageview_country42.xlsx");
let workbook_sheet = workbook.SheetNames;
let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);

workbook_response.forEach((item) => {
  item.isGdprCountry = gdprCountries.indexOf(item.country) > 0 ? true : false;
});
// console.log(workbook_response[0])
const new_workbook_sheet = xlsx.utils.json_to_sheet(workbook_response);
const new_workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(new_workbook, new_workbook_sheet, "Sheet 1");
xlsx.writeFile(new_workbook, "./pageview_country/pageview_country42_PARSED.xlsx");
