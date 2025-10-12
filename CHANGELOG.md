# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to a versioning scheme of `1.X.cacheNumber`.

## [Unreleased]

### Added

2025-10-12 — @wvanderp — Added: Build script to prepare clean package for npm publishing.

- Created `scripts/build.ts` to automate package preparation
- Build process: creates build folder, copies data, generates types, copies npm files
- Updated publish workflow to use build script and publish from build directory
- Added `build/` to `.gitignore` to prevent committing build artifacts

### Changed

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
