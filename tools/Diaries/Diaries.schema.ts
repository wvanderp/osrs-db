import { z } from "zod";

/**
 * All achievement diary tier identifiers
 */
export const DiarySchema = z.enum([
    "ARDOUGNE_EASY",
    "ARDOUGNE_MEDIUM",
    "ARDOUGNE_HARD",
    "ARDOUGNE_ELITE",
    "DESERT_EASY",
    "DESERT_MEDIUM",
    "DESERT_HARD",
    "DESERT_ELITE",
    "FALADOR_EASY",
    "FALADOR_MEDIUM",
    "FALADOR_HARD",
    "FALADOR_ELITE",
    "FREMENNIK_EASY",
    "FREMENNIK_MEDIUM",
    "FREMENNIK_HARD",
    "FREMENNIK_ELITE",
    "KANDARIN_EASY",
    "KANDARIN_MEDIUM",
    "KANDARIN_HARD",
    "KANDARIN_ELITE",
    "KARAMJA_EASY",
    "KARAMJA_MEDIUM",
    "KARAMJA_HARD",
    "KARAMJA_ELITE",
    "KOUREND_AND_KEBOS_EASY",
    "KOUREND_AND_KEBOS_MEDIUM",
    "KOUREND_AND_KEBOS_HARD",
    "KOUREND_AND_KEBOS_ELITE",
    "LUMBRIDGE_AND_DRAYNOR_EASY",
    "LUMBRIDGE_AND_DRAYNOR_MEDIUM",
    "LUMBRIDGE_AND_DRAYNOR_HARD",
    "LUMBRIDGE_AND_DRAYNOR_ELITE",
    "MORYTANIA_EASY",
    "MORYTANIA_MEDIUM",
    "MORYTANIA_HARD",
    "MORYTANIA_ELITE",
    "VARROCK_EASY",
    "VARROCK_MEDIUM",
    "VARROCK_HARD",
    "VARROCK_ELITE",
    "WESTERN_PROVINCES_EASY",
    "WESTERN_PROVINCES_MEDIUM",
    "WESTERN_PROVINCES_HARD",
    "WESTERN_PROVINCES_ELITE",
    "WILDERNESS_EASY",
    "WILDERNESS_MEDIUM",
    "WILDERNESS_HARD",
    "WILDERNESS_ELITE",
]);

export type Diary = z.infer<typeof DiarySchema>;

/**
 * Schema for the generated diaries.g.json file: an array of achievement diary tier names
 */
export const DiariesSchema = z.array(DiarySchema);

export type Diaries = z.infer<typeof DiariesSchema>;

export default DiariesSchema;
