import Ajv from "ajv";
import fs from "fs";
import path from "path";

// load the file
const filePath = path.join(__dirname, "../../data/items.g.json");
const file = JSON.parse(fs.readFileSync(filePath, "utf8")) as { [key: string]: number | string | null }[];

const schemaPath = path.join(__dirname, "../../schemas/items.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

export default function items() {
    console.log("Linting items.g.json");
    // #region schema
    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    const valid = validate(file);

    if (!valid) {
        console.log(validate.errors);
    }
    // #endregion

    console.log("items.g.json is valid");
}
