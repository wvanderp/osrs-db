import Tool from "../../collect/Tool";
import { cyan } from "../../common/colors";
import fs from "fs";
import path from "path";

export const ObjectLocationsTool: Tool = {
  name: "ObjectLocations",
  description: "Generate common object locations (banks, anvils, trees, etc.) from objects export.",
  version: "0.1.0",
  needs: ["Objects"],
  async run() {
    console.log(`${cyan("[ObjectLocations]")} Generating object locations...`);
    const objectsPath = path.join(__dirname, "../Objects/data/objects.g.json");
    const outDir = path.join(__dirname, "./data");
    const outPath = path.join(outDir, "object-locations.g.json");

    if (!fs.existsSync(objectsPath)) {
      console.log(`${cyan("[ObjectLocations]")} objects.g.json not found, skipping`);
      return;
    }

    const raw = fs.readFileSync(objectsPath, "utf8");
    const objects = JSON.parse(raw) as any[];

    const results: any[] = [];
    let nextId = 1;

    // simple heuristics to identify object types
    const typeMatchers: { type: string; nameContains?: string[]; optionContains?: string[] }[] = [
      { type: "bank", nameContains: ["bank", "bank chest", "bank booth"] , optionContains: ["bank"]},
      { type: "anvil", nameContains: ["anvil"], optionContains: ["smith"] },
      { type: "tree", nameContains: ["tree"], optionContains: ["chop down"] },
      { type: "altar", nameContains: ["altar"], optionContains: ["pray"] },
      { type: "furnace", nameContains: ["furnace"], optionContains: ["smelt"] },
      { type: "bank_booth", nameContains: ["bank booth"], optionContains: ["bank"] }
    ];

    for (const obj of objects) {
      const name = (obj.name || "").toString().toLowerCase();
      const interactions = Array.isArray(obj.interactions) ? obj.interactions.map((s: any) => (s || "").toString().toLowerCase()) : [];

      for (const matcher of typeMatchers) {
        let matched = false;
        if (matcher.nameContains) {
          for (const kw of matcher.nameContains) if (name.includes(kw)) matched = true;
        }
        if (!matched && matcher.optionContains) {
          for (const kw of matcher.optionContains) if (interactions.some((i: string) => i && i.includes(kw))) matched = true;
        }

        if (matched) {
          // ensure coords exist
          if (typeof obj.x === "number" && typeof obj.y === "number" && typeof obj.plane === "number") {
            results.push({
              id: nextId++,
              name: obj.name,
              type: matcher.type,
              x: obj.x,
              y: obj.y,
              plane: obj.plane,
              sourceObjectId: typeof obj.id === "number" ? obj.id : null,
            });
          }
          break;
        }
      }
    }

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`${cyan("[ObjectLocations]")} Wrote ${results.length} locations to ${outPath}`);
  },
  async lint() {
    console.log(`${cyan("[ObjectLocations]")} Linting generated locations...`);
    try {
      const { default: lint } = await import("./ObjectLocations.linter");
      lint();
    } catch (e) {
      console.log(e);
    }
  },
};
