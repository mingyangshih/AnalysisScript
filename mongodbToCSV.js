const { MongoClient } = require("mongodb");
const { Transform, Readable } = require("stream");
const { Parser, parse } = require("json2csv");
const fs = require("fs");
var _ = require("lodash");

// MongoDB 連接 URL
const url = "mongodb://35.164.7.114:27017"; //"mongodb://54.189.105.156:27017/";
const dbName = "data-collection";
const collectionName = "pageview46";
// 86400000
// const July_1_to_July_15 = [
//   1719806400000, 1719892800000, 1719979200000, 1720065600000, 1720152000000,
//   1720238400000, 1720324800000, 1720411200000, 1720497600000, 1720584000000,
//   1720670400000, 1720756800000, 1720843200000, 1720929600000, 1721016000000,
//   1721102400000, 1721188800000
// ];
const July_1_to_July_15 = [
  // 7/15
  1721102400000, 1721191121000,
];

async function exportData() {
  // _.forEach(July_1_to_July_15, async (value, index) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log(
      new Date(new Number(1724299200000)).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
      new Date(new Number(1724385600000)).toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    );
    // pv
    const matchCondition = [
      {
        $match: {
          ts: {
            $gte: 1724299200000,
            $lte: 1724385600000,
          },
          category: {
            $regex: "^pageview$",
          },
          cd3: {
            $regex: "92|93",
          },
        },
      },
      // step 6: Format the output
      {
        $project: {
          cd3: "$cd3",
          pagepath: "$pagepath",
          category: "$category",
        },
      },
    ];
    // const matchCondition = [
    //   {
    //     $match: {
    //       ts: {
    //         $gte: 1724299200000,
    //         $lte: 1724385600000,
    //       },
    //       action: {
    //         $regex: "^ympbReady$",
    //       },
    //     },
    //   },
    //   // step 6: Format the output
    //   {
    //     $project: {
    //       cd3: "$cd3",
    //       pagepath: "$pagepath",
    //       action: "$action",
    //     },
    //   },
    // ];
    // query data
    const data = await collection.aggregate(matchCondition).toArray();
    console.log(data.length);

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    // save file
    fs.writeFileSync(`freegame.org_pv_08-22_92_93.csv`, csv);
    console.log(`freegame.org_pv_08-22_92_93.csv Done`);
  } catch (err) {
    console.error("Error exporting data:", err);
  } finally {
    await client.close();
  }
  // });
}

exportData();
