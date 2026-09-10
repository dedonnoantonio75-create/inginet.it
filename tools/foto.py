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

# originale -> (nome descrittivo, larghezze, ritaglio)
# I nomi sono frasi in italiano: contano per la ricerca per immagini e dicono
# ai modelli AI di cosa parla la pagina.
#
# Il ritaglio vale None (nessuno), "centro" (al centro, a 16:9) oppure una
# finestra in frazioni (sinistra, alto, destra, basso). Le tre foto con la
# finestra esplicita inquadrano piu stretto persone e schermi: nello sfondo
# originale si vedeva il golfo di Napoli col Vesuvio, che con un'azienda del
# Salento non c'entra niente.
MAPPA = [
    ("01_team.png",            "software-house-inginet-team-sviluppo-software-maglie-lecce-salento", [640, 1000, 1400], "centro"),
    ("01_team_verticale.webp", "software-house-inginet-team-sviluppo-software-verticale",            [640, 900],        None),
    ("02_siti_ecommerce.png",  "sviluppo-siti-web-ed-e-commerce-su-misura-inginet",                  [640, 900, 1400],  None),
    ("03_gestionali.png",      "software-gestionali-e-intelligenza-artificiale-per-le-imprese-inginet", [640, 900, 995], (0.2434, 0.31, 0.7566, 1.0)),
    ("04_hospitality.png",     "gestionali-per-hotel-strutture-ricettive-e-ristoranti-inginet",      [640, 900, 1400],  None),
    ("05_marketing_seo.png",   "seo-posizionamento-e-digital-marketing-inginet",                     [640, 900, 1105], (0.1693, 0.34, 0.8307, 1.0)),
    ("06_app_portali.png",     "chi-siamo-team-inginet-idee-tecnologia-persone-risultati",           [640, 900, 1137], (0.1597, 0.32, 0.8403, 1.0)),
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
    for src, nome, larghezze, ritaglio in MAPPA:
        p = os.path.join(SRC, src)
        prima += os.path.getsize(p)
        im = Image.open(p).convert("RGB")
        if ritaglio == "centro":
            # al centro, alla proporzione delle altre: niente bande, niente deformazioni
            largo = int(round(im.height * 16 / 9))
            if largo < im.width:
                x = (im.width - largo) // 2
                im = im.crop((x, 0, x + largo, im.height))
        elif ritaglio:
            x0, y0, x1, y1 = ritaglio
            im = im.crop((int(x0 * im.width), int(y0 * im.height),
                          int(x1 * im.width), int(y1 * im.height)))
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
