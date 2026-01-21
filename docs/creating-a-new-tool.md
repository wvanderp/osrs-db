# Creating a New Tool

This guide explains how to create a new tool in the osrs-db project. Tools are responsible for extracting, processing, and validating specific types of game data.

## Overview

A tool is a self-contained module that:

1. Collects or generates data (from the OSRS cache, existing data files, or external sources)
2. Outputs structured JSON data
3. Validates the output against a schema
4. Provides documentation and change tracking

## Tool Structure

Each tool should have the following files in its directory (`tools/{ToolName}/`):

```
tools/{ToolName}/
├── {ToolName}Tool.ts        # Main tool implementation
├── {ToolName}.schema.ts     # Zod schema for data validation
├── {ToolName}.linter.ts     # Linter implementation
├── {ToolName}.md            # Documentation
├── {ToolName}.changelog.md  # Change history
└── data/                    # Generated data (optional, for tool-specific data)
    └── *.g.json             # Generated JSON files
```

## Step-by-Step Guide

### 1. Create the Tool Directory

```bash
mkdir tools/MyNewTool
mkdir tools/MyNewTool/data  # If needed for generated data
```

### 2. Create the Main Tool File (`{ToolName}Tool.ts`)

```typescript
import Tool from "../../collect/Tool";
import { cyan, green, red, yellow } from "../../common/colors";
import formatJson from "../../common/formatJson";
import fs from "fs";
import path from "path";

const prefix = cyan("[MyNewTool]");

export const MyNewToolTool: Tool = {
  name: "MyNewTool",
  description: "Brief description of what this tool does.",
  version: "1.0.0",
  needs: [], // List other tool names this depends on, e.g., ["Objects"]

  async run() {
    console.log(prefix, "Starting data extraction...");

    // Your data collection/generation logic here
    const data = [];

    // Write output
    const outDir = path.join(__dirname, "./data");
    const outPath = path.join(outDir, "my-data.g.json");

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outPath, formatJson(data));
    console.log(prefix, green(`Wrote ${data.length} entries to ${outPath}`));
  },

  async lint() {
    console.log(prefix, "Linting data...");
    try {
      const { default: lint } = await import("./MyNewTool.linter");
      lint();
    } catch (e) {
      console.error(prefix, red("Linting failed:"), e);
      throw e;
    }
  },
};
```

### 3. Create the Schema File (`{ToolName}.schema.ts`)

Use [Zod](https://zod.dev/) to define your data schema:

```typescript
import { z } from "zod";

/**
 * Schema for a single entry
 */
export const MyEntrySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  // Add more fields as needed
});

export type MyEntry = z.infer<typeof MyEntrySchema>;

/**
 * Schema for the full output file
 */
export const MyNewToolSchema = z.array(MyEntrySchema);

export type MyNewToolData = z.infer<typeof MyNewToolSchema>;

export default MyNewToolSchema;
```

### 4. Create the Linter File (`{ToolName}.linter.ts`)

```typescript
import path from "path";
import lintWithZod from "../../common/lintWithZod";
import { cyan, green, red } from "../../common/colors";
import MyNewToolSchema from "./MyNewTool.schema";

const prefix = cyan("[MyNewTool]");

export default function lintMyNewTool(): void {
  const filePath = path.join(__dirname, "./data/my-data.g.json");

  console.log(prefix, "Linting my-data.g.json");

  const valid = lintWithZod(filePath, MyNewToolSchema, { prefix });

  if (!valid) {
    console.error(prefix, red("Schema validation failed"));
    process.exit(1);
  }

  console.log(prefix, green("my-data.g.json is valid"));
}
```

### 5. Register the Tool

Add your tool to `collect/Tool.ts`:

```typescript
// Add import at the top
import { MyNewToolTool } from "../tools/MyNewTool/MyNewToolTool";

// Add to the tools array (respect dependencies - tools run in order)
export const tools: Tool[] = [
  CacheNumberTool,
  NpcsTool,
  ObjectsTool,
  // ... other tools
  MyNewToolTool, // Add your tool here
  // ... remaining tools
];
```

**Important**: Tools run in the order they appear in the array. If your tool depends on another tool's output (via the `needs` property), ensure it appears after its dependencies.

### 6. Create Documentation (`{ToolName}.md`)

```markdown
# MyNewTool

Brief description of what this tool does and why it's useful.

## Overview

Detailed explanation of the tool's purpose and how it works.

## Output

Description of the generated data format with examples:

\`\`\`json
[
{
"id": 1,
"name": "Example"
}
]
\`\`\`

## Dependencies

List any dependencies on other tools.

## Files

- `MyNewToolTool.ts` - Main tool implementation
- `MyNewTool.schema.ts` - Zod schema for validation
- `MyNewTool.linter.ts` - Data linter
- `data/my-data.g.json` - Generated output
```

### 7. Create Changelog (`{ToolName}.changelog.md`)

```markdown
# MyNewTool Changelog

All notable changes to the MyNewTool tool are documented in this file.

## Unreleased

### YYYY-MM-DD — @username — Added: Initial implementation

- Created MyNewToolTool.ts with core functionality
- Added Zod schema for data validation
- Added linter
```

## Example: Action-Based Object Detection

The Amenities tool demonstrates how to extract data based on object actions. Here's the pattern:

```typescript
// Define matchers based on actions
const MATCHERS = [
    {
        type: "bank",
        description: "Banking facilities",
        actions: ["Bank"],  // Case-insensitive action matching
    },
    {
        type: "altar",
        description: "Prayer altars",
        actions: ["Pray", "Pray-at"],
        nameContains: ["altar"],  // Optional: also check object name
    },
];

// Scan objects and match
for (const obj of objects) {
    const actions = Array.isArray(obj.actions) ? obj.actions : [];

    for (const matcher of MATCHERS) {
        const hasAction = matcher.actions.some(action =>
            actions.some(a => a?.toLowerCase() === action.toLowerCase())
        );

        if (hasAction) {
            // Object matches this amenity type
            results.push({ ... });
            break;
        }
    }
}
```

## Testing Your Tool

Run your tool directly:

```bash
npx tsx -e "import { MyNewToolTool } from './tools/MyNewTool/MyNewToolTool'; MyNewToolTool.run();"
```

Run the linter:

```bash
npx tsx -e "import { MyNewToolTool } from './tools/MyNewTool/MyNewToolTool'; MyNewToolTool.lint();"
```

## Best Practices

1. **Logging**: Use the `[ToolName]` prefix for all log messages with appropriate colors:
   - `cyan` for informational messages
   - `green` for success messages
   - `yellow` for warnings
   - `red` for errors

2. **Error Handling**: Follow the project philosophy - throw early, throw often. Don't catch errors; let them crash the process.

3. **Generated Files**: Files with `.g.` in the name are generated and should not be edited directly.

4. **Dependencies**: Clearly declare dependencies in the `needs` array and check if required files exist before processing.

5. **Schema Validation**: Always validate output against the schema before writing.

6. **Documentation**: Keep the tool's `.md` file up to date with any changes.

7. **Changelog**: Add entries to the changelog for any meaningful changes.

## Common Patterns

### Reading from objects.g.json

```typescript
const objectsPath = path.join(__dirname, "../../data/objects.g.json");
if (!fs.existsSync(objectsPath)) {
  console.log(prefix, yellow("objects.g.json not found, skipping"));
  return;
}
const objects = JSON.parse(fs.readFileSync(objectsPath, "utf8"));
```

### Using executeShellScript for external tools

```typescript
import executeShellScript from '../../common/executeShellScript';

async run() {
    await executeShellScript("bash tools/MyTool/myScript.sh");
}
```

### Validating with lintWithZod

```typescript
import lintWithZod from "../../common/lintWithZod";

const valid = lintWithZod(filePath, MySchema, { prefix });
if (!valid) {
  process.exit(1);
}
```
