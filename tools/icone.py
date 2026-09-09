# -*- coding: utf-8 -*-
"""
Genera logo ottimizzato, marchio isolato e tutte le icone del sito
a partire dal logo originale Inginet ad alta risoluzione.

Sorgente:  assets/img/inginet-logo-originale.png  (3866x901, sfondo trasparente)
Uso:       python tools/icone.py
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
SRC = os.path.join(IMG, "inginet-logo-originale.png")

BG = (7, 10, 18)          # stesso fondo del sito
MARK_CUT = 740            # colonna in cui finisce il simbolo e comincia la scritta


def load():
    im = Image.open(SRC).convert("RGBA")
    full = im.crop(im.split()[3].getbbox())
    mark = im.crop((0, 0, MARK_CUT, im.height))
    mark = mark.crop(mark.split()[3].getbbox())
    return full, mark


def rounded_bg(size, radius=0.22):
    """Quadrato arrotondato pieno, generato in grande e ridotto (bordi puliti)."""
    k = 4
    base = Image.new("RGBA", (size * k, size * k), BG + (255,))
    mask = Image.new("L", (size * k, size * k), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size * k - 1, size * k - 1], radius=int(size * k * radius), fill=255)
    base.putalpha(mask)
    return base.resize((size, size), Image.LANCZOS)


def icon(mark, size, pad=0.08, radius=0.22, square=False):
    canvas = rounded_bg(size, 0 if square else radius)
    inner = int(size * (1 - 2 * pad))
    mm = mark.copy()
    mm.thumbnail((inner, inner), Image.LANCZOS)
    canvas.paste(mm, ((size - mm.width) // 2, (size - mm.height) // 2), mm)
    return canvas


def main():
    full, mark = load()

    # --- logo per header e footer (retina: 900px per un uso fino a ~300px) ---
    logo = full.copy()
    logo.thumbnail((900, 900), Image.LANCZOS)
    logo.save(os.path.join(IMG, "inginet-logo.png"), optimize=True)
    print("inginet-logo.png", logo.size)

    # --- marchio isolato, senza scritta ---
    mk = mark.copy()
    mk.thumbnail((600, 600), Image.LANCZOS)
    mk.save(os.path.join(IMG, "inginet-marchio.png"), optimize=True)
    print("inginet-marchio.png", mk.size)

    # --- favicon: solo il marchio, sfondo trasparente ---
    def solo_marchio(size, pad=0.02):
        c = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        inner = int(size * (1 - 2 * pad))
        mm = mark.copy()
        mm.thumbnail((inner, inner), Image.LANCZOS)
        c.paste(mm, ((size - mm.width) // 2, (size - mm.height) // 2), mm)
        return c

    for sz in (16, 32, 48):
        solo_marchio(sz).save(os.path.join(IMG, "favicon-%d.png" % sz), optimize=True)
    print("favicon 16/32/48 png (marchio su trasparente)")

    # --- favicon.ico multi-risoluzione, in root ---
    solo_marchio(64).save(os.path.join(ROOT, "favicon.ico"), format="ICO",
                          sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print("favicon.ico")

    # --- icone app ---
    icon(mark, 180, pad=0.10).convert("RGB").save(
        os.path.join(IMG, "inginet-icona-180.png"), optimize=True)
    icon(mark, 192, pad=0.10).convert("RGB").save(
        os.path.join(IMG, "inginet-icona-192.png"), optimize=True)
    icon(mark, 512, pad=0.10).convert("RGB").save(
        os.path.join(IMG, "inginet-icona-512.png"), optimize=True)
    # maskable: fondo pieno e simbolo piccolo, cosi Android puo ritagliarlo
    icon(mark, 512, pad=0.22, square=True).convert("RGB").save(
        os.path.join(IMG, "inginet-icona-maskable-512.png"), optimize=True)
    print("icone app 180/192/512 + maskable")


if __name__ == "__main__":
    main()
