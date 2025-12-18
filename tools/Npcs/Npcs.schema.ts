import { z } from "zod";

/**
 * Schema for a single NPC entry exported from the cache
 */
export const NpcSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    examine: z.string().nullable().optional(),
    size: z.number().int().nullable().optional(),
    combatLevel: z.number().int().nullable().optional(),
    attackSpeed: z.number().int().nullable().optional(),
    aggressive: z.boolean().nullable().optional(),
    poisonous: z.boolean().nullable().optional(),
    immuneToPoison: z.boolean().nullable().optional(),
    immuneToVenom: z.boolean().nullable().optional(),
    options: z.array(z.string().nullable()).nullable().optional(),
    hitpoints: z.number().int().nullable().optional(),
    attributes: z.record(z.string(), z.unknown()).nullable().optional(),
    animations: z.record(z.string(), z.unknown()).nullable().optional(),
    params: z.record(z.string(), z.unknown()).nullable().optional(),
}).passthrough(); // Allow additional properties

export type Npc = z.infer<typeof NpcSchema>;

/**
 * Schema for npcs.g.json: an array of NPC entries
 */
export const NpcsSchema = z.array(NpcSchema);

export type Npcs = z.infer<typeof NpcsSchema>;

export default NpcsSchema;
