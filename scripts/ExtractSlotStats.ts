import axios from 'axios';
import fs from 'fs';
import { JSDOM } from 'jsdom';

const slotPages : [string, string][] = [
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

const slotStats : SlotStats[] = [];

(async () => {

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
            if(slot === "Weapon" || slot === "Two-handed") {
                speed = parseFloat(columns[18]?.textContent?.trim());
            }

            slotStats.push({
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
    fs.writeFileSync("./data/slotStats.json", JSON.stringify(slotStats, null, 4));
})();

