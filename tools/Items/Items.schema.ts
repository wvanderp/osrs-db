import { z } from "zod";

const MenuTextSchema = z.object({
    text: z.string(),
}).strict();

const GroundOpsSchema = z.object({
    ops: z.array(MenuTextSchema.nullable()),
    subOps: z.array(z.array(z.unknown()).nullable()),
    conditionalOps: z.array(MenuTextSchema.nullable()),
    conditionalSubOps: z.array(z.array(z.unknown()).nullable()),
}).strict();

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
    tradeable: z.boolean().optional().describe("Whether or not the item is tradeable between players"),
    geTradeable: z.boolean().optional().describe("Whether or not the item is tradeable on the Grand Exchange"),
    bronzeman: z.boolean().optional().describe("The item's Bronzeman cache flag (opcode 251); defaults to false in RuneLite"),
    stackable: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional().describe("Cache stackability mode: 0, 1 (opcode 11), or 2 (opcode 160)"),
    holdingWhitelist: z.array(z.number().int()).optional().describe("Holding whitelist exported by RuneLite (opcode 161)"),
    inventoryModel: z.number().int().optional(),
    wearPos1: z.number().int().optional(),
    wearPos2: z.number().int().optional(),
    wearPos3: z.number().int().optional(),
    members: z.boolean().optional().describe("Whether or not the item is members only"),
    fullRecolor: z.number().int().min(-32768).max(32767).optional().describe("Full-model recolor HSL value (opcode 99), exported as a signed 16-bit integer; -1 means no override"),
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
    groundOps: GroundOpsSchema.optional().describe("Ground interaction options and their conditional variants."),

}).strict();

export type Item = z.infer<typeof ItemSchema>;

/**
 * Schema for items.g.json: an array of item entries
 */
export const ItemsSchema = z.array(ItemSchema);

export type Items = z.infer<typeof ItemsSchema>;

export default ItemsSchema;
