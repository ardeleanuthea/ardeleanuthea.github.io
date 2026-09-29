(function () {
  var root = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Language ---------- */
  var langButtons = document.querySelectorAll('[data-set-lang]');
  function savedLang() { try { return localStorage.getItem('lang'); } catch (e) { return null; } }
  function setLang(lang, remember) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    langButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)); });
    if (remember) { try { localStorage.setItem('lang', lang); } catch (e) {} }
    document.querySelectorAll('[data-count]').forEach(function (el) { if (el.dataset.done) el.textContent = format(el, 1); });
    revealWords();
  }
  var fromUrl = new URLSearchParams(location.search).get('lang');
  var browser = (navigator.language || '').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en';
  var startLang = (fromUrl === 'fr' || fromUrl === 'en') ? fromUrl : (savedLang() || browser);
  langButtons.forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.setLang, true); }); });

  /* ---------- Menu ---------- */
  var menu = document.getElementById('menu');
  var menuBtn = document.querySelector('.menu-btn');
  function toggleMenu(open) {
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) { menu.hidden = false; } else { setTimeout(function () { if (!body.classList.contains('menu-open')) menu.hidden = true; }, 700); }
    body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { toggleMenu(!body.classList.contains('menu-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && body.classList.contains('menu-open')) toggleMenu(false); });

  /* ---------- Bar: blur on scroll, hide when scrolling down ---------- */
  var bar = document.getElementById('bar');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    bar.classList.toggle('scrolled', y > 20);
    bar.classList.toggle('hide', y > lastY && y > 400 && !body.classList.contains('menu-open'));
    lastY = y;
    revealWords();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Word-by-word reveal ---------- */
  document.querySelectorAll('[data-reveal]').forEach(function (p) {
    p.innerHTML = p.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  });
  function revealWords() {
    document.querySelectorAll('[data-reveal]').forEach(function (p) {
      if (!p.offsetParent) return;
      var words = p.querySelectorAll('.w');
      if (reduce) { words.forEach(function (w) { w.classList.add('on'); }); return; }
      var r = p.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      progress = Math.max(0, Math.min(1, progress));
      var n = Math.round(progress * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    });
  }

  /* ---------- Counters ---------- */
  function format(el, t) {
    var fr = root.getAttribute('data-lang') === 'fr';
    var n = Math.round(Number(el.dataset.count) * t);
    var s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, fr ? '\u00a0' : ',');
    var suffix = fr && el.dataset.suffixFr ? el.dataset.suffixFr : (el.dataset.suffix || '');
    if (fr && suffix === '%') suffix = ' %';
    return (el.dataset.prefix || '') + s + suffix;
  }
  function count(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    if (reduce) { el.textContent = format(el, 1); return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      el.textContent = format(el, 1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Fade-in on scroll ---------- */
  var fadeTargets = document.querySelectorAll('.stat, .acc details, .step, .card, .edu-card, .sec-head, .facts, .contact');
  fadeTargets.forEach(function (el) { el.classList.add('fade'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      var c = e.target.querySelector('[data-count]');
      if (c) count(c);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  fadeTargets.forEach(function (el) { io.observe(el); });

  /* ---------- Process cards: expand on hover / focus ---------- */
  var steps = document.querySelectorAll('.step');
  function activate(s) { steps.forEach(function (x) { x.classList.toggle('active', x === s); }); }
  steps.forEach(function (s) {
    s.addEventListener('mouseenter', function () { activate(s); });
    s.addEventListener('focus', function () { activate(s); });
    s.addEventListener('click', function () { activate(s); });
  });
  if (steps[0]) activate(steps[0]);

  /* ---------- Before / after ---------- */
  function setBA(shot, state, user) {
    shot.dataset.state = state;
    if (user) shot.dataset.touched = '1';
    shot.querySelectorAll('[data-ba]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.ba === state)); });
  }
  document.querySelectorAll('.ba').forEach(function (shot) {
    shot.querySelectorAll('[data-ba]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); setBA(shot, b.dataset.ba, true); });
    });
  });
  // Each snippet starts on "before", then flips to "after" once you've had a moment to look.
  var baIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      baIO.unobserve(e.target);
      var shot = e.target;
      setTimeout(function () { if (!shot.dataset.touched) setBA(shot, 'after', false); }, reduce ? 0 : 1600);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.ba').forEach(function (s) { baIO.observe(s); });

  /* ---------- Case study dialog ---------- */
  var dialog = document.getElementById('case');
  var content = document.getElementById('case-content');
  var lastFocus = null;
  document.querySelectorAll('.card[data-case]').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.ba-toggle')) return;
      var tpl = document.getElementById('case-' + card.dataset.case);
      if (!tpl) return;
      lastFocus = card.querySelector('.card-open');
      content.innerHTML = '';
      content.appendChild(tpl.content.cloneNode(true));
      if (dialog.showModal) { dialog.showModal(); } else { dialog.setAttribute('open', ''); }
      dialog.scrollTop = 0;
    });
  });
  function closeCase() { if (dialog.open) dialog.close(); }
  dialog.querySelector('.case-close').addEventListener('click', closeCase);
  dialog.addEventListener('click', function (e) { if (e.target === dialog) closeCase(); });
  dialog.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); });

  /* ---------- Copy email ---------- */
  var toast = document.querySelector('.toast');
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () {
        toast.textContent = root.getAttribute('data-lang') === 'fr' ? 'Adresse copiée' : 'Email copied';
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 1800);
      };
      if (navigator.clipboard) { navigator.clipboard.writeText(b.dataset.copy).then(done, function () {}); }
    });
  });

  /* ---------- Start ---------- */
  setLang(startLang, false);
  onScroll();
  requestAnimationFrame(function () { body.classList.add('loaded'); });
})();
