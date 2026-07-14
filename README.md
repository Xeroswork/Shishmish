# 🔥 Shish-Mish

**Shish-Mish** — статичен уебсайт за поръчка на шашлик и дюнер в София.
Три езика (BG по подразбиране, EN, RU) с превключвател в менюто.

## ⚠️ Липсващи снимки на новите ястия

За позициите **Пилешки шашлик** и **Дорада на въглища** трябва да
добавиш две снимки в `assets/images/`:

- `chicken.png` — пилешки шашлик
- `dorado.png` — дорада на въглища

Докато липсват, картите се показват с чист черен фон (без счупена иконка).

## Структура

```
shishmish/
├── index.html
├── style.css
├── fonts.css
├── app.js
├── README.md
└── assets/
    ├── logo.svg
    └── fonts/
        ├── Inter-Regular.woff2
        ├── Inter-Medium.woff2
        ├── Inter-SemiBold.woff2
        ├── Inter-Bold.woff2
        └── Inter-ExtraBold.woff2
```

## Шрифты (опционально)

Сайт работает сразу: если файлы Inter отсутствуют, подключается системный
шрифтовой стек (`system-ui`/Segoe UI/Roboto/…). Для фирменного вида Inter
можно скачать один раз — шрифт распространяется по лицензии SIL Open Font
License (бесплатно).

### Способ 1 — через npm (рекомендуется)
```bash
npm install @fontsource/inter
```
Скопируй из `node_modules/@fontsource/inter/files/` в `assets/fonts/` и переименуй:
- `inter-latin-400-normal.woff2` → `Inter-Regular.woff2`
- `inter-latin-500-normal.woff2` → `Inter-Medium.woff2`
- `inter-latin-600-normal.woff2` → `Inter-SemiBold.woff2`
- `inter-latin-700-normal.woff2` → `Inter-Bold.woff2`
- `inter-latin-800-normal.woff2` → `Inter-ExtraBold.woff2`

### Способ 2 — скачать вручную
Зайди на https://github.com/rsms/inter/releases, скачай последний релиз,
возьми WOFF2 файлы из папки `Inter Web/` и переименуй как указано выше.

## Деплой

### GitHub Pages
1. Загрузи файлы в GitHub репозиторий
2. Settings → Pages → Source: `main`, `/ (root)`

### Vercel / Netlify
Drag & drop папки — работает без build шага.

## Контакти

📞 +359 888 245 737
📍 София, България
💬 Viber / WhatsApp
