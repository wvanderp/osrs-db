# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to a versioning scheme of `1.X.cacheNumber`.

## [Unreleased]

### Changed

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
