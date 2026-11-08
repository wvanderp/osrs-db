# Items Tool Changelog

All notable changes to this tool will be documented in this file.

## Unreleased

- Accept RuneLite's stackability mode `2` and holding whitelist, and regenerate the item JSON schema.
- Resolve missing title IDs and casing duplicates, preserve exact title overrides, and regenerate equipment slot stats from the wiki tables.
- Recognize the verified Keris partisan of amascut combat-context aliases and make slot-stat validation failures set a failing exit status.

### 2026-04-12 — @copilot — Changed: add safer title-to-ID fallback rewrites for slot stat extraction. (#0)

- `ExtractSlotStats` now preserves explicit `titleToID.json` overrides and applies suffix fallback candidates for `(Last Man Standing)`, `(beta)`, and Deadman variants, plus an uncharged fallback.

### 2026-03-27 — @copilot — Changed: add groundOps to the item schema. (#0)

- Added Zod validation for generated `groundOps` data, including op text entries and conditional variants.

### 2026-01-21 — @copilot — Changed: Requirements schema extracted to shared module

- Moved `AnyRequirementSchema` and related requirement type schemas to `common/Requirements.schema.ts`
- `WearRequirements.schema.ts` now imports from shared module and re-exports for backwards compatibility
- Enables code reuse with Amenities tool and future tools that need requirements

## 1.0.0 - Initial

- Added tool docs and ensured schema/linter wiring.
