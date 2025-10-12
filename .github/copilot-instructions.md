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
