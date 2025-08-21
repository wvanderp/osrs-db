# OSRS-db

`A project for collecting machine readable data for OSRS`

## Standing on the shoulders of giants

We can not maintain this database without the solid foundation laid by the following projects:

- [RuneLite](https://runelite.net/): for demystifying the cache and creating the cache exporter
- [OSRSBox](https://www.osrsbox.com/blog/2018/07/26/osrs-cache-research-extract-cache-definitions/): for in turn demystifying the build process of actually compiling RuneLite

- [OSRS Wiki](https://oldschool.runescape.wiki/): for providing the most comprehensive database of items, monsters, and everything else in OSRS
  - And in particular, the lists of [item stats](https://oldschool.runescape.wiki/w/Calculator:Armoury) for the most comprehensive list of item stats in the game

## Monitoring Data Changes

Since our large data files (items.g.json, npcs.g.json, objects.g.json, etc.) are stored in Git LFS, GitHub doesn't show meaningful diffs when they change. To help reviewers understand what changed during data collection:

### LFS Diff Reports

The collect GitHub action automatically generates diff reports for LFS files and uploads them as artifacts. These reports include:

- **File size changes** - Shows how much each data file grew or shrank
- **Summary statistics** - Count of changed, new, and deleted files
- **Sample previews** - For smaller files, shows a preview of the actual changes

### Viewing Diff Reports

After a collect action runs:

1. Go to the **Actions** tab in the GitHub repository
2. Click on the specific collect workflow run
3. Scroll down to the **Artifacts** section
4. Download the `lfs-diff-report` artifact
5. Extract and open either:
   - `lfs-diff-report.md` - Human-readable summary
   - `lfs-diff-report.json` - Machine-readable detailed report

The summary is also displayed in the GitHub Actions step summary for quick viewing.
