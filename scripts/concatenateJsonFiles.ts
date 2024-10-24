import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../data/items');
const outputFilePath = path.join(dataDir, 'items.json');

async function concatenateJsonFiles() {
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json') && file !== 'items.json');
  const allItems: unknown[] = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    allItems.push(...jsonData);
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(allItems, null, 4));
}

concatenateJsonFiles().then(() => {
  console.log('All JSON files have been concatenated into items.json');
}).catch(err => {
  console.error('Error concatenating JSON files:', err);
});
