import path from 'path';
import Tool from "../../collect/Tool";
import { cyan } from "../../common/colors";
import lintWithZod from '../../common/lintWithZod';
import TransportsSchema from './Transports.schema';

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

    lintWithZod(dataPath, TransportsSchema, { prefix });
  },
};
