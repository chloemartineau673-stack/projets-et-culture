const MAX_AMOUNT = 10000;

// ─── Fond décoratif ────────────────────────────────────────────────────────

const BG_ICONS = [
  // Livre ouvert
  `<svg viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>`,
  // Avion
  `<svg viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>
  </svg>`,
  // Clap cinéma
  `<svg viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1-.3 2.1.3 2.4 1.3z"/>
    <rect x="2" y="11" width="20" height="11" rx="2"/>
    <line x1="7" y1="11" x2="7" y2="22"/>
    <line x1="12" y1="11" x2="12" y2="22"/>
    <line x1="17" y1="11" x2="17" y2="22"/>
    <line x1="2" y1="16.5" x2="22" y2="16.5"/>
  </svg>`,
  // Globe
  `<svg viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>`,
  // Appareil photo
  `<svg viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>`,
  // Étoile / favoris
  `<svg viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`,
];

function renderBgIcons() {
  const container = document.getElementById('bg-icons');
  if (!container) return;
  const cols = Math.ceil(window.innerWidth / 90) + 1;
  const rows = Math.ceil(window.innerHeight / 90) + 1;
  let html = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const icon = BG_ICONS[(r * cols + c) % BG_ICONS.length];
      const x = c * 90 + (r % 2 === 0 ? 0 : 45);
      const y = r * 90;
      const rot = ((r * 7 + c * 13) % 40) - 20;
      html += `<div style="position:absolute;left:${x}px;top:${y}px;width:40px;height:40px;opacity:0.09;transform:rotate(${rot}deg)">${icon}</div>`;
    }
  }
  container.innerHTML = html;
}

renderBgIcons();
window.addEventListener('resize', renderBgIcons);

// ─── Storage ───────────────────────────────────────────────────────────────

function loadData() {
  return {
    amount: parseFloat(localStorage.getItem('japan_amount') || '0'),
    books:  JSON.parse(localStorage.getItem('books')  || '[]'),
    videos: JSON.parse(localStorage.getItem('videos') || '[]'),
    visits: JSON.parse(localStorage.getItem('visits') || '[]'),
  };
}

function saveAmount(v) { localStorage.setItem('japan_amount', v); }
function saveList(key, list) { localStorage.setItem(key, JSON.stringify(list)); }

// ─── Tabs ──────────────────────────────────────────────────────────────────

function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelector(`.nav-btn[onclick="showTab('${name}')"]`).classList.add('active');

  if (name === 'livres')  renderArchive('books',  'archive-books',  '📚');
  if (name === 'videos')  renderArchive('videos', 'archive-videos', '🎬');
  if (name === 'visites') renderArchive('visits', 'archive-visits', '🏛️');
}

// ─── Japan progress ────────────────────────────────────────────────────────

function updateProgress(amount, animate) {
  const pct = Math.min((amount / MAX_AMOUNT) * 100, 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-percent').textContent = pct.toFixed(1) + '%';
  document.getElementById('amount-display').textContent = amount.toLocaleString('fr-FR') + ' €';

  const flag = document.getElementById('japan-flag');
  if (flag) {
    const clamped = 4 + (pct / 100) * 92;
    flag.style.left = clamped + '%';
  }

  if (animate && pct >= 100) launchFireworks();
}

function launchFireworks() {
  const colors = ['#ff4444','#ff9900','#ffee00','#7c5cbf','#44aaff','#cc44ff','#ff44cc','#fff'];
  const container = document.getElementById('fireworks-container');
  let count = 0;

  function burst() {
    if (count >= 10) return;
    count++;
    const cx = 15 + Math.random() * 70;
    const cy = 10 + Math.random() * 60;
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.className = 'firework';
      const angle = (i / 20) * 2 * Math.PI;
      const dist = 50 + Math.random() * 90;
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `left:${cx}%;top:${cy}%;background:${color};--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;animation-duration:${0.7+Math.random()*0.6}s;`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
    setTimeout(burst, 350);
  }

  burst();
  setTimeout(() => { container.innerHTML = ''; }, 5000);
}

function addAmount() {
  const input = document.getElementById('amount-input');
  const val = parseFloat(input.value);
  if (isNaN(val) || val <= 0) return;
  const data = loadData();
  const newAmount = Math.min(data.amount + val, MAX_AMOUNT);
  saveAmount(newAmount);
  updateProgress(newAmount, true);
  input.value = '';
}

function resetAmount() {
  if (!confirm('Réinitialiser la cagnotte Japon ?')) return;
  saveAmount(0);
  updateProgress(0);
}

// ─── Todo lists ────────────────────────────────────────────────────────────

function renderList(key, listId) {
  const items = loadData()[key].filter(i => !i.done);
  const ul = document.getElementById(listId);
  ul.innerHTML = '';

  if (items.length === 0) {
    ul.innerHTML = '<p class="empty-msg">Aucun élément pour l\'instant</p>';
    return;
  }

  const all = loadData()[key];
  all.forEach((item, index) => {
    if (item.done) return;
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = false;
    checkbox.addEventListener('change', () => completeItem(key, index, listId));

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
  data[key].push({ text, done: false, doneDate: null });
  saveList(key, data[key]);
  renderList(key, listId);
  input.value = '';
}

function completeItem(key, index, listId) {
  const data = loadData();
  data[key][index].done = true;
  data[key][index].doneDate = new Date().toISOString();
  saveList(key, data[key]);
  renderList(key, listId);
}

function deleteItem(key, index, listId) {
  const data = loadData();
  data[key].splice(index, 1);
  saveList(key, data[key]);
  renderList(key, listId);
}

// ─── Archives ──────────────────────────────────────────────────────────────

function renderArchive(key, containerId, emoji) {
  const data = loadData();
  const done = data[key]
    .map((item, idx) => ({ ...item, _idx: idx }))
    .filter(i => i.done);

  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (done.length === 0) {
    container.innerHTML = `
      <div class="empty-archive">
        <p>${emoji}</p>
        <p>Rien dans les archives pour l'instant.<br>Cochez un élément depuis l'accueil pour le voir ici !</p>
      </div>`;
    return;
  }

  // Stats globales
  const years = [...new Set(done.map(i => getYear(i.doneDate)))].sort((a, b) => b - a);
  const statsEl = document.createElement('div');
  statsEl.className = 'stats-global card';
  statsEl.innerHTML = `
    <h3>Statistiques globales</h3>
    <div class="stats-row">
      <div class="stat-box">
        <span class="stat-num">${done.length}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-box">
        <span class="stat-num">${years.length}</span>
        <span class="stat-label">Années</span>
      </div>
      <div class="stat-box">
        <span class="stat-num">${bestYear(done)}</span>
        <span class="stat-label">Meilleure année</span>
      </div>
    </div>`;
  container.appendChild(statsEl);

  // Par année
  years.forEach(year => {
    const items = done.filter(i => getYear(i.doneDate) === year);
    const section = document.createElement('div');
    section.className = 'year-section card';

    const titleRow = document.createElement('div');
    titleRow.className = 'year-title';
    titleRow.innerHTML = `<h3>${year}</h3><span class="year-count">${items.length} élément${items.length > 1 ? 's' : ''}</span>`;
    section.appendChild(titleRow);

    const ul = document.createElement('ul');
    ul.className = 'archive-list';

    items.forEach(item => {
      const li = document.createElement('li');
      const date = item.doneDate ? new Date(item.doneDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '';
      li.innerHTML = `
        <span class="check-icon">✓</span>
        <span class="item-text">${item.text}</span>
        <span class="item-date">${date}</span>`;

      const unarchiveBtn = document.createElement('button');
      unarchiveBtn.className = 'btn-unarchive';
      unarchiveBtn.title = 'Remettre dans la liste';
      unarchiveBtn.textContent = '↩';
      unarchiveBtn.addEventListener('click', () => unarchiveItem(key, item._idx, containerId, emoji));
      li.appendChild(unarchiveBtn);

      ul.appendChild(li);
    });

    section.appendChild(ul);
    container.appendChild(section);
  });
}

function getYear(isoDate) {
  if (!isoDate) return new Date().getFullYear();
  return new Date(isoDate).getFullYear();
}

function bestYear(done) {
  const counts = {};
  done.forEach(i => {
    const y = getYear(i.doneDate);
    counts[y] = (counts[y] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
}

function unarchiveItem(key, index, containerId, emoji) {
  const data = loadData();
  data[key][index].done = false;
  data[key][index].doneDate = null;
  saveList(key, data[key]);

  const listMap = { books: 'book-list', videos: 'video-list', visits: 'visit-list' };
  renderList(key, listMap[key]);
  renderArchive(key, containerId, emoji);
}

// ─── Enter key support ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const map = {
    'amount-input': addAmount,
    'book-input':   () => addItem('books',  'book-input',  'book-list'),
    'video-input':  () => addItem('videos', 'video-input', 'video-list'),
    'visit-input':  () => addItem('visits', 'visit-input', 'visit-list'),
  };
  Object.entries(map).forEach(([id, fn]) => {
    document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') fn(); });
  });
});

// ─── Init ──────────────────────────────────────────────────────────────────

const _init = loadData();
updateProgress(_init.amount);
renderList('books',  'book-list');
renderList('videos', 'video-list');
renderList('visits', 'visit-list');
