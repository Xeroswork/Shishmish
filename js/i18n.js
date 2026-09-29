// ============================================================
// Переводы BG (по умолчанию) / EN / RU и применение к странице.
//
// Разметка:
//   data-i18n="key"                 → innerHTML элемента (строки доверенные, можно <em>, <br>)
//   data-i18n-attr="attr:key; …"    → атрибуты (aria-label, alt, content, title …)
// В строках доступны подстановки {phone} и произвольные {var} через t(key, vars).
// ============================================================
// Обычный (не модульный) скрипт: работает и с хостинга, и при открытии index.html двойным кликом.
(function (SM) {
'use strict';

const { PHONE_DISPLAY } = SM.data;

const LANGS = ['bg', 'en', 'ru'];
const DEFAULT_LANG = 'bg';
const STORAGE_KEY = 'lang';

const I18N = {
  bg: {
    meta_title: 'Shish-Mish — шашлик и дюнер на живи въглища в София',
    meta_desc: 'Шашлик и дюнер от фермерски продукти, по авторска марината, изпечени на въглища. Поръчайте в София през WhatsApp, Viber или по телефона.',
    og_locale: 'bg_BG',

    skip_link: 'Към съдържанието',
    logo_home: 'Shish-Mish — към началото',
    lang_label: 'Език на сайта',
    nav_label: 'Основна навигация',
    nav_about: 'За нас',
    nav_process: 'Как готвим',
    nav_menu: 'Меню',
    nav_faq: 'Въпроси',
    nav_contacts: 'Контакти',
    header_call: 'Обади се',
    menu_open: 'Отвори менюто',
    menu_close: 'Затвори менюто',

    hero_eyebrow: 'Приготвено на въглища · София',
    hero_title: 'Шашлик и дюнер, изпечени на <em>живи въглища</em>',
    hero_sub: 'Фермерско месо, авторска марината и истински огън. Изберете от менюто — поръчката стига до нас с два клика през WhatsApp или Viber.',
    hero_cta_menu: 'Виж менюто',
    hero_cta_wa: 'Поръчай в WhatsApp',
    trust_coals: 'На въглища',
    trust_farm: 'Фермерски продукти',
    trust_exp: '20+ години опит',
    scroll_hint: 'Надолу',
    hero_img_alt: 'Шишове шашлик над жарава — емблемата на Shish-Mish',
    wa_greeting: 'Здравейте! Искам да направя поръчка.',

    mq_1: 'Шашлик',
    mq_2: 'На въглища',
    mq_3: 'Фермерски продукти',
    mq_4: 'Авторска марината',
    mq_5: 'Специи от Централна Азия',
    mq_6: 'Дюнер',

    about_eyebrow: 'Нашата концепция',
    about_title: 'Месо, огън и време. <em>Без компромиси.</em>',
    about_lead: 'Готвим шашлик и дюнер така, както бихме ги приготвили за себе си: от фермерски продукти, по авторска рецепта и само на въглища.',
    about_master_title: 'Майстор с 20+ години опит',
    about_master_text: 'Технологията на мариноване е разработена от майстор с над 20 години опит — за максимален вкус и сочност.',
    about_marinade_title: 'Собствена марината',
    about_marinade_text: 'Месото се маринова по собствена технология, а домашните сосове се правят по авторски рецепти.',
    about_spices_title: 'Специи от Централна Азия',
    about_spices_text: 'Част от подправките внасяме специално от Централна Азия — оттам идва автентичният, отличителен вкус.',
    about_farm_title: 'Фермерски продукти от „Симбиоза“',
    about_farm_text: 'Продуктите идват от deli shop „Симбиоза“ — постоянна свежест и строг контрол на качеството във всяка порция.',
    stat_years: 'години опит',
    stat_farm: 'фермерски продукти',
    stat_compromise: 'компромиси',
    manifesto: 'Без компромиси — това, което ядем ние, предлагаме и на вас.',
    manifesto_cite: 'екипът на Shish-Mish',

    process_eyebrow: 'От фермата до масата',
    process_title: 'Как готвим',
    process_lead: 'Пет стъпки, които не прескачаме — нито една.',
    step1_title: 'Фермерско месо',
    step1_text: 'Подбираме продукти от deli shop „Симбиоза“.',
    step2_title: 'Авторска марината',
    step2_text: 'Маринова се по собствена технология, създадена от майстор с 20+ години опит.',
    step3_title: 'Специи',
    step3_text: 'Подправки, внесени специално от Централна Азия.',
    step4_title: 'На въглища',
    step4_text: 'Печем само на въглища — заради дима, коричката и сочността.',
    step5_title: 'На вашата маса',
    step5_text: 'Поръчвате през WhatsApp, Viber или по телефона — и готово.',

    menu_eyebrow: 'Направо от жарава',
    menu_title: 'Меню',
    menu_sub: 'Добавете ястия в кошницата — ще съберем поръчката ви в готово съобщение.',
    filter_label: 'Филтър на менюто',
    filter_all: 'Всичко',
    filter_grill: 'Грил',
    filter_drinks: 'Напитки',
    grill_title: 'Грил',
    drinks_title: 'Напитки',
    badge_coals: 'На въглища',
    add: 'Добави',
    add_aria: 'Добави {name} в кошницата',
    dec_aria: 'Намали количеството: {name}',
    inc_aria: 'Увеличи количеството: {name}',
    qty_aria: 'Количество: {name}',
    photo_soon: 'Снимката идва скоро',
    unit_g: 'г',
    unit_pc: 'бр.',
    dish_shashlik_name: 'Шашлик',
    dish_shashlik_desc: 'Сочен свински врат в домашна марината, изпечен на въглища.',
    dish_wings_name: 'Пилешки крилца',
    dish_wings_desc: 'Сочни пилешки крилца в домашна марината, изпечени на въглища.',
    dish_chicken_name: 'Пилешки шашлик',
    dish_chicken_desc: 'Сочен пилешки шашлик в домашна марината, изпечен на въглища.',
    dish_dorado_name: 'Дорада на въглища',
    dish_dorado_desc: 'Прясна дорада, изпечена на въглища.',
    drink_water: 'Вода',

    cart_title: 'Вашата поръчка',
    cart_open: 'Кошница: {items}, {sum}',
    cart_open_empty: 'Кошницата е празна',
    cart_close: 'Затвори кошницата',
    cart_empty_title: 'Кошницата е празна',
    cart_empty_text: 'Добавете нещо от менюто — въглищата вече горят.',
    cart_to_menu: 'Към менюто',
    items_one: '{n} позиция',
    items_other: '{n} позиции',
    cart_checkout: 'Поръчай',
    cart_total: 'Общо',
    cart_remove: 'Премахни: {name}',
    cart_clear: 'Изчисти кошницата',
    cart_cleared: 'Кошницата е изчистена',
    cart_preview: 'Преглед на съобщението',
    cart_send_via: 'Изпратете поръчката през',
    cart_live: 'В кошницата: {items}, общо {sum}',
    viber_hint: 'Viber: текстът се копира автоматично — просто го поставете в чата.',
    order_call: 'Обади се',
    order_header: '🔥 Нова поръчка — Shish-Mish',
    order_total: 'Общо:',
    order_copied: 'Поръчката е копирана — поставете я в чата на Viber',
    copy_failed: 'Не успяхме да копираме — копирайте текста от прегледа.',

    how_eyebrow: 'Лесно и бързо',
    how_title: 'Как да поръчате',
    how1_title: 'Изберете ястия',
    how1_text: 'Добавете от менюто каквото ви се хапва — сумата се смята автоматично.',
    how2_title: 'Натиснете WhatsApp или Viber',
    how2_text: 'Сайтът сглобява готово съобщение с цялата ви поръчка.',
    how3_title: 'Потвърдете с нас',
    how3_text: 'Изпратете съобщението и ще уточним детайлите заедно.',
    how_viber_title: 'Защо с Viber има една стъпка повече?',
    how_viber_text: 'В WhatsApp текстът се попълва сам. Viber не позволява това, затова копираме поръчката в клипборда — остава само да я поставите в чата.',

    faq_eyebrow: 'Въпроси',
    faq_title: 'Често задавани въпроси',
    faq_q1: 'Как да поръчам?',
    faq_a1: 'Добавете ястия в кошницата, отворете я и натиснете WhatsApp или Viber — съобщението с поръчката е готово. Можете и просто да ни се обадите на {phone}.',
    faq_q2: 'С какво се различават WhatsApp и Viber?',
    faq_a2: 'WhatsApp отваря чат с нас и попълва текста на поръчката автоматично. Viber отваря чат с нас, а текстът се копира в клипборда — поставете го и изпратете.',
    faq_q3: 'Откъде са продуктите?',
    faq_a3: 'Използваме фермерски продукти от deli shop „Симбиоза“. Част от подправките внасяме специално от Централна Азия.',
    faq_q4: 'На какво готвите?',
    faq_a4: 'На въглища. Месото се маринова по собствена технология, разработена от майстор с над 20 години опит.',
    faq_q5: 'Доставяте ли?',
    faq_a5: 'Свържете се с нас по телефона или в съобщение — ще ви кажем актуалните условия.',
    faq_q6: 'Какво е работното време?',
    faq_a6: 'Обадете се или ни пишете — ще ви кажем кога работим днес.',
    faq_q7: 'Как се плаща?',
    faq_a7: 'Начинът на плащане се уточнява при потвърждаване на поръчката.',

    contacts_eyebrow: 'Свържете се с нас',
    contacts_title: 'Контакти',
    contacts_lead: 'Поръчки по телефона и в съобщения — WhatsApp или Viber.',
    phone_label: 'Телефон за поръчки',
    copy_phone: 'Копирай номера',
    phone_copied: 'Номерът е копиран',
    card_wa_text: 'Пишете ни — поръчката от кошницата се попълва автоматично.',
    card_viber_text: 'Отваря чат с нас; поръчката се копира за поставяне.',
    card_call_title: 'Обаждане',
    card_call_text: 'Поръчайте направо по телефона.',
    location_label: 'Локация',
    location_value: 'София · Shish-Mish / Simbiosa',
    open_maps: 'Отвори в Google Maps',
    show_map: 'Покажи картата',
    map_note: 'Картата се зарежда от Google само след натискане.',
    map_title: 'Карта: Shish-Mish в София',
    hours_label: 'Работно време',
    hours_value: 'Обадете се за актуалното работно време.',

    cta_title: 'Гладни? Въглищата вече горят <span aria-hidden="true">🔥</span>',
    cta_text: 'Изберете от менюто и изпратете поръчката с два клика.',

    footer_tagline: 'Шашлик и дюнер на въглища от фермерски продукти.',
    footer_nav: 'Навигация',
    footer_contacts: 'Контакти',
    footer_lang: 'Език',
    footer_rights: 'Всички права запазени.',
    city: 'София, България',
    back_to_top: 'Нагоре',
  },

  en: {
    meta_title: 'Shish-Mish — shish kebab & döner over live charcoal in Sofia',
    meta_desc: 'Shish kebab and döner from farm-fresh produce, in our own marinade, grilled over charcoal. Order in Sofia via WhatsApp, Viber or by phone.',
    og_locale: 'en_US',

    skip_link: 'Skip to content',
    logo_home: 'Shish-Mish — back to top',
    lang_label: 'Site language',
    nav_label: 'Main navigation',
    nav_about: 'About',
    nav_process: 'How we cook',
    nav_menu: 'Menu',
    nav_faq: 'FAQ',
    nav_contacts: 'Contacts',
    header_call: 'Call',
    menu_open: 'Open menu',
    menu_close: 'Close menu',

    hero_eyebrow: 'Cooked over charcoal · Sofia',
    hero_title: 'Shish kebab & döner, grilled over <em>live charcoal</em>',
    hero_sub: 'Farm-fresh meat, our own marinade and real fire. Pick from the menu — your order reaches us in two clicks via WhatsApp or Viber.',
    hero_cta_menu: 'View menu',
    hero_cta_wa: 'Order on WhatsApp',
    trust_coals: 'Charcoal-grilled',
    trust_farm: 'Farm-fresh produce',
    trust_exp: '20+ years of experience',
    scroll_hint: 'Scroll',
    hero_img_alt: 'Skewers of shish kebab over glowing coals — the Shish-Mish emblem',
    wa_greeting: "Hello! I'd like to place an order.",

    mq_1: 'Shish kebab',
    mq_2: 'Over charcoal',
    mq_3: 'Farm-fresh produce',
    mq_4: 'Signature marinade',
    mq_5: 'Spices from Central Asia',
    mq_6: 'Döner',

    about_eyebrow: 'Our concept',
    about_title: 'Meat, fire and time. <em>No compromises.</em>',
    about_lead: "We make shish kebab and döner the way we'd make them for ourselves: from farm-fresh produce, by our own recipe and only over charcoal.",
    about_master_title: 'A master with 20+ years of experience',
    about_master_text: 'Our marinating method was developed by a master with over 20 years of experience — for maximum flavour and juiciness.',
    about_marinade_title: 'Our own marinade',
    about_marinade_text: 'The meat is marinated using our own method, and the homemade sauces follow our own recipes.',
    about_spices_title: 'Spices from Central Asia',
    about_spices_text: "Some of our spices are imported specially from Central Asia — that's where the authentic, distinctive taste comes from.",
    about_farm_title: 'Farm produce from “Simbioza”',
    about_farm_text: 'Our produce comes from the deli shop “Simbioza” — constant freshness and strict quality control in every portion.',
    stat_years: 'years of experience',
    stat_farm: 'farm-fresh produce',
    stat_compromise: 'compromises',
    manifesto: 'No compromises — what we eat ourselves is what we serve you.',
    manifesto_cite: 'the Shish-Mish team',

    process_eyebrow: 'From farm to table',
    process_title: 'How we cook',
    process_lead: "Five steps we never skip — not a single one.",
    step1_title: 'Farm-fresh meat',
    step1_text: 'We source our produce from the deli shop “Simbioza”.',
    step2_title: 'Signature marinade',
    step2_text: 'Marinated using our own method, created by a master with 20+ years of experience.',
    step3_title: 'Spices',
    step3_text: 'Spices imported specially from Central Asia.',
    step4_title: 'Over charcoal',
    step4_text: 'Grilled only over charcoal — for the smoke, the crust and the juiciness.',
    step5_title: 'To your table',
    step5_text: 'Order via WhatsApp, Viber or by phone — done.',

    menu_eyebrow: 'Fresh off the coals',
    menu_title: 'Menu',
    menu_sub: "Add dishes to your basket — we'll turn your order into a ready-made message.",
    filter_label: 'Menu filter',
    filter_all: 'All',
    filter_grill: 'Grill',
    filter_drinks: 'Drinks',
    grill_title: 'Grill',
    drinks_title: 'Drinks',
    badge_coals: 'Charcoal-grilled',
    add: 'Add',
    add_aria: 'Add {name} to basket',
    dec_aria: 'Decrease quantity: {name}',
    inc_aria: 'Increase quantity: {name}',
    qty_aria: 'Quantity: {name}',
    photo_soon: 'Photo coming soon',
    unit_g: 'g',
    unit_pc: 'pc',
    dish_shashlik_name: 'Shish kebab',
    dish_shashlik_desc: 'Juicy pork neck in our homemade marinade, grilled over charcoal.',
    dish_wings_name: 'Chicken wings',
    dish_wings_desc: 'Juicy chicken wings in homemade marinade, grilled over charcoal.',
    dish_chicken_name: 'Chicken shish kebab',
    dish_chicken_desc: 'Juicy chicken shish kebab in homemade marinade, grilled over charcoal.',
    dish_dorado_name: 'Charcoal-grilled sea bream',
    dish_dorado_desc: 'Fresh sea bream (dorado) grilled over charcoal.',
    drink_water: 'Water',

    cart_title: 'Your order',
    cart_open: 'Basket: {items}, {sum}',
    cart_open_empty: 'Your basket is empty',
    cart_close: 'Close basket',
    cart_empty_title: 'Your basket is empty',
    cart_empty_text: 'Add something from the menu — the coals are already burning.',
    cart_to_menu: 'Go to menu',
    items_one: '{n} item',
    items_other: '{n} items',
    cart_checkout: 'Checkout',
    cart_total: 'Total',
    cart_remove: 'Remove: {name}',
    cart_clear: 'Clear basket',
    cart_cleared: 'Basket cleared',
    cart_preview: 'Message preview',
    cart_send_via: 'Send your order via',
    cart_live: 'In your basket: {items}, total {sum}',
    viber_hint: 'Viber: the text is copied automatically — just paste it into the chat.',
    order_call: 'Call',
    order_header: '🔥 New order — Shish-Mish',
    order_total: 'Total:',
    order_copied: 'Order copied — paste it in the Viber chat',
    copy_failed: "Couldn't copy — please copy the text from the preview.",

    how_eyebrow: 'Quick and easy',
    how_title: 'How to order',
    how1_title: 'Pick your dishes',
    how1_text: 'Add whatever you fancy from the menu — the total is calculated automatically.',
    how2_title: 'Tap WhatsApp or Viber',
    how2_text: 'The site assembles a ready-made message with your whole order.',
    how3_title: 'Confirm with us',
    how3_text: "Send the message and we'll sort out the details together.",
    how_viber_title: 'Why does Viber take one extra step?',
    how_viber_text: "WhatsApp fills in the text for you. Viber doesn't allow that, so we copy your order to the clipboard — just paste it into the chat.",

    faq_eyebrow: 'Questions',
    faq_title: 'Frequently asked questions',
    faq_q1: 'How do I order?',
    faq_a1: 'Add dishes to your basket, open it and tap WhatsApp or Viber — the order message is ready. You can also simply call us at {phone}.',
    faq_q2: "What's the difference between WhatsApp and Viber?",
    faq_a2: 'WhatsApp opens a chat with us and fills in your order automatically. Viber opens a chat with us and copies the text to your clipboard — paste it and send.',
    faq_q3: 'Where does your produce come from?',
    faq_a3: 'We use farm-fresh produce from the deli shop “Simbioza”. Some of our spices are imported specially from Central Asia.',
    faq_q4: 'What do you cook on?',
    faq_a4: 'Charcoal. The meat is marinated using our own method, developed by a master with over 20 years of experience.',
    faq_q5: 'Do you deliver?',
    faq_a5: "Get in touch by phone or message — we'll tell you the current options.",
    faq_q6: 'What are your opening hours?',
    faq_a6: "Call or message us — we'll tell you when we're open today.",
    faq_q7: 'How can I pay?',
    faq_a7: 'Payment is arranged when we confirm your order.',

    contacts_eyebrow: 'Get in touch',
    contacts_title: 'Contacts',
    contacts_lead: 'Orders by phone and by message — WhatsApp or Viber.',
    phone_label: 'Order line',
    copy_phone: 'Copy number',
    phone_copied: 'Number copied',
    card_wa_text: 'Message us — your basket order fills in automatically.',
    card_viber_text: 'Opens a chat with us; your order is copied for pasting.',
    card_call_title: 'Call',
    card_call_text: 'Order directly by phone.',
    location_label: 'Location',
    location_value: 'Sofia · Shish-Mish / Simbiosa',
    open_maps: 'Open in Google Maps',
    show_map: 'Show map',
    map_note: 'The map loads from Google only when you click.',
    map_title: 'Map: Shish-Mish in Sofia',
    hours_label: 'Opening hours',
    hours_value: 'Call us for current opening hours.',

    cta_title: 'Hungry? The coals are already burning <span aria-hidden="true">🔥</span>',
    cta_text: 'Pick from the menu and send your order in two clicks.',

    footer_tagline: 'Shish kebab and döner over charcoal, from farm-fresh produce.',
    footer_nav: 'Navigation',
    footer_contacts: 'Contacts',
    footer_lang: 'Language',
    footer_rights: 'All rights reserved.',
    city: 'Sofia, Bulgaria',
    back_to_top: 'Back to top',
  },

  ru: {
    meta_title: 'Shish-Mish — шашлык и дюнер на живых углях в Софии',
    meta_desc: 'Шашлык и дюнер из фермерских продуктов в авторском маринаде, приготовленные на углях. Заказ в Софии через WhatsApp, Viber или по телефону.',
    og_locale: 'ru_RU',

    skip_link: 'К содержанию',
    logo_home: 'Shish-Mish — в начало',
    lang_label: 'Язык сайта',
    nav_label: 'Основная навигация',
    nav_about: 'О нас',
    nav_process: 'Как готовим',
    nav_menu: 'Меню',
    nav_faq: 'Вопросы',
    nav_contacts: 'Контакты',
    header_call: 'Позвонить',
    menu_open: 'Открыть меню',
    menu_close: 'Закрыть меню',

    hero_eyebrow: 'Приготовлено на углях · София',
    hero_title: 'Шашлык и дюнер на <em>живых углях</em>',
    hero_sub: 'Фермерское мясо, авторский маринад и настоящий огонь. Выберите блюда в меню — заказ дойдёт до нас в два клика через WhatsApp или Viber.',
    hero_cta_menu: 'Смотреть меню',
    hero_cta_wa: 'Заказать в WhatsApp',
    trust_coals: 'На углях',
    trust_farm: 'Фермерские продукты',
    trust_exp: '20+ лет опыта',
    scroll_hint: 'Листайте',
    hero_img_alt: 'Шампуры с шашлыком над углями — эмблема Shish-Mish',
    wa_greeting: 'Здравствуйте! Хочу сделать заказ.',

    mq_1: 'Шашлык',
    mq_2: 'На углях',
    mq_3: 'Фермерские продукты',
    mq_4: 'Авторский маринад',
    mq_5: 'Специи из Центральной Азии',
    mq_6: 'Дюнер',

    about_eyebrow: 'Наша концепция',
    about_title: 'Мясо, огонь и время. <em>Без компромиссов.</em>',
    about_lead: 'Мы готовим шашлык и дюнер так, как готовили бы для себя: из фермерских продуктов, по авторскому рецепту и только на углях.',
    about_master_title: 'Мастер с опытом 20+ лет',
    about_master_text: 'Технологию маринования разработал мастер с более чем 20-летним опытом — ради максимального вкуса и сочности.',
    about_marinade_title: 'Собственный маринад',
    about_marinade_text: 'Мясо маринуется по собственной технологии, а домашние соусы готовятся по авторским рецептам.',
    about_spices_title: 'Специи из Центральной Азии',
    about_spices_text: 'Часть специй мы привозим специально из Центральной Азии — отсюда аутентичный, узнаваемый вкус.',
    about_farm_title: 'Фермерские продукты от «Симбиозы»',
    about_farm_text: 'Продукты поставляет deli shop «Симбиоза» — постоянная свежесть и строгий контроль качества в каждой порции.',
    stat_years: 'лет опыта',
    stat_farm: 'фермерские продукты',
    stat_compromise: 'компромиссов',
    manifesto: 'Без компромиссов — что едим мы, то предлагаем и вам.',
    manifesto_cite: 'команда Shish-Mish',

    process_eyebrow: 'От фермы до стола',
    process_title: 'Как мы готовим',
    process_lead: 'Пять шагов, которые мы не пропускаем. Ни одного.',
    step1_title: 'Фермерское мясо',
    step1_text: 'Выбираем продукты от deli shop «Симбиоза».',
    step2_title: 'Авторский маринад',
    step2_text: 'Маринуем по собственной технологии, созданной мастером с опытом 20+ лет.',
    step3_title: 'Специи',
    step3_text: 'Специи, привезённые специально из Центральной Азии.',
    step4_title: 'На углях',
    step4_text: 'Готовим только на углях — ради дыма, корочки и сочности.',
    step5_title: 'На ваш стол',
    step5_text: 'Заказываете через WhatsApp, Viber или по телефону — и готово.',

    menu_eyebrow: 'Прямо с углей',
    menu_title: 'Меню',
    menu_sub: 'Добавьте блюда в корзину — мы соберём заказ в готовое сообщение.',
    filter_label: 'Фильтр меню',
    filter_all: 'Всё',
    filter_grill: 'Гриль',
    filter_drinks: 'Напитки',
    grill_title: 'Гриль',
    drinks_title: 'Напитки',
    badge_coals: 'На углях',
    add: 'Добавить',
    add_aria: 'Добавить в корзину: {name}',
    dec_aria: 'Уменьшить количество: {name}',
    inc_aria: 'Увеличить количество: {name}',
    qty_aria: 'Количество: {name}',
    photo_soon: 'Фото скоро появится',
    unit_g: 'г',
    unit_pc: 'шт.',
    dish_shashlik_name: 'Шашлык',
    dish_shashlik_desc: 'Сочная свиная шея в домашнем маринаде, приготовленная на углях.',
    dish_wings_name: 'Куриные крылышки',
    dish_wings_desc: 'Сочные куриные крылышки в домашнем маринаде, приготовленные на углях.',
    dish_chicken_name: 'Куриный шашлык',
    dish_chicken_desc: 'Сочный куриный шашлык в домашнем маринаде, приготовленный на углях.',
    dish_dorado_name: 'Дорадо на углях',
    dish_dorado_desc: 'Свежая дорадо, запечённая на углях.',
    drink_water: 'Вода',

    cart_title: 'Ваш заказ',
    cart_open: 'Корзина: {items}, {sum}',
    cart_open_empty: 'Корзина пуста',
    cart_close: 'Закрыть корзину',
    cart_empty_title: 'Корзина пуста',
    cart_empty_text: 'Добавьте что-нибудь из меню — угли уже горят.',
    cart_to_menu: 'В меню',
    items_one: '{n} позиция',
    items_few: '{n} позиции',
    items_many: '{n} позиций',
    items_other: '{n} позиции',
    cart_checkout: 'Оформить',
    cart_total: 'Итого',
    cart_remove: 'Удалить: {name}',
    cart_clear: 'Очистить корзину',
    cart_cleared: 'Корзина очищена',
    cart_preview: 'Предпросмотр сообщения',
    cart_send_via: 'Отправьте заказ через',
    cart_live: 'В корзине: {items}, итого {sum}',
    viber_hint: 'Viber: текст копируется автоматически — просто вставьте его в чат.',
    order_call: 'Позвонить',
    order_header: '🔥 Новый заказ — Shish-Mish',
    order_total: 'Итого:',
    order_copied: 'Заказ скопирован — вставьте его в чат Viber',
    copy_failed: 'Не удалось скопировать — скопируйте текст из предпросмотра.',

    how_eyebrow: 'Быстро и просто',
    how_title: 'Как заказать',
    how1_title: 'Выберите блюда',
    how1_text: 'Добавьте из меню всё, что хочется, — сумма посчитается автоматически.',
    how2_title: 'Нажмите WhatsApp или Viber',
    how2_text: 'Сайт соберёт готовое сообщение со всем вашим заказом.',
    how3_title: 'Подтвердите с нами',
    how3_text: 'Отправьте сообщение — и мы вместе уточним детали.',
    how_viber_title: 'Почему в Viber на один шаг больше?',
    how_viber_text: 'В WhatsApp текст подставляется сам. Viber так не умеет, поэтому мы копируем заказ в буфер обмена — остаётся только вставить его в чат.',

    faq_eyebrow: 'Вопросы',
    faq_title: 'Частые вопросы',
    faq_q1: 'Как сделать заказ?',
    faq_a1: 'Добавьте блюда в корзину, откройте её и нажмите WhatsApp или Viber — сообщение с заказом готово. Можно и просто позвонить нам: {phone}.',
    faq_q2: 'Чем отличаются WhatsApp и Viber?',
    faq_a2: 'WhatsApp открывает чат с нами и сам подставляет текст заказа. Viber открывает чат с нами, а текст копируется в буфер обмена — вставьте его и отправьте.',
    faq_q3: 'Откуда продукты?',
    faq_a3: 'Мы используем фермерские продукты от deli shop «Симбиоза». Часть специй привозим специально из Центральной Азии.',
    faq_q4: 'На чём вы готовите?',
    faq_a4: 'На углях. Мясо маринуется по собственной технологии, которую разработал мастер с более чем 20-летним опытом.',
    faq_q5: 'Есть ли доставка?',
    faq_a5: 'Свяжитесь с нами по телефону или в сообщении — расскажем об актуальных условиях.',
    faq_q6: 'Какие часы работы?',
    faq_a6: 'Позвоните или напишите — подскажем, когда мы работаем сегодня.',
    faq_q7: 'Как оплатить?',
    faq_a7: 'Способ оплаты уточняется при подтверждении заказа.',

    contacts_eyebrow: 'Свяжитесь с нами',
    contacts_title: 'Контакты',
    contacts_lead: 'Заказы по телефону и в сообщениях — WhatsApp или Viber.',
    phone_label: 'Телефон для заказов',
    copy_phone: 'Скопировать номер',
    phone_copied: 'Номер скопирован',
    card_wa_text: 'Напишите нам — заказ из корзины подставится автоматически.',
    card_viber_text: 'Откроет чат с нами; заказ скопируется для вставки.',
    card_call_title: 'Звонок',
    card_call_text: 'Закажите напрямую по телефону.',
    location_label: 'Локация',
    location_value: 'София · Shish-Mish / Simbiosa',
    open_maps: 'Открыть в Google Maps',
    show_map: 'Показать карту',
    map_note: 'Карта загружается из Google только после нажатия.',
    map_title: 'Карта: Shish-Mish в Софии',
    hours_label: 'Часы работы',
    hours_value: 'Позвоните, чтобы уточнить часы работы.',

    cta_title: 'Голодны? Угли уже горят <span aria-hidden="true">🔥</span>',
    cta_text: 'Выберите блюда в меню и отправьте заказ в два клика.',

    footer_tagline: 'Шашлык и дюнер на углях из фермерских продуктов.',
    footer_nav: 'Навигация',
    footer_contacts: 'Контакты',
    footer_lang: 'Язык',
    footer_rights: 'Все права защищены.',
    city: 'София, Болгария',
    back_to_top: 'Наверх',
  },
};

// ---------- состояние языка ----------

let current = DEFAULT_LANG;
const listeners = new Set();

const getLang = () => current;

/** Язык из localStorage, иначе болгарский. */
function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch { /* приватный режим */ }
  return DEFAULT_LANG;
}

/** Перевод с подстановками {phone} и {var}. */
function t(key, vars = {}) {
  const dict = I18N[current] || I18N[DEFAULT_LANG];
  let str = dict[key] ?? I18N[DEFAULT_LANG][key] ?? key;
  const all = { phone: PHONE_DISPLAY, ...vars };
  return str.replace(/\{(\w+)\}/g, (m, name) => (name in all ? String(all[name]) : m));
}

/** «3 позиции» / «1 item» / «5 позиций» — по правилам языка. */
function itemsLabel(n) {
  const form = new Intl.PluralRules(current).select(n);
  const dict = I18N[current];
  const key = dict[`items_${form}`] ? `items_${form}` : 'items_other';
  return t(key, { n });
}

/** Применить переводы к поддереву (по умолчанию — весь документ). */
function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
}

/** Сменить язык: словари, <html lang>, <title>, og:locale, сохранение и подписчики. */
function setLang(lang) {
  current = LANGS.includes(lang) ? lang : DEFAULT_LANG;
  document.documentElement.lang = current;
  document.title = t('meta_title');
  applyTranslations();
  try { localStorage.setItem(STORAGE_KEY, current); } catch { /* ignore */ }
  listeners.forEach((fn) => fn(current));
}

function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

SM.i18n = { LANGS, DEFAULT_LANG, I18N, getLang, initialLang, t, itemsLabel, applyTranslations, setLang, onLangChange };
})(window.ShishMish = window.ShishMish || {});
