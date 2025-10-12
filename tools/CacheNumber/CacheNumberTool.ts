import Tool from "../../collect/Tool";
import { cyan, green, red } from "../../common/colors";
import fs from "fs";
import path from "path";
import lintWithSchema from "../../common/lintWithSchema";
import { dataPath } from "../../common/paths";
import { getCacheID } from "../../common/getNewestCache";

const prefix = cyan("[CacheNumber]");

export const CacheNumberTool: Tool = {
    name: "CacheNumber",
    description: "Saves the current cache number to data/cache-number.json",
    version: "1.0.0",
    needs: [],
    async run(): Promise<void> {

        const cacheID = await getCacheID();

        const outDir = dataPath;
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const outPath = path.join(outDir, "cache-number.json");

        const result = { cacheID };
        fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
        console.log(green(`${prefix} Wrote ${outPath}`));
    },
    async lint(): Promise<void> {
        console.log(prefix, "Linting cache-number.json");
        const filePath = path.join(dataPath, "cache-number.json");
        const schemaPath = path.join(__dirname, "cache-number.schema.json");

        console.log(`${prefix} Linting cache-number.json`);

        if (!fs.existsSync(filePath)) {
            console.error(red(`${prefix} Data file not found: ${filePath}`));
            process.exit(1);
        }

        lintWithSchema(filePath, schemaPath, { prefix });

        console.log(prefix, green(`cache-number.json validated`));
    },
};

export default CacheNumberTool;
