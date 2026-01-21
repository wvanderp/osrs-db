# Amenities Tool

This tool extracts amenities (banks, altars, furnaces, fountains, etc.) from the exported `objects.g.json` file by identifying specific actions associated with each amenity type.

## Overview

The Amenities tool scans all game objects and identifies useful amenities based on their actions. For example:

- **Banks** are identified by the `Bank` action
- **Altars** are identified by the `Pray` or `Pray-at` actions
- **Furnaces** are identified by the `Smelt` action

## Supported Amenity Types

| Type             | Description           | Identifying Actions                 |
| ---------------- | --------------------- | ----------------------------------- |
| `bank`           | Banking facilities    | `Bank`                              |
| `altar`          | Prayer altars         | `Pray`, `Pray-at`                   |
| `furnace`        | Furnaces for smelting | `Smelt`                             |
| `range`          | Cooking ranges        | `Cook`                              |
| `anvil`          | Smithing anvils       | `Smith`                             |
| `fountain`       | Water sources         | `Fill` (+ name match)               |
| `spinning_wheel` | Spinning wheels       | `Spin`                              |
| `loom`           | Weaving looms         | `Weave`                             |
| `pottery_wheel`  | Pottery wheels        | `Mould` (+ name match)              |
| `pottery_oven`   | Pottery ovens         | `Fire` (+ name match)               |
| `deposit_box`    | Bank deposit boxes    | `Deposit` (+ name match)            |
| `grand_exchange` | GE clerks             | `Exchange` (+ name match)           |
| `fairy_ring`     | Fairy rings           | `Configure`, `Use` (+ name match)   |
| `spirit_tree`    | Spirit trees          | `Teleport`, `Travel` (+ name match) |

## Output

The tool generates `tools/Amenities/data/amenities.g.json` containing an array of amenity objects:

```json
[
  {
    "id": 1,
    "objectId": 6084,
    "name": "Bank booth",
    "type": "bank",
    "actions": [null, "Bank", "Collect", null, null]
  }
]
```

## Dependencies

This tool depends on the **Objects** tool and requires `data/objects.g.json` to exist.

## Files

- `AmenitiesTool.ts` - Main tool implementation
- `Amenities.schema.ts` - Zod schema for validation
- `Amenities.linter.ts` - Data linter
- `Amenities.md` - This documentation
- `Amenities.changelog.md` - Change history
- `data/amenities.g.json` - Generated output (do not edit directly)

## Adding New Amenity Types

To add a new amenity type, update the `AMENITY_MATCHERS` array in `AmenitiesTool.ts`:

```typescript
{
    type: "my_new_amenity",
    description: "Description of the amenity",
    actions: ["Action1", "Action2"],
    nameContains: ["optional", "name", "filters"],  // Optional
}
```

- `type`: The identifier used in the output JSON
- `description`: Human-readable description
- `actions`: Actions that identify this amenity type (case-insensitive)
- `nameContains`: Optional name filters to narrow matches (e.g., for fountains)

## Logs

All log messages are prefixed with `[Amenities]` for easy filtering.
