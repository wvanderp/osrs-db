import fs from "fs";
import path from "path";
import Ajv, { ErrorObject } from "ajv";

/**
 * Lint a JSON file against a JSON Schema and print all validation errors.
 * Throws an Error on failure. Prints using the provided prefix.
 */
export function lintWithSchema(dataPath: string, schemaPath: string, opts?: { prefix?: string }) {
    const prefix = opts?.prefix ?? "[SchemaLint]";
    const absData = path.resolve(dataPath);
    const absSchema = path.resolve(schemaPath);

    console.log(`${prefix} Validating ${absData} against ${absSchema}...`);

    if (!fs.existsSync(absData)) {
        throw new Error(`${prefix} Data file not found: ${absData}`);
    }
    if (!fs.existsSync(absSchema)) {
        throw new Error(`${prefix} Schema file not found: ${absSchema}`);
    }

    const dataRaw = fs.readFileSync(absData, "utf8");
    const schemaRaw = fs.readFileSync(absSchema, "utf8");

    let data: unknown;
    try {
        data = JSON.parse(dataRaw);
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`${prefix} Failed to parse data JSON: ${msg}`);
    }

    let schema: unknown;
    try {
        schema = JSON.parse(schemaRaw);
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`${prefix} Failed to parse schema JSON: ${msg}`);
    }

    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema as any);
    const valid = validate(data);
    if (!valid) {
        const errors: ErrorObject[] = validate.errors ?? [];
        console.error(`${prefix} Validation failed with ${errors.length} error(s):`);
        for (const err of errors) {
            const loc = err.instancePath || "/";
            const msg = err.message ?? "Validation error";
            console.error(`${prefix} ${loc} ${msg}`);
            if (err.params) {
                try {
                    console.error(`${prefix}  params: ${JSON.stringify(err.params)}`);
                } catch { }
            }
        }
        throw new Error(`${prefix} Validation failed`);
    }

    console.log(`${prefix} OK: ${absData}`);
}

export default lintWithSchema;
