# Quests Tool

Exports the list of quests by parsing RuneLite's `Quest.java` enum from the upstream repository.

- Source: <https://github.com/runelite/runelite/blob/master/runelite-api/src/main/java/net/runelite/api/Quest.java>
- Output: `tools/Quests/data/quests.g.json`
- Schema: `tools/Quests/quests.schema.json`

## Fields

- id: integer quest id used by RuneLite scripts
- enum: enum constant name (e.g., `DRAGON_SLAYER_I`)
- name: human-readable display name

## Notes

- The tool fetches the raw Java file at build time; network connectivity is required.
- Results are sorted by `id` for stable diffs.
