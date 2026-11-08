import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import Tool from "../../collect/Tool";
import { cyan, red } from "../../common/colors";
import formatJson from "../../common/formatJson";

const execFileAsync = promisify(execFile);
const prefix = cyan("[ObjectLocations]");

interface ObjectDefinition {
  id: number;
  name?: unknown;
  actions?: unknown;
  interactions?: unknown;
  ops?: unknown;
}

interface ObjectPlacement {
  sourceObjectId: number;
  x: number;
  y: number;
  plane: number;
}

export interface ObjectLocation extends ObjectPlacement {
  id: number;
  name: string;
  type: string;
}

const TYPE_MATCHERS: {
  type: string;
  nameContains: string[];
  actionContains: string[];
}[] = [
  {
    type: "bank_booth",
    nameContains: ["bank booth"],
    actionContains: ["bank"],
  },
  {
    type: "bank",
    nameContains: ["bank", "bank chest"],
    actionContains: ["bank"],
  },
  { type: "anvil", nameContains: ["anvil"], actionContains: ["smith"] },
  { type: "tree", nameContains: ["tree"], actionContains: ["chop down"] },
  { type: "altar", nameContains: ["altar"], actionContains: ["pray"] },
  {
    type: "furnace",
    nameContains: ["furnace"],
    actionContains: ["smelt"],
  },
];

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.toLowerCase())
    : [];
}

function getActions(object: ObjectDefinition): string[] {
  if (object.ops && typeof object.ops === "object" && "ops" in object.ops) {
    return stringArray((object.ops as { ops?: unknown }).ops);
  }

  return [
    ...stringArray(object.ops),
    ...stringArray(object.actions),
    ...stringArray(object.interactions),
  ];
}

function classifyObject(object: ObjectDefinition): string | undefined {
  const name = typeof object.name === "string" ? object.name.toLowerCase() : "";
  const actions = getActions(object);

  return TYPE_MATCHERS.find(
    (matcher) =>
      matcher.nameContains.some((keyword) => name.includes(keyword)) ||
      matcher.actionContains.some((keyword) =>
        actions.some((action) => action.includes(keyword)),
      ),
  )?.type;
}

export function createObjectLocations(
  objects: ObjectDefinition[],
  placements: ObjectPlacement[],
): ObjectLocation[] {
  const matchedObjects = new Map<number, { name: string; type: string }>();

  for (const object of objects) {
    const type = classifyObject(object);
    if (type && typeof object.id === "number" && typeof object.name === "string") {
      matchedObjects.set(object.id, { name: object.name, type });
    }
  }

  const results = placements
    .flatMap((placement) => {
      const object = matchedObjects.get(placement.sourceObjectId);
      return object ? [{ ...placement, ...object }] : [];
    })
    .sort(
      (a, b) =>
        a.type.localeCompare(b.type) ||
        a.sourceObjectId - b.sourceObjectId ||
        a.plane - b.plane ||
        a.x - b.x ||
        a.y - b.y,
    );

  return results.map((location, index) => ({ id: index + 1, ...location }));
}

async function exportPlacements(
  repositoryRoot: string,
  outputPath: string,
): Promise<void> {
  const cachePath = path.join(repositoryRoot, "cache");
  const keysPath = path.join(repositoryRoot, "keys.json");
  const cacheJarPath = path.join(repositoryRoot, "cache.jar");
  const sourcePath = path.join(
    __dirname,
    "java",
    "ObjectLocationsExporter.java",
  );
  const classesPath = path.join(
    repositoryRoot,
    "build",
    "object-locations-java",
  );

  for (const requiredPath of [cachePath, keysPath, cacheJarPath]) {
    if (!fs.existsSync(requiredPath)) {
      throw new Error(`Required cache input not found: ${requiredPath}`);
    }
  }

  fs.mkdirSync(classesPath, { recursive: true });
  await execFileAsync("javac", [
    "-cp",
    cacheJarPath,
    "-d",
    classesPath,
    sourcePath,
  ]);
  await execFileAsync("java", [
    "-cp",
    `${classesPath}${path.delimiter}${cacheJarPath}`,
    "ObjectLocationsExporter",
    cachePath,
    keysPath,
    outputPath,
  ]);
}

export const ObjectLocationsTool: Tool = {
  name: "ObjectLocations",
  description:
    "Generate common object locations (banks, anvils, trees, etc.) from cache map placements.",
  version: "1.0.0",
  needs: ["Objects"],
  async run() {
    console.log(prefix, "Generating object locations...");
    const repositoryRoot = path.join(__dirname, "../..");
    const objectsPath = path.join(repositoryRoot, "data", "objects.g.json");
    const outDir = path.join(__dirname, "data");
    const outPath = path.join(outDir, "object-locations.g.json");
    const placementsPath = path.join(
      repositoryRoot,
      "build",
      "object-placements.g.json",
    );

    if (!fs.existsSync(objectsPath)) {
      throw new Error(`Objects export not found: ${objectsPath}`);
    }

    fs.mkdirSync(path.dirname(placementsPath), { recursive: true });
    await exportPlacements(repositoryRoot, placementsPath);

    const objects = JSON.parse(fs.readFileSync(objectsPath, "utf8")) as ObjectDefinition[];
    const placements = JSON.parse(
      fs.readFileSync(placementsPath, "utf8"),
    ) as ObjectPlacement[];
    const results = createObjectLocations(objects, placements);

    if (results.length === 0) {
      throw new Error(
        "No object locations were generated; check the cache, keys, and object export versions.",
      );
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, formatJson(results));
    console.log(prefix, `Wrote ${results.length} locations to ${outPath}`);
  },
  async lint() {
    console.log(prefix, "Linting generated locations...");
    try {
      const { default: lint } = await import("./ObjectLocations.linter");
      lint();
    } catch (error) {
      console.error(prefix, red("Linting failed:"), error);
      throw error;
    }
  },
};
