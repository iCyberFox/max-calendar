const LS_KEY = 'mixes_v2';
const readAll = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const writeAll = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

const form = document.getElementById('mixForm');
const listEl = document.getElementById('list');
const emptyEl = document.getElementById('empty');
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photoPreview');
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');

// Форматування дати у формат дд‑мм‑рік
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

// прев’ю фото у формі
photoInput.addEventListener('change', () => {
  photoPreview.innerHTML = '';
  const file = photoInput.files && photoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.createElement('img');
    img.src = e.target.result;
    photoPreview.appendChild(img);
  };
  reader.readAsDataURL(file);
});

// додавання нового замісу
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const startDate = document.getElementById('startDate').value;
  const dueDate = document.getElementById('dueDate').value;
  const notes = document.getElementById('notes').value.trim();

  if (!title || !startDate || !dueDate) {
    alert('Будь ласка, заповніть назву, дату старту і дату готовності.');
    return;
  }

  let photoData = null;
  const file = photoInput.files && photoInput.files[0];
  if (file) {
    photoData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.readAsDataURL(file);
    });
  }

  const mix = {
    id: 'mix-' + Date.now(),
    title,
    startDate,
    dueDate,
    notes,
    photo: photoData,
    createdAt: new Date().toISOString()
  };

  const mixes = readAll();
  mixes.push(mix);
  writeAll(mixes);

  renderList();
  form.reset();
  photoPreview.innerHTML = '';
});

// рендер списку
function renderList() {
  const mixes = readAll();
  listEl.innerHTML = '';
  emptyEl.style.display = mixes.length ? 'none' : 'block';

  mixes.forEach((mix, i) => {
    const card = document.createElement('div');
    card.className = 'mix-card';

    const top = document.createElement('div');
    top.className = 'mix-top';

    const title = document.createElement('div');
    title.className = 'mix-title';
    title.textContent = mix.title;

    const meta = document.createElement('div');
    meta.className = 'mix-meta';
    meta.textContent = `Старт: ${formatDate(mix.startDate)} → Готовність: ${formatDate(mix.dueDate)}`;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.textContent = '▶ Показати';

    const details = document.createElement('div');
    details.className = 'mix-details';
    details.innerHTML = `
      ${mix.notes ? `<div>${escapeHTML(mix.notes)}</div>` : '<div class="muted">Нотаток немає</div>'}
      ${mix.photo ? `<img src="${mix.photo}" alt="Фото рецепту" class="recipe-img">` : ''}
    `;

    toggleBtn.addEventListener('click', () => {
      const isOpen = details.style.display === 'block';
      details.style.display = isOpen ? 'none' : 'block';
      toggleBtn.textContent = isOpen ? '▶ Показати' : '▼ Сховати';
    });

    // Клік по фото — показ у повний розмір
    details.addEventListener('click', (ev) => {
      const img = ev.target.closest('.recipe-img');
      if (!img) return;
      modalImg.src = img.src;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    });

    const actions = document.createElement('div');
    actions.className = 'actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn';
    deleteBtn.textContent = 'Видалити';
    deleteBtn.addEventListener('click', () => {
      const arr = readAll();
      arr.splice(i, 1);
      writeAll(arr);
      renderList();
    });

    actions.appendChild(deleteBtn);

    top.appendChild(title);
    top.appendChild(meta);
    top.appendChild(toggleBtn);
    card.appendChild(top);
    card.appendChild(details);
    card.appendChild(actions);
    listEl.appendChild(card);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[m]));
}

// Закриття модалки по кліку на фон
modal.addEventListener('click', () => {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modalImg.src = '';
});

// стартовий рендер
renderList();

// реєстрація SW
// app.js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("Service Worker зареєстровано"))
    .catch((err) => console.error("SW помилка:", err));
}