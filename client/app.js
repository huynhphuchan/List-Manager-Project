const http = new CoreHTTP();
const itemList = document.getElementById('itemList');
const addForm = document.getElementById('addForm');
const itemInput = document.getElementById('itemInput');
const message = document.getElementById('message');

let items = [];

function showMessage(msg, isError = true) {
  message.textContent = msg;
  message.style.color = isError ? 'red' : 'green';
  if (msg) setTimeout(() => { message.textContent = ''; }, 3000);
}

function renderList() {
  itemList.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = item;
    span.contentEditable = false;
    span.classList.add('item-text');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit');
    editBtn.addEventListener('click', () => toggleEdit(li, index));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', () => deleteItem(index));

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    itemList.appendChild(li);
  });
}

function toggleEdit(li, index) {
  const span = li.querySelector('.item-text');
  const editBtn = li.querySelector('.edit');

  if (span.isContentEditable) {
    // Save edit
    const updatedText = span.textContent.trim();
    if (!updatedText) {
      showMessage('Item cannot be empty');
      return;
    }
    http.put(`/items/${index}`, { item: updatedText })
      .then(() => {
        items[index] = updatedText;
        span.contentEditable = false;
        editBtn.textContent = 'Edit';
        showMessage('Item updated', false);
      })
      .catch(() => showMessage('Failed to update item'));
  } else {
    // Enable edit
    span.contentEditable = true;
    span.focus();
    editBtn.textContent = 'Save';
  }
}

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value.trim();
  if (!newItem) {
    showMessage('Please enter an item');
    return;
  }
  http.post('/items', { item: newItem })
    .then(() => {
      items.push(newItem);
      renderList();
      addForm.reset();
      showMessage('Item added', false);
    })
    .catch(() => showMessage('Failed to add item'));
}

function deleteItem(index) {
  http.delete(`/items/${index}`)
    .then(() => {
      items.splice(index, 1);
      renderList();
      showMessage('Item deleted', false);
    })
    .catch(() => showMessage('Failed to delete item'));
}

function loadItems() {
  http.get('/items')
    .then(data => {
      items = data;
      renderList();
    })
    .catch(() => showMessage('Failed to load items'));
}

addForm.addEventListener('submit', addItem);

loadItems();
