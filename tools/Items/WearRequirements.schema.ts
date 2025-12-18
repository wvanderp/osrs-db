import { z } from "zod";
import { QuestEnumSchema } from "../Quests/Quests.schema";
import { DiarySchema } from "../Diaries/Diaries.schema";
import { SkillSchema } from '../Skills/Skills.schema';

/**
 * A level requirement for an item
 */
const LevelRequirementSchema = z.object({
    type: z.literal("level").describe("Level requirement type"),
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

type GameMode = z.infer<typeof GameModeSchema>;

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
const GameModeRestrictionSchema = z.object({
    type: z.literal("gameMode").describe("Game mode restriction type"),
    mode: IronmanModeSchema.describe("The game mode restricted"),
    note: z.string().optional().describe("An optional note about the restriction"),
}).strict();

/**
 * All possible requirement types
 */
export const RequirementSchema = z.discriminatedUnion("type", [
    LevelRequirementSchema,
    QuestRequirementSchema,
    GameModeRequirementSchema,
    EquipmentRequirementSchema,
    DiaryRequirementSchema,
    // Note: GameModeRestrictionSchema uses the same "type": "gameMode" as GameModeRequirementSchema
    // which means we can't use discriminated union for it. Using union instead.
]);

// Since we have two types with "gameMode" as the discriminator value, we need a custom approach
export const AnyRequirementSchema = z.union([
    LevelRequirementSchema,
    QuestRequirementSchema,
    GameModeRequirementSchema,
    EquipmentRequirementSchema,
    DiaryRequirementSchema,
    GameModeRestrictionSchema,
]);

export type AnyRequirement = z.infer<typeof AnyRequirementSchema>;

/**
 * Schema for a single wear requirements entry
 */
export const WearRequirementSchema = z.object({
    id: z.number().int().describe("The unique identifier of the item"),
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
