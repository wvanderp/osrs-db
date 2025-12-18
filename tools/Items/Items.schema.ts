import { z } from "zod";

/**
 * Schema for a single item entry from the RuneLite cache extractor
 */
export const ItemSchema = z.object({
    id: z.number().int().describe("The item's ID"),
    name: z.string().describe("The item's name"),
    examine: z.string().optional().describe("The text that appears when you examine the item"),
    resizeX: z.number().int().optional(),
    resizeY: z.number().int().optional(),
    resizeZ: z.number().int().optional(),
    xan2d: z.number().int().optional(),
    yan2d: z.number().int().optional(),
    zan2d: z.number().int().optional(),
    cost: z.number().int().optional(),
    isTradeable: z.boolean().optional().describe("Whether or not the item is tradeable"),
    stackable: z.union([z.literal(0), z.literal(1)]).optional().describe("Whether or not the item is stackable"),
    inventoryModel: z.number().int().optional(),
    wearPos1: z.number().int().optional(),
    wearPos2: z.number().int().optional(),
    wearPos3: z.number().int().optional(),
    members: z.boolean().optional().describe("Whether or not the item is members only"),
    textureFind: z.array(z.number().int()).optional(),
    textureReplace: z.array(z.number().int()).optional(),
    colorFind: z.array(z.number().int()).optional(),
    colorReplace: z.array(z.number().int()).optional(),
    zoom2d: z.number().int().optional(),
    xOffset2d: z.number().int().optional(),
    yOffset2d: z.number().int().optional(),
    ambient: z.number().int().optional(),
    contrast: z.number().int().optional(),
    countCo: z.array(z.number().int()).optional(),
    countObj: z.array(z.number().int()).optional(),
    options: z.array(z.string().nullable()).optional(),
    interfaceOptions: z.array(z.string().nullable()).optional().describe("Options for the item in the interface, such as 'Wear', 'Rub' or 'Drop', etc."),
    subops: z.array(z.array(z.unknown()).nullable()).optional().describe("Sub-options for each of the interface options"),
    maleModel0: z.number().int().optional(),
    maleModel1: z.number().int().optional(),
    maleModel2: z.number().int().optional(),
    maleOffset: z.number().int().optional(),
    maleHeadModel: z.number().int().optional(),
    maleHeadModel2: z.number().int().optional(),
    femaleModel0: z.number().int().optional(),
    femaleModel1: z.number().int().optional(),
    femaleModel2: z.number().int().optional(),
    femaleOffset: z.number().int().optional(),
    femaleHeadModel: z.number().int().optional(),
    femaleHeadModel2: z.number().int().optional(),
    category: z.number().int().optional(),
    notedID: z.number().int().optional(),
    notedTemplate: z.number().int().optional(),
    team: z.number().int().optional(),
    weight: z.number().int().optional(),
    shiftClickDropIndex: z.number().int().optional(),
    boughtId: z.number().int().optional(),
    boughtTemplateId: z.number().int().optional(),
    placeholderId: z.number().int().optional(),
    placeholderTemplateId: z.number().int().optional(),
    params: z.record(z.string(), z.union([z.string(), z.number().int()])).optional(),
}).strict();

export type Item = z.infer<typeof ItemSchema>;

/**
 * Schema for items.g.json: an array of item entries
 */
export const ItemsSchema = z.array(ItemSchema);

export type Items = z.infer<typeof ItemsSchema>;

export default ItemsSchema;
