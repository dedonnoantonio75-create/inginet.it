# -*- coding: utf-8 -*-
"""
Genera le immagini social (Open Graph, 1200x630) per ogni lingua
e le icone PNG dell'app, partendo dagli stessi colori del sito.

Uso:  python tools/og.py
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img", "og")
ICO = os.path.join(ROOT, "assets", "img")
os.makedirs(OUT, exist_ok=True)

BG = (7, 10, 18)
TX = (233, 237, 247)
TX2 = (150, 163, 188)
ACC = (255, 156, 0)
ACC2 = (255, 180, 61)
BLU = (45, 125, 255)

FONTS = [
    r"C:\Windows\Fonts\segoeuib.ttf",
    r"C:\Windows\Fonts\seguisb.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
    r"C:\Windows\Fonts\arial.ttf",
]


def font(size, bold=True):
    order = FONTS if bold else FONTS[::-1]
    for f in order:
        if os.path.exists(f):
            try:
                return ImageFont.truetype(f, size)
            except Exception:
                pass
    return ImageFont.load_default()


def orb(img, cx, cy, r, color, alpha=150):
    """Alone morbido: disegnato piccolo e ingrandito, poi sfocato."""
    s = 96
    g = Image.new("L", (s, s), 0)
    d = ImageDraw.Draw(g)
    for i in range(s // 2, 0, -1):
        a = int(alpha * (1 - i / (s / 2)) ** 2)
        d.ellipse([s / 2 - i, s / 2 - i, s / 2 + i, s / 2 + i], fill=a)
    g = g.resize((r * 2, r * 2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(r // 12))
    layer = Image.new("RGB", (r * 2, r * 2), color)
    img.paste(layer, (cx - r, cy - r), g)


def hgrad_text(img, xy, text, fnt, c1, c2):
    """Testo con riempimento a gradiente orizzontale."""
    box = ImageDraw.Draw(img).textbbox(xy, text, font=fnt)
    w = max(1, box[2] - box[0]); h = max(1, box[3] - box[1])
    mask = Image.new("L", (w + 8, h + 16), 0)
    ImageDraw.Draw(mask).text((0, 0), text, font=fnt, fill=255)
    grad = Image.new("RGB", (w + 8, h + 16))
    gd = ImageDraw.Draw(grad)
    for x in range(w + 8):
        t = x / max(1, w + 7)
        gd.line([(x, 0), (x, h + 16)], fill=tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)))
    img.paste(grad, (box[0], box[1] - 4), mask)


def logo_mark(d, x, y, s, color):
    """Marchio 'in' stilizzato, stessa geometria dell'SVG."""
    lw = max(3, int(s * 0.16))
    d.ellipse([x, y, x + lw * 1.35, y + lw * 1.35], fill=color)
    top = y + lw * 2.2
    d.rounded_rectangle([x + lw * 0.17, top, x + lw * 1.17, y + s], radius=lw / 2, fill=color)
    bx = x + s * 0.55
    d.rounded_rectangle([bx, y + s * 0.42, bx + lw, y + s], radius=lw / 2, fill=color)
    d.rounded_rectangle([bx + s * 0.42, y + s * 0.42, bx + s * 0.42 + lw, y + s], radius=lw / 2, fill=color)
    d.arc([bx, y + s * 0.30, bx + s * 0.42 + lw, y + s * 0.30 + (s * 0.42 + lw)],
          start=180, end=360, fill=color, width=lw)


TEXTS = {
    "it": ("Software house AI, gestionali e siti su misura",
           "Intelligenza artificiale · Gestionali · CRM · E-commerce · SEO",
           "Dal 2000 · oltre 1.500 clienti · Maglie (LE), Italia"),
    "en": ("AI software house, custom business software and websites",
           "Artificial intelligence · ERP · CRM · E-commerce · SEO",
           "Since 2000 · 1,500+ clients · Maglie (LE), Italy"),
    "de": ("KI-Softwarehaus, individuelle Unternehmenssoftware und Websites",
           "Künstliche Intelligenz · ERP · CRM · E-Commerce · SEO",
           "Seit 2000 · über 1.500 Kunden · Maglie (LE), Italien"),
    "fr": ("Éditeur de logiciels IA, gestion sur mesure et sites web",
           "Intelligence artificielle · Gestion · CRM · E-commerce · SEO",
           "Depuis 2000 · plus de 1 500 clients · Maglie (LE), Italie"),
    "es": ("Software house de IA, software de gestión y webs a medida",
           "Inteligencia artificial · Gestión · CRM · E-commerce · SEO",
           "Desde 2000 · más de 1.500 clientes · Maglie (LE), Italia"),
}


def wrap(draw, text, fnt, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=fnt) <= maxw:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def build_og(lang):
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), BG)
    orb(img, 120, 70, 380, ACC, 120)
    orb(img, 1090, 210, 340, BLU, 110)
    orb(img, 700, 640, 300, (120, 80, 255), 70)

    d = ImageDraw.Draw(img)
    # griglia leggera
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(19, 27, 45), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(19, 27, 45), width=1)

    # logo reale, in alto a sinistra
    logo = Image.open(os.path.join(ICO, "inginet-logo.png")).convert("RGBA")
    logo.thumbnail((420, 78), Image.LANCZOS)
    img.paste(logo, (72, 58), logo)
    d.text((76, 58 + logo.height + 8), "inginet.it", font=font(20, False), fill=TX2)

    title, sub, foot = TEXTS[lang]
    f_title = font(58)
    lines = wrap(d, title, f_title, W - 150)
    y = 215
    for i, ln in enumerate(lines[:3]):
        if i == 0:
            hgrad_text(img, (72, y), ln, f_title, ACC2, (255, 255, 255))
        else:
            d.text((72, y), ln, font=f_title, fill=TX)
        y += 72

    d.text((72, y + 18), sub, font=font(27, False), fill=TX2)

    # barra inferiore
    d.rounded_rectangle([72, H - 108, W - 72, H - 46], radius=31, fill=(15, 22, 38), outline=(36, 51, 82))
    d.text((104, H - 90), foot, font=font(23, False), fill=(198, 210, 232))
    for i, tag in enumerate(["IT", "EN", "DE", "FR", "ES"]):
        bx = W - 100 - (4 - i) * 62
        col = ACC if tag.lower() == lang else (123, 137, 165)
        d.text((bx, H - 90), tag, font=font(22), fill=col)

    path = os.path.join(OUT, "inginet-og-%s.png" % lang)
    img.save(path, "PNG", optimize=True)
    return path


if __name__ == "__main__":
    for lg in TEXTS:
        print("ok", build_og(lg))
    print("Le icone si generano con:  python tools/icone.py")
