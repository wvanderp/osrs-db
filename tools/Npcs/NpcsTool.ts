import Tool from "../../collect/Tool";
import { cyan } from "../../common/colors";
import executeShellScript from '../../common/executeShellScript';

export const NpcsTool: Tool = {
  name: "Npcs",
  description: "Tool for managing and processing NPC data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log(cyan("[NpcsTool]"), "Starting exportNpcs.sh script...");
    await executeShellScript("bash tools/Npcs/exportNpcs.sh");
  },
  async lint() {
    console.log(cyan("[NpcsTool]"), "Linting data using schema...");
    await executeShellScript("npx tsx tools/Npcs/Npcs.linter.ts");
  },
};
