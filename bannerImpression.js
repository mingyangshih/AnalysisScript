const fs = require("fs");
const xlsx = require("xlsx");
var _ = require("lodash");
const csv = require("csv-parser");
let slotRenderEnded = "./hidden_slotRenderEnded_12-30.csv";
let impressionViewable = "./hidden_impressionViewable_12-06_12-10.csv";
let datas = [];
let variant = {};
let cd26 = {};
let vatiantBanner = {};
let cpm = {};
let empty = {};
let size = {};
let country = {};
let adUnit = {};

fs.createReadStream(slotRenderEnded)
  .pipe(csv())
  .on("data", (data) => datas.push(data)) //Domain
  .on("end", () => {
    for (let i = 0; i < datas.length; i++) {
      // let day = new Date(new Number(datas[i]["ts"])).toLocaleString("en-US", {
      //   timeZone: "America/New_York",
      //   year: "numeric",
      //   month: "numeric",
      //   day: "numeric",
      // });
      // if (day !== "12/14/2024") {
      //   console.log(day);
      // }

      let tpArray = datas[i].tp.split(",");
      let adWidth = tpArray[3] - tpArray[2];
      let adHeight = tpArray[1] - tpArray[0];
      let adSize = `${adWidth}x${adHeight}`;
      // let browserHeight = +datas[i]["bs"].split("x")[1];
      let browserWidth = +datas[i].bs.split("x")[0];

      let browserDistribute = "";
      if (browserWidth >= 1200) {
        browserDistribute = "XL";
      } else if (browserWidth < 1200 && browserWidth >= 992) {
        browserDistribute = "L";
      } else {
        browserDistribute = "S";
      }
      //
      if (!vatiantBanner[datas[i].cd3]) {
        vatiantBanner[datas[i].cd3] = {
          XL: 0,
          L: 0,
          S: 0,
        };
      }
      //   ================
      if (!cpm[datas[i].cd3]) {
        cpm[datas[i].cd3] = 0;
      }
      if (!adUnit[datas[i].cd3]) {
        adUnit[datas[i].cd3] = {};
      }
      if (!variant[datas[i].cd3]) {
        variant[datas[i].cd3] = 0;
      }
      if (!empty[datas[i].cd3]) {
        empty[datas[i].cd3] = 0;
      }
      if (!country[datas[i].cd3]) {
        country[datas[i].cd3] = {
          US: 0,
          not_US: 0,
        };
      }
      if (!size[datas[i].cd3]) {
        size[datas[i].cd3] = {
          "728x90": 0,
          "300x50": 0,
          "300x250": 0,
          "320x250": 0,
          "300x600": 0,
          "160x600": 0,
          "970x250": 0,
        };
      }
      // if (datas[i].label.indexOf("leaderboard") > -1) {
      if (
        datas[i].cd26 === "dfp_rendered" ||
        datas[i].cd26 === "prebid_render"
      ) {
        // empty
        // empty[datas[i].cd3] += 1;
        // variant total number
        variant[datas[i].cd3] += 1;
        // cpm
        cpm[datas[i].cd3] += +datas[i].cm5;
        // browser size distribution
        vatiantBanner[datas[i].cd3][browserDistribute] += 1;
        // country
        if (datas[i].country === "US") {
          country[datas[i].cd3]["US"] += 1;
        } else {
          country[datas[i].cd3]["not_US"] += 1;
        }
        // adUnit
        if (!adUnit[datas[i].cd3][datas[i].label]) {
          adUnit[datas[i].cd3][datas[i].label] = 1;
        } else {
          adUnit[datas[i].cd3][datas[i].label] += 1;
        }
        //ad size
        if (adWidth === 728 && adHeight === 90) {
          size[datas[i].cd3][adSize] += 1;
        } else if (adWidth === 300 && adHeight === 50) {
          size[datas[i].cd3][adSize] += 1;
        } else if (adWidth === 320 && adHeight === 250) {
          size[datas[i].cd3][adSize] += 1;
        } else if (adWidth === 300 && adHeight === 250) {
          size[datas[i].cd3][adSize] += 1;
        } else if (adWidth === 300 && adHeight === 600) {
          size[datas[i].cd3][adSize] += 1;
        } else if (adWidth === 160 && adHeight === 600) {
          size[datas[i].cd3][adSize] += 1;
        } else if (adWidth === 970 && adHeight === 250) {
          size[datas[i].cd3][adSize] += 1;
        }
      }
    }
    // }
    console.log(
      slotRenderEnded,
      "variant",
      variant,
      // "vatiantBanner",
      // vatiantBanner,
      "cpm",
      cpm,
      // "empty",
      // empty,
      // "size",
      // size,
      // "country",
      // country,
      "adUnit",
      adUnit
    );
    Object.keys(variant).forEach((item) => {
      Object.keys(adUnit[item]).forEach((unit) => {
        console.log(
          `Case${item} ${unit}: ${(adUnit[item][unit] / variant[item]) * 100}%`
        );
      });
    });
  });
