import fs from "fs";
import path from "path";
import axios from "axios";
import Tool from "../../collect/Tool";
import executeShellScript from "../../common/executeShellScript";
import { cyan, green, yellow } from "../../common/colors";

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

export const QuestsTool: Tool = {
  name: "Quests",
  description: "Tool for exporting a quest list parsed from RuneLite's Quest enum.",
  version: "1.0.0",
  needs: [],
  run: async () => {
    console.log(`${cyan("[Quests]")} Start`);
    const quests = await fetchAndParseQuests();

    const outDir = path.join(__dirname, "..", "..", "data"); // Updated to root data folder
    const outFile = path.join(outDir, "quests.g.json");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(quests, null, 4));
    console.log(`${cyan("[Quests]")} Wrote ${green(String(quests.length))} quests to ${path.relative(process.cwd(), outFile)}`);
  },
  lint: async () => {
    console.log(`${cyan("[Quests]")} ${yellow("Linting data using schema...")}`);
    await executeShellScript("npx tsx tools/Quests/Quests.linter.ts");
  },
};
