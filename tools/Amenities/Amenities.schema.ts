import { z } from "zod";
import {
  AnyRequirementSchema,
  AnyRequirement,
} from "../../common/Requirements.schema";

// Re-export for convenience
export { AnyRequirementSchema, AnyRequirement };

/**
 * @deprecated Use AnyRequirement from common/Requirements.schema.ts instead
 */
export type AmenityRequirement = AnyRequirement;

/**
 * Schema for a single amenity entry
 */
export const AmenitySchema = z.object({
  /** The original object ID from objects.g.json */
  objectId: z.number().int(),
  /** The name of the object */
  name: z.string(),
  /** The type/category of amenity (bank, altar, furnace, etc.) */
  type: z.string(),
  /** The actions available on this object */
  actions: z.array(z.string().nullable()),
  /** Array of requirements to use this amenity */
  requirements: z.array(AnyRequirementSchema),
});

export type Amenity = z.infer<typeof AmenitySchema>;

/**
 * Schema for amenities.g.json: an array of amenity entries
 */
export const AmenitiesSchema = z.array(AmenitySchema);

export type Amenities = z.infer<typeof AmenitiesSchema>;

export default AmenitiesSchema;
