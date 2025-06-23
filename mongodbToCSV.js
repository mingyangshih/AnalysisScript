const { MongoClient } = require("mongodb");
const { Transform, Readable } = require("stream");
const { Parser, parse } = require("json2csv");
const fs = require("fs");
var _ = require("lodash");

// MongoDB 連接 URL
const url = "mongodb://35.94.152.36:27017"; // Performance Tracker
const debugUrl = "mongodb://54.189.105.156:27017/"; //Debug Tracker
const dbName = "data-collection";
const domainId = 57;
const collectionName = `pageview${domainId}`;

async function exportData() {
  const client = new MongoClient(debugUrl);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const startTime = 1748545200000; // 起始時間 5/29 19 5/30
    const oneHour = 3600000; // 一小時的毫秒數
    const totalHours = 9; // 總共要查詢的小時數

    for (let i = 0; i < totalHours; i++) {
      const currentStartTime = startTime + i * oneHour;
      const currentEndTime = currentStartTime + oneHour;

      const matchCondition = [
        {
          $match: {
            ts: {
              $gte: currentStartTime,
              $lte: currentEndTime,
            },
            label: "desktop-outstream",
            action: {
              $regex: "^onVideoStarted$",
            },
            cd3: {
              $in: ["3"],
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
            cd24: "$cd24",
            cd26: "$cd26",
            cd27: "$cd27",
            cd33: "$cd33",
            cd36: "$cd36",
            cd38: "$cd38",
            cd40: "$cd40",
            cm3: "$cm3",
            cm5: "$cm5",
            cm13: "$cm13",
          },
        },
      ];

      // query data
      const data = await collection
        .aggregate(matchCondition, {
          maxTimeMS: 600000,
          allowDiskUse: true, // 允許使用磁盤進行排序
        })
        .toArray();

      if (data.length > 0) {
        console.log(`\nFound ${data.length} records for hour ${i + 1}`);
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);
        const fileName = `bubbleshooter.net/onVideoStarted/hour_${
          i + 1
        }_data.csv`;
        fs.writeFileSync(fileName, csv);
        console.log(`Saved to: ${fileName}`);
      } else {
        console.log(`\nNo data found for hour ${i + 1}`);
      }
    }
  } catch (err) {
    console.error("Error exporting data:", err);
  } finally {
    await client.close();
  }
}

exportData();
