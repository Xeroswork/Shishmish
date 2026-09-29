// ============================================================
// Точка входа: рендер меню из данных, корзина, мессенджеры,
// языки, фильтры, карта. Эффекты — в ui.js.
// ============================================================
// Обычный (не модульный) скрипт: работает и с хостинга, и при открытии index.html двойным кликом.
(function (SM) {
'use strict';

const { MENU, PHONE_DISPLAY, MAP_COORDS } = SM.data;
const { t, itemsLabel, setLang, getLang, initialLang, onLangChange } = SM.i18n;
const cart = SM.cart;
const {
  icon, withTransition, replay, toast, copyText, splitWords, reducedMotion,
  initHeader, initReveal, initCounters, initSparks, initParallax,
  initFuse, initTilt, initMagnetic, initEmbers, flyToCart, initMobileNav,
} = SM.ui;

document.documentElement.classList.replace('no-js', 'js');

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const priceHTML = (value) => `${cart.formatPrice(value)}<span class="price__cur">€</span>`;

// ============================================================
// Меню: разметка генерируется из MENU (одно место правды)
// ============================================================

const SIZES_DISH = '(min-width: 1180px) 290px, (min-width: 600px) 45vw, 46vw';
const SIZES_DRINK = '64px';

function picture(item, sizes) {
  const { name, width, height } = item.image;
  const set = (ext) => item.widths.map((w) => `assets/images/${name}-${w}.${ext} ${w}w`).join(', ');
  const fallback = item.widths[Math.min(1, item.widths.length - 1)];
  return `<picture>
    <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
    <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
    <img src="assets/images/${name}-${fallback}.webp" width="${width}" height="${height}" alt="" loading="lazy" decoding="async" data-alt>
  </picture>`;
}

const nameAttr = (item) => (item.nameKey ? `data-i18n="${item.nameKey}"` : '');
const nameText = (item) => (item.nameKey ? '' : esc(item.name));

function qtyControl(item, small = false) {
  return `<div class="qty" data-qty-for="${item.id}">
    <button type="button" class="btn-add" data-action="add">${icon('plus', 'icon icon--sm')}<span data-i18n="add"></span></button>
    <div class="stepper${small ? ' stepper--sm' : ''}" role="group">
      <button type="button" data-action="dec">${icon('minus', 'icon icon--sm')}</button>
      <output>0</output>
      <button type="button" data-action="inc">${icon('plus', 'icon icon--sm')}</button>
    </div>
  </div>`;
}

function dishCard(item, index) {
  const media = item.image
    ? picture(item, SIZES_DISH)
    : `<div class="dish__ph" aria-hidden="true">${icon('flame')}<span class="dish__ph-name" ${nameAttr(item)}>${nameText(item)}</span><span class="dish__ph-note" data-i18n="photo_soon"></span></div>`;
  return `<article class="dish card reveal" style="--d:${index % 2}" data-id="${item.id}">
    <div class="dish__inner">
      <div class="dish__media" data-fly-source>
        ${media}
        <span class="dish__badge">${icon('flame', 'icon icon--sm')}<span data-i18n="badge_coals"></span></span>
      </div>
      <div class="dish__body">
        <span class="dish__weight" data-weight="${item.weight.value}" data-unit="${item.weight.unit}"></span>
        <h4 class="dish__name" ${nameAttr(item)}>${nameText(item)}</h4>
        <p class="dish__desc" data-i18n="${item.descKey}"></p>
        <div class="dish__foot">
          <p class="price" data-price>${priceHTML(item.price)}</p>
          ${qtyControl(item)}
        </div>
      </div>
    </div>
  </article>`;
}

function drinkCard(item, index) {
  return `<article class="drink card reveal" style="--d:${index}" data-id="${item.id}">
    <div class="drink__media" data-fly-source>${picture(item, SIZES_DRINK)}</div>
    <h4 ${nameAttr(item)}>${nameText(item)}</h4>
    <p class="price" data-price>${priceHTML(item.price)}</p>
    ${qtyControl(item, true)}
  </article>`;
}

function renderMenu() {
  const grill = MENU.filter((i) => i.category === 'grill');
  const drinks = MENU.filter((i) => i.category === 'drinks');
  $('#grill-grid').innerHTML = grill.map(dishCard).join('');
  $('#drinks-row').innerHTML = drinks.map(drinkCard).join('');
  initTilt($$('#grill-grid .dish'));
}

/** Подписи, которые зависят от языка и названия позиции (aria-label, alt, граммовка). */
function refreshMenuLabels() {
  $$('#menu [data-id]').forEach((card) => {
    const item = MENU.find((i) => i.id === card.dataset.id);
    const name = cart.itemName(item);
    card.querySelector('.btn-add')?.setAttribute('aria-label', t('add_aria', { name }));
    card.querySelector('.stepper')?.setAttribute('aria-label', t('qty_aria', { name }));
    card.querySelector('[data-action="dec"]')?.setAttribute('aria-label', t('dec_aria', { name }));
    card.querySelector('[data-action="inc"]')?.setAttribute('aria-label', t('inc_aria', { name }));
    const img = card.querySelector('img[data-alt]');
    if (img) img.alt = name;
    const w = card.querySelector('[data-weight]');
    if (w) w.textContent = `${w.dataset.weight} ${t(w.dataset.unit === 'pc' ? 'unit_pc' : 'unit_g')}`;
  });
}

/** Состояние «Добавить» ↔ степпер для одной позиции. */
function syncItem(id) {
  const qty = cart.getQty(id);
  $$(`.qty[data-qty-for="${id}"]`).forEach((box) => {
    box.toggleAttribute('data-has-qty', qty > 0);
    box.querySelector('output').textContent = qty;
    // скрытая половина не должна ловить фокус и скринридер
    box.querySelector('.btn-add').inert = qty > 0;
    box.querySelector('.stepper').inert = qty === 0;
  });
}

function cartTargetPoint() {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  return window.matchMedia('(max-width: 767px)').matches
    ? { x: 52, y: vh - 42 }
    : { x: vw - 110, y: vh - 58 };
}

function onMenuClick(e) {
  const btn = e.target.closest('[data-action]');
  const card = btn?.closest('[data-id]');
  if (!btn || !card) return;
  const id = card.dataset.id;
  const action = btn.dataset.action;

  if (action === 'add' || action === 'inc') {
    cart.add(id, 1);
    if (action === 'add') {
      card.querySelector('.qty [data-action="inc"]')?.focus();
      flyToCart(card.querySelector('[data-fly-source]'), cartTargetPoint(), pulseCart);
    } else pulseCart();
  } else if (action === 'dec') {
    cart.add(id, -1);
    if (cart.getQty(id) === 0) card.querySelector('.btn-add')?.focus();
  }
  replay(card.querySelector('[data-price]'), 'bump');
}

// ============================================================
// Фильтры меню
// ============================================================

function initFilters() {
  const menu = $('#menu');
  $$('.chips button').forEach((btn) => {
    btn.addEventListener('click', () => {
      withTransition(() => {
        menu.dataset.filter = btn.dataset.filter;
        $$('.chips button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      });
    });
  });
}

// ============================================================
// Корзина: плавающая кнопка, мобильная панель, drawer
// ============================================================

const dlg = () => $('#cart');

function pulseCart() {
  replay($('.cart-fab__icon'), 'pulse');
  replay($('.cart-bar'), 'pulse');
}

function lineTemplate({ item }) {
  const thumb = item.image
    ? `<img src="assets/images/${item.image.name}-${item.widths[0]}.webp" alt="" width="60" height="60" loading="lazy" decoding="async">`
    : icon('flame');
  return `<div class="cart-line__thumb">${thumb}</div>
    <div><p class="cart-line__name"></p><p class="cart-line__unit"></p></div>
    <p class="price cart-line__sum"></p>
    <div class="cart-line__controls">
      <div class="stepper stepper--sm" role="group">
        <button type="button" data-action="dec">${icon('minus', 'icon icon--sm')}</button>
        <output></output>
        <button type="button" data-action="inc">${icon('plus', 'icon icon--sm')}</button>
      </div>
      <button type="button" class="icon-btn cart-line__remove" data-action="remove">${icon('trash', 'icon icon--sm')}</button>
    </div>`;
}

/** Ключевое обновление списка — без перерисовки всего, чтобы не терять фокус. */
function renderCartList() {
  const list = $('#cart-list');
  const lines = cart.lines();
  const ids = new Set(lines.map((l) => l.item.id));

  $$('.cart-line', list).forEach((li) => { if (!ids.has(li.dataset.id)) li.remove(); });

  lines.forEach((line, index) => {
    let li = list.querySelector(`.cart-line[data-id="${line.item.id}"]`);
    if (!li) {
      li = document.createElement('li');
      li.className = 'cart-line';
      li.dataset.id = line.item.id;
      li.innerHTML = lineTemplate(line);
    }
    if (list.children[index] !== li) list.insertBefore(li, list.children[index] || null);
    const name = cart.itemName(line.item);
    li.querySelector('.cart-line__name').textContent = name;
    li.querySelector('.cart-line__unit').textContent = `${cart.formatPrice(line.item.price)} € × ${line.qty}`;
    li.querySelector('.cart-line__sum').innerHTML = priceHTML(line.sum);
    li.querySelector('output').textContent = line.qty;
    li.querySelector('.stepper').setAttribute('aria-label', t('qty_aria', { name }));
    li.querySelector('[data-action="dec"]').setAttribute('aria-label', t('dec_aria', { name }));
    li.querySelector('[data-action="inc"]').setAttribute('aria-label', t('inc_aria', { name }));
    li.querySelector('[data-action="remove"]').setAttribute('aria-label', t('cart_remove', { name }));
  });
}

function renderCart() {
  const qty = cart.totalQty();
  const sum = cart.totalSum();
  const empty = qty === 0;
  const sumText = `${cart.formatPrice(sum)} €`;

  // drawer
  const d = dlg();
  d.toggleAttribute('data-empty', empty);
  renderCartList();
  $('#cart-total').innerHTML = priceHTML(sum);
  $('#cart-preview-text').textContent = empty ? '' : cart.orderText();

  // плавающая кнопка (десктоп) и нижняя панель (мобильные)
  const fab = $('.cart-fab');
  const bar = $('.cart-bar');
  fab.classList.toggle('is-visible', !empty);
  bar.classList.toggle('is-visible', !empty);
  fab.inert = empty;
  bar.inert = empty;
  $('.cart-count').textContent = qty;
  $('.cart-fab__sum').textContent = sumText;
  $('.cart-bar__label').textContent = `${itemsLabel(qty)} · ${sumText}`;
  const label = empty ? t('cart_open_empty') : t('cart_open', { items: itemsLabel(qty), sum: sumText });
  fab.setAttribute('aria-label', label);
  bar.setAttribute('aria-label', label);

  // все ссылки WhatsApp ведут на заказ из корзины (или приветствие)
  $$('[data-wa]').forEach((a) => { a.href = cart.whatsappUrl(); });
  $$('[data-viber]').forEach((a) => { a.href = cart.viberUrl(); });
}

let liveTimer = 0;
function announceCart() {
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => {
    $('#cart-live').textContent = cart.isEmpty()
      ? t('cart_open_empty')
      : t('cart_live', { items: itemsLabel(cart.totalQty()), sum: `${cart.formatPrice(cart.totalSum())} €` });
  }, 500);
}

function openCart() {
  const d = dlg();
  if (d.open) return;
  d.showModal();
}

function initCart() {
  const d = dlg();

  $$('[data-open-cart]').forEach((b) => b.addEventListener('click', openCart));

  d.addEventListener('click', (e) => {
    // клик по подложке закрывает
    if (e.target === d) { d.close(); return; }
    if (e.target.closest('[data-close]')) { d.close(); return; }

    const toMenu = e.target.closest('a[href="#menu"]');
    if (toMenu) {
      e.preventDefault();
      d.close();
      $('#menu').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
      return;
    }

    const btn = e.target.closest('.cart-line [data-action]');
    if (btn) {
      const li = btn.closest('.cart-line');
      const id = li.dataset.id;
      const action = btn.dataset.action;
      if (action === 'inc') cart.add(id, 1);
      if (action === 'dec') cart.add(id, -1);
      if (action === 'remove') cart.remove(id);
      // если строка исчезла — фокус на соседнюю или на кнопку закрытия
      if (!li.isConnected) ($('#cart-list [data-action="inc"]') || $('.cart__head [data-close]'))?.focus();
    }
  });

  $('#cart-clear').addEventListener('click', () => {
    cart.clear();
    toast(t('cart_cleared'));
    $('.cart__head [data-close]')?.focus();
  });

  cart.subscribe((change) => {
    renderCart();
    announceCart();
    if (change.id) syncItem(change.id);
    else MENU.forEach((i) => syncItem(i.id));
    if (change.prev === 0 || change.next === 0) replay($('#cart-total'), 'bump');
  });
}

/** Viber: чат открывается по ссылке, а текст заказа копируется в буфер. */
function initViber() {
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('[data-viber]');
    if (!link || cart.isEmpty()) return;
    const ok = await copyText(cart.orderText());
    toast(ok ? t('order_copied') : t('copy_failed'), { type: ok ? 'viber' : 'error', timeout: ok ? 4200 : 5200 });
  });
}

// ============================================================
// Языки
// ============================================================

function initLangSwitch() {
  $$('.lang-switch button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang === getLang()) return;
      withTransition(() => setLang(btn.dataset.lang));
    });
  });
}

onLangChange((lang) => {
  $$('.lang-switch button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  splitWords($('#hero-title'));
  refreshMenuLabels();
  renderCart();
  const frame = $('.map iframe');
  if (frame) frame.title = t('map_title');
});

// ============================================================
// Контакты: копирование номера, карта по клику
// ============================================================

function initContacts() {
  $$('[data-copy-phone]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ok = await copyText(PHONE_DISPLAY);
      toast(ok ? t('phone_copied') : t('copy_failed'), { type: ok ? 'copy' : 'error' });
    });
  });

  const loadBtn = $('[data-map-load]');
  loadBtn?.addEventListener('click', () => {
    const map = $('.map');
    const iframe = document.createElement('iframe');
    iframe.src = `https://maps.google.com/maps?q=${MAP_COORDS.lat},${MAP_COORDS.lng}&z=17&hl=${getLang()}&output=embed`;
    iframe.title = t('map_title');
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    map.replaceChildren(iframe);
    iframe.focus();
  });
}

// ============================================================
// Старт
// ============================================================

renderMenu();
initCart();
initViber();
initLangSwitch();
initFilters();
initContacts();
initMobileNav();
initHeader();

$('#menu').addEventListener('click', onMenuClick);
$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

setLang(initialLang());          // применяет словари ко всему, включая меню
MENU.forEach((i) => syncItem(i.id));

initReveal();
initCounters();
initFuse();
initSparks($('.hero__sparks'));
initParallax();
initMagnetic();
initEmbers();
})(window.ShishMish = window.ShishMish || {});
