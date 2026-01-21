import { z } from "zod";
import {
  AnyRequirementSchema,
  AnyRequirement,
} from "../../common/Requirements.schema";

// Re-export AnyRequirementSchema and AnyRequirement for backwards compatibility
export { AnyRequirementSchema, AnyRequirement };

/**
 * Schema for a single wear requirements entry
 */
export const WearRequirementSchema = z
  .object({
    id: z.number().int().min(0).describe("The unique identifier of the item"),
    name: z.string().describe("The name of the item"),
    note: z
      .string()
      .optional()
      .describe("An optional note about the item's requirements"),
    requirements: z
      .array(AnyRequirementSchema)
      .describe("Array of requirements for wearing this item"),
  })
  .strict();

export type WearRequirement = z.infer<typeof WearRequirementSchema>;

/**
 * Schema for wearRequirements files
 */
export const WearRequirementsSchema = z.array(WearRequirementSchema);

export type WearRequirements = z.infer<typeof WearRequirementsSchema>;

export default WearRequirementSchema;
