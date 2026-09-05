import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT_DIR, exist_ok=True)

# Labels are language-agnostic abbreviations on purpose (not translated
# sport names) — these are static assets shared across all future
# locales, so no locale-specific text gets baked into the pixels. The
# actual translated sport name is rendered as real HTML text on top of
# (or next to) these images by NewsCard/ArticleCard.
SPORTS = {
    "football": ("FB", (34, 211, 238), (37, 99, 235)),
    "hockey": ("HK", (56, 189, 248), (67, 56, 202)),
    "tennis": ("TN", (163, 230, 53), (5, 150, 105)),
    "cs2": ("CS2", (251, 146, 60), (225, 29, 72)),
    "dota-2": ("DOTA2", (244, 63, 94), (124, 58, 237)),
    "mobile-legends": ("MLBB", (167, 139, 250), (217, 70, 239)),
    "ufc": ("UFC", (220, 38, 38), (30, 10, 10)),
}

W, H = 1200, 800


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def find_font(size):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def make_image(slug, label, c1, c2):
    img = Image.new("RGB", (W, H), c1)
    px = img.load()
    for y in range(H):
        t = y / H
        row_color = lerp(c1, c2, t)
        for x in range(0, W, 4):  # step for speed, fill blocks
            for dx in range(4):
                if x + dx < W:
                    px[x + dx, y] = row_color

    draw = ImageDraw.Draw(img, "RGBA")
    # subtle diagonal darken band for depth
    draw.polygon([(0, H), (W * 0.4, H), (0, H * 0.55)], fill=(0, 0, 0, 60))

    font = find_font(88)
    bbox = draw.textbbox((0, 0), label, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((W - tw) / 2, (H - th) / 2 - 20), label, font=font, fill=(255, 255, 255, 235))

    small_font = find_font(28)
    tag = "SPORTSNEW.NET"
    bbox2 = draw.textbbox((0, 0), tag, font=small_font)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(((W - tw2) / 2, (H / 2) + 70), tag, font=small_font, fill=(255, 255, 255, 160))

    path = os.path.join(OUT_DIR, f"{slug}.jpg")
    img.save(path, "JPEG", quality=85)
    print("wrote", path)


for slug, (label, c1, c2) in SPORTS.items():
    make_image(slug, label, c1, c2)
