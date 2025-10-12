# Skills Tool

This tool generates a simple list of skill names used across the project and provides a linter placeholder.

- Main: `SkillsTool.ts`
- Output: `data/Skills.json`
- Schema: `skills.schema.json` (simple schema for an array of strings)

Notes:

- The tool currently writes a small JSON file listing all skills. The linter validates the generated file against the schema.
- Add or remove skill names in `SkillsTool.ts` and run the collector to regenerate `data/Skills.json`.
