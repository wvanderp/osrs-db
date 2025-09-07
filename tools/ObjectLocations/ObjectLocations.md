# ObjectLocations

Tool to generate location points (banks, anvils, trees, etc.) from the exported `objects.g.json` file.

This tool reads `tools/Objects/data/objects.g.json` and produces `tools/ObjectLocations/data/object-locations.g.json`.

It is intentionally minimal: it scans objects by name and interaction options to infer common locations (bank, anvil, tree, altar, etc.).

Logs are prefixed with `[ObjectLocations]`.
