import fs from 'fs';
import Tool from '../../collect/Tool';
import { cyan, red, yellow } from '../../common/colors';
import path from 'path';
import lintWithSchema from '../../common/lintWithSchema';

export const Skills = [
    // Free to play skills
    'Attack',
    'Cooking',
    'Crafting',
    'Defence',
    'Firemaking',
    'Fishing',
    'Hitpoints',
    'Magic',
    'Mining',
    'Prayer',
    'Ranged',
    'Runecrafting',
    'Smithing',
    'Strength',
    'Woodcutting',

    // Members skills
    'Agility',
    'Construction',
    'Farming',
    'Fletching',
    'Herblore',
    'Hunter',
    'Slayer',
    'Thieving',
];

const prefix = cyan("[SkillsTool]");
const dataPath = path.join(__dirname, "../../data", "skills.g.json");

export const SkillsTool: Tool = {
    name: 'Skills',
    description: 'Tool for generating skill name list',
    version: '1.0.0',
    needs: [],
    async run() {
        const outDir = './data';
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(dataPath, JSON.stringify(Skills, null, 4));
        console.log(prefix, 'Skills data generated!');
    },
    async lint() {
        console.log(prefix, yellow("Linting data using schema..."));
        const schemaPath = path.join(__dirname, "skills.schema.json");

        try {
            lintWithSchema(dataPath, schemaPath, { prefix });
        } catch (e) {
            console.error(prefix, red("Skills schema lint failed"));
            process.exit(1);
        }
    },
};
