import path from 'path';
import Tool from "../../collect/Tool";
import { cyan, red } from "../../common/colors";
import executeShellScript from '../../common/executeShellScript';
import lintWithZod from '../../common/lintWithZod';
import NpcsSchema from './Npcs.schema';

const prefix = cyan("[NpcsTool]");


export const NpcsTool: Tool = {
  name: "Npcs",
  description: "Tool for managing and processing NPC data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log(prefix, "Starting exportNpcs.sh script...");
    await executeShellScript("bash tools/Npcs/exportNpcs.sh");
  },
  async lint() {
    console.log(prefix, "Linting data using schema...");
    const dataPath = path.join(__dirname, "../../data", "npcs.g.json");

    const valid = lintWithZod(dataPath, NpcsSchema, { prefix });
    if (!valid) {
      console.error(prefix, red("Npcs schema lint failed"));
      process.exit(1);
    }
  },
};
