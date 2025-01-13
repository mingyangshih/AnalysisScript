const xlsx = require("xlsx");
const { createCanvas } = require("canvas");
const fs = require("fs");
// Load xlsx
const workbook = xlsx.readFile("./FG_10_15_outstream_onVideoStarted.xlsx");
let workbook_sheet = workbook.SheetNames;
let workbook_response = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook_sheet[0]]
);
let output = [];
workbook_response.forEach((item, idx) => {
  let bs = item.bs.split("x");
  let tpArray = item.tp.split(",");
  // Create a canvas with specified width and height
  const fontSize = 20;
  const fontFamily = "Arial";
  const canvas = createCanvas(Number(bs[0]), Number(bs[1]));
  const ctx = canvas.getContext("2d");
  // Set rectangle properties
  const x = 0;
  const y = 0;
  const width = Number(bs[0]);
  const height = Number(bs[1]);
  // Draw a browser size
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(x, y, width, height);
  // Set browser text properties
  const browserSizetext = `Browser Size ${bs[0]}x${bs[1]}`;
  const browserSizefontColor = "#00f"; // Green color
  // Set font style
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = browserSizefontColor;
  // Set text alignment (optional)
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Position to center the text
  const browserTextX = Number(bs[0]) / 2;
  const browserTextY = Number(bs[1]) / 2;
  // Draw the ad size on the canvas
  ctx.fillText(browserSizetext, browserTextX, browserTextY);

  // Draw an ad wireframe
  ctx.strokeStyle = "#e74c3c"; // Red color
  ctx.lineWidth = 2;
  ctx.strokeRect(
    Number(tpArray[2]),
    Number(tpArray[0]),
    Number(tpArray[3]) - Number(tpArray[2]),
    Number(tpArray[1]) - Number(tpArray[0])
  );
  // Set Ad text properties
  const adSizetext = `${tpArray[3] - tpArray[2]}x${tpArray[1] - tpArray[0]}`;
  item.adSize = adSizetext;
  if (+tpArray[3] - +tpArray[2] > 400) {
    output.push(item);
  }
  const adSizefontColor = "#e74c3c"; // Green color
  // Set font style
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = adSizefontColor;
  // Set text alignment (optional)
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Position to center the text
  const adTextX = (Number(tpArray[3]) + Number(tpArray[2])) / 2;
  const adTextY = (Number(tpArray[1]) + Number(tpArray[0])) / 2;
  // Draw the ad size on the canvas
  ctx.fillText(adSizetext, adTextX, adTextY);
  // Save the canvas to an image file

  if (+tpArray[3] - +tpArray[2] > 400) {
    // const out = fs.createWriteStream(
    //   __dirname + `/adPosition/ad_page_wireframe/sw_outstream_${idx}.png`
    // );
    // const stream = canvas.createPNGStream();
    // stream.pipe(out);
    // out.on("finish", () => console.log("Rectangle image saved."));
  }

  // }
  // }
});
const new_workbook_sheet = xlsx.utils.json_to_sheet(output);
const new_workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(new_workbook, new_workbook_sheet, "After Cal");
xlsx.writeFile(
  new_workbook,
  "./adPosition/FG_10_15_outstream_onVideoStarted.xlsx"
);

// Alternatively, you can also use this method to convert the canvas to a Base64 data URL
// const dataUrl = canvas.toDataURL();
// console.log('Data URL:', dataUrl);
