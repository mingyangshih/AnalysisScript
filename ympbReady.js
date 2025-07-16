const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./xoo/05-11.csv";

let datas = [];

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (row) => {
    // "beforeSlotRequest",
    if (row.action == "ympbReady") {
      datas.push(row);
    }
  })
  .on("end", () => {
    const uniqueUsers = new Set(datas.map((row) => row.uuid));
    console.log(`Total Unique Users: ${uniqueUsers.size}`);
  });
