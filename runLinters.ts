import { execSync } from "child_process";

const linters = [
  "npm run lint:items",
  "npm run lint:npcs",
  "npm run lint:objects",
  "npm run lint:slotStats",
  "npm run lint:CollisionMap",
  "npm run lint:Quests",
];

function runLintersSequentially() {
  for (const linter of linters) {
    try {
      const stdout = execSync(linter, { stdio: "pipe" });
      console.log(`Output from ${linter}:`, stdout.toString());
    } catch (error: any) {
      console.error(
        `Error running ${linter}:`,
        error.stderr ? error.stderr.toString() : error.message,
      );
      process.exit(1);
    }
  }
}

runLintersSequentially();
