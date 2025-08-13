// Linter for CollisionMap tool output
import * as fs from "fs";
import * as path from "path";
import lintWithSchema from "../../common/lintWithSchema";

function lintCollisionMapData() {
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    console.error("Data directory does not exist:", dataDir);
    process.exit(1);
  }
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));
  let hasError = false;
  const schemaPath = path.join(__dirname, "collisionMap.schema.json");
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
      // First parse to ensure valid JSON
      JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`Failed to parse ${file}:`, msg);
      hasError = true;
      continue;
    }
    if (fs.existsSync(schemaPath)) {
      try {
        lintWithSchema(filePath, schemaPath, { prefix: "[CollisionMap]" });
      } catch (e) {
        hasError = true;
      }
    }
  }
  if (hasError) process.exit(1);
  else console.log("All collision map files are valid.");
}

if (require.main === module) {
  lintCollisionMapData();
}
