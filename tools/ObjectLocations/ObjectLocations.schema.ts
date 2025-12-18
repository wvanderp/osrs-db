import { z } from "zod";

/**
 * Schema for a single object location entry
 */
export const ObjectLocationSchema = z.object({
    id: z.number().int().optional(),
    name: z.string(),
    type: z.string(),
    x: z.number().int(),
    y: z.number().int(),
    plane: z.number().int(),
    sourceObjectId: z.number().int().nullable().optional(),
});

export type ObjectLocation = z.infer<typeof ObjectLocationSchema>;

/**
 * Schema for object-locations.g.json: an array of object location entries
 */
export const ObjectLocationsSchema = z.array(ObjectLocationSchema);

export type ObjectLocations = z.infer<typeof ObjectLocationsSchema>;

export default ObjectLocationsSchema;
