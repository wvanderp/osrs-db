# WorldMap Tool

Renders a simple world map SVG from collision region data produced by the `CollisionMap` tool.

Output

- `tools/WorldMap/data/worldmap.svg` - generated SVG visualization of regions.

Usage

- Run via the top-level collector which uses `collect/Tool.ts` to run all tools.

Notes

- This is a simple visualization helper. It maps region ids to a grid and paints each region with a color derived from the id.
