import fs from 'fs';
import Tool from '../../collect/Tool';
import { cyan, red, yellow } from '../../common/colors';
import path from 'path';
import lintWithSchema from '../../common/lintWithSchema';

export const Diaries = [
    // Ardougne Diary
    'ARDOUGNE_EASY',
    'ARDOUGNE_MEDIUM',
    'ARDOUGNE_HARD',
    'ARDOUGNE_ELITE',

    // Desert Diary
    'DESERT_EASY',
    'DESERT_MEDIUM',
    'DESERT_HARD',
    'DESERT_ELITE',

    // Falador Diary
    'FALADOR_EASY',
    'FALADOR_MEDIUM',
    'FALADOR_HARD',
    'FALADOR_ELITE',

    // Fremennik Diary
    'FREMENNIK_EASY',
    'FREMENNIK_MEDIUM',
    'FREMENNIK_HARD',
    'FREMENNIK_ELITE',

    // Kandarin Diary
    'KANDARIN_EASY',
    'KANDARIN_MEDIUM',
    'KANDARIN_HARD',
    'KANDARIN_ELITE',

    // Karamja Diary
    'KARAMJA_EASY',
    'KARAMJA_MEDIUM',
    'KARAMJA_HARD',
    'KARAMJA_ELITE',

    // Kourend & Kebos Diary
    'KOUREND_AND_KEBOS_EASY',
    'KOUREND_AND_KEBOS_MEDIUM',
    'KOUREND_AND_KEBOS_HARD',
    'KOUREND_AND_KEBOS_ELITE',

    // Lumbridge & Draynor Diary
    'LUMBRIDGE_AND_DRAYNOR_EASY',
    'LUMBRIDGE_AND_DRAYNOR_MEDIUM',
    'LUMBRIDGE_AND_DRAYNOR_HARD',
    'LUMBRIDGE_AND_DRAYNOR_ELITE',

    // Morytania Diary
    'MORYTANIA_EASY',
    'MORYTANIA_MEDIUM',
    'MORYTANIA_HARD',
    'MORYTANIA_ELITE',

    // Varrock Diary
    'VARROCK_EASY',
    'VARROCK_MEDIUM',
    'VARROCK_HARD',
    'VARROCK_ELITE',

    // Western Provinces Diary
    'WESTERN_PROVINCES_EASY',
    'WESTERN_PROVINCES_MEDIUM',
    'WESTERN_PROVINCES_HARD',
    'WESTERN_PROVINCES_ELITE',

    // Wilderness Diary
    'WILDERNESS_EASY',
    'WILDERNESS_MEDIUM',
    'WILDERNESS_HARD',
    'WILDERNESS_ELITE',
];

const prefix = cyan("[DiariesTool]");
const dataPath = path.join(__dirname, "../../data", "diaries.g.json");

export const DiariesTool: Tool = {
    name: 'Diaries',
    description: 'Tool for generating achievement diary list',
    version: '1.0.0',
    needs: [],
    async run() {
        const outDir = './data';
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(dataPath, JSON.stringify(Diaries, null, 4));
        console.log(prefix, 'Diaries data generated!');
    },
    async lint() {
        console.log(prefix, yellow("Linting data using schema..."));
        const schemaPath = path.join(__dirname, "diaries.schema.json");

        try {
            lintWithSchema(dataPath, schemaPath, { prefix });
        } catch (e) {
            console.error(prefix, red("Diaries schema lint failed"));
            process.exit(1);
        }
    },
};
