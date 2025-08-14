import { CollisionMapTool } from "../tools/CollisionMap/CollisionMapTool";
import { ItemsTool } from "../tools/Items/ItemsTool";
import { NpcsTool } from "../tools/Npcs/NpcsTool";
import { ObjectsTool } from "../tools/Objects/ObjectsTool";
import { TransportsTool } from "../tools/Transports/TransportsTool";
import { QuestsTool } from "../tools/Quests/QuestsTool";
export default interface Tool {
  name: string;
  description: string;
  version: string;

  // dependencies on other tools
  needs: string[];

  // runs the scripts to collect the data
  run: () => Promise<void>;

  // runs the linter on the tools data
  lint: () => Promise<void>;
}

export const tools: Tool[] = [
  TransportsTool,
  NpcsTool,
  ObjectsTool,
  ItemsTool,
  QuestsTool,
  CollisionMapTool,
];

