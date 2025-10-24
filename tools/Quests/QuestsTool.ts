import fs from "fs";
import path from "path";
import axios from "axios";
import Tool from "../../collect/Tool";
import { cyan, green, red, yellow } from "../../common/colors";
import lintWithSchema from '../../common/lintWithSchema';

const QUEST_SOURCE_URL =
  "https://raw.githubusercontent.com/runelite/runelite/master/runelite-api/src/main/java/net/runelite/api/Quest.java";

type QuestRow = {
  id: number;
  enum: string;
  name: string;
};

async function fetchAndParseQuests(): Promise<QuestRow[]> {
  console.log("[Quests] Fetching Quest.java from RuneLite repo...");
  const { data } = await axios.get<string>(QUEST_SOURCE_URL, {
    responseType: "text",
  });

  // Match entries like: NAME(123, "Display Name"), allowing comma or semicolon terminator
  // Handles escaped quotes within the display name.
  const entryRegex = /([A-Z0-9_]+)\s*\(\s*(\d+)\s*,\s*"((?:\\.|[^"\\])*)"\s*\)\s*[,;]/g;
  const results: QuestRow[] = [];

  let match: RegExpExecArray | null;
  while ((match = entryRegex.exec(data)) !== null) {
    const [, enumName, idStr, displayName] = match;
    const id = parseInt(idStr, 10);
    // Unescape Java-style escaped quotes if present
    const name = displayName.replace(/\\"/g, '"');

    results.push({ id, enum: enumName, name });
  }

  // Sort by id for stable output
  results.sort((a, b) => a.id - b.id);
  console.log(`[Quests] Parsed ${results.length} quests.`);
  return results;
}

const prefix = cyan("[Quests]");


export const QuestsTool: Tool = {
  name: "Quests",
  description: "Tool for exporting a quest list parsed from RuneLite's Quest enum.",
  version: "1.0.0",
  needs: [],
  run: async () => {
    console.log(prefix, "Start");
    const quests = await fetchAndParseQuests();

    // Write the output file
    const outDir = path.join(__dirname, "..", "..", "data");
    const outFile = path.join(outDir, "quests.g.json");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(quests, null, 4));
    console.log(prefix, "Wrote", green(String(quests.length)), "quests to", path.relative(process.cwd(), outFile));

    // Create a JSON schema for other tools to reference
    const schemaFile = path.join(__dirname, "QuestList.schema.json");
    const schema = quests.map(q => q.enum);
    fs.writeFileSync(schemaFile, JSON.stringify({
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "string",
      "title": "Quest",
      "description": "An enum of all quests available in Old School RuneScape.",
      "enum": schema,
    }, null, 4));
    console.log(prefix, "Wrote quest schema to", path.relative(process.cwd(), schemaFile));
  },
  lint: async () => {
    console.log(prefix, yellow("Linting data using schema..."));
    const dataPath = path.join(__dirname, "../../data", "quests.g.json");
    const schemaPath = path.join(__dirname, "quests.schema.json");

    try {
      lintWithSchema(dataPath, schemaPath, { prefix });
    } catch (e) {
      console.error(prefix, red("Quests schema lint failed"));
      process.exit(1);
    }
  },
};
