# Transports Tool

Manages and validates transport interaction data (e.g., wilderness obelisks). Future versions may generate aggregated transport datasets.

- Main: `TransportsTool.ts`
- Linter: `Transports.linter.ts`
- Schema(s): `*.schema.json` (e.g., `transports.schema.json`)
- Intermediate data: files in this folder (final generated data should go to root `data/` with `.g.`)

Notes:

- Be respectful of the environment; do not remove files after generation.
- Add ample logging with the `[Transports]` prefix in scripts.
