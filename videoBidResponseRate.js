const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let bidResponse24 = "./video_bid_response24.csv";
const bidResponse24Results = [];

let bidRequest = {};
let bidResponse = {};
let totalCPM = {};
let maxCPM = {};
fs.createReadStream(bidResponse24)
  .pipe(csv())
  .on("data", (data) => bidResponse24Results.push(data)) //Domain
  .on("end", () => {
    // cd1 : bidder
    // cd2 : CPM
    // label: 'desktop-outstream'
    // action: 'bidRequested'
    _.each(bidResponse24Results, (item) => {
      if (item.label !== "desktop-outstream") {
        return true;
      }
      if (item.action === "bidRequested") {
        if (!bidRequest[item.cd1]) {
          bidRequest[item.cd1] = 1;
        } else {
          bidRequest[item.cd1] += 1;
        }
      }
      if (item.action === "bidResponse") {
        if (!bidResponse[item.cd1]) {
          bidResponse[item.cd1] = 1;
        } else {
          bidResponse[item.cd1] += 1;
        }
        if (!totalCPM[item.cd1]) {
          totalCPM[item.cd1] = +item.cd2;
        } else {
          totalCPM[item.cd1] += +item.cd2;
        }
        if (!maxCPM[item.cd1]) {
          maxCPM[item.cd1] = +item.cd2;
        } else {
          if (maxCPM[item.cd1] < item.cd2) {
            maxCPM[item.cd1] = +item.cd2;
          }
        }
      }
    });
    console.log("bidRequest", bidRequest);
    console.log("bidResponse", bidResponse);
    console.log("totalCPM", totalCPM);
    console.log("maxCPM", maxCPM);
  });
