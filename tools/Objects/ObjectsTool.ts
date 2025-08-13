import Tool from "../../collect/Tool";
import executeShellScript from '../../common/executeShellScript';

export const ObjectsTool: Tool = {
  name: "Objects",
  description: "Tool for extracting in-game object data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log("[ObjectsTool] Starting exportObjects.sh script...");
    await executeShellScript("bash tools/Objects/exportObjects.sh");
  },
  async lint() {
    console.log("[ObjectsTool] Linting data using schema...");
    await executeShellScript("npx tsx tools/Objects/Objects.linter.ts");
  },
};
