/**
 * Modulo contatti di inginet.it
 * ---------------------------------------------------------------------------
 * Riceve i campi del modulo che sta su www.inginet.it (GitHub Pages) e manda
 * la richiesta per email. Gira dentro l'account Google di Inginet: la mail
 * parte da Gmail, quindi arriva sempre, e non serve nessuno spazio web.
 *
 * Va incollato in un progetto su script.google.com e pubblicato come
 * applicazione web (eseguita come il proprietario, accessibile a chiunque).
 *
 * Nessun database, nessun servizio di terzi, nessuna chiave da custodire.
 */

const DESTINATARIO   = 'dedonnoantonio75@gmail.com';
const COPIA          = 'info@inginet.it';
const SITO           = 'https://www.inginet.it';
const SECONDI_MINIMI = 3;    // sotto questa soglia e' un robot
const MAX_PER_ORA    = 20;   // tetto complessivo, protegge la quota di Gmail

/* ------------------------------------------------------------------ aiuti */

/** L'applicazione web risponde dentro una cornice: per portare via il
 *  visitatore bisogna spostare la finestra in cima, non la cornice. */
function vaiA(url) {
  const u = JSON.stringify(url);
  const attributo = url.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return HtmlService.createHtmlOutput(
      '<!doctype html><meta charset="utf-8">'
    + '<title>Un momento...</title>'
    + '<style>body{font:16px/1.5 system-ui,sans-serif;margin:3rem;text-align:center}</style>'
    + '<script>try{top.location.href=' + u + '}catch(e){location.href=' + u + '}</' + 'script>'
    + '<p>Un momento... <a href="' + attributo + '" target="_top">continua</a></p>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Solo indirizzi del nostro sito: evita che qualcuno usi il modulo per
 *  rimbalzare gli utenti su un sito esterno. */
function destinazioneSicura(url, ripiego) {
  return (typeof url === 'string' && url.indexOf(SITO + '/') === 0) ? url : ripiego;
}

function campo(v, max) {
  if (typeof v !== 'string') return '';
  return v.replace(/[\r\u0000]/g, '').trim().slice(0, max || 2000);
}

/** Un a capo dentro l'oggetto permetterebbe di iniettare intestazioni. */
function pulitoPerIntestazione(v) {
  return v.replace(/[\r\n]/g, ' ').trim();
}

/** Tetto orario complessivo: se il modulo finisse nel mirino di un robot,
 *  la quota giornaliera di Gmail resta intatta. */
function troppiInvii() {
  const cache = CacheService.getScriptCache();
  const n = Number(cache.get('invii') || 0);
  if (n >= MAX_PER_ORA) return true;
  cache.put('invii', String(n + 1), 3600);
  return false;
}

/* --------------------------------------------------------------- ricezione */

function doGet() {
  return vaiA(SITO + '/contatti/');
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  const grazie   = destinazioneSicura(campo(p._next, 300), SITO + '/grazie/');
  const contatti = SITO + '/contatti/';

  // Campo trappola: invisibile a chi naviga, i robot lo riempiono.
  // Niente messaggi d'errore: il robot creda di aver vinto.
  if (campo(p._honey) !== '') return vaiA(grazie);

  // Compilato troppo in fretta per essere una persona.
  const aperto = parseInt(p._t, 10);
  if (aperto > 0 && (Date.now() / 1000 - aperto) < SECONDI_MINIMI) return vaiA(grazie);

  if (troppiInvii()) return vaiA(grazie);

  const nome      = campo(p.Nome, 120);
  const azienda   = campo(p.Azienda, 120);
  const email     = campo(p.Email, 160);
  const telefono  = campo(p.Telefono, 60);
  const richiesta = campo(p.Richiesta, 120);
  const messaggio = campo(p.Messaggio, 5000);
  const lingua    = /^[a-z]{2}$/.test(campo(p._lingua, 2)) ? campo(p._lingua, 2) : 'it';

  if (!nome || !messaggio || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return vaiA(contatti + '?errore=campi');
  }

  /* ----------------------------------------------------------------- invio */

  let oggetto = pulitoPerIntestazione(campo(p._oggetto, 150)) || 'Richiesta dal sito inginet.it';
  if (richiesta) oggetto += ' - ' + pulitoPerIntestazione(richiesta);

  const riga = new Array(59).join('-');
  const righe = ['Nuova richiesta dal modulo contatti di inginet.it', riga, '',
                 'Nome:      ' + nome];
  if (azienda)   righe.push('Azienda:   ' + azienda);
  righe.push('Email:     ' + email);
  if (telefono)  righe.push('Telefono:  ' + telefono);
  if (richiesta) righe.push('Richiesta: ' + richiesta);
  righe.push('Lingua:    ' + lingua, '', 'Messaggio:', messaggio, '', riga,
             'Inviata il ' + Utilities.formatDate(new Date(), 'Europe/Rome', "dd/MM/yyyy 'alle' HH:mm"));

  try {
    MailApp.sendEmail({
      to: DESTINATARIO,
      cc: COPIA,
      replyTo: email,
      name: 'Sito inginet.it',
      subject: oggetto,
      body: righe.join('\n'),
    });
  } catch (err) {
    return vaiA(contatti + '?errore=invio');
  }

  return vaiA(grazie);
}
