import Ajv from "ajv";
import fs from "fs";
import path from "path";
import findDupes from './utils/findDupes';

// load the file
const filePath = path.join(__dirname, "../titleToID.json");
const file = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, number | string | null>;

// Record<string, number | string | null>
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

export default function titleToId() {
    console.log("Linting titleToID.json");
    // #region schema
    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    const valid = validate(file);

    if (!valid) {
        console.log(validate.errors);
    }
    // #endregion

    // #region no duplicate values
    const values = Object.values(file);

    const duplicates = findDupes(values.filter(value => value !== null && typeof value !== "string"));

    if (duplicates.length > 0) {
        console.log("Duplicate values found:", duplicates);
    }
    // #endregion

    // #region no null values
    const nullValues = values.filter(value => value === null);

    if (nullValues.length > 0) {
        console.log("Null values found");
    }
    // #endregion

    console.log("titleToID.json is valid");
}
