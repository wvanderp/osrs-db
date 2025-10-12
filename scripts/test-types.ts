#!/usr/bin/env tsx

/**
 * 🧪 Test TypeScript types usage
 * 
 * This is a simple test to verify that the generated types work correctly.
 */

import type { Items } from '../tools/Items/items.schema.js';
import type { NPCs } from '../tools/Npcs/npcs.schema.js';
import type { Quests } from '../tools/Quests/quests.schema.js';
import type { Objects } from '../tools/Objects/objects.schema.js';

import itemsData from '../data/items.g.json';
import npcsData from '../data/npcs.g.json';
import questsData from '../data/quests.g.json';
import objectsData from '../data/objects.g.json';

import { green } from '../common/colors.js';

// Test that types are correctly applied
const items: Items = itemsData as Items;
const npcs: NPCs = npcsData as NPCs;
const quests: Quests = questsData as Quests;
const objects: Objects = objectsData as Objects;

console.log(green('✅ TypeScript types are working correctly!'));
console.log(green(`   Items: ${items.length} items`));
console.log(green(`   NPCs: ${npcs.length} NPCs`));
console.log(green(`   Quests: ${quests.length} quests`));
console.log(green(`   Objects: ${objects.length} objects`));

// Test accessing properties with type safety
if (items.length > 0) {
    const firstItem = items[0];
    console.log(green(`   First item: ${firstItem.name} (ID: ${firstItem.id})`));
}

if (quests.length > 0) {
    const firstQuest = quests[0];
    console.log(green(`   First quest: ${firstQuest.name} (ID: ${firstQuest.id})`));
}
