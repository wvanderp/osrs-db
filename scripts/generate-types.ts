#!/usr/bin/env tsx

/**
 * 🎯 Generate TypeScript types from JSON schemas
 * 
 * This script converts all JSON schema files into TypeScript type definitions.
 * The generated types are placed alongside the schema files with a .d.ts extension.
 */

import { compile } from 'json-schema-to-typescript';
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import { yellow, green, red } from '../common/colors.js';

async function generateTypes() {
    console.log(green('🔧 [generate-types] Starting type generation...'));

    // Find all schema files
    const schemaFiles = await glob('tools/**/*.schema.json', {
        cwd: process.cwd(),
        absolute: true
    });

    console.log(yellow(`📋 [generate-types] Found ${schemaFiles.length} schema files`));

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const schemaPath of schemaFiles) {
        try {
            const schemaContent = await readFile(schemaPath, 'utf-8');
            const schema = JSON.parse(schemaContent);

            // Skip schemas with unresolvable $refs for now
            if (JSON.stringify(schema).includes('./parts/')) {
                const fileName = path.basename(schemaPath);
                console.log(yellow(`⚠️  [generate-types] Skipping ${fileName} (contains unresolvable $refs)`));
                skippedCount++;
                continue;
            }

            // Generate TypeScript types
            const ts = await compile(schema, schema.title || 'Schema', {
                bannerComment: '/* This file was automatically generated. Do not modify it directly. */\n',
                style: {
                    bracketSpacing: true,
                    printWidth: 120,
                    semi: true,
                    singleQuote: true,
                    tabWidth: 2,
                    trailingComma: 'es5',
                },
                strictIndexSignatures: true,
                unknownAny: false,
            });

            // Write to .d.ts file next to the schema
            const outputPath = schemaPath.replace('.schema.json', '.schema.d.ts');
            await writeFile(outputPath, ts, 'utf-8');

            const fileName = path.basename(schemaPath);
            console.log(green(`✅ [generate-types] Generated types for ${fileName}`));
            successCount++;
        } catch (error) {
            const fileName = path.basename(schemaPath);
            console.error(red(`❌ [generate-types] Failed to generate types for ${fileName}:`));
            console.error(red(`   ${error instanceof Error ? error.message : String(error)}`));
            errorCount++;
        }
    }

    console.log('');
    console.log(green(`✨ [generate-types] Type generation complete!`));
    console.log(green(`   ✅ Success: ${successCount}`));
    if (skippedCount > 0) {
        console.log(yellow(`   ⚠️  Skipped: ${skippedCount}`));
    }
    if (errorCount > 0) {
        console.log(red(`   ❌ Errors: ${errorCount}`));
        process.exit(1);
    }
}

generateTypes().catch((error) => {
    console.error(red('❌ [generate-types] Fatal error:'));
    console.error(red(`   ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
});
