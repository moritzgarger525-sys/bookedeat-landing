/* ============================================================
   BookedEat Landing Page — Interactions + i18n
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     0. i18n — shared via localStorage with demo page
     ---------------------------------------------------------- */
  var LANG_KEY = 'bookedeat_lang';
  var lang = localStorage.getItem(LANG_KEY) || 'en';

  var TR = {
    en: {
      'nav.login': 'Log in',
      'nav.coming_soon': 'Coming Soon',
      'tab.guest': 'Guest',
      'tab.restaurant': 'Restaurant',
      // Guest hero
      'guest.headline': 'Friends, meals, deals.<br><span class="text-gradient">One Map.</span>',
      'guest.subtitle': "Our first city is Zurich. Every restaurant on the map. See where your friends have been, read their honest reviews, and discover deals nearby. No ads, no cost, you're in control.",
      'guest.stat1_num': 'Free',
      'guest.stat1_label': 'Always, no ads',
      'guest.stat2_label': 'Your control',
      'guest.stat3_num': 'Zurich',
      'guest.stat3_label': 'Launching soon',
      'guest.cta_action': 'See it in action',
      'guest.cta_beta': 'Join the Beta',
      // Restaurant hero
      'rest.headline': 'Reach new customers,<br><span class="text-gradient-orange">fill every table.</span>',
      'rest.subtitle': 'Starting in Zurich. Attract new guests with customizable deals. Incentivize visits outside peak hours. From discounts to special events to first-time customer offers. You decide.',
      'rest.stat1_label': 'Setup fees',
      'rest.stat2_label': 'Customizable',
      'rest.stat3_num': 'Zurich',
      'rest.stat3_label': 'Launching soon',
      'rest.cta_demo': 'Interactive Demo',
      'rest.cta_call': 'Book a Call',
      // Guest features
      'gf.title': 'Social meets savings,<br><span class="text-gradient">all in one map</span>',
      'gf.subtitle': "Not just deals. Every restaurant, your friends' experiences, and honest reviews. No ads, no cost.",
      'gf.f1_title': 'Every Restaurant, One Map',
      'gf.f1_desc': "More than deals \u2014 we show all restaurants on the map. Browse freely, discover deals when they're there. Missing a place? Add it yourself in seconds.",
      'gf.f2_title': 'See Where Friends Go',
      'gf.f2_desc': "See where your friends have been and what they thought. Real reviews from people you trust, not strangers or bought ratings. Fully private \u2014 only your friends see your activity.",
      'gf.f3_title': 'Deals & Notifications',
      'gf.f3_desc': "Like your favourite places and stay in the loop. New deals, special events, new dishes \u2014 you'll be the first to know. Redeem with one tap and save.",
      'gf.f4_title': 'Your Dining Insights',
      'gf.f4_desc': 'A great side effect: stats on your dining habits, your restaurant personality type, visit history, and more. Always private to you and your friends.',
      // Restaurant features
      'rf.title': 'Everything you need to<br><span class="text-gradient-orange">grow your business</span>',
      'rf.subtitle': 'Reach new customers. Fill off-peak hours. Deals tailored to your needs.',
      'rf.f1_title': 'Reach New Customers',
      'rf.f1_desc': 'Your restaurant is visible to thousands of nearby guests actively exploring the map. Deals make you stand out.',
      'rf.f2_title': 'Fill Off-Peak Hours',
      'rf.f2_desc': 'Incentivize visits outside busy hours. Schedule deals for specific days and times when you need more traffic.',
      'rf.f3_title': 'Fully Customizable',
      'rf.f3_desc': 'Discounts, menu deals, special events, first-time customer offers. Set limits, schedules, and rules your way.',
      'rf.f4_title': 'Track Everything',
      'rf.f4_desc': 'See redemptions, new vs returning guests, and deal performance in your partner dashboard. Full transparency.',
      // Screenshots
      'gs.title': 'See it in action',
      'gs.subtitle': 'A clean, beautiful experience designed around how you actually dine out.',
      // Restaurant screenshots
      'rs.title': 'Your partner dashboard',
      'rs.subtitle': 'Manage deals, track performance, and see what your customers see \u2014 all from one place.',
      'rs.demo_btn': 'Interactive Demo',
      'rs.demo_hint': 'Explore deals, posts, analytics \u2014 with sample data, no signup needed',
      // Pricing
      'price.title': 'Simple, transparent pricing',
      'price.p1': 'No setup fees, no monthly minimums',
      'price.p2': 'Only charged when a guest redeems',
      'price.p3': 'Cancel anytime, no commitment',
      'price.p4': 'Full dashboard visibility into every charge',
      'price.per': 'per redeemed deal',
      // Guest CTA
      'gcta.headline': 'Be the first to try BookedEat',
      'gcta.subtitle': "We're launching soon in Zurich. Leave your email and we'll let you know when the beta is ready.",
      'gcta.email_ph': 'Your email address',
      'gcta.btn': 'Become a Beta Tester',
      'gcta.success': "You're on the list! We'll be in touch.",
      'gcta.footnote': 'Available in the App Store soon. Free, no ads, ever.',
      // Restaurant CTA
      'rcta.headline': 'Curious how it works?',
      'rcta.subtitle': "Book an intro call \u2014 we'll walk you through everything. No strings attached.",
      'rcta.restaurant_ph': 'Restaurant name',
      'rcta.email_ph': 'Email address',
      'rcta.btn': 'Book an Intro Call',
      'rcta.success': "Thanks! We'll be in touch soon.",
      'rcta.footnote': "No setup fees. No commitment. We'll reach out within 24 hours.",
      // Footer
      'footer.privacy': 'Privacy',
      'footer.terms': 'Terms',
      'footer.contact': 'Contact'
    },
    de: {
      'nav.login': 'Anmelden',
      'nav.coming_soon': 'Bald verf\u00fcgbar',
      'tab.guest': 'Gast',
      'tab.restaurant': 'Restaurant',
      'guest.headline': 'Freunde, Essen, Deals.<br><span class="text-gradient">Eine Karte.</span>',
      'guest.subtitle': 'Unsere erste Stadt ist Z\u00fcrich. Jedes Restaurant auf der Karte. Sieh, wo deine Freunde waren, lies ihre ehrlichen Bewertungen und entdecke Deals in der N\u00e4he. Keine Werbung, kostenlos, du hast die Kontrolle.',
      'guest.stat1_num': 'Gratis',
      'guest.stat1_label': 'Immer, ohne Werbung',
      'guest.stat2_label': 'Deine Kontrolle',
      'guest.stat3_num': 'Z\u00fcrich',
      'guest.stat3_label': 'Bald verf\u00fcgbar',
      'guest.cta_action': 'In Aktion sehen',
      'guest.cta_beta': 'Beta beitreten',
      'rest.headline': 'Neue Kunden erreichen,<br><span class="text-gradient-orange">jeden Tisch f\u00fcllen.</span>',
      'rest.subtitle': 'Start in Z\u00fcrich. Gewinnen Sie neue G\u00e4ste mit individuellen Deals. Beleben Sie ruhige Stunden. Von Rabatten \u00fcber Events bis zu Erstkundenangeboten. Sie entscheiden.',
      'rest.stat1_label': 'Einrichtungsgeb\u00fchren',
      'rest.stat2_label': 'Anpassbar',
      'rest.stat3_num': 'Z\u00fcrich',
      'rest.stat3_label': 'Bald verf\u00fcgbar',
      'rest.cta_demo': 'Interaktive Demo',
      'rest.cta_call': 'Gespr\u00e4ch buchen',
      'gf.title': 'Sozial trifft Sparen,<br><span class="text-gradient">alles auf einer Karte</span>',
      'gf.subtitle': 'Nicht nur Deals. Jedes Restaurant, die Erfahrungen deiner Freunde und ehrliche Bewertungen. Ohne Werbung, kostenlos.',
      'gf.f1_title': 'Jedes Restaurant, eine Karte',
      'gf.f1_desc': 'Mehr als Deals \u2014 wir zeigen alle Restaurants auf der Karte. St\u00f6bere frei, entdecke Deals wenn es sie gibt. Fehlt ein Ort? F\u00fcge ihn selbst in Sekunden hinzu.',
      'gf.f2_title': 'Sieh, wohin Freunde gehen',
      'gf.f2_desc': 'Sieh, wo deine Freunde waren und was sie dachten. Echte Bewertungen von Menschen, denen du vertraust. Komplett privat \u2014 nur deine Freunde sehen deine Aktivit\u00e4t.',
      'gf.f3_title': 'Deals & Benachrichtigungen',
      'gf.f3_desc': 'Like deine Lieblingsorte und bleib auf dem Laufenden. Neue Deals, Events, neue Gerichte \u2014 du erf\u00e4hrst es zuerst. Mit einem Tipp einl\u00f6sen und sparen.',
      'gf.f4_title': 'Deine Essens-Einblicke',
      'gf.f4_desc': 'Ein toller Nebeneffekt: Statistiken \u00fcber deine Essgewohnheiten, dein Restaurant-Pers\u00f6nlichkeitstyp, Besuchshistorie und mehr. Immer privat.',
      'rf.title': 'Alles was Sie brauchen,<br><span class="text-gradient-orange">um Ihr Gesch\u00e4ft zu wachsen</span>',
      'rf.subtitle': 'Neue Kunden erreichen. Ruhige Zeiten f\u00fcllen. Deals nach Ihren Bed\u00fcrfnissen.',
      'rf.f1_title': 'Neue Kunden erreichen',
      'rf.f1_desc': 'Ihr Restaurant ist f\u00fcr Tausende von G\u00e4sten sichtbar, die aktiv die Karte erkunden. Deals heben Sie hervor.',
      'rf.f2_title': 'Nebenzeiten f\u00fcllen',
      'rf.f2_desc': 'Anreize f\u00fcr Besuche ausserhalb der Stosszeiten. Planen Sie Deals f\u00fcr bestimmte Tage und Uhrzeiten.',
      'rf.f3_title': 'Voll anpassbar',
      'rf.f3_desc': 'Rabatte, Men\u00fc-Deals, Events, Erstkundenangebote. Limits, Zeitpl\u00e4ne und Regeln nach Ihren W\u00fcnschen.',
      'rf.f4_title': 'Alles verfolgen',
      'rf.f4_desc': 'Einl\u00f6sungen, neue vs. wiederkehrende G\u00e4ste und Deal-Performance in Ihrem Dashboard. Volle Transparenz.',
      'gs.title': 'In Aktion sehen',
      'gs.subtitle': 'Ein sauberes, sch\u00f6nes Erlebnis \u2014 so wie du tats\u00e4chlich essen gehst.',
      'rs.title': 'Ihr Partner-Dashboard',
      'rs.subtitle': 'Deals verwalten, Performance verfolgen und sehen, was Ihre Kunden sehen \u2014 alles an einem Ort.',
      'rs.demo_btn': 'Interaktive Demo',
      'rs.demo_hint': 'Deals, Beitr\u00e4ge, Analysen erkunden \u2014 mit Beispieldaten, ohne Anmeldung',
      'price.title': 'Einfache, transparente Preise',
      'price.p1': 'Keine Einrichtungsgeb\u00fchren, keine monatlichen Mindestbetr\u00e4ge',
      'price.p2': 'Nur Kosten, wenn ein Gast einl\u00f6st',
      'price.p3': 'Jederzeit k\u00fcndbar, keine Verpflichtung',
      'price.p4': 'Volle Dashboard-Transparenz bei jeder Abrechnung',
      'price.per': 'pro eingel\u00f6stem Deal',
      'gcta.headline': 'Sei der Erste, der BookedEat testet',
      'gcta.subtitle': 'Wir starten bald in Z\u00fcrich. Hinterlasse deine E-Mail und wir benachrichtigen dich, wenn die Beta bereit ist.',
      'gcta.email_ph': 'Deine E-Mail-Adresse',
      'gcta.btn': 'Beta-Tester werden',
      'gcta.success': 'Du bist auf der Liste! Wir melden uns.',
      'gcta.footnote': 'Bald im App Store. Gratis, ohne Werbung, f\u00fcr immer.',
      'rcta.headline': 'Neugierig, wie es funktioniert?',
      'rcta.subtitle': 'Buchen Sie ein Intro-Gespr\u00e4ch \u2014 wir zeigen Ihnen alles. Ganz unverbindlich.',
      'rcta.restaurant_ph': 'Restaurantname',
      'rcta.email_ph': 'E-Mail-Adresse',
      'rcta.btn': 'Intro-Gespr\u00e4ch buchen',
      'rcta.success': 'Danke! Wir melden uns bald.',
      'rcta.footnote': 'Keine Einrichtungsgeb\u00fchren. Keine Verpflichtung. Wir melden uns innerhalb von 24 Stunden.',
      'footer.privacy': 'Datenschutz',
      'footer.terms': 'AGB',
      'footer.contact': 'Kontakt'
    }
  };

  var personaPhrasesI18n = {
    en: {
      guest: ['See where your friends eat.', 'Read reviews from people you trust.', 'Discover deals near you.', 'Redeem with one tap.', 'Get notified of new offers.', 'Track your dining stats.', 'Explore every restaurant on the map.'],
      restaurant: ['Reach new customers.', 'Fill off-peak hours.', 'Create deals in seconds.', 'Offer first-time customer benefits.', 'Run special event promotions.', 'Track every redemption.', 'Customize everything your way.']
    },
    de: {
      guest: ['Sieh, wo deine Freunde essen.', 'Lies Bewertungen von Menschen, denen du vertraust.', 'Entdecke Deals in deiner N\u00e4he.', 'Mit einem Tipp einl\u00f6sen.', 'Benachrichtigungen \u00fcber neue Angebote.', 'Verfolge deine Essens-Statistiken.', 'Entdecke jedes Restaurant auf der Karte.'],
      restaurant: ['Neue Kunden erreichen.', 'Nebenzeiten f\u00fcllen.', 'Deals in Sekunden erstellen.', 'Erstkundenvorteile anbieten.', 'Spezielle Event-Aktionen.', 'Jede Einl\u00f6sung verfolgen.', 'Alles nach Ihren W\u00fcnschen.']
    }
  };

  function t(key) { return (TR[lang] && TR[lang][key]) || TR.en[key] || key; }

  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-ph'));
    });
    document.documentElement.lang = lang;
  }

  function setLang(newLang) {
    lang = newLang;
    localStorage.setItem(LANG_KEY, lang);
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang.toUpperCase();
    translatePage();
    // Restart typewriters with new phrases
    rebuildTypewriters();
  }

  // Language toggle button
  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.textContent = lang.toUpperCase();
    langBtn.addEventListener('click', function () {
      setLang(lang === 'en' ? 'de' : 'en');
    });
  }

  // Initial translation
  if (lang !== 'en') translatePage();

  /* ----------------------------------------------------------
     1. Typewriter Effect (per persona, per language)
     ---------------------------------------------------------- */
  var typewriters = {};

  function createTypewriter(elementId, phrases) {
    var el = document.getElementById(elementId);
    if (!el) return null;

    var state = { el: el, phrases: phrases, phraseIndex: 0, charIndex: 0, isDeleting: false, timer: null, active: false };

    function tick() {
      if (!state.active) return;
      var current = state.phrases[state.phraseIndex];
      if (!state.isDeleting) {
        state.charIndex++;
        state.el.textContent = current.substring(0, state.charIndex);
        if (state.charIndex === current.length) { state.timer = setTimeout(function () { state.isDeleting = true; tick(); }, 2000); return; }
        state.timer = setTimeout(tick, 60);
      } else {
        state.charIndex--;
        state.el.textContent = current.substring(0, state.charIndex);
        if (state.charIndex === 0) { state.isDeleting = false; state.phraseIndex = (state.phraseIndex + 1) % state.phrases.length; state.timer = setTimeout(tick, 400); return; }
        state.timer = setTimeout(tick, 35);
      }
    }

    state.start = function () { state.active = true; state.phraseIndex = 0; state.charIndex = 0; state.isDeleting = false; state.el.textContent = ''; state.timer = setTimeout(tick, 600); };
    state.stop = function () { state.active = false; if (state.timer) clearTimeout(state.timer); state.el.textContent = ''; };

    return state;
  }

  function rebuildTypewriters() {
    var phrases = personaPhrasesI18n[lang] || personaPhrasesI18n.en;
    Object.keys(typewriters).forEach(function (k) { if (typewriters[k]) typewriters[k].stop(); });
    typewriters.guest = createTypewriter('typewriter', phrases.guest);
    typewriters.restaurant = createTypewriter('typewriter-restaurant', phrases.restaurant);
    if (typewriters[currentPersona]) typewriters[currentPersona].start();
  }

  var currentPersona = 'guest';
  rebuildTypewriters();

  /* ----------------------------------------------------------
     2. Persona Switching
     ---------------------------------------------------------- */
  var tabs = document.querySelectorAll('.persona-tab');
  var heroContents = document.querySelectorAll('.persona-content');
  var personaSections = document.querySelectorAll('.persona-section');
  var personaTrusts = document.querySelectorAll('.persona-trust');
  var heroVisualGuest = document.getElementById('hero-visual-guest');
  var heroVisualRestaurant = document.getElementById('hero-visual-restaurant');

  function switchPersona(persona) {
    if (persona === currentPersona) return;
    currentPersona = persona;
    tabs.forEach(function (tab) { tab.classList.toggle('active', tab.dataset.persona === persona); });
    heroContents.forEach(function (c) { c.classList.remove('active'); });
    var activeHero = document.getElementById('persona-' + persona);
    if (activeHero) setTimeout(function () { activeHero.classList.add('active'); }, 30);
    personaSections.forEach(function (s) { s.classList.toggle('active', s.dataset.for === persona); });
    personaTrusts.forEach(function (tr) { tr.classList.toggle('active', tr.dataset.for === persona); });
    Object.keys(typewriters).forEach(function (k) { if (typewriters[k]) typewriters[k].stop(); });
    if (typewriters[persona]) typewriters[persona].start();
    if (heroVisualGuest && heroVisualRestaurant) {
      heroVisualGuest.style.display = persona === 'guest' ? '' : 'none';
      heroVisualRestaurant.style.display = persona === 'restaurant' ? '' : 'none';
    }
  }

  tabs.forEach(function (tab) { tab.addEventListener('click', function () { switchPersona(this.dataset.persona); }); });

  /* ----------------------------------------------------------
     3. Scroll Reveal
     ---------------------------------------------------------- */
  function setupReveal() {
    ['.section-header', '.feature-card', '.step-card', '.device-showcase', '.trust-card', '.cta-content', '.hero-stats', '.hero-cta'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { el.classList.add('reveal'); });
    });
    document.querySelectorAll('.features-grid, .steps-grid').forEach(function (el) { el.classList.add('reveal-stagger'); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) { observer.observe(el); });
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setupReveal();

  /* ----------------------------------------------------------
     4. Nav shadow on scroll
     ---------------------------------------------------------- */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 20 ? 'var(--shadow-sm)' : 'none';
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     6. Smooth scroll for anchor links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ----------------------------------------------------------
     7. Device Slideshows
     ---------------------------------------------------------- */
  function initSlideshow(showcaseId, captionId, dotsId, intervalMs) {
    var showcase = document.getElementById(showcaseId);
    var captionEl = document.getElementById(captionId);
    var dotsEl = dotsId ? document.getElementById(dotsId) : null;
    if (!showcase) return null;
    var slides = showcase.querySelectorAll('.device-slide');
    if (!slides.length) return null;
    var state = { current: 0, timer: null, total: slides.length };
    var dots = [];
    if (dotsEl) {
      for (var i = 0; i < state.total; i++) {
        var dot = document.createElement('button');
        dot.className = 'device-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.dataset.index = i;
        dot.addEventListener('click', function () { goTo(parseInt(this.dataset.index, 10)); });
        dotsEl.appendChild(dot);
      }
      dots = dotsEl.querySelectorAll('.device-dot');
    }
    function goTo(index) {
      if (index === state.current) return;
      slides[state.current].classList.remove('active');
      if (dots.length) dots[state.current].classList.remove('active');
      state.current = index;
      slides[state.current].classList.add('active');
      if (dots.length) dots[state.current].classList.add('active');
      if (captionEl) { captionEl.style.opacity = '0'; setTimeout(function () { captionEl.textContent = slides[state.current].getAttribute('data-caption') || ''; captionEl.style.opacity = '1'; }, 200); }
      resetTimer();
    }
    function next() { goTo((state.current + 1) % state.total); }
    function resetTimer() { if (state.timer) clearInterval(state.timer); state.timer = setInterval(next, intervalMs); }
    resetTimer();
    return state;
  }
  initSlideshow('laptop-showcase', 'laptop-caption', 'laptop-dots', 3500);
  initSlideshow('phone-showcase', 'phone-caption', 'phone-dots', 3000);

  /* ----------------------------------------------------------
     7b. Screenshot Carousel — cursor-driven speed + typewriter caption
     ---------------------------------------------------------- */
  (function () {
    var carousel = document.getElementById('screenshot-carousel');
    var captionEl = document.getElementById('carousel-caption-text');
    if (!carousel || !captionEl) return;
    var items = carousel.querySelectorAll('.screenshot-item');
    var track = carousel.querySelector('.screenshot-track');
    var currentCaption = '', targetCaption = '', charIndex = 0, isDeleting = false, timer = null;
    var scrollSpeed = 0, scrollPos = 0, trackWidth = 0, isHovering = false;

    function measureTrack() { if (track) trackWidth = track.scrollWidth / 2; }
    measureTrack();
    window.addEventListener('resize', measureTrack);
    var baseSpeed = 0.5;

    carousel.addEventListener('mouseenter', function () { isHovering = true; });
    carousel.addEventListener('mouseleave', function () { isHovering = false; scrollSpeed = 0; });
    carousel.addEventListener('mousemove', function (e) {
      var rect = carousel.getBoundingClientRect();
      var ratio = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      if (Math.abs(ratio) < 0.1) { scrollSpeed = 0; return; }
      var sign = ratio > 0 ? 1 : -1;
      scrollSpeed = sign * Math.pow(Math.abs(ratio), 1.8) * 10;
    });

    function animate() {
      scrollPos += (isHovering ? scrollSpeed : baseSpeed);
      if (trackWidth > 0) { if (scrollPos >= trackWidth) scrollPos -= trackWidth; if (scrollPos < 0) scrollPos += trackWidth; }
      track.style.transform = 'translateX(' + (-scrollPos) + 'px)';
      requestAnimationFrame(animate);
    }
    track.style.animation = 'none';
    requestAnimationFrame(animate);

    function getCenterItem() {
      var center = carousel.getBoundingClientRect().left + carousel.offsetWidth / 2;
      var closest = null, closestDist = Infinity;
      items.forEach(function (item) { var r = item.getBoundingClientRect(); var d = Math.abs(r.left + r.width / 2 - center); if (d < closestDist) { closestDist = d; closest = item; } });
      return closest;
    }

    function typewrite() {
      if (!isDeleting) { charIndex++; captionEl.textContent = targetCaption.substring(0, charIndex); if (charIndex >= targetCaption.length) { currentCaption = targetCaption; return; } timer = setTimeout(typewrite, 55); }
      else { charIndex--; captionEl.textContent = currentCaption.substring(0, charIndex); if (charIndex <= 0) { isDeleting = false; currentCaption = ''; captionEl.textContent = ''; timer = setTimeout(typewrite, 150); return; } timer = setTimeout(typewrite, 30); }
    }

    var currentHighlight = null;
    function checkCenter() {
      var item = getCenterItem();
      if (!item) return;
      if (item !== currentHighlight) { if (currentHighlight) currentHighlight.classList.remove('is-center'); item.classList.add('is-center'); currentHighlight = item; }
      // Use lang-appropriate caption
      var captionAttr = lang === 'de' ? 'data-caption-de' : 'data-caption';
      var caption = item.getAttribute(captionAttr) || item.getAttribute('data-caption') || '';
      if (caption !== targetCaption) {
        targetCaption = caption;
        if (timer) clearTimeout(timer);
        if (currentCaption) { isDeleting = true; charIndex = currentCaption.length; } else { isDeleting = false; charIndex = 0; }
        typewrite();
      }
    }
    setInterval(checkCenter, 200);
    checkCenter();
  })();

  /* ----------------------------------------------------------
     9. Forms
     ---------------------------------------------------------- */
  var API_BASE = 'https://9j1rcg9aeb.execute-api.eu-north-1.amazonaws.com';

  var waitlistForm = document.getElementById('waitlist-form');
  var waitlistSuccess = document.getElementById('waitlist-success');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', function (e) {
      e.preventDefault();
      fetch(API_BASE + '/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ restaurant: document.getElementById('wl-restaurant').value, email: document.getElementById('wl-email').value, action: 'call' }) }).catch(function () {});
      waitlistForm.style.display = 'none';
      if (waitlistSuccess) waitlistSuccess.style.display = 'block';
    });
  }

  var betaForm = document.getElementById('beta-form');
  var betaSuccess = document.getElementById('beta-success');
  if (betaForm) {
    betaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      fetch(API_BASE + '/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.getElementById('beta-email').value, action: 'beta' }) }).catch(function () {});
      betaForm.style.display = 'none';
      if (betaSuccess) betaSuccess.style.display = 'block';
    });
  }

})();
