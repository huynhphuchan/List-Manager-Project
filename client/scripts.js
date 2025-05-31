// Initialize API client
const api = new HttpClient("http://localhost:5500");

// DOM Elements
const itemInput = document.getElementById("itemInput"); 
const addBtn = document.getElementById("addBtn");
const itemList = document.getElementById("itemList");

// Load items from server and render
async function loadItems() {
  try {
    const items = await api.get("/api");
    renderItems(items);
  } catch (error) {
    console.error("Failed to load items:", error);
    alert("Failed to load items. Check console for details.");
  }
}


function renderItems(items) {
  itemList.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    
    // Item text
    const span = document.createElement("span");
    span.textContent = item.name;
    li.appendChild(span);
    
    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.dataset.index = index;
    li.appendChild(deleteBtn);
    itemList.appendChild(li);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.dataset.index = index;
    li.appendChild(editBtn);
    itemList.appendChild(li);
  });
  
  // Add event listeners for button
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", deleteItem);
  });
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", editItem);
  });
  
}

async function deleteItem(event) {
  const index = event.target.dataset.index;
  try {
    await api.delete(`/api/${index}`);
    await loadItems(); 
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete item. Check console for details.");
  }
}

async function editItem(event) {
    const index = event.target.dataset.index;
    //input
    const newItem = prompt("Enter the new item:");
    if (newItem.trim() === null) return;
    try {
        await api.put(`/api/${index}`, { name: newItem.trim() });
        await loadItems();
    } catch(error) {
    console.error("Edit failed:", error);
    alert("Failed to update item. Check console for details.");
    }
}

// Handle add button click
addBtn.addEventListener("click", async () => {
  const name = itemInput.value.trim();
  if (!name) return;

  try {
    await api.post("/api", { name });
    itemInput.value = "";
    await loadItems();
  } catch (error) {
    console.error("Error saving item:", error);
    alert("Failed to save item. Check console for details.");
  }
});

// Initial load
loadItems();