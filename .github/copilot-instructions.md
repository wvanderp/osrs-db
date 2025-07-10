files with a `*.g.*` extensions are generated files and should not be edited directly.

A tool is a set of all code and data required to create the outputs of a given type.
A tool can generate one or more outputs.

You dont have to ask permission to edit files. just do it.

Each rule should have the following files / functions:
- `collect_{tool_name}.sh`: a script to collect and processes all data and generates the output. Configuration is handled by the script itself, but command-line arguments can be supported.
- `{tool_name}.md`: a markdown file with the description of the tool.
- `{tool_name}.linter.ts`: a linter to check the output of the tool. Output format is flexible, but the script must exit with a non-zero status code on failure.
- Multiple `*.schema.json` files: JSON schema files to validate the output of the tool.
- `{tool_name}.changelog.md`: a markdown file to track changes and updates to the tool.
- `data/`: a directory containing the data files used by the tool. This can include JSON files, CSV files, or any other format that the tool uses.