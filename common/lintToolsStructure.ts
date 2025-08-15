import fs from 'fs';
import path from 'path';

/**
 * Dev linter: checks that each tool in tools/ adheres to the required file layout.
 * Rules (from repo guidelines):
 * - {tool}.Tool.ts
 * - {tool}.md
 * - {tool}.linter.ts
 * - One or more *.schema.json files (name can vary)
 * - {tool}.changelog.md
 * - data/ directory (for intermediate data; generated data goes to root /data)
 *
 * Fails with non-zero exit code if any tool misses required artifacts.
 */

type ToolCheckResult = {
    toolName: string;
    toolPath: string;
    errors: string[];
    warnings: string[];
};

function isDir(p: string) {
    try {
        return fs.statSync(p).isDirectory();
    } catch {
        return false;
    }
}

function fileExists(p: string) {
    try {
        return fs.existsSync(p) && fs.statSync(p).isFile();
    } catch {
        return false;
    }
}

function dirExists(p: string) {
    try {
        return fs.existsSync(p) && fs.statSync(p).isDirectory();
    } catch {
        return false;
    }
}

function checkTool(toolDirName: string, toolsRoot: string): ToolCheckResult {
    const toolPath = path.join(toolsRoot, toolDirName);
    const errors: string[] = [];
    const warnings: string[] = [];

    const requiredFiles = {
        toolTs: path.join(toolPath, `${toolDirName}Tool.ts`),
        docMd: path.join(toolPath, `${toolDirName}.md`),
        linterTs: path.join(toolPath, `${toolDirName}.linter.ts`),
        changelogMd: path.join(toolPath, `${toolDirName}.changelog.md`),
    } as const;

    // Base checks
    if (!fileExists(requiredFiles.toolTs)) {
        errors.push(`Missing file: ${path.relative(process.cwd(), requiredFiles.toolTs)}`);
    }
    if (!fileExists(requiredFiles.docMd)) {
        errors.push(`Missing file: ${path.relative(process.cwd(), requiredFiles.docMd)} (tool description)`);
    }
    if (!fileExists(requiredFiles.linterTs)) {
        errors.push(`Missing file: ${path.relative(process.cwd(), requiredFiles.linterTs)} (tool linter)`);
    }
    if (!fileExists(requiredFiles.changelogMd)) {
        errors.push(`Missing file: ${path.relative(process.cwd(), requiredFiles.changelogMd)} (tool changelog)`);
    }

    // Schema check (at least one *.schema.json)
    const entries = fs.readdirSync(toolPath, { withFileTypes: true });
    const schemaFiles = entries
        .filter(e => e.isFile())
        .map(e => e.name)
        .filter(name => /\.schema\.json$/i.test(name));
    if (schemaFiles.length === 0) {
        errors.push(`No schema files found (*.schema.json) in ${path.relative(process.cwd(), toolPath)}`);
    }

    // Friendly warnings: Look for README.md if {tool}.md missing
    if (!fileExists(requiredFiles.docMd)) {
        const readme = path.join(toolPath, 'README.md');
        if (fileExists(readme)) {
            warnings.push(`Found README.md; consider renaming to ${toolDirName}.md per conventions.`);
        }
    }

    return { toolName: toolDirName, toolPath, errors, warnings };
}

function run() {
    const toolsRoot = path.join(__dirname, '..', 'tools');
    if (!isDir(toolsRoot)) {
        console.error('[dev-linter] tools/ directory not found.');
        process.exit(1);
    }

    const entries = fs.readdirSync(toolsRoot, { withFileTypes: true });
    const toolDirs = entries.filter(e => e.isDirectory()).map(e => e.name);

    const results: ToolCheckResult[] = [];
    for (const dir of toolDirs) {
        const res = checkTool(dir, toolsRoot);
        results.push(res);
    }

    let failures = 0;
    for (const r of results) {
        const prefix = `[dev-linter:${r.toolName}]`;
        if (r.errors.length === 0) {
            console.log(`${prefix} OK`);
        } else {
            failures += r.errors.length;
            console.error(`${prefix} ${r.errors.length} error(s):`);
            for (const e of r.errors) console.error(`  - ${e}`);
        }
        for (const w of r.warnings) {
            console.warn(`${prefix} WARN: ${w}`);
        }
    }

    if (failures > 0) {
        console.error(`\n[dev-linter] Failed with ${failures} error(s) across ${results.length} tool(s).`);
        process.exit(1);
    }

    console.log(`[dev-linter] All ${results.length} tool(s) passed.`);
}

run();
