Files with a `*.g.*` extension are generated files and should not be edited directly because the generation process will overwrite any changes made.

Any other files that are generated but changes are preserved during the generation process may not carry the `*.g.` extension.

A tool is a set of all code and data required to create the outputs of a given type.
A tool can generate one or more outputs.

You don't have to ask permission to edit files. Just do it.

Each rule should have the following files/functions:

- `{tool_name}Tool.ts`: the main script that implements the tool's functionality. This script exports an object that can be used to collect data and generate outputs. It also contains a `lint` function that can be used to validate the generated output.
- `{tool_name}.md`: a markdown file with the description of the tool.
- Multiple `*.schema.json` files: JSON schema files to validate the output of the tool.
- `{tool_name}.changelog.md`: a markdown file to track changes and updates to the tool.
- `data/`: a directory containing the data files used by the tool. This can include JSON files, CSV files, or any other format that the tool uses. This path is only for data used during generation that should be edited by the developers. any generated data should be place in the root data folder.

- Ensure that generated data is placed in the root `data` folder.

The tool can add all kinds of files, data, and configurations as needed to support its functionality.

Make sure to update the `collect/tool.ts` file to include the new tool.

---

All tools run in the same environments; these are two sides of the same coin.
You can use the work of previous tools, both explicitly by "needing" them in the tool definition, or by checking if any of the previous tools have already run some of the steps you need.
You always need to check thoroughly because your tool may run first, and then nothing is done.

It also means you need to be respectful of the environment, and do not remove files after you are done. Don't break the environment for the next tool. Of course, you are allowed to create and update files as needed.

---

Make sure to add enough logging so that the tool can be debugged easily.
Use `[tool_name]` as a prefix for all log messages to make it clear which tool is generating the log message.
Use colors to indicate the severity of log messages (e.g., red for errors, yellow for warnings).

---

You may use emojis to make the project more visually interesting and engaging. But be careful because this is a serious project, and the use of emojis may lead to whimsical texts.

---

If anything goes wrong while executing scripts, throw early and throw often. The philosophy is that everything should go as intended and if something was not foreseen then the code is wrong.
So don't try to catch errors just let them crash the process.

---

## Changelog entry guidelines

When you change code, data, or tooling, add a short, focused entry describing the change. Follow these rules so changelogs stay useful:

- Where to add the entry
  - For tool-specific changes, edit the tool's `{tool_name}.changelog.md` file in the tool's folder (for example `tools/Items/Items.changelog.md`).
  - For repository-wide changes (release notes, breaking changes that affect many tools, packaging, CI), update the root `CHANGELOG.md`.

- Format and minimum fields
  - Each entry should include: date (YYYY-MM-DD), author (GitHub handle or name), a short category tag and a one-line summary. Optionally add 1-2 lines of extra context.
  - Use these category tags: Added, Changed, Fixed, Deprecated, Removed, Security, Documentation.

- Linking
  - Reference the pull request or issue number (e.g. `(#123)`) in the entry. If relevant, link to external specs or data sources.

- Placement
  - Prefer adding new entries at the top of the changelog under an `Unreleased` or `Next` heading when working on an active branch.
  - When cutting a release, move `Unreleased` entries into a dated section (YYYY-MM-DD) and add a short header line for the release.

- Tone and length
  - Keep each entry concise (one line plus optional short context). Avoid long narratives. The goal is a quick eye-scan of what changed.

- Example entries
  - Tool-specific (in `tools/Items/Items.changelog.md`):

    2025-10-12 — @wvanderp — Added: exportItems script now includes wear requirements data. (#456)
    - Export now includes `wearRequirements.json` in tool data; updates generator to map new schema fields.

  - Root changelog (in `CHANGELOG.md`):

    2025-10-12 — @wvanderp — Changed: update types build to emit separate `.g.json` files for generated data. (#459)

- Small checklist before committing
  - Did you add/update the appropriate `{tool_name}.changelog.md` or `CHANGELOG.md`?
  - Did you include the date, author, category, and PR/issue reference?
  - Is the entry concise and placed under `Unreleased` if not yet released?

Following these simple rules keeps our history searchable and useful for reviewers and release notes.
