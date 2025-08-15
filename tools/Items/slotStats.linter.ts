import Ajv from "ajv";
import fs from "fs";
import path from "path";
import { cyan, red, green } from "../../common/colors";

// load the file
const filePath = path.join(__dirname, "../../data/slotStats.g.json");
const file = JSON.parse(fs.readFileSync(filePath, "utf8")) as { [key: string]: number | string | null }[];

// Record<string, number | string | null>
const schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": { "type": ["integer", "null"] },
            "name": { "type": "string" },
            "members": { "type": "boolean" },
            "stabAttack": { "type": "integer" },
            "slashAttack": { "type": "integer" },
            "crushAttack": { "type": "integer" },
            "magicAttack": { "type": "integer" },
            "rangedAttack": { "type": "integer" },
            "stabDefence": { "type": "integer" },
            "slashDefence": { "type": "integer" },
            "crushDefence": { "type": "integer" },
            "magicDefence": { "type": "integer" },
            "rangedDefence": { "type": "integer" },
            "strengthBonus": { "type": "integer" },
            "rangedStrength": { "type": "integer" },
            "magicDamage": { "type": "integer" },
            "prayerBonus": { "type": "integer" },
            "weight": { "type": "number" },
            "speed": { "type": ["number", "null"] },
            "slot": {
                "type": "string",
                "enum": [
                    "Ammunition",
                    "Body",
                    "Cape",
                    "Feet",
                    "Hands",
                    "Head",
                    "Legs",
                    "Neck",
                    "Ring",
                    "Shield",
                    "Weapon",
                    "Two-handed"
                ]
            }
        },
        "required": [
            "id",
            "name",
            "members",
            "stabAttack",
            "slashAttack",
            "crushAttack",
            "magicAttack",
            "rangedAttack",
            "stabDefence",
            "slashDefence",
            "crushDefence",
            "magicDefence",
            "rangedDefence",
            "strengthBonus",
            "rangedStrength",
            "magicDamage",
            "prayerBonus",
            "weight",
            "slot"
        ],
        "additionalProperties": false
    }
}

export default function lintSlotStats() {
    console.log(cyan("Linting slotStats.g.json"));
    // #region schema
    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    const valid = validate(file);

    if (!valid) {
        console.error(cyan("[slotStats.linter]"), red("slotStats schema validation errors:"), validate.errors);
    }
    // #endregion

    // #region no duplicate ids
    const ids = file.map(item => item.id).filter(id => typeof id === "number") as number[];
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicates.length > 0) {
        console.error(cyan("[slotStats.linter]"), red("Duplicate values found:"), duplicates);
    }
    // #endregion


    console.log(cyan("[slotStats.linter]"), green("slotStats.g.json is valid"));
}
