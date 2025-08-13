import { Tool } from "../../collect/Tool";
import {exec} from "child_process";

export const ObjectsTool: Tool = {
  name: "Objects",
  description: "Tool for extracting in-game object data.",
  version: "1.0.0",
  needs: [],
  async run() {
    exec("bash exportObjects.sh", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Script error output: ${stderr}`);
        return;
      }
      console.log(`Script output: ${stdout}`);
    });
  },
};
