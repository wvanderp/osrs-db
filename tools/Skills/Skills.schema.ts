import { z } from "zod";

/**
 * All skills available in Old School RuneScape
 */
export const SkillSchema = z.enum([
    "Agility",
    "Attack",
    "Construction",
    "Cooking",
    "Crafting",
    "Defence",
    "Farming",
    "Firemaking",
    "Fishing",
    "Fletching",
    "Herblore",
    "Hitpoints",
    "Hunter",
    "Magic",
    "Mining",
    "Prayer",
    "Ranged",
    "Runecrafting",
    "Sailing",
    "Slayer",
    "Smithing",
    "Strength",
    "Thieving",
    "Woodcutting",
]);

export type Skill = z.infer<typeof SkillSchema>;

/**
 * Schema for the generated skills.g.json file: an array of skill names
 */
export const SkillsSchema = z.array(SkillSchema);

export type Skills = z.infer<typeof SkillsSchema>;

export default SkillsSchema;
