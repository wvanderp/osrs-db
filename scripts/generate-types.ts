#!/usr/bin/env tsx

/**
 * @generated FILE — Zero-config TypeScript wrapper generator for JSON data files
 * 
 * This script discovers JSON data files and their schemas, then generates TypeScript
 * wrapper files that import the JSON and export properly typed data.
 * 
 * Conventions:
 * - DATA_DIR = "./data"
 * - SCHEMA_DIR = "./schemas" and/or co-located schemas (*.schema.json)
 * - OUT_DIR = "." (package root, mirrors data/ structure)
 * 
 * Schema resolution order:
 * 1. data/<rel>.schema.json (same folder, same base name)
 * 2. schemas/<rel>.schema.json (mirrors path under schemas/)
 * 3. Check tools/{ToolName} for matching schema
 * 
 * Generated files:
 * - data/items/item.g.json → ./items/item.g.ts
 * - ESM imports with import assertions
 * - Fully typed exports using json-schema-to-typescript
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { compile } from 'json-schema-to-typescript';
import { glob } from 'glob';
import { yellow, green, red, cyan } from '../common/colors.js';

// Constants
const DATA_DIR = './data';
const SCHEMA_DIR = './schemas';
const OUT_DIR = '.';

interface DataFileEntry {
    jsonRelToRoot: string;      // Relative path from repo root (data/items/item.g.json)
    jsonRelToData: string;      // Relative path from data/ (items/item.g.json)
    jsonAbs: string;            // Absolute path
    schemaAbs?: string;         // Absolute path to schema
    typeName: string;           // PascalCase type name
    outPath: string;            // Absolute output path for .ts file
}

/**
 * Main entry point
 */
async function main() {
    const repoRoot = process.cwd();
    console.log(green('🔧 [generate-types] Starting TypeScript wrapper generation...'));

    // 1) Discover all JSON files in data/ (excluding schemas)
    const jsonFiles = await glob(
        'data/**/*.json',
        {
            cwd: repoRoot,
            ignore: ['**/*.schema.json', '**/*.tmp.json', '**/*.test.json'],
            posix: true
        }
    );
    jsonFiles.sort();

    console.log(cyan(`📋 [generate-types] Found ${jsonFiles.length} data files`));

    // 2) Build entries with schema resolution
    const entries: DataFileEntry[] = [];
    let skippedCount = 0;

    for (const jsonRel of jsonFiles) {
        const jsonAbs = path.join(repoRoot, jsonRel);
        const schemaAbs = await findSchemaFor(jsonAbs, repoRoot);

        if (!schemaAbs) {
            console.log(yellow(`⚠️  [generate-types] No schema found for ${jsonRel}, skipping`));
            skippedCount++;
            continue;
        }

        const jsonRelToData = path.relative('data', jsonRel);
        const typeName = deriveTypeName(jsonRel);
        const outPath = deriveOutputPath(jsonRelToData, repoRoot);

        entries.push({
            jsonRelToRoot: jsonRel,
            jsonRelToData,
            jsonAbs,
            schemaAbs,
            typeName,
            outPath
        });
    }

    console.log(cyan(`✅ [generate-types] Processing ${entries.length} files with schemas`));

    // 3) Generate TypeScript wrapper for each entry
    let generatedCount = 0;
    let unchangedCount = 0;

    for (const entry of entries) {
        const generated = await generateWrapper(entry, repoRoot);
        if (generated) {
            generatedCount++;
        } else {
            unchangedCount++;
        }
    }

    // 4) Print summary
    console.log('');
    console.log(green('✨ [generate-types] Type generation complete!'));
    console.log(cyan(`   � Generated: ${generatedCount}`));
    console.log(cyan(`   ✓  Unchanged: ${unchangedCount}`));
    if (skippedCount > 0) {
        console.log(yellow(`   ⚠️  Skipped (no schema): ${skippedCount}`));
    }
}

/**
 * Find the schema file for a given JSON data file
 * 
 * Resolution order:
 * 1. data/<rel>.schema.json (same folder)
 * 2. schemas/<rel>.schema.json (mirror structure)
 * 3. tools/{ToolName}/{basename}.schema.json (for data/*.g.json files)
 */
async function findSchemaFor(jsonAbs: string, repoRoot: string): Promise<string | undefined> {
    const dir = path.dirname(jsonAbs);
    const basename = path.basename(jsonAbs, '.json');
    const relativePath = path.relative(repoRoot, jsonAbs);

    // Strategy 1: Co-located schema (data/<path>/<basename>.schema.json)
    const colocated = path.join(dir, `${basename}.schema.json`);
    if (await fileExists(colocated)) {
        return colocated;
    }

    // Strategy 2: Mirror structure in schemas/ directory
    if (relativePath.startsWith('data' + path.sep)) {
        const relToData = path.relative('data', relativePath);
        const schemaPath = path.join(repoRoot, SCHEMA_DIR, relToData.replace(/\.json$/, '.schema.json'));
        if (await fileExists(schemaPath)) {
            return schemaPath;
        }
    }

    // Strategy 3: For data/*.g.json files, check tools/{ToolName}/{name}.schema.json
    const parts = relativePath.split(path.sep);
    if (parts[0] === 'data' && parts.length >= 2) {
        const name = basename.replace(/\.g$/, ''); // Remove .g suffix

        const toolsDir = path.join(repoRoot, 'tools');
        try {
            const tools = await fs.readdir(toolsDir);
            for (const tool of tools) {
                const stat = await fs.stat(path.join(toolsDir, tool));
                if (!stat.isDirectory()) continue;

                const toolSchemaPath = path.join(toolsDir, tool, `${name}.schema.json`);
                if (await fileExists(toolSchemaPath)) {
                    return toolSchemaPath;
                }
            }
        } catch {
            // toolsDir doesn't exist or can't read
        }
    }

    return undefined;
}

/**
 * Check if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Derive a PascalCase type name from the JSON file path
 */
function deriveTypeName(jsonRel: string): string {
    const basename = path.basename(jsonRel, '.json');
    return toPascal(basename) || 'Exported';
}

/**
 * Convert a string to PascalCase
 */
function toPascal(s: string): string {
    return s
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map(part => part[0].toUpperCase() + part.slice(1).toLowerCase())
        .join('');
}

/**
 * Derive the output .ts file path from the JSON relative path
 * Mirrors data/ structure in package root
 */
function deriveOutputPath(jsonRelToData: string, repoRoot: string): string {
    const tsRel = jsonRelToData.replace(/\.json$/, '.ts');
    return path.join(repoRoot, OUT_DIR, tsRel);
}

/**
 * Extract the actual type name from generated TypeScript declarations
 * json-schema-to-typescript may use the schema title instead of our provided name
 */
function extractTypeName(typeDeclarations: string, fallbackName: string): string {
    // Look for patterns: "export type TypeName", "export interface TypeName"
    const typeMatch = typeDeclarations.match(/export\s+(?:type|interface)\s+(\w+)/);
    if (typeMatch && typeMatch[1]) {
        return typeMatch[1];
    }
    return fallbackName;
}

/**
 * Generate a TypeScript wrapper file for a data file
 * Returns true if file was written, false if unchanged
 */
async function generateWrapper(entry: DataFileEntry, repoRoot: string): Promise<boolean> {
    // 1) Read and compile schema
    const schemaContent = await fs.readFile(entry.schemaAbs!, 'utf8');
    const schema = JSON.parse(schemaContent);

    // 2) Generate TypeScript types using json-schema-to-typescript
    const typeDeclarations = await compile(schema, entry.typeName, {
        bannerComment: '',
        style: {
            singleQuote: true,
            semi: true,
            trailingComma: 'es5',
        },
        unreachableDefinitions: false,
        unknownAny: false,
    });

    // 3) Extract the actual type name from generated declarations
    // json-schema-to-typescript may use schema title instead of our provided name
    const actualTypeName = extractTypeName(typeDeclarations, entry.typeName);

    // 4) Calculate relative import path from output .ts to JSON file
    const outDir = path.dirname(entry.outPath);
    const jsonAbsNormalized = entry.jsonAbs.replace(/\\/g, '/');
    const outDirNormalized = outDir.replace(/\\/g, '/');

    let relativeImport = path.relative(outDir, entry.jsonAbs).replace(/\\/g, '/');
    if (!relativeImport.startsWith('.')) {
        relativeImport = './' + relativeImport;
    }

    // 5) Build wrapper content
    const lines: string[] = [];
    lines.push('// @generated FILE — do not edit');
    lines.push('// Generated by: scripts/generate-types.ts');
    lines.push('');

    // Import JSON with import assertion
    lines.push(`import raw from '${relativeImport}' assert { type: 'json' };`);
    lines.push('');

    // Add generated types
    lines.push(typeDeclarations.trim());
    lines.push('');

    // Export typed data
    lines.push(`const data = raw as unknown as ${actualTypeName};`);
    lines.push('export default data;');
    lines.push('');
    const content = lines.join('\n');

    // 5) Only write if content changed
    const existing = await fs.readFile(entry.outPath, 'utf8').catch(() => null);
    if (existing === content) {
        return false;
    }

    // 6) Write file
    await fs.mkdir(path.dirname(entry.outPath), { recursive: true });
    await fs.writeFile(entry.outPath, content, 'utf8');

    const relOutput = path.relative(repoRoot, entry.outPath);
    console.log(green(`  ✅ ${relOutput}`));

    return true;
}

/**
 * Run the script
 */
main().catch((error) => {
    console.error(red('❌ [generate-types] Fatal error:'));
    console.error(red(`   ${error instanceof Error ? error.message : String(error)}`));
    if (error instanceof Error && error.stack) {
        console.error(red(error.stack));
    }
    process.exit(1);
});
