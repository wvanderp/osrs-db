import fs from "fs";
import path from "path";
import { cyan, red, green } from "../../common/colors";
import SlotStatsSchema from "./SlotStats.schema";

// load the file
const filePath = path.join(__dirname, "../../data/slotStats.g.json");
const file = JSON.parse(fs.readFileSync(filePath, "utf8")) as { [key: string]: number | string | null }[];

export default function lintSlotStats() {
    console.log(cyan("Linting slotStats.g.json"));
    // #region schema
    const result = SlotStatsSchema.safeParse(file);

    if (!result.success) {
        console.error(cyan("[slotStats.linter]"), red("slotStats schema validation errors:"), result.error.issues);
    }
    // #endregion

    // #region no duplicate ids
    const ids = file.map(item => item.id).filter(id => typeof id === "number") as number[];
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicates.length > 0) {
        console.error(cyan("[slotStats.linter]"), red("Duplicate values found:"), duplicates);
    }
    // #endregion


    console.log(cyan("[slotStats.linter]"), green("slotStats.g.json is valid"));
}
