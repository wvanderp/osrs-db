import fs from 'fs';
import path from 'path';
import { cyan, red, yellow, green } from './colors';

/**
 * Dev linter: checks that each tool in tools/ adheres to the required file layout.
 * Rules (from repo guidelines):
 * - {tool}.Tool.ts
 * - {tool}.md
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

function checkTool(toolDirName: string, toolsRoot: string): ToolCheckResult {
    const toolPath = path.join(toolsRoot, toolDirName);
    const errors: string[] = [];
    const warnings: string[] = [];

    const entries = fs.readdirSync(toolPath, { withFileTypes: true });

    // Definitions drive the checks. This makes the linter easy to extend.
    type Def =
        | { kind: 'file'; name: string; relPath: string; message?: string }
        | { kind: 'atLeastOneFileMatch'; name: string; pattern: RegExp; message?: string };

    const requiredDefs: Def[] = [
        { kind: 'file', name: 'toolTs', relPath: `${toolDirName}Tool.ts` },
        { kind: 'file', name: 'docMd', relPath: `${toolDirName}.md`, message: '(tool description)' },
        { kind: 'file', name: 'changelogMd', relPath: `${toolDirName}.changelog.md`, message: '(tool changelog)' },
        // At least one schema file required
        { kind: 'atLeastOneFileMatch', name: 'schema', pattern: /\.schema\.json$/i, message: 'No schema files found (*.schema.json)' },
    ];

    for (const def of requiredDefs) {
        if (def.kind === 'file') {
            const abs = path.join(toolPath, def.relPath);
            if (!fileExists(abs)) {
                const msg = def.message ? ` ${def.message}` : '';
                errors.push(`Missing file: ${path.relative(process.cwd(), abs)}${msg}`);
            }
        } else if (def.kind === 'atLeastOneFileMatch') {
            const matches = entries
                .filter(e => e.isFile())
                .map(e => e.name)
                .filter(name => def.pattern.test(name));
            if (matches.length === 0) {
                errors.push(`${def.message} in ${path.relative(process.cwd(), toolPath)}`);
            }
        }
    }

    // Friendly warnings: Look for README.md if {tool}.md missing
    const expectedDoc = path.join(toolPath, `${toolDirName}.md`);
    if (!fileExists(expectedDoc)) {
        const readme = path.join(toolPath, 'README.md');
        if (fileExists(readme)) {
            warnings.push(cyan(`[dev-linter:${toolDirName}]`) + yellow(` Found README.md; consider renaming to ${toolDirName}.md per conventions.`));
        }
    }

    return { toolName: toolDirName, toolPath, errors, warnings };
}

function run() {
    const toolsRoot = path.join(__dirname, '..', 'tools');
    if (!isDir(toolsRoot)) {
        console.error(cyan('[dev-linter]') + red(' tools/ directory not found.'));
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
        const prefix = cyan(`[dev-linter:${r.toolName}]`);
        if (r.errors.length === 0) {
            console.log(`${prefix} ${green('OK')}`);
        } else {
            failures += r.errors.length;
            console.error(`${prefix} ${red(`${r.errors.length} error(s):`)}`);
            for (const e of r.errors) console.error(red(`  - ${e}`));
        }
        for (const w of r.warnings) {
            console.warn(`${prefix} ${yellow('WARN:')} ${yellow(w)}`);
        }
    }

    if (failures > 0) {
        console.error(cyan(`[dev-linter]`) + red(`Failed with ${failures} error(s) across ${results.length} tool(s).`));
        process.exit(1);
    }

    console.log(cyan(`[dev-linter]`) + green(` All ${results.length} tool(s) passed.`));
}

run();
