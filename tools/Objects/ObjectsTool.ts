import { Tool } from "../../collect/Tool";
import { exec } from "child_process";

export const ObjectsTool: Tool = {
  name: "Objects",
  description: "Tool for extracting in-game object data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log("[ObjectsTool] Starting exportObjects.sh script...");
    exec("bash tools/Objects/exportObjects.sh", (error, stdout, stderr) => {
      if (error) {
        console.error(`[ObjectsTool] Error executing script: ${error.message}`);
        if (stderr) {
          console.error(`[ObjectsTool] Script error output: ${stderr}`);
        }
        return;
      }
      if (stderr) {
        console.warn(`[ObjectsTool] Script stderr: ${stderr}`);
      }
      console.log(`[ObjectsTool] Script output: ${stdout}`);
      console.log("[ObjectsTool] exportObjects.sh script completed successfully.");
    });
  },
};
