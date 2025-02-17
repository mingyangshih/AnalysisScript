const { MongoClient } = require("mongodb");
const { Transform, Readable } = require("stream");
const { Parser, parse } = require("json2csv");
const fs = require("fs");
var _ = require("lodash");

// MongoDB 連接 URL
const url = "mongodb://35.94.152.36:27017"; // Performance Tracker
const debugUrl = "mongodb://54.189.105.156:27017"; //Debug Tracker
const dbName = "data-collection";
const domainId = 120;
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
            $gte: 1737435600000,
            $lte: 1737522000000, // 1738040400000
          },
          label: "desktop-outstream",
          // label: "desktop-medrec-template",
          // category: {
          //   $regex: "^Duration$",
          // },
          action: {
            $regex:
              // "^beforeSlotRequest$|^onVideoStarted$|bidResponse|slotRenderEnded|bidRequested",
              // "^beforeSlotRequest$|bidResponse|slotRenderEnded|bidRequested",
              "bidResponse|bidRequested",
            // "pageview",
          },
          cd3: {
            // $regex: "71|72|73|74|75|76", //card game
            // $regex: "23|24|25|26|27|28", classic game
            // $regex: "87|88|89|90|91|92", //action
            $regex: "22|23|24|25|26|27|28", // hidden
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
          sessionid: "$sessionid",
          bs: "$bs",
          pagepath: "$pagepath",
          hostname: "$hostname",
          country: "$country",
          cd1: "$cd1",
          cd2: "$cd2",
          cd3: "$cd3",
          cd4: "$cd4",
          cd5: "$cd5",
          cd6: "$cd6",
          cd7: "$cd7",
          cd26: "$cd26",
          cd27: "$cd27",
          cd33: "$cd33",
          cd36: "$cd36",
          cd38: "$cd38",
          cm3: "$cm3",
          cm5: "$cm5",
          cm13: "$cm13",
        },
      },
    ];

    // query data
    const data = await collection.aggregate(matchCondition).toArray();
    console.log(data.length);

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    // save file
    fs.writeFileSync(`hidden/${data[0].cd7}_01-21_outstream.csv`, csv);
    console.log(`Done: ${data[0].cd7}_01-21_outstream.csv`);
  } catch (err) {
    console.error("Error exporting data:", err);
  } finally {
    await client.close();
  }
  // });
}

exportData();
