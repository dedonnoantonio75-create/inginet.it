<?php
/**
 * Modulo contatti di inginet.it
 * ---------------------------------------------------------------------------
 * Riceve i campi dal modulo che sta su www.inginet.it (GitHub Pages) e manda
 * la richiesta per email. Sta sullo spazio Aruba, quindi la mail parte dal
 * server della posta di inginet.it: SPF e DKIM sono allineati e non finisce
 * nello spam.
 *
 * Va caricato nella cartella principale dello spazio web e raggiunto da
 * https://form.inginet.it/invia.php
 *
 * Nessun database, nessun servizio esterno, nessuna chiave da custodire.
 */

declare(strict_types=1);
mb_internal_encoding('UTF-8');

const DESTINATARIO   = 'info@inginet.it';
const MITTENTE       = 'info@inginet.it';   // deve essere una casella del dominio
const SITO           = 'https://www.inginet.it';
const SECONDI_MINIMI = 3;                    // sotto questa soglia e' un robot
const MAX_PER_ORA    = 5;                    // invii massimi dallo stesso IP
const CARTELLA_LOG   = __DIR__ . '/.form-log';

/* ------------------------------------------------------------------ aiuti */

function vaiA(string $url): never {
    header('Location: ' . $url, true, 303);
    exit;
}

/** Solo indirizzi del nostro sito: evita che qualcuno usi il modulo per
 *  rimbalzare gli utenti su un sito esterno. */
function destinazioneSicura(string $url, string $ripiego): string {
    return str_starts_with($url, SITO . '/') ? $url : $ripiego;
}

function campo(string $nome, int $max = 2000): string {
    $v = $_POST[$nome] ?? '';
    if (!is_string($v)) return '';
    $v = str_replace(["\r", "\0"], '', trim($v));
    return mb_substr($v, 0, $max);
}

/** Un indirizzo o un oggetto che contiene un a capo permetterebbe di
 *  iniettare intestazioni nell'email. Si scarta e basta. */
function pulitoPerIntestazione(string $v): string {
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v));
}

function ipVisitatore(): string {
    return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

/** Limite di invii per IP, tenuto in un file: niente database. */
function troppiInvii(): bool {
    if (!is_dir(CARTELLA_LOG)) @mkdir(CARTELLA_LOG, 0700, true);
    $f = CARTELLA_LOG . '/' . sha1(ipVisitatore()) . '.txt';
    $ora = time();
    $recenti = [];
    if (is_readable($f)) {
        foreach (explode("\n", (string)file_get_contents($f)) as $r) {
            $t = (int)$r;
            if ($t > $ora - 3600) $recenti[] = $t;
        }
    }
    if (count($recenti) >= MAX_PER_ORA) return true;
    $recenti[] = $ora;
    @file_put_contents($f, implode("\n", $recenti), LOCK_EX);
    return false;
}

/* --------------------------------------------------------------- controlli */

$ripiego  = SITO . '/grazie/';
$grazie   = destinazioneSicura(campo('_next', 300), $ripiego);
$contatti = SITO . '/contatti/';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    vaiA($contatti);
}

// Campo trappola: invisibile a chi naviga, i robot lo riempiono.
if (campo('_honey') !== '') {
    vaiA($grazie);   // niente messaggi d'errore: il robot creda di aver vinto
}

// Compilato troppo in fretta per essere una persona.
$aperto = (int)campo('_t');
if ($aperto > 0 && (time() - $aperto) < SECONDI_MINIMI) {
    vaiA($grazie);
}

if (troppiInvii()) {
    vaiA($grazie);
}

$nome      = campo('Nome', 120);
$azienda   = campo('Azienda', 120);
$email     = campo('Email', 160);
$telefono  = campo('Telefono', 60);
$richiesta = campo('Richiesta', 120);
$messaggio = campo('Messaggio', 5000);
$lingua    = preg_match('/^[a-z]{2}$/', campo('_lingua', 2)) ? campo('_lingua', 2) : 'it';

if ($nome === '' || $messaggio === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    vaiA($contatti . '?errore=campi');
}

/* ----------------------------------------------------------------- invio */

$oggetto = pulitoPerIntestazione(campo('_oggetto', 150)) ?: 'Richiesta dal sito inginet.it';
if ($richiesta !== '') $oggetto .= ' — ' . pulitoPerIntestazione($richiesta);

$corpo = "Nuova richiesta dal modulo contatti di inginet.it\n"
       . str_repeat('-', 58) . "\n\n"
       . "Nome:      $nome\n"
       . ($azienda  !== '' ? "Azienda:   $azienda\n" : '')
       . "Email:     $email\n"
       . ($telefono !== '' ? "Telefono:  $telefono\n" : '')
       . ($richiesta!== '' ? "Richiesta: $richiesta\n" : '')
       . "Lingua:    $lingua\n\n"
       . "Messaggio:\n$messaggio\n\n"
       . str_repeat('-', 58) . "\n"
       . 'Inviata il ' . date('d/m/Y \a\l\l\e H:i') . " da " . ipVisitatore() . "\n";

$intestazioni = [
    'From: Sito inginet.it <' . MITTENTE . '>',
    'Reply-To: ' . pulitoPerIntestazione($nome) . ' <' . pulitoPerIntestazione($email) . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: inginet-form',
];

$inviata = @mail(
    DESTINATARIO,
    '=?UTF-8?B?' . base64_encode($oggetto) . '?=',
    $corpo,
    implode("\r\n", $intestazioni),
    '-f' . MITTENTE
);

vaiA($inviata ? $grazie : $contatti . '?errore=invio');
