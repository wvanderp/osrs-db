#!/usr/bin/env tsx

/**
 * @generated FILE — JSON Schema generator from Zod schemas
 * 
 * This script discovers Zod schema files in tools/ and compiles them into
 * JSON schema files in the schemas/ folder at the root of the repository.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { glob } from 'glob';
import z from 'zod';
import { green, cyan, red } from '../common/colors.js';

const SCHEMAS_DIR = './schemas';

async function main() {
    const repoRoot = process.cwd();
    const schemasPath = path.join(repoRoot, SCHEMAS_DIR);

    console.log(green('🔧 [generate-schemas] Starting JSON schema generation...'));

    // 1) Create/clean schemas folder
    try {
        await fs.access(schemasPath);
        await fs.rm(schemasPath, { recursive: true, force: true });
    } catch {
        // Folder doesn't exist, which is fine
    }
    await fs.mkdir(schemasPath, { recursive: true });

    // 2) Discover all Zod schema files
    const schemaFiles = await glob('tools/**/*.schema.ts', {
        cwd: repoRoot,
        posix: true
    });

    console.log(cyan(`📋 [generate-schemas] Found ${schemaFiles.length} Zod schema files`));

    for (const schemaFile of schemaFiles) {
        const schemaAbs = path.join(repoRoot, schemaFile);
        const basename = path.basename(schemaFile, '.schema.ts');

        try {
            // Import the Zod schema module dynamically
            const schemaModule = await import(pathToFileURL(schemaAbs).href);
            const zodSchema = schemaModule.default as z.ZodArray<any>

            if (!zodSchema) {
                console.error(red(`  ❌ No default export found in ${schemaFile}`));
                continue;
            }

            // Convert Zod schema to JSON schema
            const jsonSchema = zodSchema.toJSONSchema();

            // Save to schemas folder
            const outPath = path.join(schemasPath, `${basename}.schema.json`);
            await fs.writeFile(outPath, JSON.stringify(jsonSchema, null, 2));
            console.log(green(`   ✅ Generated ${basename}.schema.json`));
        } catch (error) {
            console.error(red(`  ❌ Failed to process ${schemaFile}: ${error instanceof Error ? error.message : String(error)}`));
        }
    }

    console.log(green('✨ [generate-schemas] JSON schema generation complete!'));
}

main().catch(err => {
    console.error(red(`Fatal error: ${err.message}`));
    process.exit(1);
});
