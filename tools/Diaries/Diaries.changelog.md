# Diaries Tool Changelog

## Unreleased

2025-10-26 — @wvanderp — Added: Initial implementation of Diaries tool with all achievement diary tiers
- Created DiariesTool.ts with static list of all 48 achievement diary tiers (12 diaries × 4 tiers each)
- Added JSON schema validation for diary tier identifiers
- Included comprehensive documentation covering all supported diaries
- Follows naming convention: {DIARY_NAME}_{TIER} format (e.g., ARDOUGNE_EASY, LUMBRIDGE_AND_DRAYNOR_HARD)
