const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file =
  "./bubbleshooter.net/bubbleshooter.net_06-07_bidResponse_bidRequested_Case3_16-24.csv";
let createObject = require("./Utils/createVariantObject");
let { createVariantObject } = createObject;

// Use a Map for better memory management
const groupedData = new Map();
let totalBidRequested = 0;
let totalBidResponse = 0;
let retryCount = 0;
let retryBidRequestedCount = 0;

// Helper function to format timestamp
const formatTimestamp = (ts) => {
  try {
    const date = new Date(Number(ts));
    return date.toISOString();
  } catch (e) {
    return `Invalid timestamp: ${ts}`;
  }
};

// Process data in chunks
const processChunk = (chunk) => {
  if (
    chunk.label.indexOf("outstream") > -1 &&
    chunk.cd3 === "3" &&
    (chunk.action === "bidResponse" || chunk.action === "bidRequested")
  ) {
    const key = `${chunk.uuid}_${chunk.cd24}`;

    if (!groupedData.has(key)) {
      groupedData.set(key, []);
    }

    groupedData.get(key).push(chunk);

    if (chunk.action === "bidRequested") {
      totalBidRequested++;
    } else if (chunk.action === "bidResponse") {
      totalBidResponse++;
    }
  }
};

// Process groups and calculate retries
const processGroups = () => {
  for (const [key, group] of groupedData) {
    // Sort group by timestamp
    const sortedGroup = _.sortBy(group, "ts");
    if (sortedGroup.length === 0) continue;

    // Group by 10-second intervals
    const timeGroups = _.groupBy(sortedGroup, (item) => {
      const relativeTime = (Number(item.ts) - Number(sortedGroup[0].ts)) / 1000;
      return Math.floor(relativeTime / 10);
    });

    // Process each time group
    for (const [timeInterval, group] of Object.entries(timeGroups)) {
      let groupRetryBidRequested = 0;
      let groupRetryBidResponse = 0;

      // Find the first bidRequested in this time group
      const firstBidRequested = group.find(
        (item) => item.action === "bidRequested"
      );
      if (!firstBidRequested) continue;

      const baselineTs = Number(firstBidRequested.ts);

      // Check for retry bidRequested
      group.forEach((item) => {
        if (item.action === "bidRequested") {
          const relativeTime = (Number(item.ts) - baselineTs) / 1000;
          const isRetry = relativeTime > 0.5;

          if (isRetry) {
            groupRetryBidRequested++;
            retryBidRequestedCount++;
          }
        }
      });

      const bidRequestedCount = group.filter(
        (item) => item.action === "bidRequested"
      ).length;

      // Mark bidResponse as retry if more than 10 bidRequested
      if (bidRequestedCount > 10) {
        const retryEvents = group.filter(
          (item) => item.action === "bidResponse"
        );
        groupRetryBidResponse = retryEvents.length;
        retryCount += retryEvents.length;
      }
    }
  }
};

// Main processing
fs.createReadStream(file)
  .pipe(csv())
  .on("data", processChunk)
  .on("end", () => {
    processGroups();

    console.log("\n=== Final Results ===");
    console.log(file);
    console.log(`Total bidRequested count: ${totalBidRequested}`);
    console.log(`Total bidResponse count: ${totalBidResponse}`);
    console.log(`Total retry bidResponse count: ${retryCount}`);
    console.log(`Total retry bidRequested count: ${retryBidRequestedCount}`);

    // Clear data after processing
    groupedData.clear();
  });
