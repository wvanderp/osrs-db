import { CollisionMapTool } from "../tools/CollisionMap/CollisionMapTool";
import { DiariesTool } from "../tools/Diaries/DiariesTool";
import { ItemsTool } from "../tools/Items/ItemsTool";
import { NpcsTool } from "../tools/Npcs/NpcsTool";
import { ObjectsTool } from "../tools/Objects/ObjectsTool";
import { ObjectLocationsTool } from "../tools/ObjectLocations/ObjectLocationsTool";
import { TransportsTool } from "../tools/Transports/TransportsTool";
import { QuestsTool } from "../tools/Quests/QuestsTool";
import { WorldMapTool } from "../tools/WorldMap/WorldMapTool";
import { CacheNumberTool } from "../tools/CacheNumber/CacheNumberTool";
import { SkillsTool } from "../tools/Skills/SkillsTool";
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
  CacheNumberTool,
  TransportsTool,
  NpcsTool,
  ObjectsTool,
  ObjectLocationsTool,
  ItemsTool,
  QuestsTool,
  CollisionMapTool,
  DiariesTool,
  SkillsTool,
  WorldMapTool,
];

