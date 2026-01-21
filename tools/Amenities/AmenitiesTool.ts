import Tool from "../../collect/Tool";
import { cyan, green, red, yellow } from "../../common/colors";
import formatJson from "../../common/formatJson";
import fs from "fs";
import path from "path";

/**
 * Amenity type definitions with their action-based matchers.
 * Each amenity is identified by specific actions found in the objects data.
 */
const AMENITY_MATCHERS: {
  type: string;
  description: string;
  actions: string[];
  nameContains?: string[];
}[] = [
  {
    type: "bank",
    description: "Banking facilities (booths, chests, deposit boxes)",
    actions: ["Bank"],
  },
  {
    type: "altar",
    description: "Prayer altars for restoring prayer points",
    actions: ["Pray", "Pray-at"],
  },
  {
    type: "furnace",
    description: "Furnaces for smelting ores",
    actions: ["Smelt"],
  },
  {
    type: "range",
    description: "Cooking ranges and fires",
    actions: ["Cook"],
  },
  {
    type: "anvil",
    description: "Anvils for smithing",
    actions: ["Smith"],
  },
  {
    type: "fountain",
    description: "Fountains and water sources",
    actions: ["Fill"],
    nameContains: ["fountain", "well", "water source", "sink"],
  },
  {
    type: "spinning_wheel",
    description: "Spinning wheels for crafting",
    actions: ["Spin"],
  },
  {
    type: "loom",
    description: "Looms for weaving",
    actions: ["Weave"],
  },
  {
    type: "pottery_wheel",
    description: "Pottery wheels for crafting clay",
    actions: ["Mould"],
    nameContains: ["pottery"],
  },
  {
    type: "pottery_oven",
    description: "Pottery ovens for firing clay",
    actions: ["Fire"],
    nameContains: ["pottery", "kiln"],
  },
  {
    type: "tanner",
    description: "Tanning facilities",
    actions: ["Trade"],
    nameContains: ["tanner"],
  },
  {
    type: "sawmill",
    description: "Sawmill operators for construction",
    actions: ["Buy-plank", "Buy planks"],
  },
  {
    type: "deposit_box",
    description: "Bank deposit boxes",
    actions: ["Deposit"],
    nameContains: ["deposit box"],
  },
  {
    type: "grand_exchange",
    description: "Grand Exchange clerks",
    actions: ["Exchange"],
    nameContains: ["grand exchange"],
  },
  {
    type: "fairy_ring",
    description: "Fairy ring teleportation network",
    actions: ["Configure", "Use"],
    nameContains: ["fairy ring"],
  },
  {
    type: "spirit_tree",
    description: "Spirit tree teleportation network",
    actions: ["Teleport", "Travel"],
    nameContains: ["spirit tree"],
  },
];

const prefix = cyan("[Amenities]");

export interface AmenityRequirement {
  type: string;
  skill?: string;
  level?: number;
  quest?: string;
  note?: string;
}

export interface Amenity {
  objectId: number;
  name: string;
  type: string;
  actions: (string | null)[];
  requirements: AmenityRequirement[];
}

export const AmenitiesTool: Tool = {
  name: "Amenities",
  description:
    "Tool for extracting amenities (banks, altars, furnaces, etc.) from object data by identifying specific actions.",
  version: "1.0.0",
  needs: ["Objects"],
  async run() {
    console.log(prefix, "Starting amenity extraction...");

    const objectsPath = path.join(__dirname, "../../data/objects.g.json");
    const outDir = path.join(__dirname, "./data");
    const outPath = path.join(outDir, "amenities.g.json");

    if (!fs.existsSync(objectsPath)) {
      console.log(prefix, yellow("objects.g.json not found, skipping"));
      return;
    }

    console.log(prefix, "Loading objects data...");
    const raw = fs.readFileSync(objectsPath, "utf8");
    const objects = JSON.parse(raw) as any[];

    console.log(prefix, `Loaded ${objects.length} objects`);

    const amenities: Amenity[] = [];

    // Statistics for logging
    const stats: Record<string, number> = {};

    for (const obj of objects) {
      const name = (obj.name || "").toString();
      const nameLower = name.toLowerCase();
      const actions: (string | null)[] = Array.isArray(obj.actions)
        ? obj.actions
        : [];

      for (const matcher of AMENITY_MATCHERS) {
        let matched = false;

        // Check if any action matches
        for (const action of matcher.actions) {
          if (
            actions.some((a) => a && a.toLowerCase() === action.toLowerCase())
          ) {
            // If nameContains is specified, also check the name
            if (matcher.nameContains) {
              if (
                matcher.nameContains.some((kw) =>
                  nameLower.includes(kw.toLowerCase()),
                )
              ) {
                matched = true;
              }
            } else {
              matched = true;
            }
          }
        }

        // Also check name-only matchers (for things like fountains that may have generic actions)
        if (!matched && matcher.nameContains) {
          if (
            matcher.nameContains.some((kw) =>
              nameLower.includes(kw.toLowerCase()),
            )
          ) {
            // Only match by name if it has relevant actions
            for (const action of matcher.actions) {
              if (
                actions.some(
                  (a) => a && a.toLowerCase() === action.toLowerCase(),
                )
              ) {
                matched = true;
                break;
              }
            }
          }
        }

        if (matched) {
          amenities.push({
            objectId: typeof obj.id === "number" ? obj.id : -1,
            name: name,
            type: matcher.type,
            actions: actions,
            requirements: [],
          });

          // Update statistics
          stats[matcher.type] = (stats[matcher.type] || 0) + 1;
          break; // Only match one type per object
        }
      }
    }

    // Log statistics
    console.log(prefix, "Amenities found by type:");
    for (const [type, count] of Object.entries(stats).sort(
      (a, b) => b[1] - a[1],
    )) {
      console.log(prefix, `  ${type}: ${count}`);
    }

    // Sort by type first, then by objectId
    amenities.sort((a, b) => {
      const typeCompare = a.type.localeCompare(b.type);
      if (typeCompare !== 0) return typeCompare;
      return a.objectId - b.objectId;
    });

    // Ensure output directory exists
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Write output
    fs.writeFileSync(outPath, formatJson(amenities));
    console.log(
      prefix,
      green(`Wrote ${amenities.length} amenities to ${outPath}`),
    );
  },
  async lint() {
    console.log(prefix, "Linting amenities data...");
    try {
      const { default: lint } = await import("./Amenities.linter");
      lint();
    } catch (e) {
      console.error(prefix, red("Linting failed:"), e);
      throw e;
    }
  },
};
