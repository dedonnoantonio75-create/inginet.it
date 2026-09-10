import { site, clients, platforms, photos } from '../data/site.mjs';
import { esc, icon, btn, pageUrl, absUrl, sectionHead, faqBlock, ctaBlock } from './render.mjs';

const FOTO = '/assets/img/foto/';

const srcset = (p, est) => p.widths.map(w => `${FOTO}${p.file}-${w}.${est} ${w}w`).join(', ');

/* Catena AVIF -> WebP -> JPEG: ogni browser prende il primo formato che sa
   leggere, quindi i moderni scaricano pochissimo e i vecchi vedono comunque
   la foto. Su schermo stretto entra la versione verticale, dove esiste.
   width/height dichiarati: la pagina non salta mentre l'immagine carica. */
const photo = (key, alt, { mobile = null, eager = false } = {}) => {
  const p = photos[key];
  const m = mobile ? photos[mobile] : null;
  /* width/height su OGNI sorgente: la verticale del telefono ha proporzioni
     diverse dall'orizzontale, e senza queste il browser riserva lo spazio
     sbagliato e la pagina salta quando la foto arriva. */
  const src = (ph, est, media) =>
    `<source type="image/${est}" ${media ? `media="${media}" ` : ''}srcset="${srcset(ph, est)}" ` +
    `sizes="${media ? '100vw' : '(max-width: 900px) 92vw, 46vw'}" width="${ph.w}" height="${ph.h}">`;
  const mq = '(max-width: 640px)';
  const fonti = [];
  if (m) { fonti.push(src(m, 'avif', mq), src(m, 'webp', mq)); }
  fonti.push(src(p, 'avif'), src(p, 'webp'));
  return `<picture class="art-wrap">
  ${fonti.join('\n  ')}
  <img class="art" src="${FOTO}${p.file}.jpg" alt="${esc(alt)}" width="${p.w}" height="${p.h}"
       ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
</picture>`;
};

const heroBg = `<div class="hero-bg" aria-hidden="true"><span class="orb orb-a"></span><span class="orb orb-b"></span><span class="orb orb-c"></span><span class="grid-fade"></span></div>`;

/* ---------------------------------------------------------------- loghi */

function logoTile(c, t) {
  const dark = c.tile === 'dark';
  const isSvg = c.logo.endsWith('.svg');
  const alt = `${c.name} — sito web e software realizzati da Inginet`;
  return `
<a class="ctile${dark ? ' ctile-dark' : ''}" href="${esc(c.url)}" target="_blank" rel="noopener" data-sector="${c.sector}" title="${esc(c.name)} — ${esc(t.common.visitSite)}">
  <span class="ctile-logo">${isSvg
      ? `<img src="/assets/img/clienti/${c.logo}" alt="${esc(alt)}" width="220" height="120" loading="lazy" decoding="async">`
      : `<img src="/assets/img/clienti/${c.logo}" alt="${esc(alt)}" width="200" height="200" loading="lazy" decoding="async">`}</span>
  <span class="ctile-meta">
    <span class="ctile-name">${esc(c.name)}</span>
    <span class="ctile-tags">${c.tags.slice(0, 3).map(x => `<em>${esc(x)}</em>`).join('')}</span>
  </span>
  <span class="ctile-go" aria-hidden="true">${icon('external')}</span>
  <span class="sr-only">${esc(t.common.opensNewTab)}</span>
</a>`;
}

/* ----------------------------------------------------------------- HOME */

export function home(t, lang) {
  const p = t.pages.home;
  const marquee = clients.filter(c => !c.logo.endsWith('.svg')).slice(0, 18);

  return `
<section class="hero">
  ${heroBg}
  <div class="wrap hero-in">
    <div class="hero-txt">
      <p class="eyebrow eyebrow-glow">${icon('spark')}${esc(p.hero.eyebrow)}</p>
      <h1>${esc(p.hero.h1)}</h1>
      <p class="lead">${esc(p.hero.lead)}</p>
      <div class="hero-cta">
        ${btn(pageUrl(lang, 'contatti'), p.hero.ctaPrimary, { variant: 'primary' })}
        ${btn(pageUrl(lang, 'clienti'), p.hero.ctaSecondary, { variant: 'ghost' })}
      </div>
      <dl class="stats">
        ${p.stats.map(s => `<div><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join('')}
      </dl>
    </div>
    <div class="hero-art">${photo('hero', p.hero.imgAlt, { mobile: 'heroMobile', eager: true })}</div>
  </div>
</section>

<section class="sec sec-logos">
  <div class="wrap">
    ${sectionHead(null, esc(p.logosTitle), p.logosSub)}
  </div>
  <div class="marquee" aria-label="${esc(p.logosTitle)}">
    <div class="marquee-track">
      ${[0, 1].map(() => marquee.map(c => `
      <a class="mlogo${c.tile === 'dark' ? ' mlogo-dark' : ''}" href="${esc(c.url)}" target="_blank" rel="noopener" title="${esc(c.name)}">
        <img src="/assets/img/clienti/${c.logo}" alt="${esc(c.name)} — cliente Inginet" width="160" height="160" loading="lazy" decoding="async">
      </a>`).join('')).join('')}
    </div>
  </div>
  <div class="wrap center"><a class="link-more" href="${pageUrl(lang, 'clienti')}">${esc(t.common.ctaSecondary)} ${icon('arrow')}</a></div>
</section>

<section class="sec">
  <div class="wrap">
    ${sectionHead(null, esc(p.servicesTitle), p.servicesSub)}
    <div class="cards cards-4">
      ${p.services.map(s => `
      <article class="card card-svc">
        <span class="card-ico">${icon(s.icon)}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
        <ul class="ticks">${s.bullets.map(b => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
        <a class="card-link" href="${pageUrl(lang, s.link)}">${esc(t.common.readMore)} ${icon('arrow')}</a>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="sec sec-olvix">
  <div class="wrap olvix-in">
    <div class="olvix-txt">
      <p class="eyebrow">${esc(p.olvix.eyebrow)}</p>
      <h2>${esc(p.olvix.title)}</h2>
      <p>${esc(p.olvix.text)}</p>
      <ul class="ticks">${p.olvix.bullets.map(b => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
      ${btn('https://www.olvix.net/', p.olvix.cta, { variant: 'primary', external: true, ico: 'external' })}
    </div>
    <div class="olvix-art">
      <div class="olvix-card">
        <img src="/assets/img/clienti/olvix-marketplace-logo.png" alt="Olvix — marketplace nazionale progettato e sviluppato da Inginet" width="640" height="292" loading="lazy" decoding="async">
        <ul class="chips"><li>marketplace</li><li>multi-vendor</li><li>pagamenti</li><li>AI</li><li>antispreco</li><li>5 lingue</li></ul>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${sectionHead(null, esc(p.processTitle), p.processSub)}
    <ol class="steps">
      ${p.process.map(s => `<li><span class="step-n">${esc(s.n)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    ${sectionHead(null, esc(p.sectorsTitle), p.sectorsSub)}
    <div class="cards cards-3">
      ${p.sectorsList.map(s => `<article class="card card-plain"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${sectionHead(null, esc(p.whyTitle))}
    <div class="cards cards-2">
      ${p.why.map(w => `<article class="card card-why"><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></article>`).join('')}
    </div>
  </div>
</section>

${faqBlock(t.common.faqTitle, p.faq)}
${ctaBlock(t, lang)}`;
}

/* ------------------------------------------------------------------- AI */

export function ai(t, lang) {
  const p = t.pages.ai;
  return `
<section class="page-hero">
  ${heroBg}
  <div class="wrap page-hero-in">
    <div>
      <h1>${esc(p.h1)}</h1>
      <p class="lead">${esc(p.lead)}</p>
      <div class="hero-cta">${btn(pageUrl(lang, 'contatti'), t.common.ctaPrimary, { variant: 'primary' })}</div>
    </div>
    <div class="page-hero-art">${photo('ai', p.imgAlt, { eager: true })}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap narrow">
    <h2>${esc(p.intro.title)}</h2>
    <p class="big">${esc(p.intro.text)}</p>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    ${sectionHead(null, esc(p.solutionsTitle))}
    <div class="cards cards-3">
      ${p.solutions.map(s => `
      <article class="card card-sol">
        <span class="tag">${esc(s.tag)}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div>
      <h2>${esc(p.integrationTitle)}</h2>
      <p class="big">${esc(p.integrationText)}</p>
    </div>
    <ul class="ticks ticks-lg">${p.integrationBullets.map(b => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    ${sectionHead(null, esc(p.casesTitle))}
    <div class="cards cards-2">
      ${p.cases.map(c => `<article class="card card-plain"><h3>${esc(c.sector)}</h3><p>${esc(c.text)}</p></article>`).join('')}
    </div>
  </div>
</section>

${faqBlock(t.common.faqTitle, p.faq)}
${ctaBlock(t, lang)}`;
}

/* -------------------------------------------------------------- SERVIZI */

export function servizi(t, lang) {
  const p = t.pages.servizi;
  return `
<section class="page-hero">
  ${heroBg}
  <div class="wrap page-hero-in">
    <div>
      <h1>${esc(p.h1)}</h1>
      <p class="lead">${esc(p.lead)}</p>
      <div class="hero-cta">${btn(pageUrl(lang, 'contatti'), t.common.ctaPrimary, { variant: 'primary' })}</div>
    </div>
    <div class="page-hero-art">${photo('servizi', p.imgAlt, { eager: true })}</div>
  </div>
</section>

${p.groups.map((g, gi) => `
<section class="sec${gi % 2 ? ' sec-alt' : ''}">
  <div class="wrap">
    ${sectionHead(null, esc(g.title))}
    <div class="cards cards-${g.items.length >= 3 ? '3' : '2'}">
      ${g.items.map(it => `
      <article class="card card-svc">
        <h3>${esc(it.title)}</h3>
        <p>${esc(it.text)}</p>
        <ul class="ticks">${it.bullets.map(b => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
      </article>`).join('')}
    </div>
  </div>
</section>`).join('')}


<section class="sec sec-gest" id="gestionali">
  <div class="wrap">
    ${sectionHead(null, esc(p.gestionaliTitle), p.gestionaliSub)}
    <div class="cards cards-2">
      ${platforms.map(pf => {
        const g = p.gestionali[pf.key];
        return `
      <a class="card card-gest" href="${esc(pf.url)}" target="_blank" rel="noopener">
        <span class="gest-logo"><img src="/assets/img/clienti/${pf.logo}" alt="${esc(pf.name)} — gestionale sviluppato da Inginet" width="240" height="120" loading="lazy" decoding="async"></span>
        <h3>${esc(pf.name)}</h3>
        <p>${esc(g.text)}</p>
        <span class="ctile-tags">${g.tags.map(x => `<em>${esc(x)}</em>`).join('')}</span>
        <span class="card-link">${esc(t.common.visitSite)} ${icon('external')}</span>
      </a>`;
      }).join('')}
    </div>
  </div>
</section>

${faqBlock(t.common.faqTitle, p.faq)}
${ctaBlock(t, lang)}`;
}

/* ------------------------------------------------------------------ SEO */

export function seo(t, lang) {
  const p = t.pages.seo;
  return `
<section class="page-hero">
  ${heroBg}
  <div class="wrap page-hero-in">
    <div>
      <h1>${esc(p.h1)}</h1>
      <p class="lead">${esc(p.lead)}</p>
      <div class="hero-cta">${btn(pageUrl(lang, 'contatti'), t.common.ctaPrimary, { variant: 'primary' })}</div>
    </div>
    <div class="page-hero-art">${photo('seo', p.imgAlt, { eager: true })}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${sectionHead(null, esc(p.twoTitle))}
    <div class="cards cards-2">
      ${p.two.map((c, i) => `
      <article class="card card-big">
        <span class="card-ico">${icon(i === 0 ? 'seo' : 'ai')}</span>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.text)}</p>
        <ul class="ticks">${c.bullets.map(b => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    ${sectionHead(null, esc(p.workTitle))}
    <div class="cards cards-3">
      ${p.work.map(w => `<article class="card card-plain"><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap narrow center">
    <span class="card-ico big-ico">${icon('bolt')}</span>
    <h2>${esc(p.thisSiteTitle)}</h2>
    <p class="big">${esc(p.thisSiteText)}</p>
  </div>
</section>

${faqBlock(t.common.faqTitle, p.faq)}
${ctaBlock(t, lang)}`;
}

/* -------------------------------------------------------------- CLIENTI */

export function clienti(t, lang) {
  const p = t.pages.clienti;
  const featured = clients.filter(c => c.featured);
  const usedSectors = [...new Set(clients.map(c => c.sector))];

  return `
<section class="page-hero page-hero-slim">
  ${heroBg}
  <div class="wrap">
    <h1>${esc(p.h1)}</h1>
    <p class="lead">${esc(p.lead)}</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${sectionHead(null, esc(p.featuredTitle))}
    <div class="cards cards-3">
      ${featured.map(c => `
      <a class="card card-feat${c.tile === 'dark' ? ' feat-dark' : ''}" href="${esc(c.url)}" target="_blank" rel="noopener">
        <span class="feat-logo"><img src="/assets/img/clienti/${c.logo}" alt="${esc(c.name)} — progetto realizzato da Inginet" width="200" height="200" loading="lazy" decoding="async"></span>
        <h3>${esc(c.name)}</h3>
        <span class="ctile-tags">${c.tags.map(x => `<em>${esc(x)}</em>`).join('')}</span>
        <span class="card-link">${esc(t.common.visitSite)} ${icon('external')}</span>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="sec sec-alt" id="tutti">
  <div class="wrap">
    ${sectionHead(null, esc(p.allTitle))}
    <div class="filters" role="group" aria-label="${esc(p.filterLabel)}">
      <button type="button" class="chip is-on" data-filter="tutti">${esc(t.common.sectors.tutti)}</button>
      ${usedSectors.map(s => `<button type="button" class="chip" data-filter="${s}">${esc(t.common.sectors[s] || s)}</button>`).join('')}
    </div>
    <p class="filter-count"><span id="cCount">${clients.length}</span> ${esc(p.counterLabel)}</p>
    <div class="ctiles" id="ctiles">
      ${clients.map(c => logoTile(c, t)).join('')}
    </div>
    <p class="note">${esc(p.note)}</p>
  </div>
</section>

${faqBlock(t.common.faqTitle, p.faq)}
${ctaBlock(t, lang)}`;
}

/* ------------------------------------------------------------- CHI SIAMO */

export function chisiamo(t, lang) {
  const p = t.pages.chisiamo;
  return `
<section class="page-hero">
  ${heroBg}
  <div class="wrap page-hero-in">
    <div>
      <h1>${esc(p.h1)}</h1>
      <p class="lead">${esc(p.lead)}</p>
    </div>
    <div class="page-hero-art">${photo('team', p.imgAlt, { eager: true })}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div>
      <h2>${esc(p.founderTitle)}</h2>
      <blockquote class="quote">${esc(p.founderText)}</blockquote>
      <p class="sig">${esc(site.founder.name)} — <em>${esc(site.founder.role)}</em></p>
    </div>
    <div>
      <h2>${esc(p.teamTitle)}</h2>
      <p class="big">${esc(p.teamText)}</p>
      <h2 class="mt">${esc(p.techTitle)}</h2>
      <p class="big">${esc(p.techText)}</p>
    </div>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    ${sectionHead(null, esc(p.valuesTitle))}
    <div class="cards cards-2">
      ${p.values.map(v => `<article class="card card-plain"><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${sectionHead(null, esc(p.timelineTitle))}
    <ol class="timeline">
      ${p.timeline.map(x => `<li><span class="tl-year">${esc(x.year)}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div></li>`).join('')}
    </ol>
  </div>
</section>

${faqBlock(t.common.faqTitle, p.faq)}
${ctaBlock(t, lang)}`;
}

/* -------------------------------------------------------------- CONTATTI */

export function contatti(t, lang) {
  const p = t.pages.contatti;
  const L = site.legal;
  const maps = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${L.street}, ${L.postalCode} ${L.city} ${L.province}`)}`;

  return `
<section class="page-hero page-hero-slim">
  ${heroBg}
  <div class="wrap">
    <h1>${esc(p.h1)}</h1>
    <p class="lead">${esc(p.lead)}</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${sectionHead(null, esc(p.channelsTitle))}
    <div class="cards cards-4">
      <a class="card card-ch" href="mailto:${site.contact.email}">
        <span class="card-ico">${icon('mail')}</span><h3>${esc(p.emailLabel)}</h3>
        <p class="ch-val">${site.contact.email}</p><p>${esc(p.emailNote)}</p>
      </a>
      <a class="card card-ch" href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener">
        <span class="card-ico">${icon('whatsapp')}</span><h3>${esc(p.whatsappLabel)}</h3>
        <p class="ch-val">${esc(site.contact.phone)}</p><p>${esc(p.whatsappNote)}</p>
      </a>
      <a class="card card-ch" href="tel:${site.contact.phoneRaw}">
        <span class="card-ico">${icon('phone')}</span><h3>${esc(p.phoneLabel)}</h3>
        <p class="ch-val">${esc(site.contact.phone)}</p><p>${esc(p.phoneNote)}</p>
      </a>
      <a class="card card-ch" href="${maps}" target="_blank" rel="noopener">
        <span class="card-ico">${icon('pin')}</span><h3>${esc(p.addressLabel)}</h3>
        <p class="ch-val">${esc(L.street)}, ${esc(L.postalCode)} ${esc(L.city)} (${esc(L.province)})</p><p>${esc(p.addressNote)}</p>
      </a>
    </div>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap split split-form">
    <div>
      <h2>${esc(p.formTitle)}</h2>
      <p>${esc(p.formIntro)}</p>
      <!-- Invio vero: la richiesta arriva nella casella info@inginet.it.
           _honey e' un campo trappola invisibile: i robot lo riempiono e la
           richiesta viene scartata. _captcha aggiunge la verifica antispam. -->
      <form class="cform" action="https://formsubmit.co/${site.contact.formTo}" method="POST" accept-charset="UTF-8">
        <input type="hidden" name="_subject" value="${esc(p.form.subject)}">
        <input type="hidden" name="_cc" value="${site.contact.formCc}">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="true">
        <input type="hidden" name="_next" value="${site.origin}${pageUrl(lang, 'home')}${t.common.grazie.slug}/">
        <input type="hidden" name="_language" value="${lang}">
        <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" class="trappola">
        <div class="f-row">
          <label>${esc(p.form.name)}<input type="text" name="Nome" required autocomplete="name" placeholder="${esc(p.form.namePh)}"></label>
          <label>${esc(p.form.company)}<input type="text" name="Azienda" autocomplete="organization" placeholder="${esc(p.form.companyPh)}"></label>
        </div>
        <div class="f-row">
          <label>${esc(p.form.email)}<input type="email" name="Email" required autocomplete="email" placeholder="${esc(p.form.emailPh)}"></label>
          <label>${esc(p.form.phone)}<input type="tel" name="Telefono" autocomplete="tel" placeholder="${esc(p.form.phonePh)}"></label>
        </div>
        <label>${esc(p.form.topic)}
          <select name="Richiesta">${p.form.topics.map(o => `<option>${esc(o)}</option>`).join('')}</select>
        </label>
        <label>${esc(p.form.message)}
          <textarea name="Messaggio" rows="6" required placeholder="${esc(p.form.messagePh)}"></textarea>
        </label>
        <label class="f-check">
          <input type="checkbox" name="Consenso privacy" value="si" required>
          <span>${esc(p.form.privacyCheck)} <a href="${pageUrl(lang, 'privacy')}">${esc(t.common.nav.privacy)}</a></span>
        </label>
        <button type="submit" class="btn btn-primary">${icon('mail')}<span>${esc(p.form.submit)}</span></button>
        <p class="note">${esc(p.form.privacyNote)}</p>
      </form>
    </div>
    <aside class="contact-aside">
      <h2>${esc(p.hoursTitle)}</h2>
      <ul class="hours">${p.hours.map(h => `<li><span>${esc(h.d)}</span><b>${esc(h.h)}</b></li>`).join('')}</ul>
      <div class="aside-card">
        <span class="card-ico">${icon('pin')}</span>
        <p><b>${esc(L.ragioneSociale)}</b><br>${esc(L.street)}<br>${esc(L.postalCode)} ${esc(L.city)} (${esc(L.province)})<br>${esc(L.countryName)}</p>
        <a class="link-more" href="${maps}" target="_blank" rel="noopener">${esc(p.mapLabel)} ${icon('external')}</a>
      </div>
    </aside>
  </div>
</section>

${faqBlock(t.common.faqTitle, p.faq)}`;
}

/* ------------------------------------------------------------ LEGAL PAGES */

function legalPage(p) {
  return `
<section class="page-hero page-hero-slim">
  ${heroBg}
  <div class="wrap">
    <h1>${esc(p.h1)}</h1>
    <p class="upd">${esc(p.updated)}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap narrow prose">
    <p class="big">${esc(p.intro)}</p>
    ${p.sections.map(s => `<h2>${esc(s.h)}</h2><p>${esc(s.p)}</p>`).join('')}
  </div>
</section>`;
}

export const privacy = t => legalPage(t.pages.privacy);
export const cookie = t => legalPage(t.pages.cookie);

/* ------------------------------------------------------- schema extra */

/* Una foto sola per pagina, dichiarata come ImageObject: i motori sanno che
   e l'immagine principale, e i modelli AI leggono didascalia e descrizione. */
const FOTO_PAGINA = { home: 'hero', ai: 'ai', servizi: 'servizi', seo: 'seo', chisiamo: 'team' };

function imageSchema(key, t, lang) {
  const k = FOTO_PAGINA[key];
  if (!k) return [];
  const p = photos[k];
  const alt = key === 'home' ? t.pages.home.hero.imgAlt : t.pages[key].imgAlt;
  const url = `${site.origin}/assets/img/foto/${p.file}.jpg`;
  return [{
    '@type': 'ImageObject',
    '@id': absUrl(lang, key) + '#immagine',
    contentUrl: url,
    url,
    width: p.w,
    height: p.h,
    caption: alt,
    description: alt,
    name: alt,
    inLanguage: lang,
    representativeOfPage: true,
    creditText: site.brand,
    creator: { '@id': `${site.origin}/#organization` },
    copyrightNotice: `© ${site.brand}`,
  }];
}

export function extraSchemaFor(key, t, lang) {
  const img = imageSchema(key, t, lang);
  if (key === 'clienti') {
    return [...img, {
      '@type': 'ItemList',
      '@id': absUrl(lang, 'clienti') + '#portfolio',
      name: t.pages.clienti.h1,
      numberOfItems: clients.length,
      itemListElement: clients.map((c, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'Organization', name: c.name, url: c.url },
      })),
    }];
  }
  if (key === 'servizi' || key === 'ai' || key === 'seo') {
    const p = t.pages[key];
    const names = key === 'servizi'
      ? p.groups.flatMap(g => g.items.map(i => i.title))
      : (p.solutions || p.work).map(s => s.title);
    return [...img, {
      '@type': 'Service',
      '@id': absUrl(lang, key) + '#service',
      name: p.h1,
      description: p.description,
      serviceType: p.h1,
      provider: { '@id': `${site.origin}/#organization` },
      areaServed: { '@type': 'Country', name: 'Italia' },
      availableChannel: { '@type': 'ServiceChannel', serviceUrl: absUrl(lang, 'contatti') },
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: p.h1,
        itemListElement: names.map(n => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
      },
    }];
  }
  if (key === 'contatti') {
    const L = site.legal;
    return [...img, {
      '@type': 'ContactPage',
      '@id': absUrl(lang, 'contatti') + '#contactpage',
      mainEntity: {
        '@type': 'LocalBusiness',
        name: site.brand,
        image: `${site.origin}/assets/img/og/inginet-og-${lang}.png`,
        email: site.contact.email,
        telephone: site.contact.phoneRaw,
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress', streetAddress: L.street, addressLocality: L.city,
          addressRegion: L.province, postalCode: L.postalCode, addressCountry: L.country,
        },
        geo: { '@type': 'GeoCoordinates', latitude: L.lat, longitude: L.lon },
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '13:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '15:00', closes: '18:30' },
        ],
      },
    }];
  }
  return img;
}

export const renderers = { home, ai, servizi, seo, clienti, chisiamo, contatti, privacy, cookie };
