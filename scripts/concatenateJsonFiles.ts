import fs from 'fs';
import path from 'path';
import { stringify } from 'querystring';

const dataDir = path.join(__dirname, '../data');
const itemsDir = path.join(dataDir, './items')
const outputFilePath = path.join(dataDir, 'items.json');

async function concatenateJsonFiles() {
  const files = fs.readdirSync(itemsDir).filter(file => file.endsWith('.json') && file !== 'items.json');
  const allItems: unknown[] = [];

  for (const file of files) {
    const filePath = path.join(itemsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent) as Record<string, string>;
    allItems.push(jsonData);
  }

  // @ts-expect-error
  allItems.sort((a,b) => a.id - b.id)

  fs.writeFileSync(outputFilePath, JSON.stringify(allItems, null, 4));
}

concatenateJsonFiles().then(() => {
  console.log('All JSON files have been concatenated into items.json');
}).catch(err => {
  console.error('Error concatenating JSON files:', err);
});
