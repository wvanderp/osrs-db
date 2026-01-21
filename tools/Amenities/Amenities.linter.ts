import path from "path";
import lintWithZod from "../../common/lintWithZod";
import { cyan, green, red } from "../../common/colors";
import AmenitiesSchema from "./Amenities.schema";

const prefix = cyan("[Amenities]");

export default function lintAmenities(): void {
  const filePath = path.join(__dirname, "./data/amenities.g.json");

  console.log(prefix, "Linting amenities.g.json");

  const valid = lintWithZod(filePath, AmenitiesSchema, { prefix });

  if (!valid) {
    console.error(prefix, red("Amenities schema lint failed"));
    process.exit(1);
  }

  console.log(prefix, green("amenities.g.json is valid"));
}
