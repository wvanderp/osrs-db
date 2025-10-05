#!/usr/bin/env node

/**
 * Updates the package.json version based on the cache number
 * Version format: 1.X.cacheNumber
 * where X is the code version and cacheNumber comes from data/cache-number.json
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const cacheNumberPath = path.join(__dirname, '..', 'data', 'cache-number.json');

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Read cache number
  const cacheData = JSON.parse(fs.readFileSync(cacheNumberPath, 'utf8'));
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
  console.error('Error updating version:', error.message);
  process.exit(1);
}
