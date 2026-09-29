// ============================================================
// Единственное место правды для меню и контактов.
// Чтобы добавить блюдо: одна запись в MENU + ключи name/desc
// в словарях js/i18n.js (bg, en, ru). Подробно — в README.md.
// ============================================================
// Обычный (не модульный) скрипт: работает и с хостинга, и при открытии index.html двойным кликом.
(function (SM) {
'use strict';

/** Номер для заказов (WhatsApp / Viber / звонок), без «+». */
const PHONE = '359888245737';

/** Как номер показывается на сайте. */
const PHONE_DISPLAY = '+359 888 245 737';

/** Ссылка владельца на Google Maps. */
const MAPS_URL = 'https://maps.app.goo.gl/bxp7TNtxhWRikeHq5';

/**
 * Координаты точки из ссылки владельца («Симбиоза Deli Shop»).
 * Используются только для встраиваемой карты, которая грузится по клику.
 */
const MAP_COORDS = { lat: 42.6541032, lng: 23.3293025 };

/**
 * category: 'grill' | 'drinks'
 * price:    цена в евро (число)
 * weight:   { value, unit: 'g' | 'pc' } — подпись берётся из словаря (unit_g / unit_pc)
 * image:    { name, width, height } — файлы assets/images/<name>-<ширина>.avif/.webp
 *           (их создаёт tools/optimize_images.py; width/height — размеры оригинала)
 *           null → красивый плейсхолдер с огнём
 * widths:   какие ширины сгенерированы скриптом
 * nameKey / descKey: ключи переводов; name — для брендов, которые не переводятся
 */
// TODO(owner): «дюнер» упоминается в заголовках и текстах (как и в прежней версии сайта),
// но в меню его нет — добавить позицию (цена, граммовка, фото) или убрать слово из текстов.
const MENU = [
  {
    id: 'shashlik',
    category: 'grill',
    price: 8,
    weight: { value: 420, unit: 'g' },
    nameKey: 'dish_shashlik_name',
    descKey: 'dish_shashlik_desc',
    image: { name: 'kebab', width: 2500, height: 2500 },
    widths: [400, 800, 1200],
  },
  {
    id: 'wings',
    category: 'grill',
    price: 6.5,
    weight: { value: 420, unit: 'g' },
    nameKey: 'dish_wings_name',
    descKey: 'dish_wings_desc',
    image: { name: 'wings', width: 4096, height: 4096 },
    widths: [400, 800, 1200],
  },
  {
    id: 'chicken',
    category: 'grill',
    price: 9,
    weight: { value: 420, unit: 'g' },
    nameKey: 'dish_chicken_name',
    descKey: 'dish_chicken_desc',
    // TODO(owner): нужно фото пилешки шашлик → assets/images/src/chicken.png,
    // затем `python3 tools/optimize_images.py chicken` и заменить null на
    // { name: 'chicken', width: …, height: … } (скрипт напечатает размеры).
    image: null,
    widths: [400, 800, 1200],
  },
  {
    id: 'dorado',
    category: 'grill',
    price: 14,
    weight: { value: 1, unit: 'pc' },
    nameKey: 'dish_dorado_name',
    descKey: 'dish_dorado_desc',
    // TODO(owner): нужно фото дорады → assets/images/src/dorado.png (см. выше).
    image: null,
    widths: [400, 800, 1200],
  },
  {
    id: 'cola',
    category: 'drinks',
    price: 2,
    name: 'Coca-Cola',
    image: { name: 'coca', width: 228, height: 609 },
    widths: [120, 228],
  },
  {
    id: 'fanta',
    category: 'drinks',
    price: 2,
    name: 'Fanta',
    image: { name: 'fanta', width: 230, height: 589 },
    widths: [120, 230],
  },
  {
    id: 'sprite',
    category: 'drinks',
    price: 2,
    name: 'Sprite',
    image: { name: 'sprite', width: 230, height: 598 },
    widths: [120, 230],
  },
  {
    id: 'water',
    category: 'drinks',
    price: 1,
    nameKey: 'drink_water',
    image: { name: 'water', width: 182, height: 472 },
    widths: [120, 182],
  },
];

const findItem = (id) => MENU.find((item) => item.id === id);

SM.data = { PHONE, PHONE_DISPLAY, MAPS_URL, MAP_COORDS, MENU, findItem };
})(window.ShishMish = window.ShishMish || {});
