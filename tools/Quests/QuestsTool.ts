import Tool from "../../collect/Tool";

export const QuestsTool: Tool = {
  name: "Quests",
  description: "a tool exporting a quest list",
  version: "1.0.0",
  needs: [],
  run: async () => {
    // Implement common tool logic here
  },
  lint: async () => {
    console.log("[QuestsTool] Linting data using common/lintData.ts...");
    const { default: exec } = await import("../../common/executeShellScript");
    await exec("npx tsx common/lintData.ts");
  },
};
