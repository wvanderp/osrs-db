import { z } from "zod";

/**
 * A coordinate tuple [x, y, plane]
 */
export const CoordinateSchema = z.tuple([
    z.number().int().describe("X coordinate"),
    z.number().int().describe("Y coordinate"),
    z.number().int().describe("Plane coordinate"),
]);

export type Coordinate = z.infer<typeof CoordinateSchema>;

/**
 * Schema for a single transport entry
 */
export const TransportSchema = z.object({
    origin: CoordinateSchema.optional(),
    destination: CoordinateSchema.nullable().optional(),
    menuOption: z.string().optional(),
    menuTarget: z.string().nullable().optional(),
    objectID: z.number().int().nullable().optional(),
    skills: z.array(z.unknown()).nullable().optional(),
    items: z.array(z.unknown()).nullable().optional(),
    quests: z.array(z.unknown()).nullable().optional(),
    duration: z.number().nullable().optional(),
    displayInfo: z.record(z.string(), z.unknown()).nullable().optional(),
}).passthrough(); // Allow additional properties

export type Transport = z.infer<typeof TransportSchema>;

/**
 * Schema for transports data: an array of transport entries
 */
export const TransportsSchema = z.array(TransportSchema);

export type Transports = z.infer<typeof TransportsSchema>;

export default TransportsSchema;
