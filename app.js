const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.enableClosingConfirmation(); }

const app = document.getElementById('app');

const SCENARIOS = [
  { id: 'ttk',       icon: '📝', title: 'Составить ТТК' },
  { id: 'reverse',   icon: '📷', title: 'Реверс блюда по фото' },
  { id: 'new_menu',  icon: '🍽', title: 'Разработать меню / блюдо' },
  { id: 'food_cost', icon: '💰', title: 'Снизить food cost' },
  { id: 'invoice',   icon: '📄', title: 'OCR накладной' },
  { id: 'abc',       icon: '📊', title: 'ABC-анализ Excel' },
];

function send(payload) {
  if (tg) {
    tg.sendData(JSON.stringify(payload));
    tg.close();
  } else {
    console.log('would send', payload);
    alert('Вне Telegram. Пейлоад: ' + JSON.stringify(payload));
  }
}

function renderHome() {
  app.innerHTML = `
    <div class="header">
      <div class="logo">🍳</div>
      <div>
        <h1>РестОС</h1>
        <div class="sub">ИИ-помощник для ресторана</div>
      </div>
    </div>

    <div class="plan-card">
      <div class="label">Демо-тариф · 0 ₽</div>
      <div class="value">0 из 10 запросов</div>
      <div class="progress"><div style="width:0%"></div></div>
      <div class="meta">Лимит сбросится в начале следующего месяца</div>
    </div>

    <div class="section-title">Меню</div>
    <div class="grid" id="menu-grid"></div>

    <div class="section-title">Свободный диалог</div>
    <div class="card wide chat" data-id="chat">
      <div class="icon">💬</div>
      <div class="title">Задать свой вопрос<span>любая задача по кухне</span></div>
    </div>

    <div class="support">Техническая поддержка — @restos_support</div>
  `;
  const grid = document.getElementById('menu-grid');
  SCENARIOS.forEach(s => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.id = s.id;
    el.innerHTML = `<div class="icon">${s.icon}</div><div class="title">${s.title}</div>`;
    el.addEventListener('click', () => openScenario(s.id));
    grid.appendChild(el);
  });
  document.querySelector('.card.chat').addEventListener('click', () => openScenario('chat'));
}

function openScenario(id) {
  const routes = {
    ttk: renderTTK,
    reverse: renderSimple('📷 Реверс блюда по фото', 'Сценарий открывается в чате. Нажми «Открыть», пришли фото.', 'reverse'),
    new_menu: renderSimple('🍽 Разработать меню / блюдо', 'Запустим анкету из 14 вопросов в чате.', 'new_menu'),
    food_cost: renderSimple('💰 Снижение food cost', 'Пришли калькуляционную карту (фото/текст) и цель.', 'food_cost'),
    invoice: renderStub('📄 OCR накладной', 'В разработке'),
    abc: renderStub('📊 ABC-анализ Excel', 'В разработке'),
    chat: renderSimple('💬 Свободный диалог', 'Открываем чат — задавай любой вопрос.', 'chat'),
  };
  (routes[id] || renderHome)();
}

function renderTTK() {
  app.innerHTML = `
    <div class="screen">
      <button class="back" onclick="renderHome()">← Назад</button>
      <h2>Составить ТТК</h2>
      <div class="desc">Технико-технологическая карта блюда. Заполни, отправлю в бота — он выдаст готовый документ.</div>

      <div class="field">
        <label>Название блюда</label>
        <input id="ttk-name" placeholder="Например: Паста карбонара">
      </div>
      <div class="field">
        <label>Ингредиенты с нетто в граммах (по строке на ингредиент)</label>
        <textarea id="ttk-ingredients" placeholder="Спагетти — 100 г&#10;Бекон — 40 г&#10;Яйцо — 1 шт (50 г)&#10;Сыр пармезан — 20 г"></textarea>
      </div>
      <div class="field">
        <label>Общий выход готового блюда, г</label>
        <input id="ttk-yield" type="number" placeholder="250">
      </div>
      <div class="field">
        <label>Краткое описание технологического процесса</label>
        <textarea id="ttk-process" placeholder="Отварить пасту al dente, обжарить бекон, смешать с яйцом и сыром..."></textarea>
      </div>
    </div>
  `;
  setupMainButton('Собрать ТТК', () => {
    const payload = {
      scenario: 'ttk',
      data: {
        name: document.getElementById('ttk-name').value,
        ingredients: document.getElementById('ttk-ingredients').value,
        yield: document.getElementById('ttk-yield').value,
        process: document.getElementById('ttk-process').value,
      }
    };
    if (!payload.data.name || !payload.data.ingredients) {
      tg?.showAlert('Заполни как минимум название и ингредиенты');
      return;
    }
    send(payload);
  });
}

function renderSimple(title, desc, scenarioId) {
  return () => {
    app.innerHTML = `
      <div class="screen">
        <button class="back" onclick="renderHome()">← Назад</button>
        <h2>${title}</h2>
        <div class="desc">${desc}</div>
      </div>
    `;
    setupMainButton('Открыть в чате', () => send({ scenario: scenarioId, data: {} }));
  };
}

function renderStub(title, desc) {
  return () => {
    app.innerHTML = `
      <div class="screen">
        <button class="back" onclick="renderHome()">← Назад</button>
        <h2>${title}</h2>
        <div class="desc">${desc}. Скоро появится — сейчас можно воспользоваться «Свободным диалогом».</div>
      </div>
    `;
    hideMainButton();
  };
}

function setupMainButton(text, onClick) {
  if (!tg) return;
  tg.MainButton.setText(text);
  tg.MainButton.show();
  tg.MainButton.offClick();
  tg.MainButton.onClick(onClick);
}
function hideMainButton() { tg?.MainButton.hide(); }

window.renderHome = renderHome;
renderHome();
