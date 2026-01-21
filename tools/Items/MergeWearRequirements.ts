import fs from "fs";
import path from "path";
import { cyan } from "../../common/colors";
import formatJson from "../../common/formatJson";

const outputFile = path.join(__dirname, "../../data/itemRequirements.json");

/**
 * Merges all individual wear requirement JSON files from the requirements folder
 * into a single wearRequirements.json file in the data folder.
 */
export default async function mergeWearRequirements(): Promise<void> {
  console.log(`${cyan("[ItemsTool]")} Merging wear requirements...`);

  const requirementsDir = path.join(__dirname, "data", "requirements");

  // Check if requirements directory exists
  if (!fs.existsSync(requirementsDir)) {
    console.log(
      `${cyan("[ItemsTool]")} No requirements directory found, skipping merge.`,
    );
    return;
  }

  // Read all JSON files from the requirements directory
  const files = fs
    .readdirSync(requirementsDir)
    .filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    console.log(
      `${cyan("[ItemsTool]")} No requirement files found, skipping merge.`,
    );
    return;
  }

  const allRequirements = [];

  // Read and parse each file
  for (const file of files) {
    const filePath = path.join(requirementsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const requirement = JSON.parse(content);
    allRequirements.push(requirement);
  }

  // Sort by id for consistency
  allRequirements.sort((a, b) => a.id - b.id);

  // Write merged requirements to output file
  fs.writeFileSync(outputFile, formatJson(allRequirements));

  console.log(
    `${cyan("[ItemsTool]")} Merged ${allRequirements.length} wear requirements into ${path.basename(outputFile)}`,
  );
}
