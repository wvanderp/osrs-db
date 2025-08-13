
import Ajv from "ajv";
import fs from "fs";
import path from "path";


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



// load the file
const filePath = path.join(__dirname, "./data/titleToID.json");
let file: Record<string, number | string | null> = {};
try {
    file = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (err) {
    console.error("[titleToID.linter] Failed to read or parse titleToID.json:", err);
    process.exit(1);
}


const schema = {
    type: "object",
    additionalProperties: {
        oneOf: [
            { type: "number" },
            { type: "string" },
            { type: "null" }
        ]
    }
};


export default function titleToID_linter() {
    console.log("[titleToID.linter] Linting titleToID.json");

    // Validate schema
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(file);
    if (!valid) {
        console.error("[titleToID.linter] Schema validation errors:", validate.errors);
        process.exitCode = 1;
    }

    // Check for duplicate numeric values (ignoring nulls and strings)
    const values = Object.values(file);
    const numericValues = values.filter(v => typeof v === "number") as number[];
    const duplicates = findDuplicates(numericValues);
    if (duplicates.length > 0) {
        console.error(`[titleToID.linter] Duplicate numeric values found:`, duplicates);
        process.exitCode = 1;
    }

    // Check for null values
    const nullKeys = Object.keys(file).filter(k => file[k] === null);
    if (nullKeys.length > 0) {
        console.error(`[titleToID.linter] Null values found for keys:`, nullKeys);
        process.exitCode = 1;
    }

    if (process.exitCode === 1) {
        console.error("[titleToID.linter] titleToID.json is INVALID");
    } else {
        console.log("[titleToID.linter] titleToID.json is valid");
    }
}
