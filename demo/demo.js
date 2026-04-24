(function () {
  'use strict';

  // ============================================================
  //  i18n
  // ============================================================
  var LANG_KEY = 'bookedeat_lang';
  var lang = localStorage.getItem(LANG_KEY) || 'en';

  var TR = {
    en: {
      'demo.banner': 'Interactive Demo — Explore with sample data',
      'demo.book_call': 'Book a call',
      'demo.nav_dashboard': 'Dashboard',
      'demo.nav_deals': 'Deals',
      'demo.nav_posts': 'Posts',
      'demo.nav_billing': 'Billing',
      'demo.phone_title': 'What your customers see',
      'demo.phone_subtitle': 'Updates appear instantly in the app',
      'dashboard.subtitle': 'Partner Dashboard',
      'dashboard.value_suffix': 'unique customers brought to your restaurant',
      'dashboard.active_deals': 'Active Deals',
      'dashboard.redemptions': 'Redemptions',
      'dashboard.guests': 'Guests',
      'dashboard.subscribers': 'Subscribers',
      'dashboard.chart_pie': 'Redemptions by Deal',
      'dashboard.chart_line': 'Daily Guests',
      'dashboard.filter_all': 'All Time',
      'dashboard.filter_7d': '7 Days',
      'dashboard.filter_30d': '30 Days',
      'dashboard.manage_deals': 'Manage Deals',
      'dashboard.deal_count': '6 total deals',
      'dashboard.news_posts': 'News Posts',
      'dashboard.share_updates': 'Share updates with followers',
      'dashboard.billing': 'Billing & Receipts',
      'deals.title': 'Manage Deals',
      'deals.all': 'All',
      'deals.active': 'Active',
      'deals.inactive': 'Inactive',
      'deals.anytime': 'Available anytime',
      'deals.max1': 'Max 1 per customer',
      'posts.title': 'News Posts',
      'posts.published': 'Published',
      'posts.yesterday': 'Yesterday',
      'posts.3days': '3 days ago',
      'posts.1week': '1 week ago',
      'billing.title': 'Billing & Receipts',
      'billing.billing': 'Billing',
      'billing.total_redemptions': 'Total Redemptions',
      'billing.fee': 'BookedEat Fee',
      'billing.fee_note': 'CHF 0.50 per redemption',
      'billing.total_owed': 'Total Owed',
      'billing.spending_limit': 'Spending Limit',
      'billing.spending_limit_desc': 'Set a maximum monthly spend. Deals auto-deactivate when reached.',
      'billing.save_limit': 'Save',
      'billing.current_spend_text': 'This month: CHF 43.50',
      'billing.payment_history': 'Payment History',
      'billing.paid': 'Paid',
      'billing.download': 'Download',
      'cta.headline': 'Curious how it works?',
      'cta.subtitle': "Book an intro call \u2014 we'll walk you through everything. No strings attached.",
      'cta.restaurant': 'Restaurant name',
      'cta.email': 'Email address',
      'cta.book_call': 'Book an Intro Call',
      'cta.success': "Thanks! We'll be in touch soon.",
      'cta.spam_hint': 'Check your spam folder for our confirmation email.',
      'cta.footnote': "No setup fees. No commitment. We'll reach out within 24 hours."
    },
    de: {
      'demo.banner': 'Interaktive Demo \u2014 Mit Beispieldaten erkunden',
      'demo.book_call': 'Gespr\u00e4ch buchen',
      'demo.nav_dashboard': 'Dashboard',
      'demo.nav_deals': 'Deals',
      'demo.nav_posts': 'Beitr\u00e4ge',
      'demo.nav_billing': 'Abrechnung',
      'demo.phone_title': 'Was Ihre Kunden sehen',
      'demo.phone_subtitle': 'Updates erscheinen sofort in der App',
      'dashboard.subtitle': 'Partner-Dashboard',
      'dashboard.value_suffix': 'einzigartige Kunden in Ihr Restaurant gebracht',
      'dashboard.active_deals': 'Aktive Deals',
      'dashboard.redemptions': 'Einl\u00f6sungen',
      'dashboard.guests': 'G\u00e4ste',
      'dashboard.subscribers': 'Abonnenten',
      'dashboard.chart_pie': 'Einl\u00f6sungen nach Deal',
      'dashboard.chart_line': 'T\u00e4gliche G\u00e4ste',
      'dashboard.filter_all': 'Gesamt',
      'dashboard.filter_7d': '7 Tage',
      'dashboard.filter_30d': '30 Tage',
      'dashboard.manage_deals': 'Deals verwalten',
      'dashboard.deal_count': '6 Deals insgesamt',
      'dashboard.news_posts': 'News-Beitr\u00e4ge',
      'dashboard.share_updates': 'Updates mit Followern teilen',
      'dashboard.billing': 'Abrechnung & Belege',
      'deals.title': 'Deals verwalten',
      'deals.all': 'Alle',
      'deals.active': 'Aktiv',
      'deals.inactive': 'Inaktiv',
      'deals.anytime': 'Jederzeit verf\u00fcgbar',
      'deals.max1': 'Max. 1 pro Kunde',
      'posts.title': 'News-Beitr\u00e4ge',
      'posts.published': 'Ver\u00f6ffentlicht',
      'posts.yesterday': 'Gestern',
      'posts.3days': 'Vor 3 Tagen',
      'posts.1week': 'Vor 1 Woche',
      'billing.title': 'Abrechnung & Belege',
      'billing.billing': 'Abrechnung',
      'billing.total_redemptions': 'Gesamteinl\u00f6sungen',
      'billing.fee': 'BookedEat-Geb\u00fchr',
      'billing.fee_note': 'CHF 0.50 pro Einl\u00f6sung',
      'billing.total_owed': 'Gesamtbetrag',
      'billing.spending_limit': 'Ausgabenlimit',
      'billing.spending_limit_desc': 'Maximales Monatsbudget festlegen. Deals werden automatisch deaktiviert.',
      'billing.save_limit': 'Speichern',
      'billing.current_spend_text': 'Dieser Monat: CHF 43.50',
      'billing.payment_history': 'Zahlungsverlauf',
      'billing.paid': 'Bezahlt',
      'billing.download': 'Herunterladen',
      'cta.headline': 'Neugierig, wie es funktioniert?',
      'cta.subtitle': 'Buchen Sie ein Intro-Gespr\u00e4ch \u2014 wir zeigen Ihnen alles. Ganz unverbindlich.',
      'cta.restaurant': 'Restaurantname',
      'cta.email': 'E-Mail-Adresse',
      'cta.book_call': 'Intro-Gespr\u00e4ch buchen',
      'cta.success': 'Danke! Wir melden uns bald.',
      'cta.spam_hint': 'Pr\u00fcfe deinen Spam-Ordner f\u00fcr unsere Best\u00e4tigungsmail.',
      'cta.footnote': 'Keine Einrichtungsgeb\u00fchren. Keine Verpflichtung. Wir melden uns innerhalb von 24 Stunden.'
    }
  };

  var phonePhrases = {
    en: {
      dashboard: ['Customers discover your restaurant on the map.', 'They browse your deals, read reviews, and follow you.', 'Every visit shows up in your dashboard.'],
      deals: ['Your deals appear on the map nearby.', 'Customers redeem with one tap.', 'Set limits, schedules, and rules your way.'],
      posts: ['News posts reach every follower instantly.', 'Share menus, events, and promotions.', 'Attach deals to drive even more traffic.'],
      billing: ['Only pay when a customer redeems.', 'CHF 0.50 per redemption, nothing else.', 'Full transparency on every charge.']
    },
    de: {
      dashboard: ['Kunden entdecken Ihr Restaurant auf der Karte.', 'Sie st\u00f6bern in Deals, lesen Bewertungen und folgen Ihnen.', 'Jeder Besuch erscheint in Ihrem Dashboard.'],
      deals: ['Ihre Deals erscheinen in der N\u00e4he auf der Karte.', 'Kunden l\u00f6sen mit einem Tipp ein.', 'Limits, Zeitpl\u00e4ne und Regeln nach Ihren W\u00fcnschen.'],
      posts: ['News-Beitr\u00e4ge erreichen jeden Follower sofort.', 'Teilen Sie Men\u00fcs, Events und Aktionen.', 'H\u00e4ngen Sie Deals an f\u00fcr mehr Reichweite.'],
      billing: ['Zahlen Sie nur, wenn ein Kunde einl\u00f6st.', 'CHF 0.50 pro Einl\u00f6sung, sonst nichts.', 'Volle Transparenz bei jeder Abrechnung.']
    }
  };

  function t(key) { return (TR[lang] && TR[lang][key]) || TR.en[key] || key; }

  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-ph'));
    });
  }

  // Language dropdown
  var langBtn = document.getElementById('demo-lang-btn');
  var langDrop = document.getElementById('demo-lang-dropdown');

  function updateDemoLangUI() {
    if (langBtn) langBtn.innerHTML = lang.toUpperCase() + ' &#9662;';
    if (langDrop) langDrop.querySelectorAll('.demo-lang-option').forEach(function (o) {
      o.classList.toggle('active', o.dataset.lang === lang);
    });
  }

  function setDemoLang(newLang) {
    lang = newLang;
    localStorage.setItem(LANG_KEY, lang);
    updateDemoLangUI();
    translatePage();
    startTypewriter((phonePhrases[lang] || phonePhrases.en)[currentScreen]);
  }

  if (langBtn && langDrop) {
    updateDemoLangUI();
    if (lang !== 'en') translatePage();
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      langDrop.classList.toggle('hidden');
    });
    langDrop.querySelectorAll('.demo-lang-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        setDemoLang(this.dataset.lang);
        langDrop.classList.add('hidden');
      });
    });
    document.addEventListener('click', function () { langDrop.classList.add('hidden'); });
  } else if (lang !== 'en') {
    translatePage();
  }

  // ============================================================
  //  Phone panel config
  // ============================================================
  var phoneScreenMap = {
    dashboard: { image: '../screenshots/filter_nearby_deals.jpeg' },
    deals:     { image: '../screenshots/Navigate_like_notify_save_deals.jpeg' },
    posts:     { image: '../screenshots/News_feed.jpeg' },
    billing:   { image: '../screenshots/filter_nearby_deals.jpeg' }
  };

  // ============================================================
  //  Typewriter
  // ============================================================
  var twEl = document.getElementById('demo-typewriter');
  var twState = { phrases: [], phraseIndex: 0, charIndex: 0, isDeleting: false, timer: null, active: false };

  function twTick() {
    if (!twState.active) return;
    var current = twState.phrases[twState.phraseIndex];
    if (!twState.isDeleting) {
      twState.charIndex++;
      twEl.textContent = current.substring(0, twState.charIndex);
      if (twState.charIndex === current.length) { twState.timer = setTimeout(function () { twState.isDeleting = true; twTick(); }, 2200); return; }
      twState.timer = setTimeout(twTick, 50);
    } else {
      twState.charIndex--;
      twEl.textContent = current.substring(0, twState.charIndex);
      if (twState.charIndex === 0) { twState.isDeleting = false; twState.phraseIndex = (twState.phraseIndex + 1) % twState.phrases.length; twState.timer = setTimeout(twTick, 350); return; }
      twState.timer = setTimeout(twTick, 25);
    }
  }

  function startTypewriter(phrases) {
    if (twState.timer) clearTimeout(twState.timer);
    twState.active = false;
    twState.phrases = phrases;
    twState.phraseIndex = 0;
    twState.charIndex = 0;
    twState.isDeleting = false;
    if (twEl) twEl.textContent = '';
    twState.active = true;
    twState.timer = setTimeout(twTick, 400);
  }

  // ============================================================
  //  Screen Navigation
  // ============================================================
  var navLinks = document.querySelectorAll('.demo-nav-link');
  var screens = document.querySelectorAll('.portal-screen');
  var phoneImg = document.getElementById('demo-phone-img');
  var currentScreen = 'dashboard';

  window.showScreen = function (name) {
    currentScreen = name;
    screens.forEach(function (s) { s.classList.remove('active'); });
    navLinks.forEach(function (l) { l.classList.remove('active'); });

    var target = document.getElementById('screen-' + name);
    if (target) target.classList.add('active');

    navLinks.forEach(function (l) {
      if (l.dataset.screen === name) l.classList.add('active');
    });

    var cfg = phoneScreenMap[name];
    if (cfg && phoneImg) {
      phoneImg.style.opacity = '0';
      setTimeout(function () { phoneImg.src = cfg.image; phoneImg.style.opacity = '1'; }, 250);
    }
    startTypewriter((phonePhrases[lang] || phonePhrases.en)[name] || phonePhrases.en.dashboard);

    document.querySelector('.demo-main').scrollTop = 0;
    window.scrollTo(0, 0);
  };

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () { showScreen(this.dataset.screen); });
  });

  // Start
  startTypewriter(phonePhrases.en.dashboard);

  // ============================================================
  //  Deal Filter Chips
  // ============================================================
  var filterChips = document.querySelectorAll('.filter-chip');
  var dealCards = document.querySelectorAll('#deals-list .deal-card');

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      filterChips.forEach(function (c) { c.classList.remove('active'); });
      this.classList.add('active');
      var filter = this.dataset.filter;
      dealCards.forEach(function (card) {
        var isActive = card.querySelector('input[type="checkbox"]').checked;
        if (filter === 'all') card.style.display = '';
        else if (filter === 'active') card.style.display = isActive ? '' : 'none';
        else card.style.display = isActive ? 'none' : '';
      });
    });
  });

  // ============================================================
  //  Time Filter
  // ============================================================
  var timeFilters = document.querySelectorAll('.time-filter-btn');
  timeFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      timeFilters.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      renderLineChart(this.dataset.range);
    });
  });

  // ============================================================
  //  Charts
  // ============================================================
  var pieCtx = document.getElementById('pie-chart');
  if (pieCtx) {
    new Chart(pieCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['20% Off Lunch', 'BOGO Pizza', 'Free Tiramisu', 'Set Menu', 'Wine Tasting', 'CHF 10 Off'],
        datasets: [{ data: [87, 64, 43, 31, 22, 18], backgroundColor: ['rgba(0,122,255,0.8)','rgba(175,82,222,0.8)','rgba(52,199,89,0.8)','rgba(255,149,0,0.8)','rgba(255,59,48,0.8)','rgba(88,86,214,0.8)'], borderWidth: 0, hoverOffset: 6 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 11, family: 'Inter' } } } } }
    });
  }

  var allDailyGuests = [], allDailyLabels = [];
  var today = new Date();
  for (var i = 89; i >= 0; i--) {
    var d = new Date(today); d.setDate(d.getDate() - i);
    allDailyLabels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    var base = 3 + (90 - i) * 0.08, dow = d.getDay();
    allDailyGuests.push(Math.max(0, Math.round(base + ((dow === 5 || dow === 6) ? 3 : 0) + Math.round((Math.random() - 0.3) * 4))));
  }

  var lineChartInstance = null;
  function renderLineChart(range) {
    var labels, data;
    if (range === '7d') { labels = allDailyLabels.slice(-7); data = allDailyGuests.slice(-7); }
    else if (range === '30d') { labels = allDailyLabels.slice(-30); data = allDailyGuests.slice(-30); }
    else { labels = allDailyLabels; data = allDailyGuests; }
    if (lineChartInstance) lineChartInstance.destroy();
    var ctx = document.getElementById('line-chart'); if (!ctx) return;
    lineChartInstance = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: { labels: labels, datasets: [{ label: 'Guests', data: data, borderColor: 'rgba(0,122,255,0.8)', backgroundColor: 'rgba(0,122,255,0.08)', fill: true, tension: 0.35, borderWidth: 2, pointRadius: data.length > 30 ? 0 : 3, pointHoverRadius: 5, pointBackgroundColor: '#007AFF' }] },
      options: { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' }, scales: { x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' }, maxTicksLimit: 8 } }, y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10, family: 'Inter' }, stepSize: 2 } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(0,0,0,0.75)', titleFont: { size: 12, family: 'Inter' }, bodyFont: { size: 12, family: 'Inter' }, padding: 10, cornerRadius: 8 } } }
    });
  }
  renderLineChart('all');

  // ============================================================
  //  Receipt download (generates a simple text receipt)
  // ============================================================
  var receiptData = {
    march:    { month: 'March 2026',    redemptions: 87, amount: '43.50' },
    february: { month: 'February 2026', redemptions: 92, amount: '46.00' },
    january:  { month: 'January 2026',  redemptions: 68, amount: '34.00' }
  };

  window.downloadReceipt = function (key) {
    var r = receiptData[key];
    if (!r) return;
    var lines = [
      '========================================',
      '           BookedEat - Receipt',
      '========================================',
      '',
      'Restaurant:    Demo Account',
      'Period:        ' + r.month,
      '',
      '----------------------------------------',
      'Description          Qty      Amount',
      '----------------------------------------',
      'Platform Fee         ' + r.redemptions + '       CHF ' + r.amount,
      '(CHF 0.50/redemption)',
      '----------------------------------------',
      'Total:                        CHF ' + r.amount,
      'Status:                       Paid',
      '----------------------------------------',
      '',
      'Thank you for partnering with BookedEat.',
      '========================================'
    ];
    var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'BookedEat_Receipt_' + r.month.replace(' ', '_') + '.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // ============================================================
  //  Waitlist Form
  // ============================================================
  var wlForm = document.getElementById('demo-waitlist-form');
  var wlSuccess = document.getElementById('demo-wl-success');
  var wlAction = 'call';

  if (wlForm) {
    wlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        restaurant: document.getElementById('dwl-restaurant').value,
        email: document.getElementById('dwl-email').value,
        action: 'call'
      };
      fetch('https://9j1rcg9aeb.execute-api.eu-north-1.amazonaws.com/waitlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(function () {});
      wlForm.style.display = 'none';
      if (wlSuccess) wlSuccess.style.display = 'block';
    });
  }

})();
