import Ajv from "ajv";
import fs from "fs";
import path from "path";
import { cyan, red, green, yellow } from "../../common/colors";

/**
 * Validates individual wearRequirements JSON files in data/requirements/ against the schema
 */
export default function lintWearRequirements(): void {
    console.log(`${cyan("[ItemsTool]")} Linting individual wearRequirements files`);

    const requirementsDir = path.join(__dirname, "data", "requirements");
    const schemaPath = path.join(__dirname, "wearRequirements.schema.json");
    const questListSchemaPath = path.join(__dirname, "..", "Quests", "QuestList.schema.json");

    // Check if requirements directory exists
    if (!fs.existsSync(requirementsDir)) {
        console.log(`${yellow("[ItemsTool]")} No requirements directory found, skipping lint.`);
        return;
    }

    // Load the schemas
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    const questListSchema = JSON.parse(fs.readFileSync(questListSchemaPath, "utf8"));

    // Setup AJV validator and add the referenced schema
    const ajv = new Ajv();
    // Add the quest list schema so it can be resolved by the $ref
    ajv.addSchema(questListSchema, "Quests/QuestList.schema.json");
    const validate = ajv.compile(schema);

    // Get all JSON files in the requirements directory
    const files = fs.readdirSync(requirementsDir).filter(file => file.endsWith('.json'));

    if (files.length === 0) {
        console.log(`${yellow("[ItemsTool]")} No JSON files found in requirements directory, skipping lint.`);
        return;
    }

    let allValid = true;
    let validCount = 0;

    // Validate each file
    for (const file of files) {
        const filePath = path.join(requirementsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const valid = validate(data);

        if (!valid) {
            console.error(`${red("[ItemsTool]")} Validation failed for ${file}:`);
            console.error(validate.errors);
            allValid = false;
        } else {
            validCount++;
        }
    }

    if (!allValid) {
        throw new Error("Some wearRequirements files failed validation");
    }

    console.log(`${green("[ItemsTool]")} All ${validCount} wearRequirements files validated successfully`);
}
