// scripts/generateCarIndex.js
import fs from "fs";
import path from "path";

const carsFolder = path.join("data", "cars");
const indexFile = path.join("data", "cars.json");

try {
  const files = fs
    .readdirSync(carsFolder)
    .filter(file => file.endsWith(".json") && file !== "cars.json");

  fs.writeFileSync(indexFile, JSON.stringify(files, null, 2));
  console.log(`✅ Updated cars.json with ${files.length} entries.`);
} catch (err) {
  console.error("❌ Error generating cars.json:", err);
  process.exit(1);
}
