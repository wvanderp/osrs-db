import { exec } from "child_process";
import { Tool } from "../../collect/Tool";

export const ItemsTool: Tool = {
  name: "Items",
  description: "Tool for managing and processing item data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log("[ItemsTool] Starting exportItems.sh script...");
    exec("bash tools/Items/exportItems.sh", (error, stdout, stderr) => {
      if (error) {
        console.error(`[ItemsTool] Error executing script: ${error.message}`);
        if (stderr) {
          console.error(`[ItemsTool] Script error output: ${stderr}`);
        }
        return;
      }
      if (stderr) {
        console.warn(`[ItemsTool] Script stderr: ${stderr}`);
      }
      console.log(`[ItemsTool] Script output: ${stdout}`);
      console.log("[ItemsTool] exportItems.sh script completed successfully.");
    });
  },
};
