import Tool from "../../collect/Tool";

export const TransportsTool: Tool = {
  name: "Transports",
  description: "Tool for managing and processing transport data.",
  version: "1.0.0",
  needs: [],
  async run() {
    // TODO: Implement transport data processing logic here
    console.log("Running TransportsTool...");
  },
  async lint() {
    console.log("[TransportsTool] Linting data using common/lintData.ts...");
    // Re-use the shared linter runner to execute all linters
    // This will fail fast if any linter reports errors (non-zero exit code)
    const { default: exec } = await import("../../common/executeShellScript");
    await exec("npx tsx common/lintData.ts");
  },
};
