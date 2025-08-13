import { Tool } from "../../collect/Tool";
import executeShellScript from '../../common/executeShellScript';

export const ItemsTool: Tool = {
  name: "Items",
  description: "Tool for managing and processing item data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log("[ItemsTool] Starting exportItems.sh script...");
    await executeShellScript("bash tools/Items/exportItems.sh");
  },
};
