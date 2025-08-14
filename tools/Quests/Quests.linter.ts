// Linter for Quests tool output based on JSON Schema
import path from "path";
import lintWithSchema from "../../common/lintWithSchema";

function run() {
    const prefix = "[Quests]";
    const dataPath = path.join(__dirname, "data", "quests.g.json");
    const schemaPath = path.join(__dirname, "quests.schema.json");

    try {
        lintWithSchema(dataPath, schemaPath, { prefix });
    } catch (e) {
        process.exit(1);
    }
}

if (require.main === module) run();

export { };
