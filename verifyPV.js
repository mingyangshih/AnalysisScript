const fs = require("fs");
const xlsx = require("xlsx");
let _ = require("lodash");
let countryGroup = require("./countryGroup");
let { COUNTRY_GROUP_1, COUNTRY_GROUP_2 } = countryGroup;
const csv = require("csv-parser");
let pageviews = "./hiddenobjectgames.com_01_20_PV.csv";
const PVResults = [];
let pageView = {};
let pageViewGroup = {};
let uuid = {};
let uuidGroup = {};
let browserDis = {};
function addPV(key) {
  if (!pageView[key]) {
    pageView[key] = 1;
  } else {
    pageView[key] += 1;
  }
}
function createVariantObject(object, variant, defaultValue) {
  if (!object[variant]) {
    object[variant] = defaultValue;
  }
}
fs.createReadStream(pageviews)
  .pipe(csv())
  .on("data", (data) => PVResults.push(data))
  .on("end", () => {
    _.forEach(PVResults, (value) => {
      let browserWidth = +value.bs.split("x")[0];

      let browserDistribute = "";
      if (browserWidth >= 1200) {
        browserDistribute = "XL";
      } else if (browserWidth < 1200 && browserWidth >= 992) {
        browserDistribute = "L";
      } else {
        browserDistribute = "S";
      }
      // Count total of each variant.
      addPV(value.cd3);
      let { country } = value;

      let countryGroup = "OTHERS";
      if (COUNTRY_GROUP_1.indexOf(country) > -1) {
        countryGroup = "COUNTRY_GROUP_1";
      } else if (COUNTRY_GROUP_2.indexOf(country) > -1 || country === "US") {
        countryGroup = "COUNTRY_GROUP_2 + US";
      }
      createVariantObject(pageViewGroup, value.cd3, {});
      createVariantObject(uuid, value.cd3, new Set());
      createVariantObject(uuidGroup, value.cd3, {
        COUNTRY_GROUP_1: new Set(),
        "COUNTRY_GROUP_2 + US": new Set(),
        OTHERS: new Set(),
      });
      createVariantObject(browserDis, value.cd3, {
        XL: 0,
        L: 0,
        S: 0,
      });
      if (!pageViewGroup[value.cd3][countryGroup]) {
        pageViewGroup[value.cd3][countryGroup] = 1;
      } else {
        pageViewGroup[value.cd3][countryGroup] += 1;
      }

      uuid[value.cd3].add(value.uuid);
      uuidGroup[value.cd3][countryGroup].add(value.uuid);
      browserDis[value.cd3][browserDistribute] += 1;
    });
    console.log(
      `${pageviews} ==============================================================`
    );
    console.log("pageView", pageView);
    console.log("pageViewGroup");
    console.table(pageViewGroup);
    console.table(browserDis);
    // Show the pageview distribution by group
    Object.keys(pageViewGroup).forEach((variant) => {
      Object.keys(pageViewGroup[variant]).forEach((group) => {
        console.log(
          `Page View Percentage: Case${variant} ${group} ${(
            (pageViewGroup[variant][group] / pageView[variant]) *
            100
          ).toFixed(2)} %`
        );
      });
    });
    // Show the unique user result.
    Object.keys(uuid).forEach((i) => {
      // console.log(`Case ${i} Unique User: ${uuid[i].size}`);
    });
    // show the unique user by group
    Object.keys(uuidGroup).forEach((variant) => {
      Object.keys(uuidGroup[variant]).forEach((group) => {
        uuidGroup[variant][group] = uuidGroup[variant][group].size;
      });
    });
    // show browser width distribution
    Object.keys(browserDis).forEach((variant) => {
      Object.keys(browserDis[variant]).forEach((group) => {
        console.log(
          `Browser Distribution Percentage: Case${variant} ${
            browserDis[variant][group]
          } ${group} ${(
            (browserDis[variant][group] / pageView[variant]) *
            100
          ).toFixed(2)}%`
        );
      });
    });
    // console.log("uuidGroup", uuidGroup);
    // console.log("browserDis", browserDis);
    // Object.keys(browserDis).forEach((variant) => {
    //   Object.keys(browserDis[variant]).forEach((size) => {
    //     Object.keys(browserDis[variant][size]).forEach((group) => {
    //       console.log(
    //         `Browser Distribution Percentage: Case${variant} ${group} ${size} ${(
    //           (browserDis[variant][size][group] / pageView[variant]) *
    //           100
    //         ).toFixed(2)}%`
    //       );
    //     });
    //   });
    // });
  });
