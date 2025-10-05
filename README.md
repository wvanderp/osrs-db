# OSRS-db

`A project for collecting machine readable data for OSRS`

## Installation

```bash
npm install osrs-db
```

## Usage

This package provides machine-readable JSON data for Old School RuneScape. You can import the data files directly in your JavaScript/TypeScript projects:

```javascript
// Import specific data files using the file names from the data directory
import items from 'osrs-db/items.g.json';
import npcs from 'osrs-db/npcs.g.json';
import objects from 'osrs-db/objects.g.json';
import quests from 'osrs-db/quests.g.json';
import slotStats from 'osrs-db/slotStats.g.json';
import cacheNumber from 'osrs-db/cache-number.json';

// Now you can use the data
console.log(`Items count: ${items.length}`);
console.log(`Current cache ID: ${cacheNumber.cacheID}`);
```

### Available Data Files

All files in the `data/` directory can be imported using the pattern `osrs-db/[filename]`:

- `osrs-db/items.g.json` - All items data
- `osrs-db/npcs.g.json` - All NPCs data
- `osrs-db/objects.g.json` - All game objects data
- `osrs-db/quests.g.json` - All quests data
- `osrs-db/slotStats.g.json` - Item slot statistics
- `osrs-db/cache-number.json` - Current cache version information

## Versioning

This package uses a semantic versioning scheme: `1.X.cacheNumber`

- `1` - Major version (API compatibility)
- `X` - Code version (incremented for feature changes)
- `cacheNumber` - The OSRS cache version number (e.g., 2317)

The package is automatically updated when new cache data is available.

## Standing on the shoulders of giants

We can not maintain this database without the solid foundation laid by the following projects:

- [RuneLite](https://runelite.net/): for demystifying the cache and creating the cache exporter
- [OSRSBox](https://www.osrsbox.com/blog/2018/07/26/osrs-cache-research-extract-cache-definitions/): for in turn demystifying the build process of actually compiling RuneLite

- [OSRS Wiki](https://oldschool.runescape.wiki/): for providing the most comprehensive database of items, monsters, and everything else in OSRS
  - And in particular, the lists of [item stats](https://oldschool.runescape.wiki/w/Calculator:Armoury) for the most comprehensive list of item stats in the game

