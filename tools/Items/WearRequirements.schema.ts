import { z } from "zod";
import { QuestEnumSchema } from "../Quests/Quests.schema";
import { DiarySchema } from "../Diaries/Diaries.schema";
import { SkillSchema } from '../Skills/Skills.schema';

/**
 * A skill requirement for an item
 */
const skillRequirementSchema = z.object({
    type: z.literal("skill").describe("Skill requirement type"),
    skill: SkillSchema.describe("The skill required"),
    level: z.number().int().min(1).max(99).describe("The required level in the specified skill"),
    note: z.string().optional().describe("An optional note about the requirement"),
}).strict();


/**
 * A quest requirement for an item
 */
const QuestRequirementSchema = z.object({
    type: z.literal("quest").describe("Quest requirement type"),
    quest: QuestEnumSchema.describe("The quest required"),
    note: z.string().optional().describe("An optional note about the requirement"),
}).strict();


/**
 * Game mode options for requirements
 */
const GameModeSchema = z.enum([
    "Raging Echoes League",
    "Grid Master",
]);

/**
 * A game mode requirement for an item
 */
const GameModeRequirementSchema = z.object({
    type: z.literal("gameMode").describe("Game mode requirement type"),
    gameMode: GameModeSchema.describe("The game mode required"),
    note: z.string().optional().describe("An optional note about the requirement"),
}).strict();


/**
 * Required equipment needed when using this item
 */
const EquipmentRequirementSchema = z.object({
    type: z.literal("equipment").describe("Equipment requirement type"),
    equipment: z.array(z.number().int()).describe("Array of equipment item IDs required. When multiple items are listed, any one of them can satisfy the requirement."),
    note: z.string().optional().describe("An optional note about the requirement"),
}).strict();


/**
 * Achievement diary requirement for an item
 */
const DiaryRequirementSchema = z.object({
    type: z.literal("diary").describe("Achievement diary requirement type"),
    diary: DiarySchema.describe("The achievement diary required"),
    note: z.string().optional().describe("An optional note about the requirement"),
}).strict();

/**
 * Ironman mode types
 */
const IronmanModeSchema = z.enum([
    "Ironman",
    "Hardcore Ironman",
    "Ultimate Ironman",
]);

/**
 * A game mode restriction for an item (Ironman modes)
 */
const IronmanRestrictionSchema = z.object({
    type: z.literal("ironman").describe("Ironman mode restriction type"),
    mode: IronmanModeSchema.describe("The type of Ironman mode"),
    note: z.string().optional().describe("An optional note about the restriction"),
}).strict();


// Since we have two types with "gameMode" as the discriminator value, we need a custom approach
export const AnyRequirementSchema = z.union([
    skillRequirementSchema,
    QuestRequirementSchema,
    GameModeRequirementSchema,
    EquipmentRequirementSchema,
    DiaryRequirementSchema,
    IronmanRestrictionSchema,
]);

export type AnyRequirement = z.infer<typeof AnyRequirementSchema>;

/**
 * Schema for a single wear requirements entry
 */
export const WearRequirementSchema = z.object({
    id: z.number()
        .int()
        .min(0)
        .describe("The unique identifier of the item"),
    name: z.string().describe("The name of the item"),
    note: z.string().optional().describe("An optional note about the item's requirements"),
    requirements: z.array(AnyRequirementSchema).describe("Array of requirements for wearing this item"),
}).strict();

export type WearRequirement = z.infer<typeof WearRequirementSchema>;

/**
 * Schema for wearRequirements files
 */
export const WearRequirementsSchema = z.array(WearRequirementSchema);

export type WearRequirements = z.infer<typeof WearRequirementsSchema>;

export default WearRequirementSchema;
