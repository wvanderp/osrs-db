# ObjectLocations

Tool to generate location points (banks, anvils, trees, etc.) by joining cache map placements to the exported object definitions.

This tool reads `data/objects.g.json`, the downloaded `cache`, and `keys.json`. It produces `tools/ObjectLocations/data/object-locations.g.json`.

Object types are inferred from their names and actions. Coordinates come from the cache's region location archives.

The collector must run the `Objects` tool first. That tool downloads the cache and XTEA keys when they are not already present.

Logs are prefixed with `[ObjectLocations]`.
