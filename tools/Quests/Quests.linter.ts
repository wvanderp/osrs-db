// Linter for Quests tool output based on JSON Schema
import path from "path";
import lintWithSchema from "../../common/lintWithSchema";
import { cyan, red } from "../../common/colors";

function run() {
    const prefix = cyan("[Quests]");
    const dataPath = path.join(__dirname, "../../data", "quests.g.json");
    const schemaPath = path.join(__dirname, "quests.schema.json");

    try {
        lintWithSchema(dataPath, schemaPath, { prefix });
    } catch (e) {
        console.error(red("Quests schema lint failed"));
        process.exit(1);
    }
}

if (require.main === module) run();

export { };
