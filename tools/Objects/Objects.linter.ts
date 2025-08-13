// Linter for Objects tool output based on JSON Schema
import path from "path";
import lintWithSchema from "../../common/lintWithSchema";

function run() {
    const prefix = "[Objects]";
    const dataPath = path.join(__dirname, "data", "objects.g.json");
    const schemaPath = path.join(__dirname, "objects.schema.json");

    try {
        lintWithSchema(dataPath, schemaPath, { prefix });
    } catch (e) {
        process.exit(1);
    }
}

if (require.main === module) run();

export { };
