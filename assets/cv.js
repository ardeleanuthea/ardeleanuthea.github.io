// Language switch: ?lang=fr in the URL, else the saved choice, else the browser language.
(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-set-lang]');

  function saved() {
    try { return localStorage.getItem('lang'); } catch (e) { return null; }
  }

  function apply(lang, remember) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
    });
    if (remember) {
      try { localStorage.setItem('lang', lang); } catch (e) {}
    }
  }

  var fromUrl = new URLSearchParams(location.search).get('lang');
  var browser = (navigator.language || '').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en';
  var start = fromUrl === 'fr' || fromUrl === 'en' ? fromUrl : (saved() || browser);
  apply(start, false);

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-set-lang'), true); });
  });
})();
