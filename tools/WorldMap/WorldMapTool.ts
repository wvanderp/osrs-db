import * as fs from "fs";
import * as path from "path";
import Tool from "../../collect/Tool";
import { cyan, green, yellow } from "../../common/colors";

export const WorldMapTool: Tool = {
    name: "WorldMap",
    description: "Renders a simple world map SVG from collision region data.",
    version: "0.1.0",
    needs: ["CollisionMap"],
    async run(): Promise<void> {
        console.log(cyan("[WorldMap]"), "Rendering world map...");
    },
    async lint(): Promise<void> {

    },
};

export default WorldMapTool;
