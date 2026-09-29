// ============================================================
// Корзина: состояние, сохранение в localStorage, текст заказа,
// ссылки WhatsApp / Viber. Никакой разметки — только логика.
// ============================================================
// Обычный (не модульный) скрипт: работает и с хостинга, и при открытии index.html двойным кликом.
(function (SM) {
'use strict';

const { MENU, PHONE, findItem } = SM.data;
const { t } = SM.i18n;

const STORAGE_KEY = 'shishmish:cart';
const MAX_QTY = 99;

/** { [id]: qty } — только позиции с qty > 0 */
let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const clean = {};
    for (const [id, qty] of Object.entries(raw)) {
      const n = Math.floor(Number(qty));
      if (findItem(id) && n > 0) clean[id] = Math.min(n, MAX_QTY);
    }
    return clean;
  } catch {
    return {};
  }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function emit(change) {
  save();
  listeners.forEach((fn) => fn(change));
}

// ---------- API ----------

const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

const getQty = (id) => state[id] || 0;

function setQty(id, qty) {
  if (!findItem(id)) return;
  const prev = getQty(id);
  const next = Math.max(0, Math.min(MAX_QTY, Math.floor(qty)));
  if (next === prev) return;
  if (next === 0) delete state[id];
  else state[id] = next;
  emit({ id, prev, next });
}

const add = (id, delta = 1) => setQty(id, getQty(id) + delta);
const remove = (id) => setQty(id, 0);

function clear() {
  state = {};
  emit({ cleared: true });
}

/** Позиции в порядке меню: [{ item, qty, sum }] */
function lines() {
  return MENU.filter((item) => state[item.id]).map((item) => ({
    item,
    qty: state[item.id],
    sum: item.price * state[item.id],
  }));
}

const totalQty = () => Object.values(state).reduce((a, b) => a + b, 0);
const totalSum = () => lines().reduce((a, l) => a + l.sum, 0);
const isEmpty = () => totalQty() === 0;

// ---------- форматирование ----------

/** 16 → "16", 14.5 → "14.5", 6.5 → "6.5" */
function formatPrice(value) {
  return value.toFixed(2).replace(/\.?0+$/, '');
}

/** Название позиции на текущем языке. */
const itemName = (item) => item.name || t(item.nameKey);

/** Текст заказа — формат сохранён 1:1 с прежней версией сайта. */
function orderText() {
  const rows = lines().map(({ item, qty, sum }) => `• ${itemName(item)} × ${qty} — ${formatPrice(sum)} €`);
  return (
    t('order_header') + '\n' +
    '━━━━━━━━━━━━━━\n' +
    rows.join('\n') + '\n' +
    '━━━━━━━━━━━━━━\n' +
    t('order_total') + ' ' + formatPrice(totalSum()) + ' €'
  );
}

/** WhatsApp: текст заказа, а при пустой корзине — короткое приветствие. */
function whatsappUrl() {
  const text = isEmpty() ? t('wa_greeting') : orderText();
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
}

/** Viber не умеет подставлять текст в чат с конкретным номером — текст копируется отдельно. */
const viberUrl = () => `viber://chat?number=${PHONE}`;

const telUrl = () => `tel:+${PHONE}`;

SM.cart = { subscribe, getQty, setQty, add, remove, clear, lines, totalQty, totalSum, isEmpty, formatPrice, itemName, orderText, whatsappUrl, viberUrl, telUrl };
})(window.ShishMish = window.ShishMish || {});
