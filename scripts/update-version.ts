#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type JsonObject = Record<string, unknown>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const cacheNumberPath = path.join(__dirname, '..', 'data', 'cache-number.json');

function parseJsonFile<T extends JsonObject = JsonObject>(filePath: string): T {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    try {
        return JSON.parse(raw) as T;
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const snippet = raw.slice(0, 1024).replace(/\n/g, '\\n');
        throw new Error(`Invalid JSON in ${filePath}: ${msg}. File starts with: "${snippet}"`);
    }
}

function ensureNonEmptyString(value: unknown, name: string): string {
    if (typeof value === 'string' && value.trim() !== '') return value;
    if (typeof value === 'number') return String(value);
    throw new Error(`${name} is missing or not a string`);
}

async function main(): Promise<void> {
    try {
        const packageJson = parseJsonFile<{ version?: string }>(packageJsonPath);
        const cacheData = parseJsonFile<{ cacheID?: number | string }>(cacheNumberPath);
        const cacheNumberRaw = cacheData.cacheID;
        const cacheNumber = ensureNonEmptyString(cacheNumberRaw, 'cacheID');

        const currentVersion = ensureNonEmptyString(packageJson.version, 'package.json version');
        const versionParts = currentVersion.split('.');
        const codeVersion = versionParts[1] ?? '0';
        const newVersion = `1.${codeVersion}.${cacheNumber}`;

        // Update package.json on disk
        const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
        const packageObj = JSON.parse(packageJsonRaw) as JsonObject;
        (packageObj as any).version = newVersion;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageObj, null, 2) + '\n', 'utf8');

        console.log(`Version updated to ${newVersion}`);
        console.log(`Code version: ${codeVersion}, Cache ID: ${cacheNumber}`);
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('Error updating version:', msg);
        process.exit(1);
    }
}

// Run when executed directly
void main();
