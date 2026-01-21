import fs from "fs";
import path from "path";
import formatJson from "./formatJson";

async function concatenateJsonFiles(name: string) {
  const dataDir = path.join(__dirname, "../data");
  const targetDir = path.join(dataDir, `./${name}`);
  const outputFilePath = path.join(dataDir, `${name}.g.json`);

  const files = fs
    .readdirSync(targetDir)
    .filter((file) => file.endsWith(".json") && file !== `${name}.json`);
  const allItems: unknown[] = [];

  for (const file of files) {
    const filePath = path.join(targetDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent) as Record<string, string>;
    allItems.push(jsonData);
  }

  // @ts-expect-error
  allItems.sort((a, b) => a.id - b.id);

  fs.writeFileSync(outputFilePath, formatJson(allItems));
}

const name = process.argv[2];
if (!name) {
  console.error("Please provide a name as an argument.");
  process.exit(1);
}

concatenateJsonFiles(name)
  .then(() => {
    console.log(
      `All JSON files in ${name} have been concatenated into ${name}.json`,
    );
  })
  .catch((err) => {
    console.error("Error concatenating JSON files:", err);
  });
