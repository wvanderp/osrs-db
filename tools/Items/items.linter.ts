import fs from "fs";
import path from "path";
import lintWithZod from "../../common/lintWithZod";
import { cyan, red, green } from "../../common/colors";
import ItemsSchema from "./Items.schema";

const prefix = cyan("[ItemsTool]");

export default function LintItems() {
    const filePath = path.join(__dirname, "../../data/items.g.json");

    console.log(`${prefix} ${cyan("Linting items.g.json")}`);

    let hasError = false;
    const valid = lintWithZod(filePath, ItemsSchema, { prefix });
    if (!valid) {
        hasError = true;
    }

    const file = JSON.parse(fs.readFileSync(filePath, "utf8")) as { [key: string]: number | string | null }[];

    // #region no duplicate ids
    const ids = file.map(item => item.id).filter(id => typeof id === "number") as number[];
    const seen = new Set<number>();
    const duplicates: number[] = [];
    for (const id of ids) {
        if (seen.has(id)) duplicates.push(id);
        else seen.add(id);
    }

    if (duplicates.length > 0) {
        console.error(red(`${prefix} Duplicate id values found:`), [...new Set(duplicates)].slice(0, 20));
        hasError = true;
    }
    // #endregion

    if (hasError) process.exit(1);

    console.log(green(`${prefix} items.g.json is valid`));
}
