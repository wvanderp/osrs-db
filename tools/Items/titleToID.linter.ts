
import fs from "fs";
import path from "path";
import { z } from "zod";
import { cyan, red, green, yellow } from "../../common/colors";


function findDuplicates<T>(arr: T[]): T[] {
    const seen = new Set<T>();
    const duplicates = new Set<T>();
    for (const value of arr) {
        if (seen.has(value)) {
            duplicates.add(value);
        } else {
            seen.add(value);
        }
    }
    return Array.from(duplicates);
}

const allowedDuplicateKeysById = new Map<number, Set<string>>([
    [33093, new Set(["Cow slippers", "Cow slippers#1"])],
    [33103, new Set(["Cow bell amulet", "Cowbell amulet", "Cowbell amulet#Empty"])],
]);

function findUnexpectedDuplicateNumericValues(entries: [string, number | string | null][]) {
    const numericKeysByValue = new Map<number, string[]>();

    for (const [key, value] of entries) {
        if (typeof value !== "number") {
            continue;
        }

        const keys = numericKeysByValue.get(value) ?? [];
        keys.push(key);
        numericKeysByValue.set(value, keys);
    }

    return Array.from(numericKeysByValue.entries()).filter(([value, keys]) => {
        if (keys.length < 2) {
            return false;
        }

        const allowedKeys = allowedDuplicateKeysById.get(value);
        return !allowedKeys || keys.some(key => !allowedKeys.has(key));
    });
}



// load the file
const filePath = path.join(__dirname, "./data/titleToID.json");
let file: Record<string, number | string | null> = {};
try {
    file = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (err) {
    console.error(cyan("[titleToID.linter]"), red("Failed to read or parse titleToID.json:"), err);
    process.exit(1);
}


const schema = z.record(z.string(), z.union([z.number(), z.string(), z.null()]));


export default function LintTitleToID() {
    console.log(cyan("[titleToID.linter]"), "Linting titleToID.json");

    // Validate schema
    const result = schema.safeParse(file);
    if (!result.success) {
        console.error(cyan("[titleToID.linter]"), red("Schema validation errors:"));
        for (const err of result.error.issues) {
            const loc = err.path.length > 0 ? err.path.join(".") : "/";
            console.error(cyan("[titleToID.linter]"), red(`${loc}: ${err.message}`));
        }
        process.exitCode = 1;
    }

    // Check for duplicate numeric values (ignoring nulls and strings)
    const duplicateEntries = findUnexpectedDuplicateNumericValues(Object.entries(file));
    if (duplicateEntries.length > 0) {
        console.error(
            cyan("[titleToID.linter]"),
            red("Duplicate numeric values found:"),
            duplicateEntries.map(([value]) => value),
        );
        for (const [value, keys] of duplicateEntries) {
            console.error(cyan("[titleToID.linter]"), red(`  ${value}: ${keys.join(", ")}`));
        }
        process.exitCode = 1;
    }

    // Check for null values
    const nullKeys = Object.keys(file).filter(k => file[k] === null);
    if (nullKeys.length > 0) {
        console.error(cyan("[titleToID.linter]"), yellow("Null values found for keys:"), nullKeys);
        process.exitCode = 1;
    }

    if (process.exitCode === 1) {
        console.error(cyan("[titleToID.linter]"), red("titleToID.json is INVALID"));
    } else {
        console.log(cyan("[titleToID.linter]"), green("titleToID.json is valid"));
    }
}
