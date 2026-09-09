/* ============================================================================
   Inginet — generatore del sito statico.
   Uso:  node build.mjs
   Scrive l'output nella root del repository, pronto per GitHub Pages.
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, languages, pages, slugs, defaultLang, clients, artwork } from './src/data/site.mjs';
import { layout, pageUrl, absUrl, outPath } from './src/lib/render.mjs';
import { renderers, extraSchemaFor } from './src/lib/pages.mjs';
import * as art from './src/lib/artwork.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const p = (...x) => path.join(ROOT, ...x);

const write = (rel, content) => {
  const file = p(rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
};

const copyDir = (from, to) => {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
};

/* ------------------------------------------------------- 1. traduzioni */

const T = {};
for (const l of languages) {
  const mod = await import(`./src/data/i18n/${l.code}.mjs`);
  T[l.code] = mod.default;
}

/* ------------------------------------------------------- 2. immagini */

write('assets/img/' + artwork.hero, art.heroArt());
write('assets/img/' + artwork.ai, art.aiArt());
write('assets/img/' + artwork.servizi, art.serviziArt());
write('assets/img/' + artwork.seo, art.seoArt());
write('assets/img/' + artwork.team, art.teamArt());
write('favicon.svg', art.faviconSvg());
write('assets/img/inginet-logo.svg', art.logoFull());

write('assets/img/clienti/olvix-marketplace-logo.svg', art.olvixLogo());
write('assets/img/clienti/leuca-rooms-logo.svg', art.wordmarkLogo('LEUCA ROOMS', 'SANTA MARIA DI LEUCA', '#0d5b8a'));
write('assets/img/clienti/valortra-logo.svg', art.wordmarkLogo('VALORTRA', '', '#1d3557'));
write('assets/img/clienti/studio-santi-dentista-logo.svg', art.wordmarkLogo('STUDIO SANTI', 'ODONTOIATRIA', '#0e7490'));

/* ------------------------------------------------------- 3. asset statici */

copyDir(p('src/assets/css'), p('assets/css'));
copyDir(p('src/assets/js'), p('assets/js'));

/* ------------------------------------------------------- 4. pagine HTML */

let n = 0;
for (const l of languages) {
  const lang = l.code;
  const t = T[lang];
  for (const key of pages) {
    const body = renderers[key](t, lang);
    const html = layout({ lang, key, t, body, extraSchema: extraSchemaFor(key, t, lang) });
    write(outPath(lang, key), html);
    n++;
  }
}

/* ------------------------------------------------------- 5. sitemap */

const PRIO = { home: '1.0', ai: '0.9', servizi: '0.9', seo: '0.9', clienti: '0.8', chisiamo: '0.7', contatti: '0.7', privacy: '0.3', cookie: '0.3' };
const today = new Date().toISOString().slice(0, 10);

const urlEntries = [];
for (const l of languages) {
  for (const key of pages) {
    const alts = languages
      .map(x => `    <xhtml:link rel="alternate" hreflang="${x.hreflang}" href="${absUrl(x.code, key)}"/>`)
      .join('\n');
    urlEntries.push(`  <url>
    <loc>${absUrl(l.code, key)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${key === 'home' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${PRIO[key]}</priority>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${absUrl(defaultLang, key)}"/>
  </url>`);
  }
}

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>
`);

/* sitemap dedicata alle immagini: conta per la ricerca per immagini */
const imgUrls = [
  { page: absUrl(defaultLang, 'home'), imgs: [[artwork.hero, T.it.pages.home.hero.imgAlt], ...clients.map(c => [`clienti/${c.logo}`, `${c.name} — sito web e software realizzati da Inginet`])] },
  { page: absUrl(defaultLang, 'ai'), imgs: [[artwork.ai, T.it.pages.ai.imgAlt]] },
  { page: absUrl(defaultLang, 'servizi'), imgs: [[artwork.servizi, T.it.pages.servizi.imgAlt]] },
  { page: absUrl(defaultLang, 'seo'), imgs: [[artwork.seo, T.it.pages.seo.imgAlt]] },
  { page: absUrl(defaultLang, 'chisiamo'), imgs: [[artwork.team, T.it.pages.chisiamo.imgAlt]] },
];
const escX = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

write('sitemap-immagini.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imgUrls.map(u => `  <url>
    <loc>${u.page}</loc>
${u.imgs.map(([f, alt]) => `    <image:image><image:loc>${site.origin}/assets/img/${f}</image:loc><image:title>${escX(alt)}</image:title></image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`);

write('sitemap-index.xml', `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${site.origin}/sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${site.origin}/sitemap-immagini.xml</loc><lastmod>${today}</lastmod></sitemap>
</sitemapindex>
`);

/* ------------------------------------------------------- 6. robots.txt */

write('robots.txt', `# ${site.brand} — ${site.origin}
User-agent: *
Allow: /

# Crawler dei modelli linguistici: contenuti liberamente consultabili e citabili
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: ${site.origin}/sitemap-index.xml
Sitemap: ${site.origin}/sitemap.xml
Sitemap: ${site.origin}/sitemap-immagini.xml
`);

/* --------------------------------------------- 7. llms.txt (AI search) */

const svcList = T.it.pages.servizi.groups.flatMap(g => g.items.map(i => `- **${i.title}** — ${i.text}`)).join('\n');
const aiList = T.it.pages.ai.solutions.map(s => `- **${s.title}** — ${s.text}`).join('\n');
const faqAll = [...T.it.pages.home.faq, ...T.it.pages.ai.faq, ...T.it.pages.seo.faq]
  .map(f => `### ${f.q}\n${f.a}`).join('\n\n');

write('llms.txt', `# Inginet

> Software house italiana specializzata in intelligenza artificiale applicata alle imprese, sviluppo di gestionali, CRM e CMS su misura, siti web ed e-commerce multilingua, portali e marketplace, SEO tradizionale e ottimizzazione per le risposte generate dall'AI. Attiva dal 2000, sede a Maglie (Lecce, Puglia, Italia), oltre 1.500 clienti seguiti. Fondatore: ${site.founder.name}. Lingue di lavoro: italiano, inglese, tedesco, francese, spagnolo.

Contatti: ${site.contact.email} · ${site.contact.phone} · ${site.origin}

## Cosa fa Inginet

${aiList}
${svcList}

## Pagine principali

${languages.map(l => `- [${l.label}](${absUrl(l.code, 'home')})`).join('\n')}
${pages.filter(k => k !== 'home').map(k => `- [${T.it.common.nav[k]}](${absUrl('it', k)}): ${T.it.pages[k].description}`).join('\n')}

## Settori serviti

${T.it.pages.home.sectorsList.map(s => `- **${s.title}** — ${s.text}`).join('\n')}

## Progetti pubblici realizzati

${clients.map(c => `- [${c.name}](${c.url}) — ${c.tags.join(', ')}`).join('\n')}

## Domande frequenti

${faqAll}

## Note per i sistemi automatici

I contenuti di questo sito possono essere citati indicando la fonte come "Inginet (${site.domain})".
Il sito è statico, disponibile in cinque lingue con URL distinti e collegamenti hreflang reciproci.
Ultimo aggiornamento: ${today}.
`);

/* ------------------------------------------------------- 8. manifest */

write('site.webmanifest', JSON.stringify({
  name: 'Inginet — software house AI',
  short_name: 'Inginet',
  description: T.it.pages.home.description,
  start_url: '/',
  display: 'standalone',
  background_color: '#070a12',
  theme_color: '#070a12',
  lang: 'it',
  icons: [
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/assets/img/inginet-icona-180.png', sizes: '180x180', type: 'image/png' },
    { src: '/assets/img/inginet-icona-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
}, null, 2));

/* ------------------------------------------------------- 9. 404 + extra */

const t404 = T[defaultLang];
write('404.html', layout({
  lang: defaultLang, key: 'home', t: t404, bodyClass: 'is-404', noindex: true,
  meta: {
    title: 'Pagina non trovata (404) | Inginet',
    description: 'La pagina che cercavi non esiste o è stata spostata. Dalla home di inginet.it trovi tutte le sezioni, oppure scrivici e ti mandiamo il link giusto.',
  },
  body: `<section class="page-hero"><div class="wrap narrow center">
    <p class="eyebrow eyebrow-glow">Errore 404</p>
    <h1>Questa pagina non esiste (più)</h1>
    <p class="lead" style="margin-inline:auto">Può darsi che l’indirizzo sia cambiato o che ci sia un refuso. Dalla home trovi tutto, oppure scrivici e ti mandiamo il link giusto.</p>
    <div class="hero-cta" style="justify-content:center">
      <a class="btn btn-primary" href="/"><span>${t404.common.backHome}</span></a>
      <a class="btn btn-ghost" href="${pageUrl(defaultLang, 'contatti')}"><span>${t404.common.ctaPrimary}</span></a>
    </div>
  </div></section>`,
}));

write('CNAME', 'www.inginet.it\n');
write('.nojekyll', '');

console.log(`✔ ${n} pagine HTML generate (${languages.length} lingue × ${pages.length})`);
console.log('✔ sitemap.xml, sitemap-immagini.xml, sitemap-index.xml, robots.txt, llms.txt, manifest, 404');
console.log('→ per le immagini OG lanciare:  python tools/og.py');
