const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();
  tg.disableVerticalSwipes?.();
  try { tg.setHeaderColor('#121418'); tg.setBackgroundColor('#121418'); } catch {}
}

const haptic = {
  tap:    () => tg?.HapticFeedback?.impactOccurred?.('light'),
  medium: () => tg?.HapticFeedback?.impactOccurred?.('medium'),
  heavy:  () => tg?.HapticFeedback?.impactOccurred?.('heavy'),
  sel:    () => tg?.HapticFeedback?.selectionChanged?.(),
  ok:     () => tg?.HapticFeedback?.notificationOccurred?.('success'),
  err:    () => tg?.HapticFeedback?.notificationOccurred?.('error'),
};

const app = document.getElementById('app');

let isTransitioning = false;
function transitionTo(direction, render) {
  if (isTransitioning) return;
  isTransitioning = true;

  const supportsVT = typeof document.startViewTransition === 'function';
  if (supportsVT) {
    document.startViewTransition(() => {
      render();
    }).finished.finally(() => { isTransitioning = false; });
    return;
  }

  const leaveClass = direction === 'back' ? 'is-leaving-back' : 'is-leaving-forward';
  const enterClass = direction === 'back' ? 'is-entering-back' : 'is-entering-forward';

  app.classList.remove('is-entering-forward', 'is-entering-back');
  app.classList.add(leaveClass);

  const onLeaveDone = () => {
    app.removeEventListener('transitionend', onLeaveDone);
    app.classList.remove(leaveClass);
    render();
    app.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' });
    app.classList.add(enterClass);
    const onEnterDone = () => {
      app.removeEventListener('animationend', onEnterDone);
      app.classList.remove(enterClass);
      isTransitioning = false;
    };
    app.addEventListener('animationend', onEnterDone);
  };
  app.addEventListener('transitionend', onLeaveDone);
  setTimeout(() => { if (app.classList.contains(leaveClass)) onLeaveDone(); }, 260);
}

const icons = {
  chef: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><path d="M6 17h12"/></svg>`,
  file:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5M8 9h2"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="4"/></svg>`,
  utensils:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zM18 22v-7"/></svg>`,
  coins:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`,
  receipt:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>`,
  chart:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="4" width="3" height="14" rx="1"/></svg>`,
  chat:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>`,
  headphones:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
};

const SCENARIOS = [
  { id: 'ttk',       icon: 'file',     title: 'Составить ТТК' },
  { id: 'reverse',   icon: 'camera',   title: 'Реверс блюда по фото' },
  { id: 'new_menu',  icon: 'utensils', title: 'Разработать меню / блюдо' },
  { id: 'food_cost', icon: 'coins',    title: 'Снизить food cost' },
  { id: 'invoice',   icon: 'receipt',  title: 'OCR накладной', soon: true },
  { id: 'abc',       icon: 'chart',    title: 'ABC-анализ Excel', soon: true },
];

function send(payload) {
  haptic.heavy();
  if (tg) {
    tg.sendData(JSON.stringify(payload));
    tg.close();
  } else {
    console.log('would send', payload);
    alert('Вне Telegram. Пейлоад: ' + JSON.stringify(payload));
  }
}

function setupBackButton(handler) {
  if (!tg?.BackButton) return;
  tg.BackButton.show();
  tg.BackButton.offClick();
  tg.BackButton.onClick(handler);
}

function hideBackButton() {
  tg?.BackButton?.hide?.();
}

function renderHome() {
  hideBackButton();
  hideMainButton();
  app.innerHTML = `
    <div class="header">
      <div class="logo">${icons.chef}</div>
      <div>
        <h1>РестОС</h1>
        <div class="sub">ИИ-помощник для ресторана</div>
      </div>
    </div>

    <div class="plan-card">
      <div class="label">Демо-тариф · 0 ₽</div>
      <div class="value">0 / 10 запросов</div>
      <div class="progress"><div style="width:0%"></div></div>
      <div class="meta">Лимит обновится 1 мая</div>
    </div>

    <div class="section-title">Инструменты</div>
    <div class="grid" id="menu-grid"></div>

    <div class="section-title">Свободный режим</div>
    <div class="card wide chat" data-id="chat" style="--i:6">
      <div class="icon-tile">${icons.chat}</div>
      <div class="title">Задать свой вопрос<span>любая задача по кухне</span></div>
    </div>

    <div class="support">${icons.headphones}<span>Техподдержка — @restos_support</span></div>
  `;

  const grid = document.getElementById('menu-grid');
  SCENARIOS.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'card' + (s.soon ? ' soon' : '');
    el.dataset.id = s.id;
    el.style.setProperty('--i', i);
    el.innerHTML = `<div class="icon-tile">${icons[s.icon]}</div><div class="title">${s.title}</div>`;
    el.addEventListener('click', () => { haptic.tap(); openScenario(s.id); });
    grid.appendChild(el);
  });

  const chatCard = document.querySelector('.card.chat');
  chatCard.addEventListener('click', () => { haptic.tap(); openScenario('chat'); });
}

function openScenario(id) {
  const routes = {
    ttk: renderTTK,
    reverse: renderSimple('Реверс блюда по фото', icons.camera, 'Открою чат в боте — пришли фото блюда, разложу на компоненты и верну ТТК.', 'reverse'),
    new_menu: renderSimple('Разработать меню / блюдо', icons.utensils, 'Пройдёшь короткую анкету в чате (14 вопросов), соберу концепцию и блюда.', 'new_menu'),
    food_cost: renderSimple('Снизить food cost', icons.coins, 'Пришли калькуляционную карту (текст или фото) и целевой food cost — верну план снижения.', 'food_cost'),
    invoice: renderStub('OCR накладной', icons.receipt, 'Модуль распознавания накладных'),
    abc: renderStub('ABC-анализ Excel', icons.chart, 'Модуль аналитики продаж'),
    chat: renderSimple('Свободный диалог', icons.chat, 'Открою чат в боте — задавай любой вопрос по кухне, технологии, управлению.', 'chat'),
  };
  const fn = routes[id] || renderHome;
  transitionTo('forward', fn);
}

function backToHome() {
  transitionTo('back', renderHome);
}

function renderTTK() {
  setupBackButton(backToHome);
  app.innerHTML = `
    <div class="screen">
      <h2>Составить ТТК</h2>
      <div class="desc">Технико-технологическая карта. Заполни поля — бот соберёт документ по стандарту.</div>

      <div class="field">
        <label>Название блюда</label>
        <input id="ttk-name" placeholder="Паста карбонара">
      </div>
      <div class="field">
        <label>Ингредиенты, нетто в граммах</label>
        <textarea id="ttk-ingredients" placeholder="Спагетти — 100 г&#10;Бекон — 40 г&#10;Яйцо — 1 шт (50 г)&#10;Пармезан — 20 г"></textarea>
      </div>
      <div class="field">
        <label>Выход готового блюда, г</label>
        <input id="ttk-yield" type="number" inputmode="numeric" placeholder="250">
      </div>
      <div class="field">
        <label>Технологический процесс</label>
        <textarea id="ttk-process" placeholder="Отварить пасту al dente, обжарить бекон, смешать с желтком и пармезаном..."></textarea>
      </div>
    </div>
  `;

  setupMainButton('СОБРАТЬ ТТК', () => {
    const payload = {
      scenario: 'ttk',
      data: {
        name: document.getElementById('ttk-name').value,
        ingredients: document.getElementById('ttk-ingredients').value,
        yield: document.getElementById('ttk-yield').value,
        process: document.getElementById('ttk-process').value,
      },
    };
    if (!payload.data.name || !payload.data.ingredients) {
      haptic.err();
      tg?.showAlert('Заполни как минимум название и ингредиенты');
      return;
    }
    send(payload);
  });
}

function renderSimple(title, iconSvg, desc, scenarioId) {
  return () => {
    setupBackButton(backToHome);
    app.innerHTML = `
      <div class="screen">
        <div class="screen-icon">${iconSvg.replace('width="20"','width="24"').replace('height="20"','height="24"')}</div>
        <h2>${title}</h2>
        <div class="desc">${desc}</div>
      </div>
    `;
    setupMainButton('ОТКРЫТЬ В ЧАТЕ', () => send({ scenario: scenarioId, data: {} }));
  };
}

function renderStub(title, iconSvg, desc) {
  return () => {
    setupBackButton(backToHome);
    app.innerHTML = `
      <div class="screen">
        <div class="screen-icon screen-icon--muted">${iconSvg.replace('width="20"','width="24"').replace('height="20"','height="24"')}</div>
        <h2>${title}</h2>
        <div class="desc">${desc} в разработке. Пока доступны другие инструменты или свободный диалог.</div>
      </div>
    `;
    hideMainButton();
  };
}

function setupMainButton(text, onClick) {
  if (!tg) return;
  tg.MainButton.setParams({ text, color: '#1ed760', text_color: '#0a0e12' });
  tg.MainButton.show();
  tg.MainButton.offClick();
  tg.MainButton.onClick(() => { haptic.medium(); onClick(); });
}

function hideMainButton() { tg?.MainButton?.hide?.(); }

window.renderHome = renderHome;
window.backToHome = backToHome;
renderHome();
