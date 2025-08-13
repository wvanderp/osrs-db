// Linter for CollisionMap tool output
import * as fs from "fs";
import * as path from "path";

function lintCollisionMapData() {
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    console.error("Data directory does not exist:", dataDir);
    process.exit(1);
  }
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));
  let hasError = false;
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (!data || typeof data !== "object") {
        console.error(`Invalid data in ${file}`);
        hasError = true;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`Failed to parse ${file}:`, msg);
      hasError = true;
    }
  }
  if (hasError) process.exit(1);
  else console.log("All collision map files are valid JSON.");
}

if (require.main === module) {
  lintCollisionMapData();
}
