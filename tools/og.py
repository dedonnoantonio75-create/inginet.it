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
    box = tuple(int(round(v)) for v in box)
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
    "it": ("Intelligenza artificiale", "applicata alle imprese",
           "Gestionali · CRM · Siti · E-commerce · SEO", "dal 2000 · Maglie (LE), Italia"),
    "en": ("Artificial intelligence", "that works for business",
           "Business software · CRM · Websites · E-commerce · SEO", "since 2000 · Italy"),
    "de": ("Künstliche Intelligenz", "für Ihr Unternehmen",
           "Branchensoftware · CRM · Websites · Shops · SEO", "seit 2000 · Italien"),
    "fr": ("Intelligence artificielle", "au service des entreprises",
           "Gestion · CRM · Sites · E-commerce · SEO", "depuis 2000 · Italie"),
    "es": ("Inteligencia artificial", "aplicada a las empresas",
           "Gestión · CRM · Webs · E-commerce · SEO", "desde 2000 · Italia"),
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
    """1200x630. WhatsApp ritaglia l'anteprima al quadrato centrale, quindi
    tutto cio che conta sta dentro i 630 px centrali (x da 285 a 915)."""
    W, H = 1200, 630
    CX = W // 2
    img = Image.new("RGB", (W, H), BG)
    orb(img, CX - 240, 60, 380, ACC, 110)
    orb(img, CX + 260, 520, 360, BLU, 100)

    d = ImageDraw.Draw(img)
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(19, 27, 45), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(19, 27, 45), width=1)

    # marchio + logotipo, centrati in alto
    logo = Image.open(os.path.join(ICO, "inginet-logo.png")).convert("RGBA")
    logo.thumbnail((430, 100), Image.LANCZOS)
    img.paste(logo, (CX - logo.width // 2, 74), logo)

    riga1, riga2, servizi, piede = TEXTS[lang]

    f1 = font(52)
    w1 = d.textlength(riga1, font=f1)
    hgrad_text(img, (int(CX - w1 / 2), 216), riga1, f1, ACC2, (255, 255, 255))

    f2 = font(52)
    w2 = d.textlength(riga2, font=f2)
    d.text((CX - w2 / 2, 284), riga2, font=f2, fill=TX)

    f3 = font(24, False)
    w3 = d.textlength(servizi, font=f3)
    d.text((CX - w3 / 2, 376), servizi, font=f3, fill=TX2)

    # riga inferiore centrata
    f4 = font(26)
    dom = "inginet.it"
    wd = d.textlength(dom, font=f4)
    f5 = font(22, False)
    wp = d.textlength(piede, font=f5)
    tot = wd + 26 + wp
    x0 = CX - tot / 2
    d.rounded_rectangle([x0 - 34, 470, x0 + tot + 34, 532], radius=31,
                        fill=(15, 22, 38), outline=(36, 51, 82))
    d.text((x0, 486), dom, font=f4, fill=ACC)
    d.text((x0 + wd + 26, 489), piede, font=f5, fill=(178, 192, 214))

    path = os.path.join(OUT, "inginet-og-%s.png" % lang)
    img.save(path, "PNG", optimize=True)
    return path


if __name__ == "__main__":
    for lg in TEXTS:
        print("ok", build_og(lg))
    print("Le icone si generano con:  python tools/icone.py")
