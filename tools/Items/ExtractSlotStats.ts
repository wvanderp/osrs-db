import axios from 'axios';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';

const itemsFilePath = path.resolve(__dirname, "../../data/items.g.json");
const titleToIDFilePath = path.resolve(__dirname, "./data/titleToID.json");

const items = JSON.parse(fs.readFileSync(itemsFilePath, "utf-8")) as { id: number, name: string, examine: string }[];

const slotPages: [string, string][] = [
    ["https://oldschool.runescape.wiki/w/Ammunition_slot_table", "Ammunition"],
    ["https://oldschool.runescape.wiki/w/Body_slot_table", "Body"],
    ["https://oldschool.runescape.wiki/w/Cape_slot_table", "Cape"],
    ["https://oldschool.runescape.wiki/w/Feet_slot_table", "Feet"],
    ["https://oldschool.runescape.wiki/w/Hands_slot_table", "Hands"],
    ["https://oldschool.runescape.wiki/w/Head_slot_table", "Head"],
    ["https://oldschool.runescape.wiki/w/Legs_slot_table", "Legs"],
    ["https://oldschool.runescape.wiki/w/Neck_slot_table", "Neck"],
    ["https://oldschool.runescape.wiki/w/Ring_slot_table", "Ring"],
    ["https://oldschool.runescape.wiki/w/Shield_slot_table", "Shield"],
    ["https://oldschool.runescape.wiki/w/Two-handed_slot_table", "Two-handed"],
    ["https://oldschool.runescape.wiki/w/Weapon_slot_table", "Weapon"]
];

interface SlotStats {
    id: number | null;

    name: string;
    members: boolean;

    stabAttack: number;
    slashAttack: number;
    crushAttack: number;
    magicAttack: number;
    rangedAttack: number;

    stabDefence: number;
    slashDefence: number;
    crushDefence: number;
    magicDefence: number;
    rangedDefence: number;

    strengthBonus: number;
    rangedStrength: number;
    magicDamage: number;

    prayerBonus: number;
    weight: number;

    speed?: number;

    slot: string;
}

const slotStats: SlotStats[] = [];

// items that should not be found automatically because they find the wrong item
const manualItemsSubstring = [
    "Mining helmet",
    "Alchemist's amulet",
    "Silver necklace",
    "Ring of charos",
    "Ring of the elements",
    "Abyssal lantern#Normal",
    "Saradomin's blessed sword",
    "Trident of the seas"
];
/**
 * 
 * @param name find the id of the item with the given name
 */
function findID(name: string): number | null {
    const titleToID = JSON.parse(fs.readFileSync(titleToIDFilePath, "utf-8")) as Record<string, number | null>;

    const rewrittenName = rewriteName(name);

    // the normal lookup
    const lookupID = items.find((item) => {
        return item.name.toLowerCase() === rewrittenName.toLowerCase();
    })?.id;

    // the lookup the ID with a decorative kit
    const decorativeID = findIDDecorative(rewrittenName);


    // find the id from the titleToID.json
    let idFromTitle = titleToID[name]

    let id = lookupID ?? decorativeID;

    // if the item is in the manualItemsSubstring then remove the id
    if (manualItemsSubstring.some((item) => name.includes(item))) {
        id = null;
    }

    // If the id is already found but stored in the titleToID.json then remove it
    if (id && (idFromTitle !== undefined)) {
        delete titleToID[name];
    }

    // write a null if the id is not found
    if (!id && !idFromTitle) {
        titleToID[name] = null;
    }

    writeTitleToID(titleToID);

    // we needed the actual value before but now we can only use a number
    idFromTitle = typeof idFromTitle === "number" ? idFromTitle : null
    return id ?? decorativeID ?? idFromTitle ?? null;
}

function writeTitleToID(titleToID: Record<string, number | null>) {
    // sort the object by key
    const sorted = Object.keys(titleToID).sort().reduce((acc, key) => {
        acc[key] = titleToID[key];
        return acc;
    }, {} as Record<string, number | null>);

    fs.writeFileSync(titleToIDFilePath, JSON.stringify(sorted, null, 4));
}

/**
 * some of the items have a decorative kit, named after a god or hero
 * 
 * example of the names:
 * - Adamant heraldic helm (Saradomin)
 * - Rune kiteshield (Arrav)
 * - Rune platebody (Guthix)
 * - Adamant kiteshield (HAM)
 * 
 * @param name find the id of the item with the given name
 * @returns the id of the item
 * @returns null if the item is not found
 */
function findIDDecorative(name: string): number | null {
    const eligibleItems = [
        "Adamant heraldic helm",
        "Rune kiteshield",
        "Rune platebody",
        "Adamant kiteshield",
        "Banner",
        "Rune heraldic helm",
        "Steel heraldic helm",
        "Steel kiteshield",
        "Damaged book",
        "Priest gown",

        "Rat pole",
    ].map((name) => name.toLowerCase());

    if (!eligibleItems.some((item) => name.toLowerCase().includes(item))) {
        return null;
    }

    // some items choose the wrong name so we are going to exclude them
    const excludeSubstrings: string[] = [];

    if (excludeSubstrings.some((item) => name.toLowerCase().includes(item))) {
        return null;
    }

    // find name and decoration aka Rune kiteshield (Arrav) -> Rune kiteshield, Arrav
    let [namePart, decoration, hashtag] = name.match(/(.+)(?:(?: \((.*)\))|(?:#(.*)))/)?.slice(1) ?? [];

    decoration = decoration ?? hashtag;

    if (!decoration || !namePart) {
        return null;
    }

    decoration = decoration.replaceAll("_", " ")

    const id = items.find((item) => {
        return item.name.toLowerCase() === namePart.toLowerCase() && item.examine.toLowerCase().includes(decoration.toLowerCase());
    })?.id;

    return id ?? null;
}

/**
 * rewrite from the wiki name to the item name
 * 
 * @param name the wiki name to rewrite
 * @returns the rewritten name
 */
function rewriteName(name: string): string {
    // if it ends with #(p) or #(p+) or #(p++) then remove the #
    name = name.replace(/#(\(p\+?\+?\))/, "$1");
    name = name.replace(/#Poison(\+?\+?)/, " (p$1)");
    name = name.replace("#(kp)", "(kp)");


    // if it ends with #(unp) then remove the #(unp)
    name = name.replace(/#\(unp\)/, "");
    name = name.replace(/#Unpoisoned/, "");

    // if it ends on a number remove the #
    name = name.replace("#Undamaged", "");

    // if it has #Normal then remove the #normal
    name = name.replace("#Normal", "");

    // if it has #locked then replace it with (l)
    name = name.replace("(or)#Locked", "(l)(or)");
    name = name.replace("#Locked", " (l)");

    // if it has #Charged then remove the #Charged
    name = name.replace("#Charged", "");

    // if it has #uncharged then replace it with (uncharged)
    name = name.replace("#Uncharged", " (uncharged)");

    // if it has ##Active then remove it
    name = name.replace("#Active", "");
    name = name.replace("#Activated", "");

    // if it has #Lit then replace it with (lit)
    name = name.replace("#Lit", " (lit)");
    // if it has #Unlit then remove it
    name = name.replace("#Unlit", "");

    // if it has #Broken then replace it with (broken)
    name = name.replace("#Broken", " (broken)");

    // if a cape is trimmed then add (t) to the name
    name = name.replace("#Trimmed", "(t)");
    name = name.replace("#Untrimmed", "");

    // specific item classes

    name = name.replace(/Amulet of glory \(t\)#\(t(\d)\)/, "Amulet of glory (t$1)");
    // (uncharged) is a artifact from some rewrite above, should be "Amulet of glory (t)#Uncharged"
    name = name.replace("Amulet of glory (t) (uncharged)", "Amulet of glory (t)");

    name = name.replace(/Ring of wealth \(i\)#\(i(\d)\)/, "Ring of wealth (i$1)");
    // (uncharged) is a artifact from some rewrite above, should be "Amulet of glory (t)#Uncharged"
    name = name.replace("Ring of wealth (i) (uncharged)", "Ring of wealth (i)");

    // if the name shows the charges with name#1 or name#(1) then transform it to name(1)
    const digitReplaces = [
        ["Games necklace", ""],
        ["Ring of dueling", ""],
        ["Amulet of glory", ""],
        ["Ring of returning", ""],
        ["Ring of wealth", " "],
        ["Slayer ring", " "],
        ["Enchanted lyre", ""],
        ["Abyssal bracelet", ""],
        ["Castle wars bracelet", ""],
        ["Combat bracelet", ""],
        ["Burning amulet", ""],
        ["Digsite pendant", " "],
        ["Necklace of passage", ""],
        ["Skills necklace", ""],
        ["Void seal", ""],
        ["Rod of ivandis", " "],
        ["Black mask", " "],
    ];

    for (const replace of digitReplaces) {
        if (name.includes(replace[0])) {
            name = name.replace(/#\(?(\d+)\)?/, replace[1] + "($1)");
            name = name.replace(" (uncharged)", "");
        }
    }

    // the barrows items have a different naming scheme
    const barrowsBrothers = [
        "Ahrim's", "Dharok's", "Guthan's", "Karil's", "Torag's", "Verac's", "Echo ahrim's"
    ];

    for (const brother of barrowsBrothers) {
        if (name.includes(brother)) {
            name = name.replace(/#(\d+)/, " $1");
        }
    }

    if (name.includes("Abyssal lantern")) {
        name = name.replace(/Abyssal lantern#(.+)/, "Abyssal lantern ($1 logs)");
    }

    if (name.includes("javelin (")) {
        name = name.replace("javelin (", "javelin(");
    }

    // Things that just need a little space beween the name and the ()
    const spaceNeeders = [
        "Abyssal dagger",
        "Bone dagger",
        "Viggora's chainmace"
    ]

    for (const spaceNeeder of spaceNeeders) {
        name = name.replace(`${spaceNeeder}(`, `${spaceNeeder} (`);
    }

    // A special case for pumpkins with emotions
    const emotions = [
        "Angry", "Depressed", "Disgusted", "Evil", "Happy", "Laughing", "Sad", "Shocked", "Silly"
    ];

    for (const emotion of emotions) {
        if (name.includes(emotion)) {
            name = name.replace(`#${emotion}`, ` (${emotion.toLowerCase()})`);
        }
    }

    // Black mask (i)#7 -> Black mask (7)(i)
    // watch out it has been partially rewritten before (Black mask (i) (5))
    name = name.replace(/Black mask \(i\) \((\d+)\)/, "Black mask ($1) (i)");

    // for the greenman mask we need to put the wood type in brackets in lower case
    // so `Greenman mask#Magic` -> `Greenman mask (magic)`
    name = name.replace(/Greenman mask#(\w+)/, "Greenman mask ($1)");
    name = name.replace('Greenman mask (default)', 'Greenman mask');



    return name;
}

export default async function extractSlotStats() {

    for (const [url, slot] of slotPages) {
        console.log(`Extracting slot: ${slot}`);
        const request = await axios.get(url);
        const html = request.data;

        const dom = new JSDOM(html);

        const table = dom.window.document.querySelector(".wikitable.sortable tbody");

        if (!table) {
            throw new Error(`No table found for slot: ${slot}`);
        }


        // Skip the first row as it is the header
        const rows = [...table.children];

        for (let row of rows.slice(1)) {
            const columns = row.children;

            const name = columns[1].querySelector("a")?.textContent?.trim();

            if (!name) {
                throw new Error(`No name found for slot: ${row}`);
            }

            const id = findID(name);


            const members = columns[2].querySelector("img")?.getAttribute("alt") === "Members";

            const stabAttack = parseInt(columns[3].textContent.trim());
            const slashAttack = parseInt(columns[4].textContent.trim());
            const crushAttack = parseInt(columns[5].textContent.trim());
            const magicAttack = parseInt(columns[6].textContent.trim());
            const rangedAttack = parseInt(columns[7].textContent.trim());

            const stabDefence = parseInt(columns[8].textContent.trim());
            const slashDefence = parseInt(columns[9].textContent.trim());
            const crushDefence = parseInt(columns[10].textContent.trim());
            const magicDefence = parseInt(columns[11].textContent.trim());
            const rangedDefence = parseInt(columns[12].textContent.trim());

            const strengthBonus = parseInt(columns[13].textContent.trim());
            const rangedStrength = parseInt(columns[14].textContent.trim());
            const magicDamage = parseInt(columns[15].textContent.trim());

            const prayerBonus = parseInt(columns[16].textContent.trim());
            const weight = parseFloat(columns[17].textContent.trim());

            let speed: number | undefined = undefined;
            if (slot === "Weapon" || slot === "Two-handed") {
                speed = parseFloat(columns[18]?.textContent?.trim());
            }

            slotStats.push({
                id,
                name,
                members,
                stabAttack,
                slashAttack,
                crushAttack,
                magicAttack,
                rangedAttack,
                stabDefence,
                slashDefence,
                crushDefence,
                magicDefence,
                rangedDefence,
                strengthBonus,
                rangedStrength,
                magicDamage,
                prayerBonus,
                weight,
                speed,
                slot
            });
        }
    }

    console.log("Writing slot stats to file");
    fs.writeFileSync("./data/slotStats.g.json", JSON.stringify(slotStats, null, 4));
};
