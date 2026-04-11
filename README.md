# 🔥 Shish-Mish

**Shish-Mish** — статичен уебсайт за поръчка на шашлик и дюнер в София.

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

## ⚠️ Шрифты — нужно скачать один раз

Шрифт **Inter** распространяется по лицензии SIL Open Font License (бесплатно).

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

📞 +359 897 728 878
📍 София, България
💬 Viber / WhatsApp
