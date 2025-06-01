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

// Utility functions to read/write data asynchronously
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File not found, create empty list
      await writeData([]);
      return [];
    }
    console.error('Error reading data:', err);
    throw err;
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing data:', err);
    throw err;
  }
}

// Routes

// GET - Retrieve all items
app.get('/items', async (req, res) => {
  try {
    const items = await readData();
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Failed to read items' });
  }
});

// POST - Add a new item
app.post('/items', async (req, res) => {
  const newItem = req.body.item;
  if (!newItem || typeof newItem !== 'string' || newItem.trim() === '') {
    return res.status(400).json({ error: 'Valid item is required' });
  }

  try {
    const items = await readData();
    items.push(newItem.trim());
    await writeData(items);
    res.status(201).json({ success: true, newItem });
  } catch {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// DELETE - Remove an item by index
app.delete('/items/:id', async (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  try {
    const items = await readData();
    if (isNaN(itemId) || itemId < 0 || itemId >= items.length) {
      return res.status(404).json({ error: 'Item not found' });
    }
    const removedItem = items.splice(itemId, 1);
    await writeData(items);
    res.json({ success: true, removedItem: removedItem[0] });
  } catch {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// PUT - Update an item by index
app.put('/items/:id', async (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const updatedItem = req.body.item;
  if (!updatedItem || typeof updatedItem !== 'string' || updatedItem.trim() === '') {
    return res.status(400).json({ error: 'Valid updated item is required' });
  }

  try {
    const items = await readData();
    if (isNaN(itemId) || itemId < 0 || itemId >= items.length) {
      return res.status(404).json({ error: 'Item not found' });
    }
    items[itemId] = updatedItem.trim();
    await writeData(items);
    res.json({ success: true, updatedItem });
  } catch {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app; // export for tests if needed
