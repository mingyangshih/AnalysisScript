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

<<<<<<< HEAD
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

=======
  // Calculate unique users for each time bucket
  const pageUniqueUsers = _.chain(game)
    .groupBy(
      (item) =>
        `${item.uuid}_${item.pagepath}_${item.country}_${item.devicecategory}`
    )
    .map((events) => {
      const pagepath = events[0].pagepath;
      const uuid = events[0].uuid;
      const country = events[0].country;
      const devicecategory = events[0].devicecategory;
>>>>>>> only_pagepath
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

<<<<<<< HEAD
          // Add revenue to all applicable buckets based on cm12Minutes
=======
>>>>>>> only_pagepath
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

<<<<<<< HEAD
        // Add non-game revenue for this user to qualified buckets only
        const userNonGameRevenue = nonGameUserRevenue[uuid]?.totalRevenue || 0;

        // Only add non-game revenue to buckets where game revenue is not zero
=======
        // Add non-game revenue
        const userNonGameRevenue = nonGameUserRevenue[uuid]?.totalRevenue || 0;
>>>>>>> only_pagepath
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
<<<<<<< HEAD
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
=======
        country,
        devicecategory,
        revenue,
      };
    })
    .groupBy(
      (item) => `${item.pagepath}_${item.country}_${item.devicecategory}`
    )
    .mapValues((users) => ({
      totalUniqueUsers: users.length,
      users_1min: _.filter(users, (u) => u.revenue["1min"] > 0).length,
      users_5min: _.filter(users, (u) => u.revenue["5min"] > 0).length,
      users_10min: _.filter(users, (u) => u.revenue["10min"] > 0).length,
      users_20min: _.filter(users, (u) => u.revenue["20min"] > 0).length,
      users_30min: _.filter(users, (u) => u.revenue["30min"] > 0).length,
      users_40min: _.filter(users, (u) => u.revenue["40min"] > 0).length,
      users_50min: _.filter(users, (u) => u.revenue["50min"] > 0).length,
      users_60min: _.filter(users, (u) => u.revenue["60min"] > 0).length,
    }))
    .value();

  // 在 pageUniqueUsers 後面加入新的計算
  const pageSessions = _.chain(game)
    .groupBy(
      (item) =>
        `${item.uuid}_${item.sessionid}_${item.pagepath}_${item.country}_${item.devicecategory}`
    )
    .map((events) => {
      const pagepath = events[0].pagepath;
      const uuid = events[0].uuid;
      const sessionid = events[0].sessionid;
      const country = events[0].country;
      const devicecategory = events[0].devicecategory;
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
      }

      return {
        uuid,
        sessionid,
        pagepath,
        country,
        devicecategory,
        revenue,
      };
    })
    .groupBy(
      (item) => `${item.pagepath}_${item.country}_${item.devicecategory}`
    )
    .mapValues((sessions) => ({
      totalSessions: sessions.length,
      sessions_1min: _.filter(sessions, (s) => s.revenue["1min"] > 0).length,
      sessions_5min: _.filter(sessions, (s) => s.revenue["5min"] > 0).length,
      sessions_10min: _.filter(sessions, (s) => s.revenue["10min"] > 0).length,
      sessions_20min: _.filter(sessions, (s) => s.revenue["20min"] > 0).length,
      sessions_30min: _.filter(sessions, (s) => s.revenue["30min"] > 0).length,
      sessions_40min: _.filter(sessions, (s) => s.revenue["40min"] > 0).length,
      sessions_50min: _.filter(sessions, (s) => s.revenue["50min"] > 0).length,
      sessions_60min: _.filter(sessions, (s) => s.revenue["60min"] > 0).length,
    }))
    .value();

  const TOTAL_VALUE = 23543946;
  const DFP_REVENUE = 333.683;

  // Process game pages and add non-game revenue
  let gameRevenueReport = _.chain(game)
    .groupBy(
      (item) =>
        `${item.uuid}_${item.pagepath}_${item.country}_${item.devicecategory}`
    )
    .map((events) => {
      const pagepath = events[0].pagepath;
      const uuid = events[0].uuid;
      const country = events[0].country;
      const devicecategory = events[0].devicecategory;
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

          if (totalTimeSpentMinutes > 1 && cm12Minutes <= 1) {
            revenue["1min"] += eventValue;
          }
          if (totalTimeSpentMinutes > 5 && cm12Minutes <= 5) {
            revenue["5min"] += eventValue;
          }
          if (totalTimeSpentMinutes > 10 && cm12Minutes <= 10) {
            revenue["10min"] += eventValue;
          }
          if (totalTimeSpentMinutes > 20 && cm12Minutes <= 20) {
            revenue["20min"] += eventValue;
          }
          if (totalTimeSpentMinutes > 30 && cm12Minutes <= 30) {
            revenue["30min"] += eventValue;
          }
          if (totalTimeSpentMinutes > 40 && cm12Minutes <= 40) {
            revenue["40min"] += eventValue;
          }
          if (totalTimeSpentMinutes > 50 && cm12Minutes <= 50) {
            revenue["50min"] += eventValue;
          }
          if (totalTimeSpentMinutes > 60 && cm12Minutes <= 60) {
            revenue["60min"] += eventValue;
          }
        });

        // Add non-game revenue
        const userNonGameRevenue = nonGameUserRevenue[uuid]?.totalRevenue || 0;
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
        country,
        devicecategory,
        timeSpentMinutes: Math.round(totalTimeSpentMinutes * 100) / 100,
        eventCount: events.length,
        revenue,
      };
    })
    .groupBy(
      (item) => `${item.pagepath}_${item.country}_${item.devicecategory}`
    )
    .map((users, key) => {
      const [pagepath, country, devicecategory] = key.split("_");
      // 先計算原始的 revenue 值
      const rawRevenues = {
        revenue_1min: _.sumBy(users, (u) => u.revenue["1min"]),
        revenue_5min: _.sumBy(users, (u) => u.revenue["5min"]),
        revenue_10min: _.sumBy(users, (u) => u.revenue["10min"]),
        revenue_20min: _.sumBy(users, (u) => u.revenue["20min"]),
        revenue_30min: _.sumBy(users, (u) => u.revenue["30min"]),
        revenue_40min: _.sumBy(users, (u) => u.revenue["40min"]),
        revenue_50min: _.sumBy(users, (u) => u.revenue["50min"]),
        revenue_60min: _.sumBy(users, (u) => u.revenue["60min"]),
      };

      return {
        pagepath,
        country,
        devicecategory,
        totalEvents: _.sumBy(users, "eventCount"),
        avgTimeSpent:
          Math.round(_.meanBy(users, "timeSpentMinutes") * 100) / 100,
        ...pageUniqueUsers[key],
        ...pageSessions[key], // 加入 sessions 數據
        // 對每個 revenue 值套用公式並保留兩位小數
        revenue_1min: Number(
          ((rawRevenues.revenue_1min / TOTAL_VALUE) * DFP_REVENUE).toFixed(2)
        ),
        revenue_5min: Number(
          ((rawRevenues.revenue_5min / TOTAL_VALUE) * DFP_REVENUE).toFixed(2)
        ),
        revenue_10min: Number(
          ((rawRevenues.revenue_10min / TOTAL_VALUE) * DFP_REVENUE).toFixed(2)
        ),
        revenue_20min: Number(
          ((rawRevenues.revenue_20min / TOTAL_VALUE) * DFP_REVENUE).toFixed(2)
        ),
        revenue_30min: Number(
          ((rawRevenues.revenue_30min / TOTAL_VALUE) * DFP_REVENUE).toFixed(2)
        ),
        revenue_40min: Number(
          ((rawRevenues.revenue_40min / TOTAL_VALUE) * DFP_REVENUE).toFixed(2)
        ),
        revenue_50min: Number(
          ((rawRevenues.revenue_50min / TOTAL_VALUE) * DFP_REVENUE).toFixed(2)
        ),
        revenue_60min: Number(
          ((rawRevenues.revenue_60min / TOTAL_VALUE) * DFP_REVENUE).toFixed(2)
        ),
      };
    })
    .value();

  // Update CSV output format
  const gameCsvOutput = gameRevenueReport.map(
    (stat) =>
      `${stat.pagepath},${stat.country},${stat.devicecategory},` +
      `${stat.totalUniqueUsers},${stat.totalSessions},${stat.totalEvents},${stat.avgTimeSpent},` +
      // 1min
      `${stat.users_1min},${stat.sessions_1min},${stat.revenue_1min},` +
      // 5min
      `${stat.users_5min},${stat.sessions_5min},${stat.revenue_5min},` +
      // 10min
      `${stat.users_10min},${stat.sessions_10min},${stat.revenue_10min},` +
      // 20min
      `${stat.users_20min},${stat.sessions_20min},${stat.revenue_20min},` +
      // 30min
      `${stat.users_30min},${stat.sessions_30min},${stat.revenue_30min},` +
      // 40min
      `${stat.users_40min},${stat.sessions_40min},${stat.revenue_40min},` +
      // 50min
      `${stat.users_50min},${stat.sessions_50min},${stat.revenue_50min},` +
      // 60min
      `${stat.users_60min},${stat.sessions_60min},${stat.revenue_60min}`
  );

  gameCsvOutput.unshift(
    "pagepath,country,devicecategory," +
      "totalUniqueUsers,totalSessions,totalEvents,avgTimeSpent," +
      "users_1min,sessions_1min,revenue_1min," +
      "users_5min,sessions_5min,revenue_5min," +
      "users_10min,sessions_10min,revenue_10min," +
      "users_20min,sessions_20min,revenue_20min," +
      "users_30min,sessions_30min,revenue_30min," +
      "users_40min,sessions_40min,revenue_40min," +
      "users_50min,sessions_50min,revenue_50min," +
      "users_60min,sessions_60min,revenue_60min"
  );

  fs.writeFileSync(
    `./iwin/iwin_03-01_report_country_device_revenue_session.csv`,
    gameCsvOutput.join("\n")
  );
>>>>>>> only_pagepath
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
