import { z } from "zod";

/**
 * Schema for a single object entry exported from the cache
 */
export const ObjectSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    examine: z.string().nullable().optional(),
    interactions: z.array(z.string().nullable()).nullable().optional(),
    x: z.number().int().nullable().optional(),
    y: z.number().int().nullable().optional(),
    plane: z.number().int().nullable().optional(),
    type: z.number().int().nullable().optional(),
    width: z.number().int().nullable().optional(),
    length: z.number().int().nullable().optional(),
    impenetrable: z.boolean().nullable().optional(),
    clipType: z.number().int().nullable().optional(),
    offsetX: z.number().int().nullable().optional(),
    offsetY: z.number().int().nullable().optional(),
    offsetHeight: z.number().int().nullable().optional(),
    ambient: z.number().int().nullable().optional(),
    contrast: z.number().int().nullable().optional(),
    params: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type GameObject = z.infer<typeof ObjectSchema>;

/**
 * Schema for objects.g.json: an array of object entries
 */
export const ObjectsSchema = z.array(ObjectSchema);

export type Objects = z.infer<typeof ObjectsSchema>;

export default ObjectsSchema;
