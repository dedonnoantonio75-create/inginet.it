import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, languages, slugs, navPages, defaultLang } from '../data/site.mjs';

/* impronta dei file statici: forza il browser a ricaricarli dopo un rilascio */
const __dir = path.dirname(fileURLToPath(import.meta.url));
const stamp = (rel) => {
  try {
    const buf = fs.readFileSync(path.join(__dir, '..', 'assets', rel));
    return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
  } catch { return '1'; }
};
export const CSS_V = stamp('css/inginet.css');
export const JS_V = stamp('js/inginet.js');

/* ------------------------------------------------------------------ utils */

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** URL relativa alla root del sito per una pagina in una lingua. */
export function pageUrl(lang, key) {
  const slug = slugs[lang][key];
  const base = lang === defaultLang ? '' : `/${lang}`;
  const u = `${base}/${slug ? slug + '/' : ''}`;
  return u || '/';
}

export const absUrl = (lang, key) => site.origin + pageUrl(lang, key);

/** Percorso del file da scrivere su disco. */
export function outPath(lang, key) {
  const u = pageUrl(lang, key).replace(/^\/|\/$/g, '');
  return u ? `${u}/index.html` : 'index.html';
}

/* ------------------------------------------------------------------ icone */

const ICON = {
  ai: '<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.6"/>',
  code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
  seo: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m21 21-5.4-5.4M8 10.5h5M10.5 8v5"/>',
  bolt: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z"/>',
  shield: '<path d="M12 2.5 20 6v6c0 5-3.4 8.6-8 9.5-4.6-.9-8-4.5-8-9.5V6l8-3.5Z"/><path d="m9 12 2 2 4-4"/>',
  chart: '<path d="M3 21h18M6.5 21V11M11.5 21V4M16.5 21v-7"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M6.5 3h3l1.5 4.5-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2L21 14.5v3a2.5 2.5 0 0 1-2.7 2.5A17 17 0 0 1 3 5.7 2.5 2.5 0 0 1 5.5 3h1Z"/>',
  whatsapp: '<path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.3a8.5 8.5 0 1 1 15.4-4.6Z"/><path d="M8.9 8.4c.3-.6.6-.6 1-.6h.6c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.3.3-.1.6a6 6 0 0 0 2.8 2.4c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5a2 2 0 0 1-1.9 1.9c-.6 0-3-.5-5-2.7s-2.4-4-2.4-4.6c0-.3.1-.5.3-.7Z"/>',
  pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.4 2"/>',
  arrow: '<path d="M5 12h13m-5.5-6 6 6-6 6"/>',
  external: '<path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
  spark: '<path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 11l5.6-1.9L12 3.5Z"/>',
  layers: '<path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z"/><path d="m3 12.5 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
  cookie: '<path d="M21.5 12.4A9.5 9.5 0 1 1 11.6 2.5a4 4 0 0 0 4.3 4.3 4 4 0 0 0 3.7 3.7 4 4 0 0 0 1.9 1.9Z"/><circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none"/><circle cx="8.4" cy="15.2" r="1.1" fill="currentColor" stroke="none"/><circle cx="14" cy="15.6" r="1.1" fill="currentColor" stroke="none"/>',
};

export const icon = (name, cls = '') =>
  `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON[name] || ICON.spark}</svg>`;

/* ------------------------------------------------------------------- logo */

export const logoLockup = (cls = '', eager = false) => `
<span class="logo ${cls}"><img src="/assets/img/inginet-logo.png" alt="Inginet" width="900" height="210"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></span>`;

/* --------------------------------------------------------------- frammenti */

export const btn = (href, label, { variant = 'primary', external = false, ico = null, cls = '' } = {}) =>
  `<a class="btn btn-${variant} ${cls}" href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${ico ? icon(ico) : ''}<span>${esc(label)}</span>${variant === 'primary' && !ico ? icon('arrow', 'ico-arrow') : ''}</a>`;

export const sectionHead = (eyebrow, title, sub) => `
<header class="sec-head">
  ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
  <h2>${title}</h2>
  ${sub ? `<p class="sec-sub">${esc(sub)}</p>` : ''}
</header>`;

export const faqBlock = (title, faq) => `
<section class="sec sec-faq" id="faq">
  <div class="wrap">
    ${sectionHead(null, esc(title))}
    <div class="faq">
      ${faq.map((f, i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary><span>${esc(f.q)}</span>${icon('arrow', 'faq-chev')}</summary>
        <div class="faq-a"><p>${esc(f.a)}</p></div>
      </details>`).join('')}
    </div>
  </div>
</section>`;

export const ctaBlock = (t, lang) => `
<section class="sec sec-cta">
  <div class="wrap">
    <div class="cta-box">
      <div class="cta-glow" aria-hidden="true"></div>
      <div class="cta-txt">
        <h2>${esc(t.common.ctaBoxTitle)}</h2>
        <p>${esc(t.common.ctaBoxText)}</p>
      </div>
      <div class="cta-actions">
        ${btn(pageUrl(lang, 'contatti'), t.common.ctaPrimary, { variant: 'primary' })}
        ${btn(`https://wa.me/${site.contact.whatsapp}`, t.common.ctaWhatsapp, { variant: 'ghost', external: true, ico: 'whatsapp' })}
      </div>
    </div>
  </div>
</section>`;

export const breadcrumb = (t, lang, key) => {
  if (key === 'home') return '';
  return `
<nav class="crumbs" aria-label="${esc(t.common.breadcrumb)}">
  <div class="wrap">
    <ol>
      <li><a href="${pageUrl(lang, 'home')}">${esc(t.common.nav.home)}</a></li>
      <li aria-current="page">${esc(t.common.nav[key])}</li>
    </ol>
  </div>
</nav>`;
};

/* ---------------------------------------------------------------- header */

function langSwitch(lang, key, t) {
  return `
<div class="langsw">
  <button type="button" class="langsw-btn" aria-expanded="false" aria-controls="langmenu" aria-label="${esc(t.common.changeLang)}">
    ${icon('globe')}<span>${lang.toUpperCase()}</span>
  </button>
  <ul id="langmenu" class="langsw-menu" hidden>
    ${languages.map(l => `<li><a hreflang="${l.code}" lang="${l.code}" href="${pageUrl(l.code, key)}"${l.code === lang ? ' aria-current="true"' : ''}><b>${l.short}</b> ${esc(l.label)}</a></li>`).join('')}
  </ul>
</div>`;
}

export const header = (t, lang, key) => `
<a class="skip" href="#main">${esc(t.common.skip)}</a>
<header class="site-head" id="siteHead">
  <div class="wrap head-in">
    <a class="logo-link" href="${pageUrl(lang, 'home')}" aria-label="Inginet — ${esc(t.common.nav.home)}">${logoLockup('', true)}</a>
    <nav class="mainnav" id="mainnav" aria-label="${esc(t.common.menu)}">
      <ul>
        ${navPages.map(p => `<li><a href="${pageUrl(lang, p)}"${p === key ? ' aria-current="page"' : ''}>${esc(t.common.nav[p])}</a></li>`).join('')}
      </ul>
    </nav>
    <div class="head-actions">
      ${langSwitch(lang, key, t)}
      <button type="button" class="icon-btn theme-btn" id="themeBtn" aria-label="Tema chiaro / scuro">${icon('sun', 'i-sun')}${icon('moon', 'i-moon')}</button>
      <a class="btn btn-primary btn-sm head-cta" href="${pageUrl(lang, 'contatti')}"><span>${esc(t.common.ctaPrimary)}</span></a>
      <button type="button" class="icon-btn burger" id="burger" aria-expanded="false" aria-controls="mainnav" aria-label="${esc(t.common.menu)}"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;

/* ---------------------------------------------------------------- footer */

export const footer = (t, lang) => {
  const L = site.legal;
  return `
<footer class="site-foot">
  <div class="wrap foot-in">
    <div class="foot-brand">
      ${logoLockup('logo-lg')}
      <p>${esc(t.common.footer.tagline)}</p>
      <p class="foot-made">${esc(t.common.footer.madeBy)}</p>
    </div>
    <nav class="foot-col" aria-label="${esc(t.common.footer.navTitle)}">
      <h3>${esc(t.common.footer.navTitle)}</h3>
      <ul>${navPages.map(p => `<li><a href="${pageUrl(lang, p)}">${esc(t.common.nav[p])}</a></li>`).join('')}</ul>
    </nav>
    <div class="foot-col">
      <h3>${esc(t.common.footer.contactTitle)}</h3>
      <ul class="foot-contact">
        <li>${icon('mail')}<a href="mailto:${site.contact.email}">${site.contact.email}</a></li>
        <li>${icon('whatsapp')}<a href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener">${esc(site.contact.phone)}</a></li>
        <li>${icon('pin')}<span>${esc(L.street)}<br>${esc(L.postalCode)} ${esc(L.city)} (${esc(L.province)}) — ${esc(L.countryName)}</span></li>
      </ul>
    </div>
    <div class="foot-col">
      <h3>${esc(t.common.footer.legalTitle)}</h3>
      <ul>
        <li><a href="${pageUrl(lang, 'privacy')}">${esc(t.common.nav.privacy)}</a></li>
        <li><a href="${pageUrl(lang, 'cookie')}">${esc(t.common.nav.cookie)}</a></li>
      </ul>
      <p class="foot-vat">${esc(L.ragioneSociale)}<br>${esc(t.common.footer.vat)} ${esc(L.piva)}</p>
    </div>
  </div>
  <div class="wrap foot-bar">
    <p>© ${site.founded}–2026 ${site.brand}. ${esc(t.common.footer.rights)}</p>
    <ul class="foot-langs">${languages.map(l => `<li><a hreflang="${l.code}" href="${pageUrl(l.code, 'home')}"${l.code === lang ? ' aria-current="true"' : ''}>${l.short}</a></li>`).join('')}</ul>
  </div>
</footer>
<a class="wa-float" href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener" aria-label="${esc(t.common.ctaWhatsapp)}">${icon('whatsapp')}</a>`;
};


/* ------------------------------------------------------- consenso cookie */

export const consentBanner = (t, lang) => {
  const c = t.common.consent;
  return `
<aside class="cc" id="cc" aria-live="polite">
  <div class="cc-panel" id="ccPanel" role="dialog" aria-modal="false" aria-labelledby="ccTitle" hidden>
    <div class="cc-head">${icon('cookie')}<h2 id="ccTitle">${esc(c.title)}</h2></div>
    <p>${esc(c.text)} <a href="${pageUrl(lang, 'cookie')}">${esc(t.common.nav.cookie)}</a> · <a href="${pageUrl(lang, 'privacy')}">${esc(t.common.nav.privacy)}</a></p>
    <div class="cc-prefs" id="ccPrefs" hidden>
      <div class="cc-row">
        <div><b>${esc(c.necessaryTitle)}</b><span>${esc(c.necessaryText)}</span></div>
        <span class="cc-fixed">${esc(c.always)}</span>
      </div>
      <div class="cc-row">
        <div><b>${esc(c.statsTitle)}</b><span>${esc(c.statsText)}</span></div>
        <label class="cc-switch"><input type="checkbox" id="ccStats" aria-label="${esc(c.statsTitle)}"><i></i></label>
      </div>
    </div>
    <div class="cc-actions">
      <button type="button" class="btn btn-primary" id="ccAccept"><span>${esc(c.accept)}</span></button>
      <button type="button" class="btn btn-ghost" id="ccReject"><span>${esc(c.reject)}</span></button>
    </div>
    <button type="button" class="cc-link" id="ccPrefsBtn">${esc(c.prefs)}</button>
    <button type="button" class="cc-link" id="ccSave" hidden>${esc(c.save)}</button>
  </div>
  <button type="button" class="cc-tab" id="ccTab" hidden aria-expanded="false" aria-controls="ccPanel">
    ${icon('cookie')}<span>${esc(c.reopen)}</span><span class="cc-dot" id="ccDot" aria-hidden="true"></span>
  </button>
</aside>`;
};

/* -------------------------------------------------------------- JSON-LD */

function orgSchema(lang, t) {
  const L = site.legal;
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${site.origin}/#organization`,
    name: site.brand,
    legalName: L.ragioneSociale,
    url: site.origin + '/',
    logo: { '@type': 'ImageObject', url: `${site.origin}/assets/img/inginet-logo.png`, width: 900, height: 210 },
    image: `${site.origin}/assets/img/og/inginet-og-${lang}.png`,
    email: site.contact.email,
    telephone: site.contact.phoneRaw,
    vatID: L.piva,
    foundingDate: String(site.founded),
    founder: { '@type': 'Person', name: site.founder.name, jobTitle: site.founder.role },
    address: {
      '@type': 'PostalAddress',
      streetAddress: L.street,
      addressLocality: L.city,
      addressRegion: L.province,
      postalCode: L.postalCode,
      addressCountry: L.country,
    },
    areaServed: [
      { '@type': 'Country', name: 'Italia' },
      { '@type': 'AdministrativeArea', name: 'Puglia' },
      { '@type': 'Place', name: 'Europa' },
    ],
    availableLanguage: languages.map(l => l.label),
    sameAs: Object.values(site.social).filter(Boolean),
    knowsAbout: [
      'Artificial intelligence software development',
      'AI agents for business',
      'Custom management software',
      'CRM development',
      'Headless CMS',
      'E-commerce development',
      'Search engine optimization',
      'Generative engine optimization',
      'Multilingual websites',
    ],
    slogan: t.pages.home.hero.h1,
  };
}

function siteSchema(lang) {
  return {
    '@type': 'WebSite',
    '@id': `${site.origin}/#website`,
    url: site.origin + '/',
    name: site.brand,
    inLanguage: lang,
    publisher: { '@id': `${site.origin}/#organization` },
  };
}

export function jsonLd(lang, key, t, extra = []) {
  const graph = [orgSchema(lang, t), siteSchema(lang)];
  const p = t.pages[key];

  graph.push({
    '@type': 'WebPage',
    '@id': absUrl(lang, key) + '#webpage',
    url: absUrl(lang, key),
    name: p.title,
    description: p.description,
    inLanguage: lang,
    isPartOf: { '@id': `${site.origin}/#website` },
    about: { '@id': `${site.origin}/#organization` },
  });

  if (key !== 'home') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.common.nav.home, item: absUrl(lang, 'home') },
        { '@type': 'ListItem', position: 2, name: t.common.nav[key], item: absUrl(lang, key) },
      ],
    });
  }

  if (p.faq && p.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': absUrl(lang, key) + '#faq',
      mainEntity: p.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  graph.push(...extra);
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}

/* ----------------------------------------------------------------- layout */

export function layout({ lang, key, t, body, extraSchema = [], bodyClass = '', noindex = false, meta = null }) {
  const p = meta ? { ...t.pages[key], ...meta } : t.pages[key];
  const canonical = absUrl(lang, key);
  const alts = noindex ? '' : languages
    .map(l => `<link rel="alternate" hreflang="${l.hreflang}" href="${absUrl(l.code, key)}">`)
    .join('\n  ');

  return `<!doctype html>
<html lang="${lang}" data-page="${key}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="keywords" content="${esc(p.keywords)}">
<meta name="author" content="${esc(site.brand)}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}">
${noindex ? '' : `<link rel="canonical" href="${canonical}">
  ${alts}
<link rel="alternate" hreflang="x-default" href="${absUrl(defaultLang, key)}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.brand)}">
<meta property="og:locale" content="${languages.find(l => l.code === lang).locale}">
${languages.filter(l => l.code !== lang).map(l => `<meta property="og:locale:alternate" content="${l.locale}">`).join('\n')}
${noindex ? '' : `<meta property="og:url" content="${canonical}">`}
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="${site.origin}/assets/img/og/inginet-og-${lang}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.brand)} — ${esc(p.description.slice(0, 110))}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${site.origin}/assets/img/og/inginet-og-${lang}.png">
<meta name="theme-color" content="#070a12">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/img/inginet-icona-180.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/space-grotesk-700-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-400-latin.woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/assets/css/inginet.css?v=${CSS_V}">
<script>(function(){try{var t=localStorage.getItem('ing-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();</script>
${noindex ? '' : jsonLd(lang, key, t, extraSchema)}
</head>
<body class="${bodyClass}">
${header(t, lang, key)}
<main id="main">
${breadcrumb(t, lang, key)}
${body}
</main>
${footer(t, lang)}
${consentBanner(t, lang)}
<script src="/assets/js/inginet.js?v=${JS_V}" defer></script>
</body>
</html>`;
}
