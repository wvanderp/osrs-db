# Amenities Changelog

All notable changes to the Amenities tool are documented in this file.

## Unreleased

### 2026-01-21 — @copilot — Changed: Requirements schema refactored to shared module

- Replaced `AmenityRequirementSchema` with shared `AnyRequirementSchema` from `common/Requirements.schema.ts`
- Now uses the same strongly-typed requirement union as the Items tool (skill, quest, gameMode, equipment, diary, ironman)
- Deprecated `AmenityRequirement` type alias in favor of `AnyRequirement`

### 2025-01-21 — @wvanderp — Changed: Updated data structure

- Removed `id` field from amenity entries
- Added `requirements` array (empty by default, ready for future use)
- Output is now sorted by `type` first, then by `objectId`

### 2025-01-21 — @wvanderp — Added: Initial implementation of Amenities tool

- Created `AmenitiesTool.ts` with action-based amenity detection
- Added support for: banks, altars, furnaces, ranges, anvils, fountains, spinning wheels, looms, pottery wheels/ovens, deposit boxes, grand exchange, fairy rings, spirit trees
- Created Zod schema for data validation (`Amenities.schema.ts`)
- Added linter (`Amenities.linter.ts`)
- Tool depends on Objects tool for `objects.g.json` data
