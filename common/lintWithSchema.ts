import fs from "fs";
import path from "path";
import Ajv, { ErrorObject } from "ajv";
import { cyan, green, red } from "./colors";

/**
 * Lint a JSON file against a JSON Schema and print all validation errors.
 * Does not throw on failure, but instead prints all the errors
 * @param dataPath - Path to the JSON data file
 * @param schemaPath - Path to the JSON Schema file
 * @param opts - Optional parameters
 * @param opts.prefix - Prefix for log messages (default: "[SchemaLint]")
 */
export function lintWithSchema(dataPath: string, schemaPath: string, opts?: { prefix?: string }) {
    const prefix = opts?.prefix ? cyan(opts.prefix) : cyan("[SchemaLint]");
    const absData = path.resolve(dataPath);
    const absSchema = path.resolve(schemaPath);

    console.log(`${prefix} Validating ${absData} against ${absSchema}...`);

    if (!fs.existsSync(absData)) {
        console.error(`${prefix} `, red(`Data file not found: ${absData}`));
        return;
    }
    if (!fs.existsSync(absSchema)) {
        console.error(`${prefix} `, red(`Schema file not found: ${absSchema}`));
        return;
    }

    const dataRaw = fs.readFileSync(absData, "utf8");
    const schemaRaw = fs.readFileSync(absSchema, "utf8");

    let data: unknown;
    try {
        data = JSON.parse(dataRaw);
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`${prefix} `, red(`Failed to parse data JSON: ${msg}`));
        return;
    }

    let schema: unknown;
    try {
        schema = JSON.parse(schemaRaw);
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`${prefix} `, red(`Failed to parse schema JSON: ${msg}`));
        return;
    }

    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema as any);
    const valid = validate(data);
    if (!valid) {
        const errors: ErrorObject[] = validate.errors ?? [];
        console.error(`${prefix}`, red(`Validation failed with ${errors.length} error(s):`));
        for (const err of errors) {
            const loc = err.instancePath || "/";
            const msg = err.message ?? "Validation error";
            console.error(`${prefix} `, red(`${loc} ${msg}`));
            if (err.params) {
                try {
                    console.error(`${prefix}   `, red(`params: ${JSON.stringify(err.params)}`));
                } catch { }
            }
        }
        console.error(`${prefix} `, red(`Validation failed`));
        return;
    }

    console.log(`${prefix} `, green(`OK: ${absData}`));
}

export default lintWithSchema;
