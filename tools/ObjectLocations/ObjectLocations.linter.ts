import path from "path";
import lintWithZod from "../../common/lintWithZod";
import { cyan, green } from "../../common/colors";
import ObjectLocationsSchema from "./ObjectLocations.schema";

export default function lintObjectLocations() {
  const prefix = cyan("[ObjectLocations]");
  const filePath = path.join(__dirname, "./data/object-locations.g.json");

  console.log(`${prefix} Linting object-locations.g.json`);
  const valid = lintWithZod(filePath, ObjectLocationsSchema, { prefix });
  if (!valid) {
    throw new Error("Object locations schema lint failed");
  }

  console.log(green(`${prefix} object-locations.g.json is valid`));
}
