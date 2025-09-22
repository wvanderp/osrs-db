import fs from "fs";
import path from "path";
import lintWithSchema from "../../common/lintWithSchema";
import { cyan, green, red } from "../../common/colors";

export default function lintCacheNumber() {
    const prefix = cyan("[CacheNumber]");
    const filePath = path.join(__dirname, "data", "cache-number.json");
    const schemaPath = path.join(__dirname, "cache-number.schema.json");

    console.log(`${prefix} Linting cache-number.json`);

    if (!fs.existsSync(filePath)) {
        console.error(red(`${prefix} Data file not found: ${filePath}`));
        process.exit(1);
    }

    lintWithSchema(filePath, schemaPath, { prefix });

    console.log(green(`${prefix} cache-number.json validated`));
}
