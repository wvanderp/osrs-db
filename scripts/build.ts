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
 * Copy only schema files from a directory recursively
 */
async function copySchemaFiles(src: string, dest: string): Promise<void> {
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copySchemaFiles(srcPath, destPath);
        } else if (entry.name.endsWith('.schema.json')) {
            await fs.mkdir(path.dirname(destPath), { recursive: true });
            await fs.copyFile(srcPath, destPath);
        }
    }
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

    // Step 3: Generate TypeScript wrapper files into build directory
    // We run the generator from the repository root so it can locate schemas in tools/.
    console.log(cyan('� [build] Generating TypeScript wrappers into build/...'));
    try {
        const generateTypesScript = path.join(repoRoot, 'scripts', 'generate-types.ts');
        // Run generator from repo root so it can resolve tools/ and other schema locations
        execSync(`npx tsx "${generateTypesScript}"`, {
            stdio: 'inherit',
            cwd: repoRoot,
        });

        // After generation, copy each generated .g.ts file inside build/ to a facade .ts filename
        const buildFilesPostGen = await fs.readdir(buildPath);
        for (const file of buildFilesPostGen) {
            if (file.endsWith('.g.ts') && !file.includes('test') && file !== 'index.ts') {
                const src = path.join(buildPath, file);
                const destFilename = file.replace('.g.ts', '.ts');
                const dest = path.join(buildPath, destFilename);
                await copyFile(src, dest);
                console.log(green(`   ✅ Copied generated ${file} -> ${destFilename}`));
            }
        }

        console.log(green('   ✅ TypeScript wrappers generated'));
    } catch (error) {
        throw new Error(`Type generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    console.log('');

    // Step 4: Compile TypeScript facade files in build directory
    console.log(cyan('📦 [build] Compiling TypeScript facade files...'));
    try {
        // Copy tsconfig for compilation
        const tsconfigBuildSrc = path.join(repoRoot, 'tsconfig.build.json');
        const tsconfigBuildDest = path.join(buildPath, 'tsconfig.build.json');
        await copyFile(tsconfigBuildSrc, tsconfigBuildDest);

        // Compile in build directory with increased memory
        const tscPath = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');
        execSync(`node --max-old-space-size=8192 "${tscPath}" -p tsconfig.build.json`, {
            stdio: 'inherit',
            cwd: buildPath,
        });

        // Rename .js files to .mjs in build directory
        const compiledFiles = await fs.readdir(buildPath);
        for (const file of compiledFiles) {
            if (file.endsWith('.js') && !file.endsWith('.mjs')) {
                const oldPath = path.join(buildPath, file);
                const newPath = path.join(buildPath, file.replace(/\.js$/, '.mjs'));
                await fs.rename(oldPath, newPath);
            }
        }

        // Remove any generated ".g.mjs" files and accompanying generated d.ts files
        // We want the build output to use clean filenames (e.g. skills.mjs) only.
        const postRenameFiles = await fs.readdir(buildPath);
        for (const file of postRenameFiles) {
            try {
                if (file.endsWith('.g.mjs')) {
                    await fs.unlink(path.join(buildPath, file));
                    console.log(green(`   ✅ Removed generated ${file}`));
                }
                if (file.endsWith('.g.d.ts') || file.endsWith('.g.d.ts.map')) {
                    await fs.unlink(path.join(buildPath, file));
                    console.log(green(`   ✅ Removed generated ${file}`));
                }
            } catch (err) {
                // ignore if file already removed
            }
        }

        // Clean up tsconfig.build.json from build directory
        await fs.unlink(tsconfigBuildDest);

        console.log(green('   ✅ TypeScript facade files compiled'));
    } catch (error) {
        throw new Error(`TypeScript compilation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    console.log('');

    // Step 5: Clean up .g.ts files generated by generate-types (they are not shipped)
    console.log(cyan('🧹 [build] Cleaning up generated .g.ts files...'));
    const buildFiles = await fs.readdir(buildPath);
    for (const file of buildFiles) {
        if (file.endsWith('.g.ts')) {
            const filePath = path.join(buildPath, file);
            await fs.unlink(filePath);
            console.log(green(`   ✅ Removed ${file}`));
        }
    }
    console.log('');

    // Step 6: Copy required npm files
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

    // Step 7: Auto-generate exports in package.json
    console.log(cyan('⚙️  [build] Auto-generating exports in package.json...'));
    const packageJsonPath = path.join(buildPath, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    // Find all .mjs files in the build root (excluding subdirectories)
    const mjsFiles = (await fs.readdir(buildPath))
        .filter(file => file.endsWith('.mjs'))
        .sort();

    // Build exports object
    const exports: Record<string, any> = {
        './data/*': './data/*'
    };

    for (const mjsFile of mjsFiles) {
        const baseName = mjsFile.replace('.mjs', '');
        const exportName = `./${baseName}`;

        exports[exportName] = {
            types: `./${baseName}.d.ts`,
            import: `./${mjsFile}`
        };

        console.log(green(`   ✅ Added export: ${exportName}`));
    }

    // Update package.json with generated exports
    packageJson.exports = exports;
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
    console.log(green(`   ✅ Generated ${mjsFiles.length} exports`));

    console.log('');

    // Step 8: Generate JSON schemas
    console.log(cyan('🔧 [build] Generating JSON schemas...'));
    try {
        const generateSchemasScript = path.join(repoRoot, 'scripts', 'generate-schemas.ts');
        execSync(`npx tsx "${generateSchemasScript}"`, {
            stdio: 'inherit',
            cwd: repoRoot,
        });

        // Copy schemas to build directory
        const schemasSrc = path.join(repoRoot, 'schemas');
        const schemasDest = path.join(buildPath, 'schemas');
        await copyDir(schemasSrc, schemasDest);
        console.log(green('   ✅ JSON schemas generated and copied to build/schemas'));
    } catch (error) {
        throw new Error(`JSON schema generation failed: ${error instanceof Error ? error.message : String(error)}`);
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
