import path from 'path';
import Tool from "../../collect/Tool";
import { cyan, red } from "../../common/colors";
import executeShellScript from '../../common/executeShellScript';
import lintWithSchema from '../../common/lintWithSchema';

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
    const schemaPath = path.join(__dirname, "npcs.schema.json");

    try {
      lintWithSchema(dataPath, schemaPath, { prefix });
    } catch (e) {
      // lintWithSchema prints all errors already, just exit non-zero here
      console.error(prefix, red("Npcs schema lint failed"));
      process.exit(1);
    }
  },
};
