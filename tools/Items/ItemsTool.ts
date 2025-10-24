import Tool from "../../collect/Tool";
import { cyan } from "../../common/colors";
import executeShellScript from '../../common/executeShellScript';
import extractSlotStats from './ExtractSlotStats';
import LintItems from './items.linter';
import lintSlotStats from './slotStats.linter';
import LintTitleToID from './titleToID.linter';
import mergeWearRequirements from './MergeWearRequirements';
import lintWearRequirements from './wearRequirements.linter';

export const ItemsTool: Tool = {
  name: "Items",
  description: "Tool for managing and processing item data.",
  version: "1.0.0",
  needs: [],
  async run() {
    console.log(`${cyan("[ItemsTool]")} Starting exportItems.sh script...`);
    await executeShellScript("bash tools/Items/exportItems.sh");

    await extractSlotStats();
    await mergeWearRequirements();
  },
  async lint() {
    console.log(`${cyan("[ItemsTool]")} Linting data`);
    lintSlotStats();
    lintWearRequirements();
    await LintTitleToID();
    await LintItems();
  },
};
