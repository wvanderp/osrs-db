// Tool for extracting and processing the collision map from the OSRS cache
// This tool assumes the workflow will generate the output in a known location (e.g., tools/CollisionMap/data/)
import * as fs from "fs";
import * as path from "path";
import { Tool } from "../../collect/Tool";

export interface CollisionMapOutput {
  regionId: number;
  collisionData: any;
}


export const CollisionMapTool: Tool = {
  name: "CollisionMap",
  description: "Extracts and processes collision map data from the OSRS cache.",
  version: "1.0.0",
  needs: [],
  async run(): Promise<void> {
    // Implement the main logic for running the tool here if needed
    // For now, this is a stub.
    console.log("CollisionMapTool run() called");
  },
};

/**
 * Loads all collision map data files from the data directory.
 */
export function loadAll(): CollisionMapOutput[] {
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) return [];
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const regionId = parseInt(file.replace(/\.json$/, ""));
    const collisionData = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), "utf8")
    );
    return { regionId, collisionData };
  });
}

/**
 * Loads a single region's collision map data.
 */
export function loadRegion(regionId: number): CollisionMapOutput | null {
  const file = path.join(__dirname, "data", `${regionId}.json`);
  if (!fs.existsSync(file)) return null;
  return {
    regionId,
    collisionData: JSON.parse(fs.readFileSync(file, "utf8")),
  };
}
