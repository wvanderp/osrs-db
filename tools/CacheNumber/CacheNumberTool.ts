import Tool from "../../collect/Tool";
import { cyan, green } from "../../common/colors";
import fs from "fs";
import path from "path";
import lintCacheNumber from './cache-number.linter';

export const CacheNumberTool: Tool = {
    name: "CacheNumber",
    description: "Saves the current cache number to data/cache-number.json",
    version: "1.0.0",
    needs: [],
    async run(): Promise<void> {
        const prefix = cyan("[CacheNumber]");
        console.log(`${prefix} Writing cache number file`);

        // Try to read keys.json produced by common/getNewestCache.ts or fallback to keys in repo root
        const possiblePaths = [
            path.join(process.cwd(), "keys.json"),
            path.join(process.cwd(), "cache", "keys.json"),
        ];

        let keys: any = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                try {
                    keys = JSON.parse(fs.readFileSync(p, "utf8"));
                    break;
                } catch (e) {
                    // ignore
                }
            }
        }

        const outDir = path.join(__dirname, "data");
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        const outPath = path.join(outDir, "cache-number.json");

        const result = {
            cacheNumber: keys && typeof keys.id === "number" ? keys.id : null,
            source: keys ? "keys.json" : null,
        };

        fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
        console.log(green(`${prefix} Wrote ${outPath}`));
    },
    async lint(): Promise<void> {
        console.log(cyan("[CacheNumber]"), "Linting cache-number.json");
        lintCacheNumber();
    },
};

export default CacheNumberTool;
