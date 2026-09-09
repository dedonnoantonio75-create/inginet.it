/* Inginet — interazioni essenziali. Nessuna libreria, nessun tracciamento. */
(function () {
  'use strict';

  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

  /* -------------------------------------------------------------- tema */
  var themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var light = doc.documentElement.getAttribute('data-theme') === 'light';
      if (light) doc.documentElement.removeAttribute('data-theme');
      else doc.documentElement.setAttribute('data-theme', 'light');
      try { localStorage.setItem('ing-theme', light ? 'dark' : 'light'); } catch (e) {}
    });
  }

  /* ------------------------------------------------------ menu mobile */
  var burger = $('#burger'), nav = $('#mainnav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ------------------------------------------------------ menu lingue */
  var lsBtn = $('.langsw-btn'), lsMenu = $('#langmenu');
  if (lsBtn && lsMenu) {
    var closeLs = function () { lsMenu.hidden = true; lsBtn.setAttribute('aria-expanded', 'false'); };
    lsBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = lsMenu.hidden;
      lsMenu.hidden = !open;
      lsBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    doc.addEventListener('click', function (e) { if (!e.target.closest('.langsw')) closeLs(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLs(); });
  }

  /* ------------------------------------------------- header appiccicoso */
  var head = $('#siteHead');
  if (head) {
    var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------ filtro portfolio */
  var tiles = $('#ctiles');
  if (tiles) {
    var count = $('#cCount');
    $$('.filters .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.dataset.filter;
        $$('.filters .chip').forEach(function (c) { c.classList.toggle('is-on', c === chip); });
        var n = 0;
        $$('.ctile', tiles).forEach(function (t) {
          var show = f === 'tutti' || t.dataset.sector === f;
          t.hidden = !show;
          if (show) n++;
        });
        if (count) count.textContent = n;
      });
    });
  }

  /* ------------------------------------- modulo contatti → mailto: */
  var form = $('#cform');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var get = function (k) { return (d.get(k) || '').toString().trim(); };
      var lines = [
        get('nome') ? 'Nome: ' + get('nome') : '',
        get('azienda') ? 'Azienda: ' + get('azienda') : '',
        get('email') ? 'Email: ' + get('email') : '',
        get('telefono') ? 'Telefono: ' + get('telefono') : '',
        get('argomento') ? 'Richiesta: ' + get('argomento') : '',
        '',
        get('messaggio')
      ].filter(function (l) { return l !== null; }).join('\n');
      var subject = form.dataset.subject + (get('argomento') ? ' — ' + get('argomento') : '');
      window.location.href = 'mailto:' + form.dataset.to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines);
    });
  }

  /* ------------------------------------------- comparsa alla scrolllata */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.sec, .card, .ctile, .steps li, .timeline li').forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
