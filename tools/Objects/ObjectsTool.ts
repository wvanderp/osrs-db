import path from 'path';
import Tool from "../../collect/Tool";
import { cyan, red } from "../../common/colors";
import executeShellScript from '../../common/executeShellScript';
import lintWithZod from '../../common/lintWithZod';
import ObjectsSchema from './Objects.schema';

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

    const valid = lintWithZod(dataPath, ObjectsSchema, { prefix });
    if (!valid) {
      console.error(prefix, red("Objects schema lint failed"));
      process.exit(1);
    }
  },
};
