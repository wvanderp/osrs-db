// Linter for Transports tool data based on JSON Schema
import path from "path";
import lintWithSchema from "../../common/lintWithSchema";

export default function lintTransports() {
    const prefix = "[Transports]";
    const dataPath = path.join(__dirname, "wilderness_obelisks.json");
    const schemaPath = path.join(__dirname, "transports.schema.json");

    try {
        lintWithSchema(dataPath, schemaPath, { prefix });
    } catch (e) {
        process.exit(1);
    }
}