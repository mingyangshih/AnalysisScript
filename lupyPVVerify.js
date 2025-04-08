const fs = require("fs");
const xlsx = require("xlsx");
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;
let _ = require("lodash");
const csv = require("csv-parser");
let pageviews = "./action/lupy_pageview_yolla_01-06.csv";
const reportData = [];
let pageView = {};
let Yolla = {};
let userWithoutYollaEvents = {};
let userWithoutYollaEventsCountry = {};
let userWithoutYollaEventsBrowser = {};
let total = 0;
function addPV(key) {
  if (!pageView[key]) {
    pageView[key] = 1;
  } else {
    pageView[key] += 1;
  }
}

fs.createReadStream(pageviews)
  .pipe(csv())
  .on("data", (data) => reportData.push(data))
  .on("end", () => {
    let sorted = _.sortBy(reportData, ["uuid", "sessionid", "ts"]);
    _.forEach(sorted, (item, id) => {
      createVariantObject(userWithoutYollaEvents, item.cd3, 0);
      createVariantObject(pageView, item.cd3, 0);
      createVariantObject(Yolla, item.cd3, 0);

      // createVariantObject(total, item.pagepath, {
      //   pageView: 0,
      //   Yolla: 0,
      // });
      if (sorted[id + 1]) {
        if (item.action === "pageview") {
          if (sorted[id + 1].action === "pageview") {
            userWithoutYollaEvents[item.cd3] += 1;
            total += 1;
            if (!userWithoutYollaEventsCountry[item.country]) {
              userWithoutYollaEventsCountry[item.country] = 1;
            } else {
              userWithoutYollaEventsCountry[item.country] += 1;
            }
            if (!userWithoutYollaEventsBrowser[item.browser]) {
              userWithoutYollaEventsBrowser[item.browser] = 1;
            } else {
              userWithoutYollaEventsBrowser[item.browser] += 1;
            }
          }
        }
      }
      if (item.action === "pageview") {
        pageView[item.cd3] += 1;
      } else {
        Yolla[item.cd3] += 1;
      }
    });
    console.table({
      "Yolla Events": Yolla,
      userWithoutYollaEvents: userWithoutYollaEvents,
      pageview: pageView,
    });

    let output = [];
    Object.keys(userWithoutYollaEventsBrowser).forEach((key) => {
      output.push({
        Country: key,
        Number: userWithoutYollaEventsBrowser[key],
        Percentage: `${
          (userWithoutYollaEventsBrowser[key] / total).toFixed(2) * 100
        }%`,
      });
    });
    const lupyPVVerify_sheet = xlsx.utils.json_to_sheet(output);

    const lupyPVVerify_book = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(
      lupyPVVerify_book,
      lupyPVVerify_sheet,
      "After Cal"
    );

    xlsx.writeFile(lupyPVVerify_book, "./lupyPVVerify_01-06_browser.xlsx");
  });
