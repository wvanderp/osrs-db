# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to a versioning scheme of `1.X.cacheNumber`.

## [Unreleased]

### Added

2025-11-22 — @copilot — Fixed: Automatic loading of referenced JSON schemas during schema linting to resolve relative $refs (e.g., Diaries/diariesList.schema.json). (#TBD)

- `lintWithSchema` now detects and registers any `.schema.json` files referenced with `$ref` and recursively resolves nested references.
- `wearRequirements.linter.ts` now explicitly registers the `Diaries/diariesList.schema.json` so that `../Diaries/diariesList.schema.json` references resolve.

2025-10-12 — @copilot — Added: TypeScript compilation of facade files and proper npm package exports. (#TBD)

- Build script now compiles `*.g.ts` facade files to `.mjs` with `.d.ts` type definitions
- Added `tsconfig.build.json` for ES2020 module compilation with declarations
- Package exports are now auto-generated based on compiled `.mjs` files in the build directory
- Facade files are now importable from the npm package with full type support
- Updated `package.json` to include `.mjs`, `.d.ts`, and `.d.ts.map` files
- Build output uses clean filenames without `.g` suffix (e.g., `items.mjs` instead of `items.g.mjs`)
- Exports are dynamically generated: `./items`, `./npcs`, `./objects`, `./quests`, `./skills`, `./slotStats`, `./cache-number`

2025-10-12 — @wvanderp — Added: Build script to prepare clean package for npm publishing.

- Created `scripts/build.ts` to automate package preparation
- Build process: creates build folder, copies data, generates types, copies npm files
- Updated publish workflow to use build script and publish from build directory
- Added `build/` to `.gitignore` to prevent committing build artifacts

### Changed

2025-10-12 — @copilot — Changed: Build process now copies only schema files from tools folder instead of entire tools directory. (#TBD)

- Added `copySchemaFiles` function to selectively copy `*.schema.json` files
- Reduces package size by excluding tool implementation code
- Maintains directory structure for schema resolution during type generation

2025-10-12 — @copilot — Changed: Updated JSON import syntax from `assert` to `with` for Node.js compatibility. (#TBD)

- Changed `import ... assert { type: 'json' }` to `import ... with { type: 'json' }`
- Ensures compatibility with Node.js 22+ which uses the new import attributes syntax
- Updated `scripts/generate-types.ts` to generate modern import syntax

2025-10-12 — @copilot — Changed: Rewrote `scripts/generate-types.ts` to generate TypeScript wrapper files instead of ambient type declarations.

- Now generates individual `.ts` files (e.g., `items.g.ts`) in the package root, mirroring `data/` structure
- Each wrapper imports the JSON file with ESM import assertions and re-exports typed data
- Uses `json-schema-to-typescript` for robust type generation from JSON schemas
- Script is zero-config: discovers data files, resolves schemas automatically, and mirrors folder structure
- Implements idempotent generation: only writes files when content changes
- Schema resolution order: co-located schemas → `schemas/` directory → `tools/{ToolName}` folders

2025-10-12 — @wvanderp — Changed: Fixed TypeScript type configuration to require explicit `data/` folder in import paths. (#TBD)

- Updated `exports` field from `./*` to `./data/*` to remove shortcuts
- Updated `typesVersions` to use single `data/*` pattern for clarity
- Modified `generate-types` script to automatically clean up old patterns
- All imports now require full path: `osrs-db/data/items.g.json` (no shortcuts allowed)

### Added

- TypeScript type definitions automatically generated from JSON schemas
- `generate-types` script to convert JSON schemas to TypeScript types
- JSON schemas and TypeScript types now included in npm package

### Dependencies

- Added `json-schema-to-typescript` as dev dependency for type generation

## [1.0.2317] - 2024-10-05

### Added

- Initial npm package release
- Automatic versioning based on OSRS cache number
- GitHub Actions workflow for automatic publishing
- Package exports for items, npcs, objects, quests, slotStats, and cache-number
- Comprehensive README with usage examples
- PUBLISHING.md guide for maintainers

### Changed

- Moved all dependencies to devDependencies (only data files are published)
- Package now only includes JSON data files, no source code

## Version Scheme

This package uses semantic versioning: `1.X.cacheNumber`

- `1` - Major version (breaking API changes)
- `X` - Code version (feature updates)
- `cacheNumber` - OSRS cache version (e.g., 2317)

The cache number is automatically updated when new OSRS data is collected.
