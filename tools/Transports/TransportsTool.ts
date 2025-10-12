import path from 'path';
import Tool from "../../collect/Tool";
import { cyan } from "../../common/colors";
import lintWithSchema from '../../common/lintWithSchema';

const prefix = cyan("[TransportsTool]");


export const TransportsTool: Tool = {
  name: "Transports",
  description: "Tool for managing and processing transport data.",
  version: "1.0.0",
  needs: [],
  async run() {
    // TODO: Implement transport data processing logic here
    console.log(prefix, "Not implemented");
  },
  async lint() {
    console.log(prefix, "Linting data using schema...");
    const dataPath = path.join(__dirname, "data/wilderness_obelisks.json");
    const schemaPath = path.join(__dirname, "transports.schema.json");

    lintWithSchema(dataPath, schemaPath, { prefix });
  },
};
