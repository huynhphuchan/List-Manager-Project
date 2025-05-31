const express = require("express");
const fs = require("fs/promises");
const app = express();
const data_file = "ListData.json";


app.use(express.static("./Client"));
app.use(express.json());

// Initialize empty array if file doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(data_file);
  } catch {
    await fs.writeFile(data_file, "[]");
  }
}


app.get("/api", async (req, res) => {
  await initializeDataFile();
  try {
    const data = await fs.readFile(data_file, "utf-8");
    res.status(200).json(JSON.parse(data));
  } catch (err) {
    console.error("Failed to read or parse file:", err);
    res.status(500).send("Error reading data");
  }
});


app.post("/api", async (req, res) => {
  await initializeDataFile();
  try {
    const data = await fs.readFile(data_file, "utf-8");
    const items = JSON.parse(data);
    
    items.push(req.body);
    await fs.writeFile(data_file, JSON.stringify(items, null, 2));
    res.status(200).send("Item added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});


app.delete("/api/:index", async (req, res) => {
  await initializeDataFile();
  try { 
    const index = Number(req.params.index);
    const data = await fs.readFile(data_file, "utf-8");
    const items = JSON.parse(data);
    items.splice(index, 1);
    await fs.writeFile(data_file, JSON.stringify(items, null, 2));
    res.status(200).send("Item deleted")
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Error deleting item" });
  }
});

app.put("/api/:index", async (req, res) => {
    const index = Number(req.params.index);
    await initializeDataFile();
    try {
        const data = await fs.readFile(data_file, "utf-8");
        const items = JSON.parse(data);
        items[index].name = req.body.name.trim();
        await fs.writeFile(data_file, JSON.stringify(items, null, 2));
        res.status(200).send("Item updated")
    } catch(err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Error updating item" });
    }
});

// Start on port 5500
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});