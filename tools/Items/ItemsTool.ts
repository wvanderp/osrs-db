import Tool from "../../collect/Tool";
import executeShellScript from '../../common/executeShellScript';
import extractSlotStats from './ExtractSlotStats';
import LintItems from './items.linter';
import lintSlotStats from './slotStats.linter';
import LintTitleToID from './titleToID.linter';

export const ItemsTool: Tool = {
  name: "Items",
  description: "Tool for managing and processing item data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log("[ItemsTool] Starting exportItems.sh script...");
    await executeShellScript("bash tools/Items/exportItems.sh");

    await extractSlotStats();
  },
  async lint() {
    console.log("[ItemsTool] Linting data");
    lintSlotStats();
    await LintTitleToID();
    await LintItems();
  },
};
