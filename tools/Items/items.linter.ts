import fs from "fs";
import path from "path";
import lintWithSchema from "../../common/lintWithSchema";

export default function LintItems() {
    const prefix = "[Items]";
    const filePath = path.join(__dirname, "../../data/items.g.json");
    const schemaPath = path.join(__dirname, "items.schema.json");

    console.log(`${prefix} Linting items.g.json`);

    let hasError = false;
    try {
        lintWithSchema(filePath, schemaPath, { prefix });
    } catch (e) {
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
        console.error(`${prefix} Duplicate id values found:`, [...new Set(duplicates)].slice(0, 20));
        hasError = true;
    }
    // #endregion

    if (hasError) process.exit(1);

    console.log(`${prefix} items.g.json is valid`);
}
