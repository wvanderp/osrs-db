#!/usr/bin/env node

/**
 * Updates the package.json version based on the cache number
 * Version format: 1.X.cacheNumber
 * where X is the code version and cacheNumber comes from data/cache-number.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const cacheNumberPath = path.join(__dirname, '..', 'data', 'cache-number.json');

try {
  // Helper to read & parse JSON with better error messages
  /**
   * @param {string} filePath
   * @returns {any} The parsed JSON object from the file.
   */
  function parseJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    try {
      return JSON.parse(raw);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Show a snippet of the file to help debugging (first 1KB)
      const snippet = raw.slice(0, 1024).replace(/\n/g, '\\n');
      throw new Error(`Invalid JSON in ${filePath}: ${msg}. File starts with: "${snippet}"`);
    }
  }

  // Read package.json
  const packageJson = parseJsonFile(packageJsonPath);

  // Read cache number
  const cacheData = parseJsonFile(cacheNumberPath);
  const cacheNumber = cacheData.cacheID;
  
  if (!cacheNumber) {
    console.error('Error: cacheID not found in cache-number.json');
    process.exit(1);
  }
  
  // Parse current version to get the code version (middle number)
  const currentVersion = packageJson.version;
  const versionParts = currentVersion.split('.');
  
  // Keep the major version (1) and code version (second number)
  // Update the cache number (third number)
  const codeVersion = versionParts[1] || '0';
  const newVersion = `1.${codeVersion}.${cacheNumber}`;
  
  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  console.log(`Version updated to ${newVersion}`);
  console.log(`Code version: ${codeVersion}, Cache ID: ${cacheNumber}`);
  
} catch (error) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error('Error updating version:', msg);
  process.exit(1);
}
