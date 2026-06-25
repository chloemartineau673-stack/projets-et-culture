const MAX_AMOUNT = 10000;

function loadData() {
  return {
    amount: parseFloat(localStorage.getItem('japan_amount') || '0'),
    books: JSON.parse(localStorage.getItem('books') || '[]'),
    videos: JSON.parse(localStorage.getItem('videos') || '[]'),
    visits: JSON.parse(localStorage.getItem('visits') || '[]'),
  };
}

function saveAmount(amount) {
  localStorage.setItem('japan_amount', amount);
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function updateProgress(amount) {
  const pct = Math.min((amount / MAX_AMOUNT) * 100, 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-percent').textContent = pct.toFixed(1) + '%';
  document.getElementById('amount-display').textContent = amount.toLocaleString('fr-FR') + ' €';
}

function addAmount() {
  const input = document.getElementById('amount-input');
  const val = parseFloat(input.value);
  if (isNaN(val) || val <= 0) return;
  const data = loadData();
  const newAmount = Math.min(data.amount + val, MAX_AMOUNT);
  saveAmount(newAmount);
  updateProgress(newAmount);
  input.value = '';
}

function resetAmount() {
  if (!confirm('Réinitialiser la cagnotte Japon ?')) return;
  saveAmount(0);
  updateProgress(0);
}

function renderList(key, listId) {
  const data = loadData();
  const items = data[key];
  const ul = document.getElementById(listId);
  ul.innerHTML = '';

  if (items.length === 0) {
    ul.innerHTML = '<p class="empty-msg">Aucun élément pour l\'instant</p>';
    return;
  }

  items.forEach((item, index) => {
    const li = document.createElement('li');
    if (item.done) li.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.done;
    checkbox.addEventListener('change', () => toggleItem(key, index, listId));

    const span = document.createElement('span');
    span.className = 'item-text';
    span.textContent = item.text;

    const del = document.createElement('button');
    del.className = 'btn-delete';
    del.textContent = '✕';
    del.addEventListener('click', () => deleteItem(key, index, listId));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    ul.appendChild(li);
  });
}

function addItem(key, inputId, listId) {
  const input = document.getElementById(inputId);
  const text = input.value.trim();
  if (!text) return;

  const data = loadData();
  data[key].push({ text, done: false });
  saveList(key, data[key]);
  renderList(key, listId);
  input.value = '';
}

function toggleItem(key, index, listId) {
  const data = loadData();
  data[key][index].done = !data[key][index].done;
  saveList(key, data[key]);
  renderList(key, listId);
}

function deleteItem(key, index, listId) {
  const data = loadData();
  data[key].splice(index, 1);
  saveList(key, data[key]);
  renderList(key, listId);
}

// Allow pressing Enter to add items
['book-input', 'video-input', 'visit-input', 'amount-input'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (id === 'amount-input') addAmount();
    else if (id === 'book-input') addItem('books', 'book-input', 'book-list');
    else if (id === 'video-input') addItem('videos', 'video-input', 'video-list');
    else if (id === 'visit-input') addItem('visits', 'visit-input', 'visit-list');
  });
});

// Init
const data = loadData();
updateProgress(data.amount);
renderList('books', 'book-list');
renderList('videos', 'video-list');
renderList('visits', 'visit-list');
