import path from "path";
import lintWithSchema from "../../common/lintWithSchema";
import { cyan, green } from "../../common/colors";

export default function lintObjectLocations() {
  const prefix = cyan("[ObjectLocations]");
  const filePath = path.join(__dirname, "./data/object-locations.g.json");
  const schemaPath = path.join(__dirname, "object-locations.schema.json");

  console.log(`${prefix} Linting object-locations.g.json`);
  lintWithSchema(filePath, schemaPath, { prefix });

  console.log(green(`${prefix} object-locations.g.json is valid`));
}
