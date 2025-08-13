// Linter for Npcs tool output based on JSON Schema
import path from "path";
import lintWithSchema from "../../common/lintWithSchema";

function run() {
    const prefix = "[Npcs]";
    const dataPath = path.join(__dirname, "data", "npcs.g.json");
    const schemaPath = path.join(__dirname, "npcs.schema.json");

    try {
        lintWithSchema(dataPath, schemaPath, { prefix });
    } catch (e) {
        // lintWithSchema prints all errors already, just exit non-zero here
        process.exit(1);
    }
}

if (require.main === module) run();

export { };
