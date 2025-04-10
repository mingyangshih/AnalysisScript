const fs = require("fs");
var _ = require("lodash");
const csv = require("csv-parser");
let file = "./iwin/iwin_03-31_Yolla.csv";
let reportResult = [];

function processData(reportResult, fileName = "test") {
  // Separate game and non-game pages at the start
  const { game, nonGame } = _.groupBy(reportResult, (item) =>
    item.pagepath.includes("/online-games/game/play/") ? "game" : "nonGame"
  );

  // First get non-game revenue by user (simplified)
  let nonGameUserRevenue = _.chain(nonGame)
    .groupBy("uuid")
    .map((events) => {
      return {
        uuid: events[0].uuid,
        totalRevenue: _.sumBy(events, (event) => Number(event.value) || 0),
      };
    })
    .keyBy("uuid")
    .value();

  // Calculate session numbers for each pagepath
  const pageSessionCounts = _.chain(game)
    .groupBy("pagepath")
    .mapValues((pageEvents) => {
      return _.uniqBy(
        pageEvents.map((event) => ({
          uuid: event.uuid,
          sessionid: event.sessionid,
        })),
        (item) => `${item.uuid}_${item.sessionid}`
      ).length;
    })
    .value();

  const totalEventValue = 23291796;
  const dfpRevenue = 329.9636;

  // Process game pages and add non-game revenue
  let gameRevenueReport = _.chain(game)
    .groupBy((item) => `${item.uuid}_${item.pagepath}_${item.sessionid}`)
    .map((events) => {
      const pagepath = events[0].pagepath;
      const uuid = events[0].uuid;

      let revenue = {
        "1min": 0,
        "5min": 0,
        "10min": 0,
        "20min": 0,
        "30min": 0,
        "40min": 0,
        "50min": 0,
        "60min": 0,
      };

      const minTs = _.minBy(events, (item) => Number(item.ts))?.ts;
      const maxTs = _.maxBy(events, (item) => Number(item.ts))?.ts;
      const totalTimeSpentMinutes =
        (Number(maxTs) - Number(minTs)) / (1000 * 60);

      if (totalTimeSpentMinutes >= 1) {
        events.forEach((event) => {
          const cm12Minutes = (Number(event.cm12) || 0) / 60;
          const eventValue = Number(event.value) || 0;

          // Add revenue to all applicable buckets based on cm12Minutes
          if (totalTimeSpentMinutes > 1 && cm12Minutes <= 1)
            revenue["1min"] += eventValue;
          if (totalTimeSpentMinutes > 5 && cm12Minutes <= 5)
            revenue["5min"] += eventValue;
          if (totalTimeSpentMinutes > 10 && cm12Minutes <= 10)
            revenue["10min"] += eventValue;
          if (totalTimeSpentMinutes > 20 && cm12Minutes <= 20)
            revenue["20min"] += eventValue;
          if (totalTimeSpentMinutes > 30 && cm12Minutes <= 30)
            revenue["30min"] += eventValue;
          if (totalTimeSpentMinutes > 40 && cm12Minutes <= 40)
            revenue["40min"] += eventValue;
          if (totalTimeSpentMinutes > 50 && cm12Minutes <= 50)
            revenue["50min"] += eventValue;
          if (totalTimeSpentMinutes > 60 && cm12Minutes <= 60)
            revenue["60min"] += eventValue;
        });

        // Add non-game revenue for this user to qualified buckets only
        const userNonGameRevenue = nonGameUserRevenue[uuid]?.totalRevenue || 0;

        // Only add non-game revenue to buckets where game revenue is not zero
        if (revenue["1min"] > 0) revenue["1min"] += userNonGameRevenue;
        if (revenue["5min"] > 0) revenue["5min"] += userNonGameRevenue;
        if (revenue["10min"] > 0) revenue["10min"] += userNonGameRevenue;
        if (revenue["20min"] > 0) revenue["20min"] += userNonGameRevenue;
        if (revenue["30min"] > 0) revenue["30min"] += userNonGameRevenue;
        if (revenue["40min"] > 0) revenue["40min"] += userNonGameRevenue;
        if (revenue["50min"] > 0) revenue["50min"] += userNonGameRevenue;
        if (revenue["60min"] > 0) revenue["60min"] += userNonGameRevenue;
      }

      return {
        uuid,
        pagepath,
        sessionNumber: pageSessionCounts[pagepath],
        timeSpentMinutes: Math.round(totalTimeSpentMinutes * 100) / 100,
        eventCount: events.length,
        ...revenue,
      };
    })
    .groupBy("pagepath")
    .map((sessions, pagepath) => ({
      pagepath,
      totalUniqueUsers: _.uniqBy(sessions, "uuid").length,
      totalEvents: _.sumBy(sessions, "eventCount"),
      avgTimeSpent:
        Math.round(_.meanBy(sessions, "timeSpentMinutes") * 100) / 100,
      sessionCount: sessions.length,
      // Revenue calculation
      revenue_1min:
        Math.round(
          (_.sumBy(sessions, "1min") / totalEventValue) * dfpRevenue * 100
        ) / 100,
      revenue_5min:
        Math.round(
          (_.sumBy(sessions, "5min") / totalEventValue) * dfpRevenue * 100
        ) / 100,
      revenue_10min:
        Math.round(
          (_.sumBy(sessions, "10min") / totalEventValue) * dfpRevenue * 100
        ) / 100,
      revenue_20min:
        Math.round(
          (_.sumBy(sessions, "20min") / totalEventValue) * dfpRevenue * 100
        ) / 100,
      revenue_30min:
        Math.round(
          (_.sumBy(sessions, "30min") / totalEventValue) * dfpRevenue * 100
        ) / 100,
      revenue_40min:
        Math.round(
          (_.sumBy(sessions, "40min") / totalEventValue) * dfpRevenue * 100
        ) / 100,
      revenue_50min:
        Math.round(
          (_.sumBy(sessions, "50min") / totalEventValue) * dfpRevenue * 100
        ) / 100,
      revenue_60min:
        Math.round(
          (_.sumBy(sessions, "60min") / totalEventValue) * dfpRevenue * 100
        ) / 100,
    }))
    .value();

  // Save game pages report
  const gameCsvOutput = gameRevenueReport.map(
    (stat) =>
      `${stat.pagepath},${stat.totalUniqueUsers},${stat.totalEvents},${stat.avgTimeSpent},` +
      `${stat.revenue_1min},${stat.revenue_5min},${stat.revenue_10min},${stat.revenue_20min},` +
      `${stat.revenue_30min},${stat.revenue_40min},${stat.revenue_50min},${stat.revenue_60min}`
  );
  gameCsvOutput.unshift(
    "pagepath,totalUniqueUsers,totalEvents,avgTimeSpent," +
      "revenue_1min,revenue_5min,revenue_10min,revenue_20min," +
      "revenue_30min,revenue_40min,revenue_50min,revenue_60min"
  );

  fs.writeFileSync(`./iwin/iwin_03-31_report.csv`, gameCsvOutput.join("\n"));
}

fs.createReadStream(file)
  .pipe(csv())
  .on("data", (data) => {
    reportResult.push(data);
  })
  .on("end", () => {
    processData(reportResult);
  });

module.exports = {
  processData,
};
