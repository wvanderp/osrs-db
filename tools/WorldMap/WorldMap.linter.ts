import fs from "fs";
import path from "path";
import { cyan, green, red } from "../../common/colors";

export default function lintWorldMap() {
    const file = path.join(__dirname, "data", "worldmap.svg");
    console.log(cyan("[WorldMap.linter]"), "Checking for generated SVG...");
    if (!fs.existsSync(file)) {
        console.error(cyan("[WorldMap.linter]"), red("Missing worldmap.svg in data folder"));
        process.exitCode = 1;
        return;
    }
    const stat = fs.statSync(file);
    if (stat.size <= 0) {
        console.error(cyan("[WorldMap.linter]"), red("worldmap.svg is empty"));
        process.exitCode = 1;
        return;
    }
    console.log(cyan("[WorldMap.linter]"), green("worldmap.svg exists and is non-empty"));
}
