---
name: osrs-db-data-lint
description: Run and repair the OSRS-db data linters, including cache schema drift, wiki title-to-ID mappings, and generated slot stats. Use when asked to fix data lint failures in the osrs-db repository.
---

Work from the OSRS-db repository root containing `package.json` and `collect/linters.ts`. Read local instructions and inspect `git status --short` before editing; preserve existing changes.

Run `npm run lint:data`, installing locked dependencies with `npm ci` if needed. Capture the full log outside the repository when output is large. The entry point is `collect/linters.ts`, which calls tool linters registered in `collect/Tool.ts`. Some linters stop the process early, so rerun after fixes to expose later failures. Check diagnostics as well as the exit status: some tool linters only log errors.

Trace failures to their source:

- Zod schemas live in `tools/<Tool>/*.schema.ts`; generated JSON schemas live in root `schemas/`. For new cache fields or enum values, verify their types and encoding against RuneLite's `cache/src/main/java/net/runelite/cache/definitions/` and `loaders/` sources. Preserve strict validation; do not broadly accept unknown fields or null IDs. Regenerate the affected JSON schema using the default Zod export's `toJSONSchema()` and `common/formatJson.ts`. `scripts/generate-schemas.ts` regenerates all schemas and deletes the output directory first, so inspect its scope before using it.
- Item mappings are in `tools/Items/data/titleToID.json`. Nulls are unresolved placeholders; strings deliberately mark beta/history items without usable numeric IDs. Resolve IDs using `data/items.g.json` and the relevant wiki page's ID and version fields. Names may match several cache entries, including minigame, noted, placeholder, charged, and cosmetic variants; do not select an arbitrary first match for an explicit override.
- Title lookups are case insensitive. Consolidate casing-only duplicate keys while preserving their known numeric override, preferably under the current wiki spelling. Conflicting numeric overrides need investigation. Allow duplicate numeric IDs only for specifically verified aliases or contexts, with narrowly scoped keys and an explanation in `titleToID.linter.ts`.
- Generated `.g.json` files must be repaired through their producer. To regenerate item slot stats without running the Java cache exporter or recollecting every dataset, run:
  ```bash
  npx tsx -e 'import extract from "./tools/Items/ExtractSlotStats"; extract()'
  ```
  This fetches all wiki equipment tables, updates the title map, deduplicates IDs, and writes `data/slotStats.g.json`. Inspect new null placeholders after each run. Keep explicit overrides ahead of inferred name lookups. Other producers are wired through each tool's `run()` method; inspect them before running a broader collection.

Wiki raw page content is available at `https://oldschool.runescape.wiki/w/<Title>?action=raw`; match `versionN` to `idN` rather than assuming the first ID is the desired variant. If a client receives 403, try `curl -L` or another available read-only fetch method. Report a real source-access blocker rather than guessing IDs.

After repairs, rerun the full data linter until all diagnostics are resolved and it exits zero. Run `npm run lint` for TypeScript changes. For linter behavior changes, verify invalid schema data and duplicate IDs produce a nonzero exit without a success message, using temporary fixtures without leaving tracked data modified.

Review the diff, including generated data. Large data files use Git LFS, so ordinary `git diff` can show only pointers; compare parsed JSON with the original LFS object when assessing actual content. Use the repository formatter to avoid unrelated JSON churn. Report what changed, checks run, and any unresolved issue. Do not commit, publish, or push unless requested.
