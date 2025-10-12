import path from 'path';
import Tool from "../../collect/Tool";
import { cyan, red } from "../../common/colors";
import executeShellScript from '../../common/executeShellScript';
import lintWithSchema from '../../common/lintWithSchema';

const prefix = cyan("[ObjectsTool]");


export const ObjectsTool: Tool = {
  name: "Objects",
  description: "Tool for extracting in-game object data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log(prefix, "Starting exportObjects.sh script...");
    await executeShellScript("bash tools/Objects/exportObjects.sh");
  },
  async lint() {
    console.log(prefix, "Linting data using schema...");
    const dataPath = path.join(__dirname, "../../data", "objects.g.json");
    const schemaPath = path.join(__dirname, "objects.schema.json");

    try {
      lintWithSchema(dataPath, schemaPath, { prefix });
    } catch (e) {
      console.error(prefix, red("Objects schema lint failed"));
      process.exit(1);
    }
  },
};
