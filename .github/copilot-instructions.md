files with a `*.g.*` extensions are generated files and should not be edited directly.

A tool is a set of all code and data required to create the outputs of a given type.
A tool can generate one or more outputs.

You dont have to ask permission to edit files. just do it.

Each rule should have the following files / functions:

- `{tool_name}Tool.ts`: the main script that implements the tool's functionality. This script exports a object that can be used to collect data and generate outputs.
- `{tool_name}.md`: a markdown file with the description of the tool.
- `{tool_name}.linter.ts`: a linter to check the output of the tool. Output format is flexible, but the script must exit with a non-zero status code on failure.
- Multiple `*.schema.json` files: JSON schema files to validate the output of the tool.
- `{tool_name}.changelog.md`: a markdown file to track changes and updates to the tool.
- `data/`: a directory containing the data files used by the tool. This can include JSON files, CSV files, or any other format that the tool uses.

The tool can add all kinds of files data and configurations as needed to support its functionality.

Make sure to update the `collect/main.ts` file to include the new tool.

---

All tools run in the same environments, these are two sides of the same coin.
You can use the work of previous tools, both explicitly by "needing" them in the tool definition, or by checking if any of the previous tools have already ran some of the steps you need.
You always need to check tough because maybe your tool runs first and then nothing is done.

It also means you need to be respectful of the enviroment do not remove files after you are done. dont break the environment for the next tool. of course you are allowed to create and update files as needed.

---

make sure to add enough logging so that the tool can be debugged easily.
use `[tool_name]` as a prefix for all log messages to make it clear which tool is generating the log message.

---
