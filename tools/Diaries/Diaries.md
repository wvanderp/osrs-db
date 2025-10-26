# Diaries Tool

The Diaries tool generates a static list of all achievement diary tiers in Old School RuneScape.

## Overview

This tool provides a comprehensive list of all achievement diaries and their tiers (Easy, Medium, Hard, Elite) in a standardized format. The data is exported as a JSON array containing string identifiers for each diary tier.

## Output

The tool generates:
- `diaries.g.json`: A JSON array containing all achievement diary tier identifiers

## Data Format

Each diary tier is represented as a string in the format `{DIARY_NAME}_{TIER}`, where:
- `DIARY_NAME` is the uppercase name of the diary area (with spaces replaced by underscores)
- `TIER` is one of: EASY, MEDIUM, HARD, ELITE

## Achievement Diaries Included

The following achievement diaries are included with all four tiers each:

1. **Ardougne Diary** - ARDOUGNE_EASY, ARDOUGNE_MEDIUM, ARDOUGNE_HARD, ARDOUGNE_ELITE
2. **Desert Diary** - DESERT_EASY, DESERT_MEDIUM, DESERT_HARD, DESERT_ELITE
3. **Falador Diary** - FALADOR_EASY, FALADOR_MEDIUM, FALADOR_HARD, FALADOR_ELITE
4. **Fremennik Diary** - FREMENNIK_EASY, FREMENNIK_MEDIUM, FREMENNIK_HARD, FREMENNIK_ELITE
5. **Kandarin Diary** - KANDARIN_EASY, KANDARIN_MEDIUM, KANDARIN_HARD, KANDARIN_ELITE
6. **Karamja Diary** - KARAMJA_EASY, KARAMJA_MEDIUM, KARAMJA_HARD, KARAMJA_ELITE
7. **Kourend & Kebos Diary** - KOUREND_AND_KEBOS_EASY, KOUREND_AND_KEBOS_MEDIUM, KOUREND_AND_KEBOS_HARD, KOUREND_AND_KEBOS_ELITE
8. **Lumbridge & Draynor Diary** - LUMBRIDGE_AND_DRAYNOR_EASY, LUMBRIDGE_AND_DRAYNOR_MEDIUM, LUMBRIDGE_AND_DRAYNOR_HARD, LUMBRIDGE_AND_DRAYNOR_ELITE
9. **Morytania Diary** - MORYTANIA_EASY, MORYTANIA_MEDIUM, MORYTANIA_HARD, MORYTANIA_ELITE
10. **Varrock Diary** - VARROCK_EASY, VARROCK_MEDIUM, VARROCK_HARD, VARROCK_ELITE
11. **Western Provinces Diary** - WESTERN_PROVINCES_EASY, WESTERN_PROVINCES_MEDIUM, WESTERN_PROVINCES_HARD, WESTERN_PROVINCES_ELITE
12. **Wilderness Diary** - WILDERNESS_EASY, WILDERNESS_MEDIUM, WILDERNESS_HARD, WILDERNESS_ELITE

## Usage

The tool is part of the data collection pipeline and will be executed automatically when running the main data generation script. The generated data can be used for:

- Validating diary-related content
- Providing autocomplete/dropdown options in applications
- Database seeding for diary-related features
- API endpoints that need to list available diaries

## Validation

The tool includes JSON schema validation to ensure the generated data conforms to the expected structure and contains only valid diary tier identifiers.
