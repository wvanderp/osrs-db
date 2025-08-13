import { CollisionMapTool } from "../tools/CollisionMap/CollisionMapTool";
import { ItemsTool } from "../tools/Items/ItemsTool";
import { NpcsTool } from "../tools/Npcs/NpcsTool";
import { ObjectsTool } from "../tools/objects/ObjectsTool";
import { QuestsTool } from "../tools/quests/QuestsTool";
import { TransportsTool } from "../tools/Transports/TransportsTool";
import { Tool } from "./Tool";

const tools: Tool[] = [
  TransportsTool,
  NpcsTool,
  QuestsTool,
  ObjectsTool,
  ItemsTool,
  CollisionMapTool,
];

// Helper to get all needs for a tool (flattened)
function getNeeds(tool: Tool): string[] {
  return Array.isArray(tool.needs) ? tool.needs : [];
}

// Topological sort based on 'needs' property
function sortToolsByNeeds(tools: Tool[]): Tool[] {
  const toolMap = new Map<string, Tool>();
  const nameMap = new Map<Tool, string>();
  // Assume each tool has a unique 'name' property
  for (const tool of tools) {
    if (tool.name) {
      toolMap.set(tool.name, tool);
      nameMap.set(tool, tool.name);
    }
  }

  const visited = new Set<string>();
  const sorted: Tool[] = [];

  function visit(tool: Tool) {
    const name = nameMap.get(tool);
    if (!name || visited.has(name)) return;
    visited.add(name);
    for (const need of getNeeds(tool)) {
      const dep = toolMap.get(need);
      if (dep) visit(dep);
    }
    sorted.push(tool);
  }

  for (const tool of tools) {
    visit(tool);
  }
  return sorted;
}

// Linter: check that every 'needs' of a tool is another tool
function lintToolNeeds(tools: Tool[]) {
  const toolNames = new Set(tools.map((t) => t.name));
  let hasError = false;
  for (const tool of tools) {
    const needs = getNeeds(tool);
    for (const need of needs) {
      if (!toolNames.has(need)) {
        // eslint-disable-next-line no-console
        console.error(
          `Tool '${tool.name}' needs '${need}', but no such tool exists.`
        );
        hasError = true;
      }
    }
  }
  if (hasError) {
    throw new Error("Tool needs validation failed.");
  }
}

async function runToolsInOrder() {
  lintToolNeeds(tools);
  const sortedTools = sortToolsByNeeds(tools);
  for (const tool of sortedTools) {
    if (typeof tool.run === "function") {
      // eslint-disable-next-line no-console
      console.log(`Running tool: ${tool.name}`);
      await tool.run();
    }
  }
}

// Run the tools
runToolsInOrder().catch((e) => {
  // eslint-disable-next-line no-console
  console.error("Error running tools:", e);
});
