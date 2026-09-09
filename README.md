# inginet.it — sito statico multilingua

Sito istituzionale di Inginet: **statico**, cinque lingue (IT · EN · DE · FR · ES),
zero cookie di tracciamento, zero chiamate a server esterni, pronto per GitHub Pages.

Su Aruba restano **solo la posta e il dominio**. L'hosting è GitHub Pages.

---

## Dati aziendali

Sono in [`src/data/site.mjs`](src/data/site.mjs), blocco `legal`, e da lì finiscono in
footer, pagina contatti, informativa privacy e dati strutturati di tutte e cinque le lingue.

| | |
|---|---|
| Ragione sociale | Inginet di Antonio De Donno |
| Sede legale e amministrativa | Via G. Marconi 14 — 73024 Maglie (LE), Italia |
| P.IVA | 05346170755 |
| Codice fiscale | DDNNTN75B06E815O |
| REA | LE-360123 |
| PEC | inginet@pec.it |
| Email | info@inginet.it |
| Telefono / WhatsApp | +39 393 569 4342 |

Coordinate della sede: `40.1166488, 18.3062816` (geocodificate da OpenStreetMap sulla via,
non sul civico: se vuoi il puntamento esatto si affinano a mano).

Dopo ogni modifica: `node build.mjs`.

---

## Come si costruisce

```bash
node build.mjs        # genera le 45 pagine HTML + sitemap, robots, llms.txt, manifest, 404
python tools/icone.py # logo ottimizzato, marchio, favicon.ico e icone app dal logo originale
python tools/og.py    # le 5 immagini social (una per lingua)
```

I due script Python vanno rilanciati solo se cambi il logo o i testi delle immagini social.

Il build **scrive nella root del repository**: è quello che GitHub Pages pubblica.
Non modificare mai gli `index.html` a mano: vengono riscritti a ogni build.
Si modificano solo i file dentro `src/`.

### Anteprima in locale

```bash
python -m http.server 8099
```

Poi apri <http://localhost:8099>.

---

## Struttura

```
src/
  data/
    site.mjs          ← dati azienda, lingue, slug, ELENCO CLIENTI, contatti
    i18n/it|en|de|fr|es.mjs   ← tutti i testi, una lingua per file, stessa struttura
  lib/
    render.mjs        ← head, header, footer, dati strutturati JSON-LD, layout
    pages.mjs         ← composizione delle 9 pagine
    artwork.mjs       ← illustrazioni SVG generate a build time
  assets/css|js       ← sorgenti copiati in /assets dal build
tools/og.py           ← generatore immagini Open Graph e icone
build.mjs             ← orchestratore

(root)                ← output pubblicato: index.html, /en /de /fr /es, assets, sitemap…
```

### Aggiungere o togliere un cliente

Si tocca solo l'array `clients` in `src/data/site.mjs`:

```js
{ name: 'Nome Cliente', url: 'https://www.sito.it/', logo: 'nome-file-logo.png',
  sector: 'ricettivo', tags: ['sito', 'seo'], featured: true, tile: 'dark' }
```

- il logo va messo in `assets/img/clienti/` con un **nome file descrittivo** (conta per la SEO immagini);
- `tile: 'dark'` serve **solo** ai loghi bianchi, che su tessera chiara sparirebbero (oggi: Brunitta e Olvix);
- `featured: true` lo mostra anche nella fascia "Progetti in primo piano";
- `sector` deve essere una delle chiavi presenti in `common.sectors` di tutte le lingue.

Poi `node build.mjs`.

### Aggiungere o modificare un testo

Si modifica la chiave corrispondente in **tutti e cinque** i file di `src/data/i18n/`.
La struttura delle chiavi deve restare identica: c'è un controllo pronto,

```bash
node -e "const l=['it','en','de','fr','es'];const p=(o,x='')=>Object.entries(o).flatMap(([k,v])=>{const q=x?x+'.'+k:k;return Array.isArray(v)?[q+'[]:'+v.length]:(v&&typeof v==='object'?p(v,q):[q])});(async()=>{const b=p((await import('./src/data/i18n/it.mjs')).default).sort();for(const x of l.slice(1)){const c=p((await import('./src/data/i18n/'+x+'.mjs')).default).sort();console.log(x,b.filter(y=>!c.includes(y)).join(',')||'ok')}})()"
```

---

## SEO: cosa è già impostato

**Motori tradizionali**
- un URL per lingua con slug tradotti (`/servizi/`, `/en/services/`, `/de/leistungen/`…);
- `hreflang` reciproci fra tutte e cinque le lingue + `x-default`;
- `canonical` su ogni pagina, nessun duplicato;
- `sitemap.xml` (con gli alternate), `sitemap-immagini.xml`, `sitemap-index.xml`;
- `robots.txt` con i crawler AI esplicitamente ammessi;
- title ≤ 68 caratteri e description fra 110 e 165 su tutte le 45 pagine;
- dati strutturati JSON-LD: `Organization` + `ProfessionalService`, `WebSite`, `WebPage`,
  `BreadcrumbList`, `FAQPage`, `Service` con `OfferCatalog`, `ItemList` del portfolio,
  `ContactPage` con `LocalBusiness`, orari e coordinate.

**Risposte generate dall'AI**
- `llms.txt` in root, rigenerato a ogni build dai contenuti reali;
- blocchi FAQ su tutte le pagine principali, in forma di domanda e risposta autosufficiente,
  marcati come `FAQPage`;
- entità dichiarate (azienda, fondatore, servizi, luoghi, lingue, `knowsAbout`).

**Immagini**
- nomi file descrittivi in italiano, `alt` scritto per una persona e localizzato;
- illustrazioni in SVG con `<title>` e `<desc>` interni;
- `width`/`height` sempre dichiarati (niente spostamenti di layout);
- sitemap dedicata alle immagini.

---

## Prestazioni e privacy

- Nessun framework, nessuna libreria esterna: un solo CSS e un solo JS, entrambi con
  impronta nell'URL (`?v=…`) così il browser ricarica dopo ogni rilascio.
- Caratteri tipografici **ospitati sul sito** (`assets/fonts/`): nessuna chiamata a Google Fonts,
  quindi nessun problema GDPR.
- Nessuna mappa incorporata, nessun video incorporato, nessun pixel, nessun analytics.
- Il modulo contatti **non invia nulla a un server**: compone un `mailto:` precompilato.
  Se un giorno servisse un vero invio, la strada più semplice è passare il deploy a Netlify
  (form nativi) oppure agganciare Formspree/Web3Forms.

---

## Banner cookie e consenso

Il banner compare **in basso a sinistra** alla prima visita. Tre strade: *Accetta tutto*,
*Solo necessari*, oppure *Personalizza* per decidere voce per voce.
Dopo la scelta il pannello si chiude e **resta una linguetta piccola, sempre in basso a
sinistra**: da lì si riapre e si cambia idea. Il pallino è verde se le statistiche sono
attive, grigio se sono spente.

La scelta finisce in `localStorage` alla chiave `ing-consent` e non arriva a noi.

**Oggi il sito non installa nulla**, quindi il banner non sarebbe obbligatorio: è pronto
perché la scelta valga già da subito. Quando vorrai aggiungere Google Analytics (o Matomo,
o Plausible), lo script va messo **solo** dentro `attivaStatistiche()` in
[`src/assets/js/inginet.js`](src/assets/js/inginet.js): parte esclusivamente dopo il
consenso, e da quel momento il banner diventa a norma senza toccare altro.

Se cambi cosa il sito installa, aggiorna anche i testi della pagina Cookie
(`pages.cookie` nei cinque file di `src/data/i18n/`).

---

## Pubblicazione su GitHub Pages

1. Repository → **Settings → Pages** → *Source: Deploy from a branch* → `main` / `/ (root)`.
2. Il file [`CNAME`](CNAME) è già presente con `www.inginet.it`.
3. Su Aruba, nel pannello DNS del dominio:

   | Tipo | Nome | Valore |
   |---|---|---|
   | CNAME | `www` | `<utente-github>.github.io` |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |

   I record MX della posta **non si toccano**: la mail resta su Aruba.
4. In Settings → Pages, spuntare **Enforce HTTPS** appena il certificato è emesso
   (di solito entro un'ora dalla propagazione DNS).
5. Dopo la messa online: registrare il sito in Google Search Console e Bing Webmaster Tools
   e inviare `https://www.inginet.it/sitemap-index.xml`.

---

## Note

- I clienti offline al 09/09/2026 (euxeria.it, otrantobelvedere.it, maresidenze.it,
  ristoprime.com) sono stati **esclusi dal portfolio** per non pubblicare link rotti.
  Se tornano online basta rimetterli nell'array `clients`.
- Il vecchio sito WordPress va tenuto raggiungibile finché non si sono impostati i
  redirect 301 dai vecchi URL a quelli nuovi (i vecchi permalink erano lunghissimi e
  alcuni sono indicizzati).
