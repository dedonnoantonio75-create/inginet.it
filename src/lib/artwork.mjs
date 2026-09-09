/* Illustrazioni SVG originali generate a build time.
   Ogni file porta <title>/<desc> interni (accessibilità + indicizzazione)
   e un nome file descrittivo, deciso in src/data/site.mjs. */

const defs = (id) => `
<defs>
  <linearGradient id="${id}g1" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffb43d"/><stop offset=".5" stop-color="#ff9c00"/><stop offset="1" stop-color="#2d7dff"/>
  </linearGradient>
  <linearGradient id="${id}g2" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1a2440"/><stop offset="1" stop-color="#0c1424"/>
  </linearGradient>
  <linearGradient id="${id}g3" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#2d7dff"/><stop offset="1" stop-color="#6aa5ff"/>
  </linearGradient>
  <radialGradient id="${id}glow" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#ff9c00" stop-opacity=".55"/><stop offset="1" stop-color="#ff9c00" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${id}glow2" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#2d7dff" stop-opacity=".5"/><stop offset="1" stop-color="#2d7dff" stop-opacity="0"/>
  </radialGradient>
  <filter id="${id}soft" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="9"/>
  </filter>
</defs>`;

const head = (w, h, title, desc) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="ttl dsc">
<title id="ttl">${title}</title><desc id="dsc">${desc}</desc>`;

const win = (id, x, y, w, h, r = 18, fill = `url(#${id}g2)`) => `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="#243352" stroke-width="1.5"/>
<path d="M${x} ${y + 34}h${w}" stroke="#243352" stroke-width="1.5"/>
<circle cx="${x + 18}" cy="${y + 17}" r="4" fill="#ff5f57"/><circle cx="${x + 33}" cy="${y + 17}" r="4" fill="#ffbd2e"/><circle cx="${x + 48}" cy="${y + 17}" r="4" fill="#28c840"/>`;

/* ------------------------------------------------------------------ HERO */

export function heroArt() {
  const id = 'h';
  return `${head(900, 760, 'Inginet: sviluppo software con intelligenza artificiale',
    'Illustrazione di una piattaforma software: pannello di controllo centrale, rete neurale collegata, moduli di intelligenza artificiale, codice e indicizzazione.')}
${defs(id)}
<ellipse cx="300" cy="230" rx="270" ry="230" fill="url(#${id}glow)"/>
<ellipse cx="640" cy="520" rx="250" ry="220" fill="url(#${id}glow2)"/>

<!-- rete di nodi sullo sfondo -->
<g stroke="url(#${id}g1)" stroke-width="1.2" opacity=".45" fill="none">
  <path d="M120 120 L300 190 L470 110 L690 180"/>
  <path d="M120 120 L180 320 L300 190"/>
  <path d="M690 180 L760 350 L620 430"/>
  <path d="M180 320 L360 400 L620 430"/>
  <path d="M360 400 L300 620 L560 660 L620 430"/>
</g>
<g fill="url(#${id}g1)">
  ${[[120, 120], [300, 190], [470, 110], [690, 180], [180, 320], [760, 350], [360, 400], [620, 430], [300, 620], [560, 660]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}
</g>

<!-- pannello principale -->
${win(id, 150, 210, 520, 340, 22)}
<rect x="180" y="266" width="160" height="12" rx="6" fill="#2b3b5e"/>
<rect x="180" y="292" width="104" height="12" rx="6" fill="#22304d"/>
<!-- barre -->
<g>
  <rect x="182" y="470" width="34" height="42" rx="8" fill="#22304d"/>
  <rect x="228" y="440" width="34" height="72" rx="8" fill="#2b3b5e"/>
  <rect x="274" y="404" width="34" height="108" rx="8" fill="url(#${id}g3)"/>
  <rect x="320" y="368" width="34" height="144" rx="8" fill="url(#${id}g1)"/>
</g>
<!-- curva -->
<path d="M390 480 C430 470 440 400 480 392 C520 384 540 430 580 412 C610 398 620 350 645 340"
      fill="none" stroke="url(#${id}g1)" stroke-width="4" stroke-linecap="round"/>
<circle cx="645" cy="340" r="7" fill="#ffb43d"/>
<circle cx="645" cy="340" r="14" fill="none" stroke="#ffb43d" stroke-opacity=".4" stroke-width="2"/>

<!-- scheda AI -->
<g>
  <rect x="520" y="120" width="260" height="150" rx="20" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.5"/>
  <circle cx="560" cy="165" r="18" fill="none" stroke="url(#${id}g1)" stroke-width="3"/>
  <path d="M560 152v-9M560 187v-9M543 165h-9M586 165h-9" stroke="url(#${id}g1)" stroke-width="3" stroke-linecap="round"/>
  <rect x="592" y="152" width="150" height="11" rx="5.5" fill="#2b3b5e"/>
  <rect x="592" y="172" width="106" height="11" rx="5.5" fill="#22304d"/>
  <rect x="544" y="212" width="198" height="10" rx="5" fill="#22304d"/>
  <rect x="544" y="232" width="148" height="10" rx="5" fill="#22304d"/>
</g>

<!-- scheda codice -->
<g>
  <rect x="60" y="470" width="250" height="180" rx="20" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.5"/>
  <g font-family="monospace" font-size="15" fill="#7b89a5">
    <text x="88" y="516">&lt;<tspan fill="#ffb43d">agent</tspan>&gt;</text>
    <text x="104" y="546" fill="#6aa5ff">read(dati)</text>
    <text x="104" y="576" fill="#6aa5ff">answer()</text>
    <text x="88" y="606">&lt;/<tspan fill="#ffb43d">agent</tspan>&gt;</text>
  </g>
</g>

<!-- badge lingue -->
<g>
  <rect x="600" y="560" width="248" height="120" rx="20" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.5"/>
  <g font-family="'Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#a6b3cc">
    <text x="628" y="606">IT</text><text x="676" y="606">EN</text><text x="724" y="606">DE</text>
    <text x="628" y="646">FR</text><text x="676" y="646">ES</text>
  </g>
  <circle cx="806" cy="600" r="22" fill="none" stroke="url(#${id}g1)" stroke-width="2.5"/>
  <path d="M784 600h44M806 578a30 30 0 0 1 0 44 30 30 0 0 1 0-44" fill="none" stroke="url(#${id}g1)" stroke-width="2"/>
</g>
</svg>`;
}

/* -------------------------------------------------------------------- AI */

export function aiArt() {
  const id = 'a';
  const docRow = (x, y) => `
    <rect x="${x}" y="${y}" width="118" height="70" rx="12" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.4"/>
    <rect x="${x + 16}" y="${y + 20}" width="70" height="8" rx="4" fill="#2b3b5e"/>
    <rect x="${x + 16}" y="${y + 38}" width="86" height="8" rx="4" fill="#22304d"/>`;
  return `${head(820, 620, 'Come funziona una soluzione di intelligenza artificiale su misura',
    'Schema: i documenti e i dati aziendali alimentano un agente di intelligenza artificiale collegato al gestionale, che risponde su sito, WhatsApp ed email.')}
${defs(id)}
<ellipse cx="410" cy="300" rx="330" ry="260" fill="url(#${id}glow)" opacity=".5"/>

<!-- colonna sinistra: fonti -->
<g>
  ${docRow(40, 120)}${docRow(40, 220)}${docRow(40, 320)}${docRow(40, 420)}
  <text x="40" y="105" font-family="'Segoe UI',sans-serif" font-size="15" font-weight="600" fill="#a6b3cc">Dati e documenti</text>
</g>
<g stroke="url(#${id}g1)" stroke-width="2" fill="none" opacity=".8">
  <path d="M158 155 C220 155 240 280 300 300"/>
  <path d="M158 255 C220 255 250 290 300 300"/>
  <path d="M158 355 C220 355 250 315 300 300"/>
  <path d="M158 455 C220 455 240 330 300 300"/>
</g>

<!-- nucleo AI -->
<g>
  <circle cx="410" cy="300" r="112" fill="#0d1728" stroke="url(#${id}g1)" stroke-width="2.5"/>
  <circle cx="410" cy="300" r="76" fill="none" stroke="#2b3b5e" stroke-width="1.4" stroke-dasharray="5 7"/>
  <circle cx="410" cy="300" r="34" fill="url(#${id}g1)" opacity=".18"/>
  <path d="M410 262v76M372 300h76M385 275l50 50M435 275l-50 50" stroke="url(#${id}g1)" stroke-width="3" stroke-linecap="round"/>
  <circle cx="410" cy="300" r="10" fill="#ffb43d"/>
  ${[0, 60, 120, 180, 240, 300].map(deg => {
    const r = 112, rad = (deg * Math.PI) / 180;
    return `<circle cx="${(410 + r * Math.cos(rad)).toFixed(1)}" cy="${(300 + r * Math.sin(rad)).toFixed(1)}" r="6" fill="#6aa5ff"/>`;
  }).join('')}
  <text x="410" y="446" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="16" font-weight="700" fill="#e9edf7">Agente AI</text>
</g>

<!-- gestionale sotto -->
<g>
  <rect x="300" y="480" width="220" height="86" rx="16" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.5"/>
  <path d="M330 512h32M330 532h60" stroke="#2b3b5e" stroke-width="7" stroke-linecap="round"/>
  <rect x="410" y="500" width="86" height="48" rx="10" fill="url(#${id}g3)" opacity=".35"/>
  <text x="410" y="470" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="14" fill="#7b89a5">Gestionale · CRM · magazzino</text>
</g>
<path d="M410 412v68" stroke="url(#${id}g1)" stroke-width="2.5" stroke-dasharray="6 6"/>

<!-- canali a destra -->
<g>
  <text x="620" y="105" font-family="'Segoe UI',sans-serif" font-size="15" font-weight="600" fill="#a6b3cc">Canali</text>
  ${[['Sito', 130], ['WhatsApp', 240], ['Email', 350], ['Telefono', 460]].map(([label, y]) => `
  <rect x="620" y="${y}" width="164" height="76" rx="14" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.4"/>
  <circle cx="654" cy="${y + 38}" r="15" fill="url(#${id}g1)" opacity=".25"/>
  <text x="684" y="${y + 44}" font-family="'Segoe UI',sans-serif" font-size="15" fill="#c9d4e8">${label}</text>`).join('')}
</g>
<g stroke="url(#${id}g3)" stroke-width="2" fill="none" opacity=".85">
  <path d="M522 300 C570 300 580 168 620 168"/>
  <path d="M522 300 C570 300 580 278 620 278"/>
  <path d="M522 300 C570 300 580 388 620 388"/>
  <path d="M522 300 C570 300 580 498 620 498"/>
</g>
</svg>`;
}

/* --------------------------------------------------------------- SERVIZI */

export function serviziArt() {
  const id = 's';
  const layer = (y, label, color, w) => `
  <g>
    <rect x="${(820 - w) / 2}" y="${y}" width="${w}" height="72" rx="16" fill="#101a2e" stroke="${color}" stroke-width="1.8"/>
    <text x="410" y="${y + 44}" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="17" font-weight="600" fill="#c9d4e8">${label}</text>
  </g>`;
  return `${head(820, 620, 'Architettura dei progetti software Inginet',
    'Illustrazione a livelli: interfaccia utente, applicazione, banca dati e integrazioni esterne come pagamenti, fatturazione elettronica e channel manager.')}
${defs(id)}
<ellipse cx="410" cy="300" rx="330" ry="250" fill="url(#${id}glow2)" opacity=".5"/>
${win(id, 210, 40, 400, 130, 18)}
<g>
  <rect x="240" y="94" width="120" height="52" rx="10" fill="url(#${id}g1)" opacity=".3"/>
  <rect x="374" y="94" width="94" height="52" rx="10" fill="#22304d"/>
  <rect x="482" y="94" width="98" height="52" rx="10" fill="#22304d"/>
</g>
<path d="M410 170v34" stroke="#2b3b5e" stroke-width="2.5"/>
${layer(204, 'Sito · E-commerce · App', '#ff9c00', 520)}
<path d="M410 276v30" stroke="#2b3b5e" stroke-width="2.5"/>
${layer(306, 'Gestionale · CRM · CMS', '#2d7dff', 560)}
<path d="M410 378v30" stroke="#2b3b5e" stroke-width="2.5"/>
${layer(408, 'Banca dati · API · Automazioni AI', '#6aa5ff', 600)}

<g>
  <text x="410" y="516" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="14" fill="#7b89a5">Integrazioni</text>
  ${['Pagamenti', 'Fattura el.', 'Channel mgr', 'Corrieri'].map((l, i) => `
  <rect x="${58 + i * 180}" y="536" width="164" height="50" rx="12" fill="#0d1728" stroke="#243352" stroke-width="1.4"/>
  <text x="${140 + i * 180}" y="566" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="14" fill="#a6b3cc">${l}</text>`).join('')}
  <g stroke="#243352" stroke-width="1.6">
    ${[140, 320, 500, 680].map(x => `<path d="M${x} 536 C${x} 500 410 500 410 480"/>`).join('')}
  </g>
</g>
</svg>`;
}

/* ------------------------------------------------------------------- SEO */

export function seoArt() {
  const id = 'q';
  return `${head(820, 620, 'Indicizzazione sui motori di ricerca e sulle risposte AI',
    'Schema a due colonne: a sinistra i risultati di un motore di ricerca tradizionale, a destra una risposta generata da un modello di intelligenza artificiale che cita la fonte.')}
${defs(id)}
<ellipse cx="220" cy="300" rx="250" ry="240" fill="url(#${id}glow)" opacity=".45"/>
<ellipse cx="620" cy="300" rx="250" ry="240" fill="url(#${id}glow2)" opacity=".45"/>

<!-- colonna motore di ricerca -->
<g>
  <rect x="40" y="70" width="340" height="480" rx="22" fill="#0d1728" stroke="#243352" stroke-width="1.6"/>
  <rect x="70" y="104" width="280" height="44" rx="22" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.4"/>
  <circle cx="98" cy="126" r="10" fill="none" stroke="url(#${id}g1)" stroke-width="2.4"/>
  <path d="M106 134l10 10" stroke="url(#${id}g1)" stroke-width="2.4" stroke-linecap="round"/>
  <rect x="122" y="120" width="150" height="11" rx="5.5" fill="#2b3b5e"/>
  ${[190, 288, 386, 470].map((y, i) => `
  <rect x="70" y="${y}" width="${i === 0 ? 210 : 168}" height="11" rx="5.5" fill="${i === 0 ? 'url(#' + id + 'g1)' : '#2b3b5e'}"/>
  <rect x="70" y="${y + 24}" width="280" height="8" rx="4" fill="#22304d"/>
  <rect x="70" y="${y + 42}" width="232" height="8" rx="4" fill="#1b2740"/>`).join('')}
  <text x="210" y="580" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="15" font-weight="600" fill="#a6b3cc">Motori di ricerca</text>
</g>

<!-- colonna risposta AI -->
<g>
  <rect x="440" y="70" width="340" height="480" rx="22" fill="#0d1728" stroke="#243352" stroke-width="1.6"/>
  <g>
    <circle cx="480" cy="118" r="18" fill="none" stroke="url(#${id}g1)" stroke-width="2.4"/>
    <path d="M480 106v24M468 118h24" stroke="url(#${id}g1)" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="510" y="110" width="130" height="14" rx="7" fill="#2b3b5e"/>
  </g>
  <rect x="470" y="164" width="280" height="212" rx="18" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.4"/>
  ${[196, 224, 252, 280, 308].map((y, i) => `<rect x="496" y="${y}" width="${[228, 200, 214, 176, 150][i]}" height="10" rx="5" fill="#22304d"/>`).join('')}
  <g>
    <rect x="496" y="336" width="228" height="26" rx="13" fill="url(#${id}g1)" opacity=".22"/>
    <text x="512" y="354" font-family="'Segoe UI',sans-serif" font-size="14" font-weight="600" fill="#ffb43d">Fonte: inginet.it</text>
  </g>
  <g>
    <rect x="470" y="400" width="280" height="110" rx="16" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.4"/>
    <text x="496" y="432" font-family="monospace" font-size="13" fill="#6aa5ff">llms.txt</text>
    <text x="496" y="458" font-family="monospace" font-size="13" fill="#6aa5ff">schema.org</text>
    <text x="496" y="484" font-family="monospace" font-size="13" fill="#6aa5ff">hreflang</text>
  </g>
  <text x="610" y="580" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="15" font-weight="600" fill="#a6b3cc">Risposte generate dall’AI</text>
</g>
</svg>`;
}

/* ------------------------------------------------------------------ TEAM */

export function teamArt() {
  const id = 't';
  return `${head(820, 620, 'Il team Inginet al lavoro',
    'Illustrazione del gruppo di lavoro Inginet: sviluppo, dati e intelligenza artificiale, progettazione delle interfacce, contenuti multilingua.')}
${defs(id)}
<ellipse cx="410" cy="290" rx="330" ry="250" fill="url(#${id}glow)" opacity=".4"/>
${win(id, 130, 90, 560, 300, 22)}
<g>
  <rect x="164" y="160" width="140" height="196" rx="14" fill="#101a2e" stroke="#2b3b5e" stroke-width="1.4"/>
  ${[186, 212, 238, 264, 290, 316].map((y, i) => `<rect x="186" y="${y}" width="${[96, 74, 88, 60, 96, 70][i]}" height="9" rx="4.5" fill="${i === 0 ? 'url(#' + id + 'g1)' : '#22304d'}"/>`).join('')}
  <rect x="330" y="160" width="326" height="196" rx="14" fill="#0d1728" stroke="#2b3b5e" stroke-width="1.4"/>
  <g font-family="monospace" font-size="14" fill="#6aa5ff">
    <text x="356" y="192"><tspan fill="#ffb43d">function</tspan> risolvi(problema) {</text>
    <text x="376" y="220">const piano = analizza(problema)</text>
    <text x="376" y="248">const app = costruisci(piano)</text>
    <text x="376" y="276"><tspan fill="#ffb43d">return</tspan> pubblica(app)</text>
    <text x="356" y="304">}</text>
  </g>
  <rect x="356" y="322" width="180" height="9" rx="4.5" fill="#22304d"/>
</g>
<g>
  ${[['Sviluppo', 90], ['Dati e AI', 268], ['Design', 446], ['Contenuti 5 lingue', 624]].map(([l, x], i) => `
  <circle cx="${x + 40}" cy="470" r="34" fill="#101a2e" stroke="url(#${id}g${i % 2 ? '3' : '1'})" stroke-width="2.4"/>
  <circle cx="${x + 40}" cy="460" r="11" fill="#2b3b5e"/>
  <path d="M${x + 22} 490a18 18 0 0 1 36 0" fill="#2b3b5e"/>
  <text x="${x + 40}" y="536" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="14" fill="#a6b3cc">${l}</text>`).join('')}
  <path d="M170 470h68M348 470h68M526 470h68" stroke="#243352" stroke-width="1.6" stroke-dasharray="5 6"/>
</g>
</svg>`;
}

/* ----------------------------------------------- loghi cliente mancanti */

export function wordmarkLogo(text, sub = '', accent = '#133660') {
  const w = 300, h = 130;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${text}">
<rect width="${w}" height="${h}" fill="none"/>
<text x="${w / 2}" y="${sub ? 64 : 76}" text-anchor="middle" font-family="'Segoe UI',Georgia,serif" font-size="34" font-weight="700" letter-spacing="1.5" fill="${accent}">${text}</text>
${sub ? `<text x="${w / 2}" y="94" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="14" letter-spacing="4" fill="#6d7d99">${sub}</text>` : ''}
<path d="M${w / 2 - 46} ${sub ? 78 : 92}h92" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>
</svg>`;
}

export function olvixLogo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" width="320" height="120" role="img" aria-label="Olvix">
<defs><linearGradient id="ol" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fb2ff"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
<circle cx="52" cy="60" r="27" fill="none" stroke="url(#ol)" stroke-width="7"/>
<path d="M52 44v32" stroke="url(#ol)" stroke-width="7" stroke-linecap="round"/>
<text x="96" y="76" font-family="'Segoe UI',sans-serif" font-size="46" font-weight="700" letter-spacing="1" fill="url(#ol)">OLVIX</text>
<text x="98" y="96" font-family="'Segoe UI',sans-serif" font-size="12" letter-spacing="3.4" fill="#9db6dd">SHARE AND DISCOVER</text>
</svg>`;
}

/* --------------------------------------------------------------- favicon */

export function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
<defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb43d"/><stop offset=".55" stop-color="#ff9c00"/><stop offset="1" stop-color="#2d7dff"/></linearGradient></defs>
<rect width="40" height="40" rx="10" fill="#070a12"/>
<path d="M13 28V17.4" stroke="url(#f)" stroke-width="3.6" stroke-linecap="round"/>
<circle cx="13" cy="12.4" r="2.2" fill="url(#f)"/>
<path d="M20.5 28V17.6c0-2.6 2-4.4 4.5-4.4s4.5 1.8 4.5 4.4V28" stroke="url(#f)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;
}

export function logoFull() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Inginet">
<defs><linearGradient id="L" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb43d"/><stop offset=".55" stop-color="#ff9c00"/><stop offset="1" stop-color="#2d7dff"/></linearGradient></defs>
<rect width="512" height="512" rx="128" fill="#070a12"/>
<path d="M166 358V222" stroke="url(#L)" stroke-width="46" stroke-linecap="round"/>
<circle cx="166" cy="158" r="28" fill="url(#L)"/>
<path d="M262 358V226c0-33 26-56 58-56s58 23 58 56v132" stroke="url(#L)" stroke-width="46" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;
}
