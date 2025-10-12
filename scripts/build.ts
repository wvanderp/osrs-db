#!/usr/bin/env tsx

/**
 * Build script for osrs-db npm package
 * 
 * This script creates a clean build folder ready for publishing to npm:
 * 1. Creates/cleans the build folder
 * 2. Copies the data folder
 * 3. Generates TypeScript type files
 * 4. Copies required npm files (README, LICENSE, package.json, package-lock.json)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { green, cyan, red, yellow } from '../common/colors.js';

const BUILD_DIR = './build';
const FILES_TO_COPY = [
    'README.md',
    'package.json',
    'package-lock.json',
];

// LICENSE might not exist yet, so we'll check for it
const OPTIONAL_FILES = ['LICENSE', 'LICENCE'];

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
 * Remove directory recursively
 */
async function removeDir(dirPath: string): Promise<void> {
    try {
        await fs.rm(dirPath, { recursive: true, force: true });
    } catch (error) {
        // Ignore errors if directory doesn't exist
    }
}

/**
 * Copy directory recursively
 */
async function copyDir(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

/**
 * Copy a single file
 */
async function copyFile(src: string, dest: string): Promise<void> {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
}

/**
 * Main build function
 */
async function build() {
    const repoRoot = process.cwd();
    const buildPath = path.join(repoRoot, BUILD_DIR);

    console.log(green('🏗️  [build] Starting build process...'));
    console.log('');

    // Step 1: Create/clean build folder
    console.log(cyan('📁 [build] Creating build folder...'));
    await removeDir(buildPath);
    await fs.mkdir(buildPath, { recursive: true });
    console.log(green('   ✅ Build folder created'));
    console.log('');

    // Step 2: Copy data folder
    console.log(cyan('📦 [build] Copying data folder...'));
    const dataSrc = path.join(repoRoot, 'data');
    const dataDest = path.join(buildPath, 'data');
    await copyDir(dataSrc, dataDest);
    console.log(green('   ✅ Data folder copied'));
    console.log('');

    // Step 2.5: Copy tools folder (needed for schema resolution during type generation)
    console.log(cyan('🔧 [build] Copying tools folder for schema resolution...'));
    const toolsSrc = path.join(repoRoot, 'tools');
    const toolsDest = path.join(buildPath, 'tools');
    await copyDir(toolsSrc, toolsDest);
    console.log(green('   ✅ Tools folder copied'));
    console.log('');

    // Step 2.6: Copy types folder (contains ambient type declarations)
    console.log(cyan('📝 [build] Copying types folder...'));
    const typesSrc = path.join(repoRoot, 'types');
    const typesDest = path.join(buildPath, 'types');
    await copyDir(typesSrc, typesDest);
    console.log(green('   ✅ Types folder copied'));
    console.log('');

    // Step 3: Generate TypeScript types
    console.log(cyan('🔧 [build] Generating TypeScript types...'));
    const originalCwd = process.cwd();
    try {
        // Change to build directory to generate types there
        process.chdir(buildPath);

        // Run generate-types.ts from the build directory
        const generateTypesScript = path.join(repoRoot, 'scripts', 'generate-types.ts');
        execSync(`npx tsx "${generateTypesScript}"`, {
            stdio: 'inherit',
            cwd: buildPath,
        });

        console.log(green('   ✅ TypeScript types generated'));
    } finally {
        // Always restore original directory
        process.chdir(originalCwd);
    }
    console.log('');

    // Step 4: Copy required npm files
    console.log(cyan('📄 [build] Copying npm files...'));

    for (const file of FILES_TO_COPY) {
        const src = path.join(repoRoot, file);
        const dest = path.join(buildPath, file);

        if (await fileExists(src)) {
            await copyFile(src, dest);
            console.log(green(`   ✅ Copied ${file}`));
        } else {
            throw new Error(`Required file not found: ${file}`);
        }
    }

    // Copy optional LICENSE file
    let licenseCopied = false;
    for (const licenseFile of OPTIONAL_FILES) {
        const src = path.join(repoRoot, licenseFile);
        if (await fileExists(src)) {
            const dest = path.join(buildPath, licenseFile);
            await copyFile(src, dest);
            console.log(green(`   ✅ Copied ${licenseFile}`));
            licenseCopied = true;
            break;
        }
    }

    if (!licenseCopied) {
        console.log(yellow(`   ⚠️  No LICENSE file found (checked: ${OPTIONAL_FILES.join(', ')})`));
    }

    console.log('');
    console.log(green('✨ [build] Build complete!'));
    console.log(cyan(`   📦 Build output: ${BUILD_DIR}/`));
}

/**
 * Run the build script
 */
build().catch((error) => {
    console.error(red('❌ [build] Build failed:'));
    console.error(red(`   ${error instanceof Error ? error.message : String(error)}`));
    if (error instanceof Error && error.stack) {
        console.error(red(error.stack));
    }
    process.exit(1);
});
