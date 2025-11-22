import fs from "fs";
import path from "path";
import Ajv, { ErrorObject } from "ajv";
import { cyan, green, red, yellow } from "./colors";

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

    // Add any local schema files referenced by this schema (relative $ref like '../Diaries/diariesList.schema.json')
    const refs = new Set<string>();
    function collectRefs(obj: unknown) {
        if (obj && typeof obj === 'object') {
            for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
                if (k === '$ref' && typeof v === 'string' && v.endsWith('.schema.json')) {
                    refs.add(v);
                }
                // recurse into nested objects/arrays
                collectRefs(v);
            }
        } else if (Array.isArray(obj)) {
            for (const item of obj as unknown[]) collectRefs(item);
        }
    }
    collectRefs(schema);

    // Resolve and add referenced schemas (recursively), ensuring nested $refs are also registered
    const schemaDir = path.dirname(absSchema);
    const queue = Array.from(refs);
    const processed = new Set<string>();
    while (queue.length > 0) {
        const ref = queue.shift() as string;
        if (processed.has(ref)) continue;
        processed.add(ref);

        const refPath = path.resolve(schemaDir, ref);
        if (!fs.existsSync(refPath)) {
            // Try resolving relative to repository root if not found relative to the current schema directory
            const altRefPath = path.resolve(process.cwd(), 'tools', ref);
            if (fs.existsSync(altRefPath)) {
                try {
                    const refSchemaRaw = fs.readFileSync(altRefPath, 'utf8');
                    const refSchema = JSON.parse(refSchemaRaw);
                    ajv.addSchema(refSchema, ref);
                    // Collect any refs in the newly loaded schema
                    collectRefs(refSchema);
                    for (const newRef of refs) if (!processed.has(newRef)) queue.push(newRef);
                } catch (e) {
                    console.error(`${prefix} `, red(`Failed to load referenced schema ${ref}: ${e instanceof Error ? e.message : String(e)}`));
                }
            } else {
                console.warn(`${prefix} `, yellow(`Referenced schema not found: ${ref}`));
            }
            continue;
        }

        try {
            const refSchemaRaw = fs.readFileSync(refPath, 'utf8');
            const refSchema = JSON.parse(refSchemaRaw);
            ajv.addSchema(refSchema, ref);
            // Collect refs inside the schema and queue them
            collectRefs(refSchema);
            for (const newRef of refs) if (!processed.has(newRef)) queue.push(newRef);
        } catch (e) {
            console.error(`${prefix} `, red(`Failed to load referenced schema ${ref}: ${e instanceof Error ? e.message : String(e)}`));
        }
    }

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
