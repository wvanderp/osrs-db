# Items Tool

## Overview

The **Items Tool** is responsible for managing and processing item data for the OSRS database project. It automates the export, linting, and validation of item-related data, ensuring consistency and correctness across the dataset.

## Features

- **Data Export:** Runs the `exportItems.sh` script to generate and update item data files.
- **Linting:** Provides linters for item data, slot stats, and title-to-ID mappings to ensure data quality.
- **Schema Validation:** Uses JSON schemas to validate the structure of item data and wear requirements.
- **Change Tracking:** Maintains a changelog for tracking updates and improvements to the tool.

## Directory Structure

```tree
Items/
├── exportItems.sh                # Script to export item data
├── items.linter.ts               # Linter for items data
├── items.schema.json             # JSON schema for items
├── ItemsTool.ts                  # Main tool implementation
├── slotStats.linter.ts           # Linter for slot stats
├── titleToID.linter.ts           # Linter for title-to-ID mapping
├── wearRequirements.schema.json  # JSON schema for wear requirements
├── data/
│   ├── titleToID.json            # Title-to-ID mapping
│   └── wearRequirements.json     # Wear requirements data
```

## Usage

1. **Export Item Data:**
   - Run the tool to execute `exportItems.sh`, which generates the latest item data files in the `data/` directory.
2. **Lint Data:**
   - Use the provided linter scripts to check for errors or inconsistencies in the data files.
3. **Validate Data:**
   - Ensure that all data files conform to their respective JSON schemas.

## Notes

- Files with a `.g.` in their name are generated and should **not** be edited directly.
- All scripts and tools should be run from the project root unless otherwise specified.
- For more information on the tool's implementation, see `ItemsTool.ts`.

## Cache fields

- `bronzeman` is an optional boolean. RuneLite sets it to `true` when item cache opcode `251` is present and otherwise exports `false`. It is a static item-definition flag, not a player's unlock status. The decoder names it for Bronzeman mode but does not establish the exact gameplay rule it controls.
- `fullRecolor` is an optional integer for a full-model recolor, decoded from opcode `99`. It is a packed HSL color, exported by RuneLite as a signed Java `short` (`-32768` through `32767`); `-1` is the default meaning no override. Full-model recoloring is inferred from the field name and HSL type; RuneLite's item sprite renderer currently does not apply this field.

Sources: [RuneLite item definitions](https://github.com/runelite/runelite/blob/master/cache/src/main/java/net/runelite/cache/definitions/ItemDefinition.java), [RuneLite item decoder](https://github.com/runelite/runelite/blob/master/cache/src/main/java/net/runelite/cache/definitions/loaders/ItemLoader.java), [cache2 HSL typing](https://github.com/abextm/cache2/blob/master/cache2-ts/src/loaders/Item.ts), and [RuneLite item sprite renderer](https://github.com/runelite/runelite/blob/master/cache/src/main/java/net/runelite/cache/item/ItemSpriteFactory.java).

## Changelog

See `Items/Items.changelog.md` for a history of changes and updates to this tool.
