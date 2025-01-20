const { MongoClient } = require("mongodb");
const { Transform, Readable } = require("stream");
const { Parser, parse } = require("json2csv");
const fs = require("fs");
var _ = require("lodash");

// MongoDB 連接 URL
const url = "mongodb://35.94.152.36:27017"; // Performance Tracker
const debugUrl = "mongodb://54.189.105.156:27017"; //Debug Tracker
const dbName = "data-collection";
const domainId = 111;
const collectionName = `pageview${domainId}`;

async function exportData() {
  // _.forEach(July_1_to_July_15, async (value, index) => {
  const client = new MongoClient(debugUrl);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // pv
    const matchCondition = [
      {
        $match: {
          ts: {
            $gte: 1737176400000,
            $lte: 1737262800000,
          },
          // label: "desktop-outstream",
          // category: {
          //   $regex: "^Duration$",
          // },
          action: {
            $regex:
              "^beforeSlotRequest$|^onVideoStarted$|bidResponse|slotRenderEnded",
          },
          cd3: {
            // $regex: "65|66|67|68|69|70", card game
            // $regex: "23|24|25|26|27|28", classic game
            $regex: "87|88|89|90|91|92",
          },
        },
      },
      {
        $lookup: {
          from: `user_info${domainId}`,
          as: "user",
          localField: "user_info_id",
          foreignField: "_id",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$$ROOT",
              {
                $arrayElemAt: ["$user", 0],
              },
            ],
          },
        },
      },
      {
        $project: {
          label: "$label",
          ts: "$ts",
          category: "$category",
          action: "$action",
          value: "$value",
          uuid: "$uuid",
          bs: "$bs",
          pagepath: "$pagepath",
          hostname: "$hostname",
          country: "$country",
          cd1: "$cd1",
          cd2: "$cd2",
          cd3: "$cd3",
          cd7: "$cd7",
          cd26: "$cd26",
          cm5: "$cm5",
        },
      },
    ];

    // query data
    const data = await collection.aggregate(matchCondition).toArray();
    console.log(data.length);

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    // save file
    fs.writeFileSync(`${data[0].cd7}_01_18.csv`, csv);
    console.log(`Done: ${data[0].cd7}_01_18.csv`);
  } catch (err) {
    console.error("Error exporting data:", err);
  } finally {
    await client.close();
  }
  // });
}

exportData();
