#!/usr/bin/env python3
"""
Конвертирует оригиналы из assets/images/src/ в AVIF + WebP нужных размеров.

Использование (из корня проекта):
    python3 tools/optimize_images.py            # все картинки
    python3 tools/optimize_images.py chicken    # только assets/images/src/chicken.png

Требуется Pillow 11+ (pip3 install pillow) — в нём уже есть AVIF и WebP.

На выходе для каждой ширины из профиля появляются файлы
    assets/images/<имя>-<ширина>.avif
    assets/images/<имя>-<ширина>.webp
Ширины больше оригинала пропускаются (картинка никогда не растягивается).
В конце скрипт печатает строку для js/menu-data.js с размерами оригинала.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "images" / "src"
OUT = ROOT / "assets" / "images"

# Фото блюд по умолчанию: карточка меню шириной до ~600 px на ретине.
DEFAULT_WIDTHS = [400, 800, 1200]

PROFILES = {
    "hero": [480, 720, 960, 1280],
    # напитки показываются маленькими
    "coca": [120, 240], "fanta": [120, 240], "sprite": [120, 240], "water": [120, 240],
    # иллюстрации блока «Как готовим»
    "ferm": [200, 400], "coals": [200, 400], "spices": [200, 400], "chef": [200, 400],
}

# Иконки контактов заменены на inline SVG — их не конвертируем.
SKIP = {"pin", "phone", "chat"}

# Иллюстрации в кружках: обрезаем пустые прозрачные поля, чтобы все выглядели одного масштаба.
TRIM = {"ferm", "coals", "spices", "chef"}

AVIF_QUALITY = 52
WEBP_QUALITY = 78


def widths_for(name: str, original_width: int) -> list[int]:
    wanted = PROFILES.get(name, DEFAULT_WIDTHS)
    result = [w for w in wanted if w <= original_width]
    # Если какая-то ширина больше оригинала — добавляем сам оригинал как самый крупный вариант.
    if any(w > original_width for w in wanted) and original_width not in result:
        result.append(original_width)
    return result


def convert(path: Path) -> None:
    name = path.stem
    with Image.open(path) as im:
        im.load()
        has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
        im = im.convert("RGBA" if has_alpha else "RGB")
        if has_alpha and name in TRIM:
            bbox = im.getchannel("A").point(lambda v: 255 if v > 16 else 0).getbbox()
            if bbox:
                im = im.crop(bbox)
        w0, h0 = im.size
        report = []
        for w in widths_for(name, w0):
            h = round(h0 * w / w0)
            resized = im if w == w0 else im.resize((w, h), Image.LANCZOS)
            avif = OUT / f"{name}-{w}.avif"
            webp = OUT / f"{name}-{w}.webp"
            resized.save(avif, "AVIF", quality=AVIF_QUALITY, speed=6)
            resized.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)
            report.append(f"{w}px avif {avif.stat().st_size // 1024} КБ / webp {webp.stat().st_size // 1024} КБ")
    src_kb = path.stat().st_size // 1024
    print(f"{name:8} {w0}×{h0}, оригинал {src_kb} КБ → " + "; ".join(report))
    print(f"         для menu-data.js: image: {{ name: '{name}', width: {w0}, height: {h0} }}")


def main() -> None:
    names = set(sys.argv[1:])
    files = sorted(p for p in SRC.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"})
    if names:
        files = [p for p in files if p.stem in names]
        missing = names - {p.stem for p in files}
        if missing:
            sys.exit(f"Не найдено в {SRC}: {', '.join(sorted(missing))}")
    for p in files:
        if p.stem in SKIP:
            continue
        convert(p)


if __name__ == "__main__":
    main()
