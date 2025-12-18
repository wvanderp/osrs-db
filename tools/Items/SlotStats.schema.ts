import { z } from "zod";

/**
 * Equipment slots available in OSRS
 */
export const EquipmentSlotSchema = z.enum([
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
    "Two-handed",
]);

export type EquipmentSlot = z.infer<typeof EquipmentSlotSchema>;

/**
 * Schema for a single slot stats entry
 */
export const SlotStatSchema = z.object({
    id: z.number().int().describe("The item's ID"),
    name: z.string().describe("The item's name"),
    members: z.boolean().describe("Whether the item is members-only"),
    stabAttack: z.number().int().describe("Stab attack bonus"),
    slashAttack: z.number().int().describe("Slash attack bonus"),
    crushAttack: z.number().int().describe("Crush attack bonus"),
    magicAttack: z.number().int().describe("Magic attack bonus"),
    rangedAttack: z.number().int().describe("Ranged attack bonus"),
    stabDefence: z.number().int().describe("Stab defence bonus"),
    slashDefence: z.number().int().describe("Slash defence bonus"),
    crushDefence: z.number().int().describe("Crush defence bonus"),
    magicDefence: z.number().int().describe("Magic defence bonus"),
    rangedDefence: z.number().int().describe("Ranged defence bonus"),
    strengthBonus: z.number().int().describe("Strength bonus"),
    rangedStrength: z.number().int().describe("Ranged strength bonus"),
    magicDamage: z.number().int().describe("Magic damage bonus"),
    prayerBonus: z.number().int().describe("Prayer bonus"),
    weight: z.number().describe("Item weight in kg"),
    speed: z.number().nullable().optional().describe("Attack speed (for weapons)"),
    slot: EquipmentSlotSchema.describe("Equipment slot"),
}).strict();

export type SlotStat = z.infer<typeof SlotStatSchema>;

/**
 * Schema for slotStats.g.json: an array of slot stats entries
 */
export const SlotStatsSchema = z.array(SlotStatSchema);

export type SlotStats = z.infer<typeof SlotStatsSchema>;

export default SlotStatsSchema;
