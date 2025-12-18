import fs from "fs";
import path from "path";
import { cyan, red, green, yellow } from "../../common/colors";
import WearRequirementSchema from "./WearRequirements.schema";

/**
 * Validates individual wearRequirements JSON files in data/requirements/ against the schema
 */
export default function lintWearRequirements(): void {
    console.log(`${cyan("[ItemsTool]")} Linting individual wearRequirements files`);

    const requirementsDir = path.join(__dirname, "data", "requirements");

    // Check if requirements directory exists
    if (!fs.existsSync(requirementsDir)) {
        console.log(`${yellow("[ItemsTool]")} No requirements directory found, skipping lint.`);
        return;
    }

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

        const result = WearRequirementSchema.safeParse(data);

        if (!result.success) {
            console.error(`${red("[ItemsTool]")} Validation failed for ${file}:`);
            console.error(result.error.issues);
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
