#!/usr/bin/env tsx

/**
 * Script to format all JSON files in the repository using FracturedJson.
 * This ensures consistent formatting across all JSON files.
 *
 * Usage: npx tsx scripts/format-json.ts [--dry-run]
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { glob } from "glob";
import { green, cyan, yellow, red } from "../common/colors.js";
import { reformatJson } from "../common/formatJson.js";

const INCLUDE_PATTERNS = [
  "data/**/*.json",
  "build/data/**/*.json",
  "schemas/**/*.json",
  "build/schemas/**/*.json",
  "tools/**/data/**/*.json",
];

const EXCLUDE_PATTERNS = [
  "**/node_modules/**",
  "**/package.json",
  "**/package-lock.json",
  "**/tsconfig*.json",
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  if (dryRun) {
    console.log(yellow("🔍 Dry run mode - no files will be modified\n"));
  }

  console.log(green("🔧 [format-json] Starting JSON formatting...\n"));

  const repoRoot = process.cwd();
  let totalFiles = 0;
  let modifiedFiles = 0;
  let errorFiles = 0;

  for (const pattern of INCLUDE_PATTERNS) {
    const files = await glob(pattern, {
      cwd: repoRoot,
      ignore: EXCLUDE_PATTERNS,
      absolute: true,
    });

    for (const filePath of files) {
      totalFiles++;
      const relativePath = path.relative(repoRoot, filePath);

      try {
        const original = await fs.readFile(filePath, "utf-8");
        const formatted = reformatJson(original);

        if (original !== formatted) {
          if (!dryRun) {
            await fs.writeFile(filePath, formatted, "utf-8");
          }
          console.log(cyan(`   📝 ${relativePath}`));
          modifiedFiles++;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(red(`   ❌ ${relativePath}: ${message}`));
        errorFiles++;
      }
    }
  }

  console.log("");
  console.log(green(`✨ [format-json] Complete!`));
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files ${dryRun ? "to be " : ""}modified: ${modifiedFiles}`);
  if (errorFiles > 0) {
    console.log(red(`   Files with errors: ${errorFiles}`));
  }
}

main().catch((err) => {
  console.error(red(`Fatal error: ${err.message}`));
  process.exit(1);
});
