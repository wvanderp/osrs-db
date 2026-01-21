# Type Generation Implementation

## Overview

This document describes the implementation of TypeScript type generation from JSON schemas in the osrs-db project.

## What Was Added

### 1. Type Generation Script (`scripts/generate-types.ts`)

A new script that:

- Finds all JSON schema files in the `tools/` directory
- Converts them to TypeScript type definitions using `json-schema-to-typescript`
- Outputs `.schema.d.ts` files alongside the schema files
- Includes a banner comment indicating files are auto-generated
- Handles schemas with unresolvable `$ref` references gracefully

### 2. Package.json Updates

- Added `generate-types` script command
- Added `json-schema-to-typescript` as a dev dependency
- Updated `files` field to include schemas and type definitions
- Updated `exports` field to expose schemas and types:
  - `osrs-db/schemas/*` for JSON schemas
  - `osrs-db/types/*` for TypeScript types

### 3. Documentation Updates

- **README.md**: Added sections on TypeScript support and JSON schemas with examples
- **PUBLISHING.md**: Added notes about type generation and what gets published
- **CHANGELOG.md**: Documented the new feature

### 4. Test Script (`scripts/test-types.ts`)

A test script to verify the generated types work correctly with the actual data.

## Usage

### For Development

Generate types from schemas:

```bash
npm run generate-types
```

Test that types work:

```bash
tsx scripts/test-types.ts
```

### For Package Users

Import types in TypeScript projects:

```typescript
import type { Items } from "osrs-db/types/Items/items.schema";
import type { NPCs } from "osrs-db/types/Npcs/npcs.schema";
import items from "osrs-db/items.g.json";

const firstItem: Items[0] = items[0];
```

Import schemas for runtime validation:

```javascript
import itemsSchema from "osrs-db/schemas/Items/items.schema.json";
import Ajv from "ajv";

const ajv = new Ajv();
const validate = ajv.compile(itemsSchema);
```

## Generated Types

The script successfully generates types for:

- ✅ `cache-number.schema.json` → `cache-number.schema.d.ts`
- ✅ `items.schema.json` → `items.schema.d.ts`
- ✅ `npcs.schema.json` → `npcs.schema.d.ts`
- ✅ `objects.schema.json` → `objects.schema.d.ts`
- ✅ `object-locations.schema.json` → `object-locations.schema.d.ts`
- ✅ `quests.schema.json` → `quests.schema.d.ts`
- ⚠️ `wearRequirements.schema.json` - Skipped (contains unresolvable `$ref` to `./parts/questlist.schema.json`)

## Known Issues

### wearRequirements Schema

The `wearRequirements.schema.json` file contains a reference to a non-existent file:

```json
"$ref": "./parts/questlist.schema.json"
```

This schema is currently skipped during type generation. To fix this:

1. Create the missing `parts/questlist.schema.json` file, or
2. Replace the `$ref` with an inline schema definition, or
3. Reference an existing schema file

## Publishing Workflow

Before publishing:

1. Run `npm run generate-types` to ensure all types are up to date
2. Commit the generated `.schema.d.ts` files (they are part of the package)
3. The types will be included in the npm package automatically

## File Structure

```text
tools/
  ├── Items/
  │   ├── items.schema.json        # JSON schema
  │   └── items.schema.d.ts        # Generated TypeScript types
  ├── Npcs/
  │   ├── npcs.schema.json
  │   └── npcs.schema.d.ts
  └── ...
```

## Benefits

1. **Type Safety**: TypeScript users get compile-time type checking
2. **IDE Support**: Autocomplete and IntelliSense for data structures
3. **Documentation**: Types serve as inline documentation
4. **Validation**: Schemas can be used for runtime validation
5. **Consistency**: Types are automatically kept in sync with schemas
