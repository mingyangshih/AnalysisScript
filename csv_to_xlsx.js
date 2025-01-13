import { convertCsvToXlsx } from "@aternus/csv-to-xlsx";
let source_path = import.meta.url.split("/");
source_path.pop();
let source = "./hidden_12-10_bidResponse.csv";
let destination = "./hidden_12-10_bidResponse.xlsx";

try {
  convertCsvToXlsx(source, destination);
} catch (e) {
  console.error(e.toString());
}
