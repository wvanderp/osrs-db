import { globSync } from "glob";
import path from "path";
import executeShellScript from './executeShellScript';

// Find all *.linter.ts files recursively from the repo root
const repoRoot = path.resolve(__dirname, "..");
const linterFiles = globSync("**/*.linter.ts", {
  cwd: repoRoot,
  absolute: true,
});

if (linterFiles.length === 0) {
  console.log("No linter files found.");
  process.exit(0);
}

let failed = false;

for (const linter of linterFiles) {
  console.log(`Running linter: ${path.relative(repoRoot, linter)}`);
  try {
    await executeShellScript(`npx ts-node "${linter}"`);
  } catch (err) {
    console.error(`Linter failed: ${linter}`, err);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log("All linters passed.");
  process.exit(0);
}
