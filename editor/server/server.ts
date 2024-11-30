import express from 'express';
import cors from 'cors';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(cors())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ItemPath = path.join(__dirname, '../../data/items.json');
export type Items = {
  id: number;
  name: string;
  examine: string;
}[];



/**
 * GET /items/:id
 * 
 * Looks up the item with the given ID and returns its details.
 */
app.get('/items/:id', (req, res) => {
  const id = req.params.id;
  const items = JSON.parse(fs.readFileSync(ItemPath, 'utf-8')) as Items;
  const item = items.find((item) => item.id === parseInt(id));

  console.log(`GET /items/${id}`);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

/**
 * GET /itemsNames
 * 
 * Returns a list of all items.
 */
app.get('/itemsNames', (_, res) => {
  console.log('GET /itemsNames');
  const items = JSON.parse(fs.readFileSync(ItemPath, 'utf-8')) as Items;

  const itemsNames = items.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });

  res.json(itemsNames);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
