// Test importing from the build output with auto-generated exports
import items from './build/items.mjs';
import npcs from './build/npcs.mjs';
import cacheNumber from './build/cache-number.mjs';
import skills from './build/skills.mjs';

console.log('✅ Items imported:', Array.isArray(items) ? `${items.length} items` : typeof items);
console.log('✅ NPCs imported:', Array.isArray(npcs) ? `${npcs.length} npcs` : typeof npcs);
console.log('✅ Cache number imported:', cacheNumber);
console.log('✅ Skills imported:', Array.isArray(skills) ? `${skills.length} skills` : typeof skills);
