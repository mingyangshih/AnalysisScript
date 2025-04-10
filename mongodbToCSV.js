const { MongoClient } = require("mongodb");
const { processData } = require("./iwin");
// const { Transform, Readable } = require("stream");
// const { Parser, parse } = require("json2csv");
// const fs = require("fs");
var _ = require("lodash");
const moment = require("moment");

// MongoDB 連接 URL
const preformanceUrl = "mongodb://54.213.142.191:27017"; // Performance Tracker
const debugUrl = "mongodb://54.189.105.156:27017"; //Debug Tracker
const dbName = "data-collection";
const domainId = 233;
const collectionName = `pageview${domainId}`;

async function exportData(startTs, endTs) {
  const client = new MongoClient(preformanceUrl);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    let allData = [];

    // Create array of daily timestamps
    const dates = [];
    let currentTs = startTs;
    while (currentTs <= endTs) {
      dates.push(currentTs);
      currentTs += 86400000; // Add one day in milliseconds
    }

    // Pull data day by day
    for (const dayStart of dates) {
      const dayEnd = dayStart + 86399999; // End of the day (23:59:59.999)

      const matchCondition = [
        {
          $match: {
            ts: {
              $gte: dayStart,
              $lte: dayEnd,
            },
            category: {
              $regex: "^Yolla$",
            },
          },
        },
        {
          $lookup: {
            from: "user_info233",
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
            uuid: "$uuid",
            sessionid: "$sessionid",
            ts: "$ts",
            value: "$value",
            pagepath: "$pagepath",
            cm12: "$cm12",
            coutry: "$country",
            devicecategory: "$devicecategory",
          },
        },
      ];

      console.log(
        `Pulling data for ${moment(dayStart).format("YYYY-MM-DD")}...`
      );
      const dayData = await collection.aggregate(matchCondition).toArray();
      console.log(`Found ${dayData.length} records`);

      allData = allData.concat(dayData);
    }

    console.log(`Total records: ${allData.length}`);
    processData(
      allData,
      `iwin_${moment(startTs).format("MM-DD")}_${moment(endTs).format(
        "MM-DD"
      )}_mongodb`
    );
  } catch (err) {
    console.error("Error exporting data:", err);
  } finally {
    await client.close();
  }
}

// Example usage for March 2025
const startTs = 1740805200000; // 2025-03-01 00:00:00 UTC
const endTs = 1743483600000; // 2025-03-31 23:59:59 UTC

exportData(startTs, endTs);
