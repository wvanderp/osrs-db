// Linter for Transports tool data based on JSON Schema
import path from "path";
import lintWithSchema from "../../common/lintWithSchema";
import { cyan } from "../../common/colors";

export default function lintTransports() {
    const prefix = cyan("[Transports]");
    const dataPath = path.join(__dirname, "data/wilderness_obelisks.json");
    const schemaPath = path.join(__dirname, "transports.schema.json");

    lintWithSchema(dataPath, schemaPath, { prefix });
}