# Items Tool

This tool manages export, validation, and linting for item data. It keeps JSON outputs consistent with schemas and runs auxiliary linters for slot stats and title-to-ID mappings.

\- Main: `ItemsTool.ts`

\- Linters: `items.linter.ts`, `slotStats.linter.ts`, `titleToID.linter.ts`

\- Schemas: `items.schema.json`, `wearRequirements.schema.json`

\- Intermediate data: `tools/Items/data/*` (final generated data with `.g.` lives in root `data/`)

Notes:

\- Files with `.g.` are generated; don’t edit them directly.

\- Run structure linter: npm run lint:dev

\- Run data linters: npm run lint:data
