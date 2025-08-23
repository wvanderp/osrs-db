// Tool for extracting and processing the collision map from the OSRS cache
// This tool assumes the workflow will generate the output in a known location (e.g., tools/CollisionMap/data/)
import * as fs from "fs";
import * as path from "path";
import Tool from "../../collect/Tool";

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
    // Todo implement
    console.log("CollisionMapTool run() called");
  },
  async lint(): Promise<void> {
    // TODO: implement linter
  },
};
