const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const app = express();
const port = 3000;
const DATA_FILE = './ListData.json';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client'));

// Utility functions to read/write data
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data:', err);
    return [];
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing data:', err);
  }
}

// Routes

// GET - Retrieve all items
app.get('/items', async (req, res) => {
  const items = await readData();
  res.json(items);
});

// POST - Add a new item
app.post('/items', async (req, res) => {
  const newItem = req.body.item;
  if (!newItem) {
    return res.status(400).json({ error: 'Item is required' });
  }

  const items = await readData();
  items.push(newItem);
  await writeData(items);
  res.status(201).json({ success: true, newItem });
});

// DELETE - Remove an item by ID (index)
app.delete('/items/:id', async (req, res) => {
  const itemId = parseInt(req.params.id);
  const items = await readData();

  if (itemId < 0 || itemId >= items.length) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const removedItem = items.splice(itemId, 1);
  await writeData(items);
  res.json({ success: true, removedItem });
});

// PUT - Update an existing item by ID (index)
app.put('/items/:id', async (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body.item;

  if (!updatedItem) {
    return res.status(400).json({ error: 'Updated item is required' });
  }

  const items = await readData();

  if (itemId < 0 || itemId >= items.length) {
    return res.status(404).json({ error: 'Item not found' });
  }

  items[itemId] = updatedItem;
  await writeData(items);
  res.status(200).json({ success: true, updatedItem });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
