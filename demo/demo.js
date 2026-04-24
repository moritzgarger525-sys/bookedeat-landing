(function () {
  'use strict';

  // ============================================================
  //  Phone panel config — screenshot + typewriter phrases per screen
  //  SCREENSHOTS: Replace these paths once you capture the real ones.
  // ============================================================
  var phoneConfig = {
    dashboard: {
      image: '../screenshots/filter_nearby_deals.jpeg',
      phrases: [
        'Customers discover your restaurant on the map.',
        'They browse your deals, read reviews, and follow you.',
        'Every visit shows up in your dashboard.',
      ]
    },
    deals: {
      image: '../screenshots/Navigate_like_notify_save_deals.jpeg',
      phrases: [
        'Your deals appear on the map nearby.',
        'Customers redeem with one tap.',
        'Set limits, schedules, and rules your way.',
      ]
    },
    posts: {
      image: '../screenshots/news_feed.jpeg',
      phrases: [
        'News posts reach every follower instantly.',
        'Share menus, events, and promotions.',
        'Attach deals to drive even more traffic.',
      ]
    }
  };

  // ============================================================
  //  Typewriter
  // ============================================================
  var twEl = document.getElementById('demo-typewriter');
  var twState = {
    phrases: [],
    phraseIndex: 0,
    charIndex: 0,
    isDeleting: false,
    timer: null,
    active: false
  };

  function twTick() {
    if (!twState.active) return;
    var current = twState.phrases[twState.phraseIndex];

    if (!twState.isDeleting) {
      twState.charIndex++;
      twEl.textContent = current.substring(0, twState.charIndex);
      if (twState.charIndex === current.length) {
        twState.timer = setTimeout(function () { twState.isDeleting = true; twTick(); }, 2200);
        return;
      }
      twState.timer = setTimeout(twTick, 50);
    } else {
      twState.charIndex--;
      twEl.textContent = current.substring(0, twState.charIndex);
      if (twState.charIndex === 0) {
        twState.isDeleting = false;
        twState.phraseIndex = (twState.phraseIndex + 1) % twState.phrases.length;
        twState.timer = setTimeout(twTick, 350);
        return;
      }
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
  //  Screen Navigation + Phone Update
  // ============================================================
  var navLinks = document.querySelectorAll('.demo-nav-link');
  var screens = document.querySelectorAll('.portal-screen');
  var phoneImg = document.getElementById('demo-phone-img');

  window.showScreen = function (name) {
    screens.forEach(function (s) { s.classList.remove('active'); });
    navLinks.forEach(function (l) { l.classList.remove('active'); });

    var target = document.getElementById('screen-' + name);
    if (target) target.classList.add('active');

    navLinks.forEach(function (l) {
      if (l.dataset.screen === name) l.classList.add('active');
    });

    // Update phone panel
    var cfg = phoneConfig[name];
    if (cfg) {
      if (phoneImg) {
        phoneImg.style.opacity = '0';
        setTimeout(function () {
          phoneImg.src = cfg.image;
          phoneImg.style.opacity = '1';
        }, 250);
      }
      startTypewriter(cfg.phrases);
    }

    // Scroll main content to top
    document.querySelector('.demo-main').scrollTop = 0;
    window.scrollTo(0, 0);
  };

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      showScreen(this.dataset.screen);
    });
  });

  // Start with dashboard phone config
  startTypewriter(phoneConfig.dashboard.phrases);

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
  //  Time Filter (line chart)
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
  //  Charts — Pie (Redemptions by Deal)
  // ============================================================
  var pieCtx = document.getElementById('pie-chart');
  if (pieCtx) {
    new Chart(pieCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['20% Off Lunch', 'BOGO Pizza', 'Free Tiramisu', 'Set Menu', 'Wine Tasting', 'CHF 10 Off'],
        datasets: [{
          data: [87, 64, 43, 31, 22, 18],
          backgroundColor: [
            'rgba(0,122,255,0.8)', 'rgba(175,82,222,0.8)', 'rgba(52,199,89,0.8)',
            'rgba(255,149,0,0.8)', 'rgba(255,59,48,0.8)', 'rgba(88,86,214,0.8)'
          ],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '60%',
        plugins: {
          legend: {
            display: true, position: 'bottom',
            labels: { boxWidth: 10, padding: 12, font: { size: 11, family: 'Inter' } }
          }
        }
      }
    });
  }

  // ============================================================
  //  Charts — Line (Daily Guests)
  // ============================================================
  var allDailyGuests = [];
  var allDailyLabels = [];
  var today = new Date();
  for (var i = 89; i >= 0; i--) {
    var d = new Date(today);
    d.setDate(d.getDate() - i);
    allDailyLabels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    var base = 3 + (90 - i) * 0.08;
    var dayOfWeek = d.getDay();
    var weekendBoost = (dayOfWeek === 5 || dayOfWeek === 6) ? 3 : 0;
    var noise = Math.round((Math.random() - 0.3) * 4);
    allDailyGuests.push(Math.max(0, Math.round(base + weekendBoost + noise)));
  }

  var lineChartInstance = null;

  function renderLineChart(range) {
    var labels, data;
    if (range === '7d') { labels = allDailyLabels.slice(-7); data = allDailyGuests.slice(-7); }
    else if (range === '30d') { labels = allDailyLabels.slice(-30); data = allDailyGuests.slice(-30); }
    else { labels = allDailyLabels; data = allDailyGuests; }

    if (lineChartInstance) lineChartInstance.destroy();
    var ctx = document.getElementById('line-chart');
    if (!ctx) return;

    lineChartInstance = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Guests', data: data,
          borderColor: 'rgba(0,122,255,0.8)', backgroundColor: 'rgba(0,122,255,0.08)',
          fill: true, tension: 0.35, borderWidth: 2,
          pointRadius: data.length > 30 ? 0 : 3, pointHoverRadius: 5, pointBackgroundColor: '#007AFF'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' }, maxTicksLimit: 8 } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10, family: 'Inter' }, stepSize: 2 } }
        },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: 'rgba(0,0,0,0.75)', titleFont: { size: 12, family: 'Inter' }, bodyFont: { size: 12, family: 'Inter' }, padding: 10, cornerRadius: 8 }
        }
      }
    });
  }

  renderLineChart('all');

  // ============================================================
  //  Waitlist Form
  // ============================================================
  var wlForm = document.getElementById('demo-waitlist-form');
  var wlSuccess = document.getElementById('demo-wl-success');
  var wlAction = 'call';

  if (wlForm) {
    wlForm.querySelectorAll('.demo-wl-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { wlAction = this.dataset.action || 'call'; });
    });

    wlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        restaurant: document.getElementById('dwl-restaurant').value,
        name: document.getElementById('dwl-name').value,
        email: document.getElementById('dwl-email').value,
        phone: document.getElementById('dwl-phone').value,
        action: wlAction
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
