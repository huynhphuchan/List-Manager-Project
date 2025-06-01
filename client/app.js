  document.addEventListener('DOMContentLoaded', () => {
  const itemList = document.getElementById('item-list');
  const addItemForm = document.getElementById('add-item-form');
  const itemInput = document.getElementById('item-input');
  const coreHTTP = new CoreHTTP();

  // Function to refresh the list from server
  async function loadItems() {
    try {
      const items = await coreHTTP.get('/items');
      itemList.innerHTML = '';
      items.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editItem(index, item);

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteItem(index);

        li.appendChild(editBtn);
        li.appendChild(delBtn);

        itemList.appendChild(li);
      });
    } catch (err) {
      alert('Error loading items: ' + err.message);
    }
  }

  // Add new item
  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newItem = itemInput.value.trim();
    if (!newItem) return alert('Please enter an item');
    try {
      await coreHTTP.post('/items', { item: newItem });
      itemInput.value = '';
      loadItems();
    } catch (err) {
      alert('Error adding item: ' + err.message);
    }
  });

  // Delete item
  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await coreHTTP.delete(`/items/${id}`);
      loadItems();
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  }

  // Edit item inline
  function editItem(id, oldValue) {
    const li = itemList.children[id];
    li.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldValue;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.onclick = async () => {
      const updatedValue = input.value.trim();
      if (!updatedValue) return alert('Item cannot be empty');
      try {
        await coreHTTP.put(`/items/${id}`, { item: updatedValue });
        loadItems();
      } catch (err) {
        alert('Error updating item: ' + err.message);
      }
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => loadItems();

    li.appendChild(input);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);
  }

  // Initial load
  loadItems();
});
