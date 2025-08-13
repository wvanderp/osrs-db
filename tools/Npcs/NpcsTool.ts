import { Tool } from "../../collect/Tool";
import executeShellScript from '../../common/executeShellScript';

export const NpcsTool: Tool = {
  name: "Npcs",
  description: "Tool for managing and processing NPC data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log("[NpcsTool] Starting exportNpcs.sh script...");
    await executeShellScript("bash tools/Npcs/exportNpcs.sh");
  },
};
