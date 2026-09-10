# -*- coding: utf-8 -*-
"""
Prepara le foto di copertina per il web.

Da ogni originale in src/foto/ genera, in assets/img/foto/:
  - AVIF  a piu larghezze  (il piu leggero, browser recenti)
  - WebP  a piu larghezze  (tutti i browser dal 2020)
  - JPEG  una sola copia   (scorta per i browser vecchi)

I nomi dei file sono frasi descrittive in italiano: contano per la ricerca
per immagini e aiutano i modelli AI a capire di cosa parla la pagina.

Uso:  python tools/foto.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src", "foto")
OUT = os.path.join(ROOT, "assets", "img", "foto")

# originale -> (nome descrittivo, larghezze da generare)
MAPPA = [
    ("inginet_01.png", "team-inginet-sviluppo-siti-gestionali-salento",           [640, 1000, 1600]),
    ("inginet_02.png", "team-inginet-sviluppo-siti-gestionali-verticale",         [640, 900]),
    ("inginet_03.png", "sviluppo-siti-web-ed-e-commerce-su-misura-inginet",       [640, 900, 1400]),
    ("inginet_04.png", "intelligenza-artificiale-applicata-alle-imprese-inginet", [640, 900, 1400]),
    ("inginet_05.png", "seo-e-risultati-di-posizionamento-inginet",               [640, 900, 1400]),
    ("inginet_06.png", "riprese-aeree-con-drone-team-inginet",                    [640, 900, 1400]),
]

Q_AVIF = 52   # sotto i 45 iniziano gli aloni sui cieli sfumati
Q_WEBP = 76
Q_JPEG = 78
W_JPEG = 1200  # la scorta non serve grande: la scaricano solo i browser vecchi


def main():
    os.makedirs(OUT, exist_ok=True)
    for vecchio in os.listdir(OUT):
        os.remove(os.path.join(OUT, vecchio))

    prima = dopo = 0
    for src, nome, larghezze in MAPPA:
        p = os.path.join(SRC, src)
        prima += os.path.getsize(p)
        im = Image.open(p).convert("RGB")
        pesi = []
        for w in larghezze:
            r = im.copy()
            r.thumbnail((w, w * 3), Image.LANCZOS)
            for est, kw in (("avif", dict(quality=Q_AVIF)),
                            ("webp", dict(quality=Q_WEBP, method=6))):
                f = os.path.join(OUT, "%s-%d.%s" % (nome, w, est))
                r.save(f, est.upper(), **kw)
                dopo += os.path.getsize(f)
                if w == larghezze[-1]:
                    pesi.append("%s %dk" % (est, os.path.getsize(f) // 1024))
        j = im.copy()
        j.thumbnail((W_JPEG, W_JPEG * 3), Image.LANCZOS)
        fj = os.path.join(OUT, "%s.jpg" % nome)
        j.save(fj, "JPEG", quality=Q_JPEG, optimize=True, progressive=True)
        dopo += os.path.getsize(fj)
        pesi.append("jpg %dk" % (os.path.getsize(fj) // 1024))
        print("%-56s %s" % (nome, "  ".join(pesi)))

    print("\noriginali %.1f MB  ->  web %.2f MB" % (prima / 1e6, dopo / 1e6))


if __name__ == "__main__":
    main()
