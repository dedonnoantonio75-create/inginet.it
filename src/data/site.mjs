// Configurazione globale del sito inginet.it
// Unica fonte di verità per brand, contatti, lingue, clienti e servizi.

export const site = {
  domain: 'inginet.it',
  origin: 'https://www.inginet.it',
  brand: 'Inginet',
  brandFull: 'Inginet',
  founded: 2000,
  legal: {
    ragioneSociale: 'Inginet di Antonio De Donno',
    piva: '05346170755',
    codiceFiscale: 'DDNNTN75B06E815O',
    rea: 'LE-360123',
    pec: 'inginet@pec.it',
    street: 'Via G. Marconi 14',
    city: 'Maglie',
    province: 'LE',
    postalCode: '73024',
    region: 'Puglia',
    country: 'IT',
    countryName: 'Italia',
    lat: '40.1166488',
    lon: '18.3062816',
  },
  contact: {
    email: 'info@inginet.it',
    phone: '+39 393 569 4342',
    phoneRaw: '+393935694342',
    whatsapp: '393935694342',
  },
  social: {
    facebook: 'https://www.facebook.com/olvixapp',
    linkedin: '',
    youtube: '',
  },
  founder: {
    name: 'Antonio De Donno',
    role: 'Founder & CTO',
    yearsExperience: 35,
  },
  stats: {
    clients: '1.500+',
    years: '35',
    languages: '5',
    projects: '30+',
  },
};

export const languages = [
  { code: 'it', label: 'Italiano', short: 'IT', locale: 'it_IT', hreflang: 'it', dir: '' },
  { code: 'en', label: 'English', short: 'EN', locale: 'en_GB', hreflang: 'en', dir: 'en' },
  { code: 'de', label: 'Deutsch', short: 'DE', locale: 'de_DE', hreflang: 'de', dir: 'de' },
  { code: 'fr', label: 'Français', short: 'FR', locale: 'fr_FR', hreflang: 'fr', dir: 'fr' },
  { code: 'es', label: 'Español', short: 'ES', locale: 'es_ES', hreflang: 'es', dir: 'es' },
];

export const defaultLang = 'it';

// Chiavi di pagina + slug localizzati (SEO: URL nella lingua dell'utente)
export const pages = ['home', 'ai', 'servizi', 'seo', 'clienti', 'chisiamo', 'contatti', 'privacy', 'cookie'];

export const slugs = {
  it: {
    home: '', ai: 'intelligenza-artificiale', servizi: 'servizi', seo: 'seo-e-indicizzazione',
    clienti: 'clienti', chisiamo: 'chi-siamo', contatti: 'contatti', privacy: 'privacy', cookie: 'cookie',
  },
  en: {
    home: '', ai: 'artificial-intelligence', servizi: 'services', seo: 'seo-and-indexing',
    clienti: 'clients', chisiamo: 'about-us', contatti: 'contact', privacy: 'privacy', cookie: 'cookies',
  },
  de: {
    home: '', ai: 'kuenstliche-intelligenz', servizi: 'leistungen', seo: 'seo-und-indexierung',
    clienti: 'kunden', chisiamo: 'ueber-uns', contatti: 'kontakt', privacy: 'datenschutz', cookie: 'cookies',
  },
  fr: {
    home: '', ai: 'intelligence-artificielle', servizi: 'services', seo: 'referencement-seo',
    clienti: 'clients', chisiamo: 'qui-sommes-nous', contatti: 'contact', privacy: 'confidentialite', cookie: 'cookies',
  },
  es: {
    home: '', ai: 'inteligencia-artificial', servizi: 'servicios', seo: 'posicionamiento-seo',
    clienti: 'clientes', chisiamo: 'quienes-somos', contatti: 'contacto', privacy: 'privacidad', cookie: 'cookies',
  },
};

// Voci di menu principale (le pagine legali stanno solo nel footer)
export const navPages = ['ai', 'servizi', 'seo', 'clienti', 'chisiamo', 'contatti'];

/**
 * Portfolio clienti.
 * tile: 'light' (default) oppure 'dark' per i loghi bianchi che sparirebbero su fondo chiaro.
 * Verificato a vista su provino chiaro e scuro il 09/09/2026.
 * Esclusi perché offline: euxeria.it, otrantobelvedere.it, maresidenze.it, ristoprime.com
 */
export const clients = [
  { name: 'Olvix', url: 'https://www.olvix.net/', logo: 'olvix-marketplace-logo.png', sector: 'portali', tags: ['gestionali', 'marketplace', 'piattaforma', 'ai'], featured: true, own: true },
  { name: 'Cala dei Balcani', url: 'https://www.caladeibalcani.it/', logo: 'cala-dei-balcani-logo.png', sector: 'ricettivo', tags: ['sito', 'booking', 'seo'] },
  { name: 'Borgo Terra', url: 'https://www.borgoterra.com/', logo: 'borgo-terra-logo.png', sector: 'ricettivo', tags: ['sito', 'booking', 'seo'] },
  { name: 'Corte dei Granai', url: 'https://www.cortedeigranai.it/', logo: 'corte-dei-granai-maglie-logo.png', sector: 'ricettivo', tags: ['sito', 'booking'] },
  { name: 'Casino De Viti', url: 'https://www.casinodeviti.com/', logo: 'casino-de-viti-poggiardo-logo.png', sector: 'ricettivo', tags: ['sito', 'seo'] },
  { name: 'Perle Marine', url: 'https://www.perlemarine.it/', logo: 'perle-marine-logo.png', sector: 'ricettivo', tags: ['sito', 'booking'] },
  { name: 'La Cascina', url: 'https://www.lacascinamaglie.it/', logo: 'la-cascina-maglie-logo.png', sector: 'ristorazione', tags: ['sito', 'seo'] },
  { name: 'Odegos Property Management', url: 'https://www.odegos.it/', logo: 'odegos-property-management-lecce-logo.png', sector: 'ricettivo', tags: ['gestionale', 'portale'] },
  { name: 'Messapia Hotel & Resort', url: 'https://www.messapia.com/', logo: 'messapia-logo.png', sector: 'ricettivo', tags: ['sito', 'booking'] },
  { name: 'Five Rooms Dimore Centro Lecce', url: 'https://www.dimorecentrolecce.it/', logo: 'five-rooms-dimore-centro-lecce-logo.png', sector: 'ricettivo', tags: ['sito', 'booking'] },
  { name: 'Salento Case Vacanze', url: 'https://www.salentocasevacanze.com/', logo: 'salento-case-vacanze-logo.png', sector: 'ricettivo', tags: ['portale', 'booking', 'multilingua'] },
  { name: 'Leuca Rooms', url: 'https://www.leucarooms.it/', logo: 'leuca-rooms-logo.svg', sector: 'ricettivo', tags: ['sito', 'booking'] },
  { name: 'In Puglia Tutto l’Anno', url: 'https://www.inpugliatuttolanno.it/', logo: 'in-puglia-tutto-lanno-logo.png', sector: 'portali', tags: ['portale', 'seo'] },
  { name: 'Sodero Auto', url: 'https://www.soderoauto.it/', logo: 'sodero-auto-logo.png', sector: 'automotive', tags: ['sito', 'branding', 'seo'], featured: true },
  { name: 'Sodero Autonoleggio', url: 'https://www.soderoautonoleggio.com/', logo: 'sodero-autonoleggio-logo.png', sector: 'automotive', tags: ['gestionale', 'noleggio', 'seo'], featured: true },
  { name: 'Autofficina Giannuzzi', url: 'https://www.autofficinagiannuzzi.it/', logo: 'autofficina-giannuzzi-logo.png', sector: 'automotive', tags: ['sito', 'seo'] },
  { name: 'Car Mariano', url: 'https://www.carmariano.it/', logo: 'car-mariano-noha-logo.png', sector: 'automotive', tags: ['sito', 'seo'] },
  { name: 'Dolphin Marine', url: 'https://www.dolphinmarine.it/', logo: 'dolphin-marine-cantiere-nautico-logo.png', sector: 'industria', tags: ['sito', 'catalogo'] },
  { name: 'Novitecna', url: 'https://www.novitecna.it/', logo: 'novitecna-aradeo-logo.png', sector: 'industria', tags: ['sito', 'assistenza'] },
  { name: 'Chirilli Stone & Pool', url: 'https://www.chirillistonepool.it/', logo: 'chirilli-stone-pool-cursi-logo.png', sector: 'industria', tags: ['sito', 'catalogo'] },
  { name: 'Cardinale Concept', url: 'https://www.cardinaleconcept.it/', logo: 'cardinale-concept-logo.png', sector: 'retail', tags: ['sito', 'branding'] },
  { name: 'Classe A Elettrodomestici', url: 'https://www.classeaelettrodomestici.it/', logo: 'classe-a-elettrodomestici-logo.png', sector: 'retail', tags: ['e-commerce', 'seo'] },
  { name: 'Brunitta', url: 'https://www.brunitta.it/', logo: 'brunitta-logo.png', tile: 'dark', sector: 'retail', tags: ['e-commerce', 'multilingua', 'export'], featured: true },
  { name: 'Vivaio del Sud', url: 'https://www.vivaiodelsud.com/', logo: 'vivaio-del-sud-logo.png', sector: 'retail', tags: ['e-commerce', 'catalogo'] },
  { name: 'Cardia360', url: 'https://www.cardia360.com/', logo: 'cardia360-logo.png', sector: 'salute', tags: ['gestionale', 'crm', 'sito'], featured: true },
  { name: 'Netpollwork', url: 'https://www.netpollwork.it/', logo: 'netpollwork-logo.png', sector: 'servizi', tags: ['portale', 'software'] },
];

/* Le piattaforme che mostriamo nella sezione "gestionali": sono nostre o
   nostre al 100% come sviluppo, e servono da prova concreta. */
export const platforms = [
  { key: 'cardia360', name: 'Cardia360', url: 'https://www.cardia360.com/', logo: 'cardia360-logo.png', sector: 'salute' },
  { key: 'olvix', name: 'Olvix', url: 'https://www.olvix.net/', logo: 'olvix-marketplace-logo.png', sector: 'portali' },
];

/* Vecchi permalink del sito WordPress (fino al 09/09/2026), da reindirizzare
   alle pagine nuove. GitHub Pages non fa redirect lato server: il build genera
   per ognuno una paginetta con meta refresh e canonical, che Google interpreta
   come un 301. Chiave = vecchio percorso, valore = chiave della pagina nuova. */
const OLD = 'home-costruzione-siti-web-maglie-lecce-puglia-italia';
const SRV = OLD + '/servizi-realizzazione-progetti-software-gestionali-app-e-siti-e-commerce-e-vetrina-maglie-lecce-saelnto-puglia-italia';
const GEST = SRV + '/gestionali-per-attivita-ricettive-channel-manager-maglie-lecce-salento-puglia';

export const redirects = {
  [OLD]: 'home',
  [OLD + '/cookie-policy-ue']: 'cookie',
  [OLD + '/siti-web-vetrina-ed-e-commerce-maglie-lecce-salento-puglia-italia']: 'servizi',
  [OLD + '/chi-siamo-realizzazione-siti-web-e-commerce-gestionali-portali-app-software-maglie-lecce-salento-puglia-italia']: 'chisiamo',
  [OLD + '/contattaci-per-realizzare-il-tuo-progetto-app-software-web-maglie-lecce-salento-puglia']: 'contatti',
  [SRV]: 'servizi',
  [SRV + '/digital-marketing-maglie-lecce-puglia']: 'seo',
  [SRV + '/riprese-aeree-con-drone-maglie-lecce-salento-puglia-italia']: 'servizi',
  [GEST]: 'servizi',
  [GEST + '/ristoranti-menu-online-e-sistemi-di-prenotazione-tavoli-maglie-lecce-puglia-italia']: 'servizi',
  [GEST + '/hotel-gestionali-channel-manager-maglie-lecce-salento-puglia-italia']: 'servizi',
  [GEST + '/noleggio-software-gestionali-rent-car-barche-bici-scooter-maglie-lecce-salento-puglia-italia']: 'servizi',
  'contattaci': 'contatti',
  'siti-web': 'servizi',
  'gestionali-per-attivita': 'servizi',
  'digital-marketing': 'seo',
  'riprese-aeree': 'servizi',
  'cookie-policy-ue': 'cookie',
  'privacy-policy': 'privacy',
  'home': 'home',
};

export const sectors = ['tutti', 'ricettivo', 'ristorazione', 'automotive', 'retail', 'industria', 'salute', 'portali', 'servizi'];

// Foto di copertina. widths = le larghezze davvero generate in assets/img/foto.
export const photos = {
  hero:       { file: 'team-inginet-sviluppo-siti-gestionali-salento',           w: 1600, h: 900,  widths: [640, 1000, 1600] },
  heroMobile: { file: 'team-inginet-sviluppo-siti-gestionali-verticale',         w: 900,  h: 1599, widths: [640, 900] },
  ai:         { file: 'intelligenza-artificiale-applicata-alle-imprese-inginet', w: 1400, h: 1050, widths: [640, 900, 1400] },
  servizi:    { file: 'sviluppo-siti-web-ed-e-commerce-su-misura-inginet',       w: 1400, h: 1050, widths: [640, 900, 1400] },
  seo:        { file: 'seo-e-risultati-di-posizionamento-inginet',               w: 1400, h: 1050, widths: [640, 900, 1400] },
  team:       { file: 'riprese-aeree-con-drone-team-inginet',                    w: 1400, h: 1050, widths: [640, 900, 1400] },
};

// Illustrazioni SVG generate: nome file → chiave di contenuto (alt localizzato)
export const artwork = {
  hero: 'inginet-software-house-intelligenza-artificiale-salento.svg',
  ai: 'soluzioni-intelligenza-artificiale-per-aziende-inginet.svg',
  servizi: 'sviluppo-software-gestionali-crm-cms-su-misura-inginet.svg',
  seo: 'seo-indicizzazione-motori-di-ricerca-e-intelligenza-artificiale-inginet.svg',
  processo: 'metodo-di-lavoro-inginet-analisi-sviluppo-rilascio.svg',
  team: 'team-inginet-sviluppo-software-maglie-lecce.svg',
};
