import { z } from "zod";
import { QuestEnumSchema } from "../tools/Quests/Quests.schema";
import { DiarySchema } from "../tools/Diaries/Diaries.schema";
import { SkillSchema } from "../tools/Skills/Skills.schema";

/**
 * A skill requirement
 */
export const SkillRequirementSchema = z
  .object({
    type: z.literal("skill").describe("Skill requirement type"),
    skill: SkillSchema.describe("The skill required"),
    level: z
      .number()
      .int()
      .min(1)
      .max(99)
      .describe("The required level in the specified skill"),
    note: z
      .string()
      .optional()
      .describe("An optional note about the requirement"),
  })
  .strict();

export type SkillRequirement = z.infer<typeof SkillRequirementSchema>;

/**
 * A quest requirement
 */
export const QuestRequirementSchema = z
  .object({
    type: z.literal("quest").describe("Quest requirement type"),
    quest: QuestEnumSchema.describe("The quest required"),
    note: z
      .string()
      .optional()
      .describe("An optional note about the requirement"),
  })
  .strict();

export type QuestRequirement = z.infer<typeof QuestRequirementSchema>;

/**
 * Game mode options for requirements
 */
export const GameModeSchema = z.enum(["Raging Echoes League", "Grid Master"]);

export type GameMode = z.infer<typeof GameModeSchema>;

/**
 * A game mode requirement
 */
export const GameModeRequirementSchema = z
  .object({
    type: z.literal("gameMode").describe("Game mode requirement type"),
    gameMode: GameModeSchema.describe("The game mode required"),
    note: z
      .string()
      .optional()
      .describe("An optional note about the requirement"),
  })
  .strict();

export type GameModeRequirement = z.infer<typeof GameModeRequirementSchema>;

/**
 * Required equipment needed when using an item or amenity
 */
export const EquipmentRequirementSchema = z
  .object({
    type: z.literal("equipment").describe("Equipment requirement type"),
    equipment: z
      .array(z.number().int())
      .describe(
        "Array of equipment item IDs required. When multiple items are listed, any one of them can satisfy the requirement.",
      ),
    note: z
      .string()
      .optional()
      .describe("An optional note about the requirement"),
  })
  .strict();

export type EquipmentRequirement = z.infer<typeof EquipmentRequirementSchema>;

/**
 * Achievement diary requirement
 */
export const DiaryRequirementSchema = z
  .object({
    type: z.literal("diary").describe("Achievement diary requirement type"),
    diary: DiarySchema.describe("The achievement diary required"),
    note: z
      .string()
      .optional()
      .describe("An optional note about the requirement"),
  })
  .strict();

export type DiaryRequirement = z.infer<typeof DiaryRequirementSchema>;

/**
 * Ironman mode types
 */
export const IronmanModeSchema = z.enum([
  "Ironman",
  "Hardcore Ironman",
  "Ultimate Ironman",
]);

export type IronmanMode = z.infer<typeof IronmanModeSchema>;

/**
 * A game mode restriction (Ironman modes)
 */
export const IronmanRestrictionSchema = z
  .object({
    type: z.literal("ironman").describe("Ironman mode restriction type"),
    mode: IronmanModeSchema.describe("The type of Ironman mode"),
    note: z
      .string()
      .optional()
      .describe("An optional note about the restriction"),
  })
  .strict();

export type IronmanRestriction = z.infer<typeof IronmanRestrictionSchema>;

/**
 * Union of all possible requirement types.
 * This schema is used across multiple tools (Items, Amenities, etc.)
 * to ensure consistent requirement handling.
 */
export const AnyRequirementSchema = z.union([
  SkillRequirementSchema,
  QuestRequirementSchema,
  GameModeRequirementSchema,
  EquipmentRequirementSchema,
  DiaryRequirementSchema,
  IronmanRestrictionSchema,
]);

export type AnyRequirement = z.infer<typeof AnyRequirementSchema>;

export default AnyRequirementSchema;
