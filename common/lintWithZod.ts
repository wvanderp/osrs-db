import fs from "fs";
import path from "path";
import { z } from "zod";
import { cyan, green, red } from "./colors";

/**
 * Lint a JSON file against a Zod schema and print all validation errors.
 * Does not throw on failure, but instead prints all the errors
 * @param dataPath - Path to the JSON data file
 * @param schema - Zod schema to validate against
 * @param opts - Optional parameters
 * @param opts.prefix - Prefix for log messages (default: "[SchemaLint]")
 * @returns true if valid, false if invalid
 */
export function lintWithZod<T extends z.ZodType>(
    dataPath: string,
    schema: T,
    opts?: { prefix?: string }
): boolean {
    const prefix = opts?.prefix ? cyan(opts.prefix) : cyan("[SchemaLint]");
    const absData = path.resolve(dataPath);

    console.log(`${prefix} Validating ${absData}...`);

    if (!fs.existsSync(absData)) {
        console.error(`${prefix} `, red(`Data file not found: ${absData}`));
        return false;
    }

    const dataRaw = fs.readFileSync(absData, "utf8");

    let data: unknown;
    try {
        data = JSON.parse(dataRaw);
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`${prefix} `, red(`Failed to parse data JSON: ${msg}`));
        return false;
    }

    const result = schema.safeParse(data);

    if (!result.success) {
        const issues = result.error.issues;
        console.error(`${prefix}`, red(`Validation failed with ${issues.length} error(s):`));
        for (const err of issues) {
            const loc = err.path.length > 0 ? err.path.join(".") : "/";
            const msg = err.message ?? "Validation error";
            console.error(`${prefix} `, red(`${loc}: ${msg}`));
        }
        console.error(`${prefix} `, red(`Validation failed`));
        return false;
    }

    console.log(`${prefix} `, green(`OK: ${absData}`));
    return true;
}

export default lintWithZod;
