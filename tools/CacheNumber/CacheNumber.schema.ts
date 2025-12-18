import { z } from "zod";

/**
 * Zod schema for the cache-number.json produced by CacheNumberTool
 */
export const CacheNumberSchema = z.object({
    cacheID: z.number().describe("Numeric cache id of the most recent ID"),
}).strict();

export type CacheNumber = z.infer<typeof CacheNumberSchema>;

export default CacheNumberSchema;
