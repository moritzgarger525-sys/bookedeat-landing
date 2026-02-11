(function () {
  'use strict';

  // ============================================================
  //  STATE
  // ============================================================
  var partner = null;   // { id, userId, restaurantId, isVerified, restaurantName, restaurantAddress, restaurantPhotos }
  var deals = [];       // array of deal objects
  var currentScreen = null;
  var editingDealId = null;
  var pieChart = null;
  var lineChart = null;

  // Chart colors (matching Flutter)
  var CHART_COLORS = [
    '#007AFF', '#AF52DE', '#34C759', '#FF9500',
    '#FF3B30', '#26A69A', '#FF7043', '#78909C'
  ];

  // Deal types config
  var DEAL_TYPES = [
    { key: 'percent',       label: 'Percent Off',     icon: '%' },
    { key: 'fixed',         label: 'CHF Off',         icon: 'CHF' },
    { key: 'bogo',          label: 'BOGO',            icon: '2x' },
    { key: 'free_item',     label: 'Free Item',       icon: '&#127873;' },
    { key: 'menu_discount', label: 'Menu Discount',   icon: '&#127860;' },
    { key: 'set_menu',      label: 'Set Menu',        icon: '&#128214;' },
    { key: 'special_event', label: 'Special Event',   icon: '&#127881;' }
  ];

  var DAY_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  var DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Form state
  var formState = {
    discountType: 'percent',
    includedItems: [],
    eventDates: [],
    validDays: new Set(),
    cooldownDays: null
  };

  // ============================================================
  //  HELPERS
  // ============================================================
  function $(id) { return document.getElementById(id); }
  function show(el) { if (el) el.style.display = ''; }
  function hide(el) { if (el) el.style.display = 'none'; }

  function shortLabel(deal) {
    switch (deal.discount_type) {
      case 'percent': return deal.discount_value + '% off';
      case 'fixed': return 'CHF ' + Math.round(deal.discount_value) + ' off';
      case 'bogo': return 'BOGO';
      case 'free_item': return 'Free item';
      case 'menu_discount': return deal.discount_value + '% off';
      case 'set_menu': return 'CHF ' + (deal.price ? Math.round(deal.price) : '?');
      case 'special_event': return 'Event';
      default: return 'Deal';
    }
  }

  function validitySummary(deal) {
    var parts = [];
    if (deal.valid_days && deal.valid_days.length > 0) {
      if (deal.valid_days.length <= 2) {
        parts.push(deal.valid_days.map(function (d) { return d.charAt(0).toUpperCase() + d.slice(1); }).join(' & '));
      } else {
        parts.push(deal.valid_days.length + ' days/week');
      }
    }
    if (deal.valid_time_start && deal.valid_time_end) {
      parts.push(deal.valid_time_start.slice(0, 5) + '–' + deal.valid_time_end.slice(0, 5));
    }
    if (deal.valid_until) {
      var diff = Math.ceil((new Date(deal.valid_until) - new Date()) / 86400000);
      if (diff <= 7 && diff >= 0) parts.push((diff + 1) + ' days left');
    }
    return parts.length ? parts.join(' \u00b7 ') : 'Available anytime';
  }

  function avatarHTML(name, photos, size) {
    if (photos && photos.length > 0) {
      return '<img src="' + photos[0] + '" alt="' + (name || '') + '">';
    }
    return (name || '?').charAt(0).toUpperCase();
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // ============================================================
  //  ROUTER
  // ============================================================
  function navigate(hash) {
    if (!hash || hash === '#') hash = '#login';
    var route = hash.replace('#', '').split('/')[0];
    var param = hash.indexOf('/') > -1 ? hash.split('/').slice(1).join('/') : null;

    // Auth guard
    if (route !== 'login' && !partner) {
      location.hash = '#login';
      return;
    }
    if (route === 'login' && partner) {
      location.hash = '#dashboard';
      return;
    }

    // Hide all screens
    var screens = document.querySelectorAll('.portal-screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');

    // Toggle nav visibility
    var nav = $('portal-nav');
    if (route === 'login') {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }

    // Update active nav link
    var navLinks = document.querySelectorAll('.portal-nav-link[data-route]');
    for (var j = 0; j < navLinks.length; j++) {
      navLinks[j].classList.toggle('active', navLinks[j].getAttribute('data-route') === route);
    }

    // Show target screen
    var screen = $('screen-' + route);
    if (screen) {
      screen.classList.add('active');
      currentScreen = route;
    }

    // Screen init
    switch (route) {
      case 'dashboard': initDashboard(); break;
      case 'deals': initDeals(); break;
      case 'deal-form': initDealForm(param); break;
      case 'settings': initSettings(); break;
      case 'verify-code': initVerifyCode(); break;
    }
  }

  window.addEventListener('hashchange', function () {
    navigate(location.hash);
  });

  // ============================================================
  //  AUTH
  // ============================================================
  async function checkSession() {
    var result = await supabaseClient.auth.getSession();
    var session = result.data && result.data.session;
    if (session) {
      var ok = await fetchPartner();
      if (ok) {
        navigate(location.hash || '#dashboard');
      } else {
        await supabaseClient.auth.signOut();
        navigate('#login');
      }
    } else {
      navigate('#login');
    }
  }

  async function fetchPartner() {
    var userRes = await supabaseClient.auth.getUser();
    var user = userRes.data && userRes.data.user;
    if (!user) return false;

    var res = await supabaseClient
      .from('partners')
      .select('*, restaurants(name, address, photos)')
      .eq('user_id', user.id)
      .maybeSingle();

    if (res.error || !res.data) return false;
    var d = res.data;
    if (!d.is_verified) return false;

    var rest = d.restaurants || {};
    partner = {
      id: d.id,
      userId: d.user_id,
      restaurantId: d.restaurant_id,
      isVerified: d.is_verified,
      restaurantName: rest.name || 'Your Restaurant',
      restaurantAddress: rest.address || '',
      restaurantPhotos: rest.photos || []
    };
    return true;
  }

  supabaseClient.auth.onAuthStateChange(function (event) {
    if (event === 'SIGNED_OUT') {
      partner = null;
      deals = [];
      navigate('#login');
    }
  });

  // Login form
  function setupLogin() {
    var form = $('login-form');
    var btn = $('login-btn');
    var toggle = $('password-toggle');

    toggle.addEventListener('click', function () {
      var pw = $('login-password');
      if (pw.type === 'password') {
        pw.type = 'text';
        toggle.textContent = '\u{1F441}\uFE0F';
      } else {
        pw.type = 'password';
        toggle.textContent = '\u{1F441}';
      }
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = $('login-email').value.trim();
      var password = $('login-password').value;
      if (!email || !password) return;

      hide($('login-error'));
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div>';

      try {
        var authRes = await supabaseClient.auth.signInWithPassword({ email: email, password: password });
        if (authRes.error) throw authRes.error;

        var ok = await fetchPartner();
        if (!ok) {
          await supabaseClient.auth.signOut();
          showLoginError('No verified restaurant account found for this email.');
          return;
        }
        location.hash = '#dashboard';
      } catch (err) {
        showLoginError(err.message || 'Invalid email or password.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    });
  }

  function showLoginError(msg) {
    var el = $('login-error');
    el.textContent = msg;
    show(el);
  }

  // ============================================================
  //  DASHBOARD
  // ============================================================
  async function initDashboard() {
    if (!partner) return;

    // Set header
    $('dash-avatar').innerHTML = avatarHTML(partner.restaurantName, partner.restaurantPhotos);
    $('dash-name').textContent = partner.restaurantName;

    // Load data
    var results = await Promise.all([
      supabaseClient.rpc('get_partner_dashboard_stats', { p_restaurant_id: partner.restaurantId }),
      supabaseClient.from('deals').select('*').eq('partner_id', partner.userId).order('created_at', { ascending: false }),
      supabaseClient.rpc('get_partner_deal_analytics', { p_restaurant_id: partner.restaurantId })
    ]);

    var stats = (results[0].data) || {};
    deals = (results[1].data) || [];
    var analytics = (results[2].data) || [];

    // Daily stats (loaded separately — RPC may not exist)
    var dailyRes = await supabaseClient.rpc('get_daily_redemption_stats', { p_restaurant_id: partner.restaurantId });
    var dailyStats = (dailyRes.data) || [];

    // Render stats
    $('dash-value-text').textContent = (stats.unique_guests || 0) + ' unique customers brought to your restaurant';
    $('dash-active-deals').textContent = stats.active_deals || 0;
    $('dash-redemptions').textContent = stats.total_redemptions || 0;
    $('dash-guests').textContent = stats.unique_guests || 0;
    $('dash-deal-count').textContent = deals.length + ' total deals';

    // Pie chart
    renderPieChart(analytics);

    // Line chart
    renderLineChart(dailyStats);
  }

  function renderPieChart(analytics) {
    var withData = analytics.filter(function (a) { return (a.total_redemptions || 0) > 0; });

    if (withData.length === 0) {
      hide($('pie-chart-area'));
      show($('pie-empty'));
      return;
    }
    show($('pie-chart-area'));
    hide($('pie-empty'));

    var labels = withData.map(function (a) { return a.deal_title || 'Deal'; });
    var values = withData.map(function (a) { return a.total_redemptions || 0; });
    var colors = withData.map(function (_, i) { return CHART_COLORS[i % CHART_COLORS.length]; });

    if (pieChart) pieChart.destroy();
    pieChart = new Chart($('pie-chart'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        cutout: '55%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });

    // Legend
    var legendHTML = '';
    for (var i = 0; i < withData.length; i++) {
      legendHTML += '<div class="legend-item">' +
        '<div class="legend-dot" style="background:' + colors[i] + ';"></div>' +
        '<span class="legend-label">' + escapeHTML(labels[i]) + '</span>' +
        '<span class="legend-value">' + values[i] + '</span>' +
        '</div>';
    }
    $('pie-legend').innerHTML = legendHTML;
  }

  function renderLineChart(dailyStats) {
    if (!dailyStats || dailyStats.length === 0) {
      hide($('line-chart-area'));
      show($('line-empty'));
      return;
    }
    show($('line-chart-area'));
    hide($('line-empty'));

    var labels = dailyStats.map(function (s) {
      var d = new Date(s.stat_date);
      return d.getDate() + '/' + (d.getMonth() + 1);
    });
    var values = dailyStats.map(function (s) { return s.redemption_count || 0; });

    if (lineChart) lineChart.destroy();
    lineChart = new Chart($('line-chart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          borderColor: '#007AFF',
          borderWidth: 2.5,
          backgroundColor: function (ctx) {
            var chart = ctx.chart;
            var gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height);
            gradient.addColorStop(0, 'rgba(0, 122, 255, 0.25)');
            gradient.addColorStop(1, 'rgba(0, 122, 255, 0)');
            return gradient;
          },
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHitRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxTicksLimit: 5,
              color: 'rgba(0,0,0,0.35)',
              font: { size: 10 }
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: {
              color: 'rgba(0,0,0,0.35)',
              font: { size: 11 },
              precision: 0
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.75)',
            titleFont: { size: 12 },
            bodyFont: { size: 13, weight: 'bold' },
            padding: 8,
            cornerRadius: 8
          }
        }
      }
    });
  }

  // ============================================================
  //  DEALS LIST
  // ============================================================
  var dealsFilter = 'all';

  async function initDeals() {
    show($('deals-loading'));
    hide($('deals-list'));
    hide($('deals-empty'));

    var res = await supabaseClient
      .from('deals')
      .select('*')
      .eq('partner_id', partner.userId)
      .order('created_at', { ascending: false });

    deals = (res.data) || [];
    hide($('deals-loading'));
    renderDeals();
  }

  function renderDeals() {
    var filtered = deals;
    if (dealsFilter === 'active') filtered = deals.filter(function (d) { return d.is_active; });
    if (dealsFilter === 'inactive') filtered = deals.filter(function (d) { return !d.is_active; });

    if (filtered.length === 0) {
      hide($('deals-list'));
      show($('deals-empty'));
      return;
    }
    hide($('deals-empty'));
    show($('deals-list'));

    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var d = filtered[i];
      var redemptionText = d.current_redemptions + ' redemptions' +
        (d.max_redemptions ? ' / ' + d.max_redemptions : '');

      html += '<div class="deal-card" data-id="' + d.id + '">' +
        '<div class="deal-card-top">' +
          '<span class="deal-badge">' + escapeHTML(shortLabel(d)) + '</span>' +
          '<label class="deal-toggle">' +
            '<input type="checkbox"' + (d.is_active ? ' checked' : '') + ' data-toggle-id="' + d.id + '">' +
            '<span class="deal-toggle-slider"></span>' +
          '</label>' +
        '</div>' +
        '<div class="deal-card-body" data-edit-id="' + d.id + '">' +
          '<div class="deal-card-title">' + escapeHTML(d.title) + '</div>' +
          '<div class="deal-card-validity">' + escapeHTML(validitySummary(d)) + '</div>' +
          '<div class="deal-card-redemptions">' + escapeHTML(redemptionText) + '</div>' +
        '</div>' +
        '<div class="deal-card-actions">' +
          '<button class="btn-icon" data-edit-id="' + d.id + '" title="Edit">&#9998;</button>' +
          '<button class="btn-icon danger" data-delete-id="' + d.id + '" title="Delete">&#128465;</button>' +
        '</div>' +
      '</div>';
    }
    $('deals-list').innerHTML = html;

    // Bind toggle events
    var toggles = $('deals-list').querySelectorAll('[data-toggle-id]');
    for (var t = 0; t < toggles.length; t++) {
      toggles[t].addEventListener('change', handleToggle);
    }
    // Bind edit events
    var edits = $('deals-list').querySelectorAll('[data-edit-id]');
    for (var e = 0; e < edits.length; e++) {
      edits[e].addEventListener('click', function () {
        location.hash = '#deal-form/' + this.getAttribute('data-edit-id');
      });
    }
    // Bind delete events
    var deletes = $('deals-list').querySelectorAll('[data-delete-id]');
    for (var dd = 0; dd < deletes.length; dd++) {
      deletes[dd].addEventListener('click', function (ev) {
        ev.stopPropagation();
        handleDelete(this.getAttribute('data-delete-id'));
      });
    }
  }

  async function handleToggle() {
    var id = this.getAttribute('data-toggle-id');
    var active = this.checked;
    await supabaseClient
      .from('deals')
      .update({ is_active: active, updated_at: new Date().toISOString() })
      .eq('id', id);
    initDeals();
  }

  function handleDelete(id) {
    var deal = deals.find(function (d) { return d.id === id; });
    if (!deal) return;

    $('dialog-title').textContent = 'Delete Deal';
    $('dialog-message').textContent = 'Are you sure you want to delete "' + deal.title + '"? This cannot be undone.';
    $('confirm-dialog').classList.remove('hidden');

    var confirmBtn = $('dialog-confirm');
    var cancelBtn = $('dialog-cancel');

    function cleanup() {
      $('confirm-dialog').classList.add('hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
    }
    async function onConfirm() {
      cleanup();
      await supabaseClient.from('deals').delete().eq('id', id);
      initDeals();
    }
    function onCancel() { cleanup(); }

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
  }

  function setupDealsPage() {
    // Filter chips
    $('deals-filter-chips').addEventListener('click', function (e) {
      var chip = e.target.closest('.filter-chip');
      if (!chip) return;
      dealsFilter = chip.getAttribute('data-filter');
      var chips = $('deals-filter-chips').querySelectorAll('.filter-chip');
      for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
      chip.classList.add('active');
      renderDeals();
    });

    $('deals-add-btn').addEventListener('click', function () {
      location.hash = '#deal-form';
    });
    $('deals-create-first').addEventListener('click', function () {
      location.hash = '#deal-form';
    });
  }

  // ============================================================
  //  DEAL FORM
  // ============================================================
  async function initDealForm(dealId) {
    editingDealId = dealId || null;
    $('form-title').textContent = editingDealId ? 'Edit Deal' : 'Create Deal';
    $('deal-submit-btn').textContent = editingDealId ? 'Save Changes' : 'Create Deal';

    // Reset form
    resetForm();

    if (editingDealId) {
      var deal = deals.find(function (d) { return d.id === editingDealId; });
      if (!deal) {
        var res = await supabaseClient.from('deals').select('*').eq('id', editingDealId).single();
        deal = res.data;
      }
      if (deal) populateForm(deal);
    }

    updateFormVisibility();
  }

  function resetForm() {
    $('deal-form').reset();
    formState = {
      discountType: 'percent',
      includedItems: [],
      eventDates: [],
      validDays: new Set(),
      cooldownDays: null
    };
    $('included-items-list').innerHTML = '';
    $('event-date-chips').innerHTML = '';
    updateTypePills();
    updateCooldownChips();
    updateDayToggles();
  }

  function populateForm(deal) {
    formState.discountType = deal.discount_type || 'percent';
    $('deal-title').value = deal.title || '';
    $('deal-description').value = deal.description || '';
    $('deal-discount-value').value = deal.discount_value > 0 ? Math.round(deal.discount_value) : '';
    $('deal-item-description').value = deal.item_description || '';
    $('deal-price').value = deal.price ? Math.round(deal.price) : '';
    $('deal-original-price').value = deal.original_price ? Math.round(deal.original_price) : '';
    $('deal-max-per-user').value = deal.max_per_user || '';
    formState.cooldownDays = deal.cooldown_days || null;

    formState.includedItems = (deal.included_items || []).slice();
    renderIncludedItems();

    formState.eventDates = (deal.event_dates || []).map(function (d) { return new Date(d); });
    renderEventDateChips();

    formState.validDays = new Set(deal.valid_days || []);
    $('deal-valid-from').value = deal.valid_from || '';
    $('deal-valid-until').value = deal.valid_until || '';
    $('deal-time-start').value = (deal.valid_time_start || '').slice(0, 5);
    $('deal-time-end').value = (deal.valid_time_end || '').slice(0, 5);

    updateTypePills();
    updateCooldownChips();
    updateDayToggles();
    updateFormVisibility();
  }

  // Type visibility rules
  function showDiscountValue() {
    return ['percent', 'fixed', 'menu_discount'].indexOf(formState.discountType) > -1;
  }
  function showItemDescription() {
    return ['bogo', 'free_item', 'menu_discount'].indexOf(formState.discountType) > -1;
  }
  function showPrice() {
    return ['set_menu', 'special_event'].indexOf(formState.discountType) > -1;
  }
  function showIncludedItems() {
    return ['set_menu', 'special_event'].indexOf(formState.discountType) > -1;
  }
  function isEvent() {
    return formState.discountType === 'special_event';
  }

  function updateFormVisibility() {
    var type = formState.discountType;

    // Discount value
    if (showDiscountValue()) {
      show($('field-discount-value'));
      $('discount-value-label').textContent = type === 'fixed' ? 'Amount (CHF)' : 'Percentage (1-100)';
    } else {
      hide($('field-discount-value'));
    }

    // Item description
    if (showItemDescription()) {
      show($('field-item-description'));
      var lbl = type === 'bogo' ? 'Item (e.g., "main dish")' :
                type === 'free_item' ? 'Free item (e.g., "dessert")' :
                'Menu item (e.g., "pasta menu")';
      $('item-description-label').textContent = lbl;
    } else {
      hide($('field-item-description'));
    }

    // Pricing
    if (showPrice()) {
      show($('field-pricing'));
      $('pricing-label').textContent = isEvent() ? 'Event Pricing' : 'Menu Pricing';
    } else {
      hide($('field-pricing'));
    }

    // Included items
    showIncludedItems() ? show($('field-included-items')) : hide($('field-included-items'));

    // Cooldown
    !isEvent() ? show($('field-cooldown')) : hide($('field-cooldown'));

    // Schedule vs Event dates
    if (isEvent()) {
      hide($('field-schedule'));
      show($('field-event-dates'));
      renderCalendar();
    } else {
      show($('field-schedule'));
      hide($('field-event-dates'));
    }
  }

  // Type pills
  function updateTypePills() {
    var html = '';
    for (var i = 0; i < DEAL_TYPES.length; i++) {
      var t = DEAL_TYPES[i];
      var sel = formState.discountType === t.key;
      html += '<button type="button" class="type-pill' + (sel ? ' active' : '') + '" data-type="' + t.key + '">' +
        '<span class="type-pill-icon">' + t.icon + '</span>' +
        escapeHTML(t.label) +
      '</button>';
    }
    $('deal-type-pills').innerHTML = html;
  }

  // Cooldown chips
  function updateCooldownChips() {
    var chips = $('cooldown-chips').querySelectorAll('.cooldown-chip');
    for (var i = 0; i < chips.length; i++) {
      var val = chips[i].getAttribute('data-value');
      var match = (val === '' && formState.cooldownDays === null) ||
                  (val !== '' && parseInt(val) === formState.cooldownDays);
      chips[i].classList.toggle('active', match);
    }
  }

  // Day toggles
  function updateDayToggles() {
    var html = '';
    for (var i = 0; i < DAY_NAMES.length; i++) {
      var sel = formState.validDays.has(DAY_NAMES[i]);
      html += '<button type="button" class="day-toggle' + (sel ? ' active' : '') + '" data-day="' + DAY_NAMES[i] + '">' +
        DAY_LABELS[i] + '</button>';
    }
    $('day-toggles').innerHTML = html;
  }

  // Included items
  function renderIncludedItems() {
    var html = '';
    for (var i = 0; i < formState.includedItems.length; i++) {
      html += '<div class="included-item">' +
        '<span class="included-item-check">&#10004;</span>' +
        '<span class="included-item-text">' + escapeHTML(formState.includedItems[i]) + '</span>' +
        '<button type="button" class="included-item-remove" data-idx="' + i + '">&#10005;</button>' +
      '</div>';
    }
    $('included-items-list').innerHTML = html;

    // Bind remove
    var removes = $('included-items-list').querySelectorAll('[data-idx]');
    for (var j = 0; j < removes.length; j++) {
      removes[j].addEventListener('click', function () {
        formState.includedItems.splice(parseInt(this.getAttribute('data-idx')), 1);
        renderIncludedItems();
      });
    }
  }

  // Calendar for event dates
  var calendarMonth = new Date().getMonth();
  var calendarYear = new Date().getFullYear();

  function renderCalendar() {
    var cal = $('event-calendar');
    var firstDay = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Sun
    var daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    var html = '<div class="calendar">' +
      '<div class="calendar-header">' +
        '<button type="button" class="calendar-nav" id="cal-prev">&#8249;</button>' +
        '<span class="calendar-title">' + monthNames[calendarMonth] + ' ' + calendarYear + '</span>' +
        '<button type="button" class="calendar-nav" id="cal-next">&#8250;</button>' +
      '</div>' +
      '<div class="calendar-grid">';

    var weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    for (var w = 0; w < 7; w++) {
      html += '<div class="calendar-weekday">' + weekdays[w] + '</div>';
    }

    // Empty cells before first day
    for (var e = 0; e < firstDay; e++) {
      html += '<div class="calendar-day empty"></div>';
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(calendarYear, calendarMonth, d);
      var isPast = date < today;
      var isSelected = formState.eventDates.some(function (ed) {
        return ed.getFullYear() === date.getFullYear() &&
               ed.getMonth() === date.getMonth() &&
               ed.getDate() === date.getDate();
      });
      var cls = 'calendar-day';
      if (isPast) cls += ' disabled';
      if (isSelected) cls += ' selected';
      html += '<button type="button" class="' + cls + '" data-date="' + calendarYear + '-' +
        String(calendarMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0') + '">' + d + '</button>';
    }

    html += '</div></div>';
    cal.innerHTML = html;

    // Bind events
    $('cal-prev').addEventListener('click', function () {
      calendarMonth--;
      if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
      renderCalendar();
    });
    $('cal-next').addEventListener('click', function () {
      calendarMonth++;
      if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
      renderCalendar();
    });

    var dayBtns = cal.querySelectorAll('.calendar-day:not(.disabled):not(.empty)');
    for (var b = 0; b < dayBtns.length; b++) {
      dayBtns[b].addEventListener('click', function () {
        var dateStr = this.getAttribute('data-date');
        var dateObj = new Date(dateStr + 'T00:00:00');
        var idx = formState.eventDates.findIndex(function (ed) {
          return ed.getFullYear() === dateObj.getFullYear() &&
                 ed.getMonth() === dateObj.getMonth() &&
                 ed.getDate() === dateObj.getDate();
        });
        if (idx > -1) {
          formState.eventDates.splice(idx, 1);
        } else {
          formState.eventDates.push(dateObj);
        }
        formState.eventDates.sort(function (a, b) { return a - b; });
        renderCalendar();
        renderEventDateChips();
      });
    }
  }

  function renderEventDateChips() {
    var html = '';
    for (var i = 0; i < formState.eventDates.length; i++) {
      var d = formState.eventDates[i];
      html += '<span class="event-date-chip">' +
        d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() +
        ' <button type="button" data-remove-date="' + i + '">&#10005;</button></span>';
    }
    $('event-date-chips').innerHTML = html;

    var removeBtns = $('event-date-chips').querySelectorAll('[data-remove-date]');
    for (var j = 0; j < removeBtns.length; j++) {
      removeBtns[j].addEventListener('click', function () {
        formState.eventDates.splice(parseInt(this.getAttribute('data-remove-date')), 1);
        renderCalendar();
        renderEventDateChips();
      });
    }
  }

  function setupDealForm() {
    // Back button
    $('form-back-btn').addEventListener('click', function () {
      location.hash = '#deals';
    });

    // Type pills
    $('deal-type-pills').addEventListener('click', function (e) {
      var pill = e.target.closest('.type-pill');
      if (!pill) return;
      formState.discountType = pill.getAttribute('data-type');
      updateTypePills();
      updateFormVisibility();
    });

    // Cooldown chips
    $('cooldown-chips').addEventListener('click', function (e) {
      var chip = e.target.closest('.cooldown-chip');
      if (!chip) return;
      var val = chip.getAttribute('data-value');
      formState.cooldownDays = val === '' ? null : parseInt(val);
      updateCooldownChips();
    });

    // Day toggles
    $('day-toggles').addEventListener('click', function (e) {
      var btn = e.target.closest('.day-toggle');
      if (!btn) return;
      var day = btn.getAttribute('data-day');
      if (formState.validDays.has(day)) {
        formState.validDays.delete(day);
      } else {
        formState.validDays.add(day);
      }
      updateDayToggles();
    });

    // Add included item
    $('add-item-btn').addEventListener('click', addIncludedItem);
    $('new-item-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); addIncludedItem(); }
    });

    // Submit
    $('deal-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      await handleDealSubmit();
    });
  }

  function addIncludedItem() {
    var input = $('new-item-input');
    var val = input.value.trim();
    if (!val) return;
    formState.includedItems.push(val);
    input.value = '';
    renderIncludedItems();
  }

  async function handleDealSubmit() {
    var title = $('deal-title').value.trim();
    if (!title) {
      $('deal-title').focus();
      return;
    }

    var type = formState.discountType;
    var discountValue = showDiscountValue() ? (parseFloat($('deal-discount-value').value) || 0) : 0;

    // Validation
    if (showDiscountValue() && discountValue <= 0) {
      $('deal-discount-value').focus();
      return;
    }
    if (type === 'percent' && discountValue > 100) {
      $('deal-discount-value').focus();
      return;
    }
    if (showPrice() && !parseFloat($('deal-price').value)) {
      $('deal-price').focus();
      return;
    }

    var btn = $('deal-submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';

    var data = {
      partner_id: partner.userId,
      restaurant_id: partner.restaurantId,
      title: title,
      description: $('deal-description').value.trim() || null,
      discount_type: type,
      discount_value: discountValue,
      eligibility: 'all',
      max_per_user: $('deal-max-per-user').value ? parseInt($('deal-max-per-user').value) : null,
      cooldown_days: !isEvent() ? formState.cooldownDays : null,
      item_description: showItemDescription() && $('deal-item-description').value.trim()
        ? $('deal-item-description').value.trim() : null,
      price: showPrice() ? parseFloat($('deal-price').value) || null : null,
      original_price: showPrice() && $('deal-original-price').value
        ? parseFloat($('deal-original-price').value) : null,
      included_items: showIncludedItems() ? formState.includedItems : [],
      event_dates: isEvent() ? formState.eventDates.map(function (d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
          String(d.getDate()).padStart(2, '0');
      }) : [],
      valid_days: !isEvent() ? Array.from(formState.validDays) : [],
      valid_from: !isEvent() && $('deal-valid-from').value ? $('deal-valid-from').value : null,
      valid_until: !isEvent() && $('deal-valid-until').value ? $('deal-valid-until').value : null,
      valid_time_start: !isEvent() && $('deal-time-start').value ? $('deal-time-start').value : null,
      valid_time_end: !isEvent() && $('deal-time-end').value ? $('deal-time-end').value : null,
      is_active: true
    };

    try {
      if (editingDealId) {
        delete data.partner_id;
        delete data.restaurant_id;
        var res = await supabaseClient.from('deals').update(data).eq('id', editingDealId);
        if (res.error) throw res.error;
      } else {
        var res2 = await supabaseClient.from('deals').insert(data).select().single();
        if (res2.error) throw res2.error;
      }
      location.hash = '#deals';
    } catch (err) {
      alert('Failed to save deal: ' + (err.message || err));
    } finally {
      btn.disabled = false;
      btn.textContent = editingDealId ? 'Save Changes' : 'Create Deal';
    }
  }

  // ============================================================
  //  SETTINGS
  // ============================================================
  async function initSettings() {
    if (!partner) return;

    $('settings-avatar').innerHTML = avatarHTML(partner.restaurantName, partner.restaurantPhotos);
    $('settings-name').textContent = partner.restaurantName;
    $('settings-address').textContent = partner.restaurantAddress || '';

    var statsRes = await supabaseClient.rpc('get_partner_dashboard_stats', { p_restaurant_id: partner.restaurantId });
    var stats = (statsRes.data) || {};

    $('billing-redemptions').textContent = stats.total_redemptions || 0;
    var amount = stats.amount_owed || 0;
    $('billing-amount').textContent = 'CHF ' + (typeof amount === 'number' ? amount.toFixed(2) : '0.00');
  }

  function setupSettings() {
    $('settings-sign-out').addEventListener('click', async function () {
      $('dialog-title').textContent = 'Sign Out';
      $('dialog-message').textContent = 'Are you sure you want to sign out?';
      $('dialog-confirm').textContent = 'Sign Out';
      $('dialog-confirm').className = 'dialog-btn dialog-btn-danger';
      $('confirm-dialog').classList.remove('hidden');

      function cleanup() {
        $('confirm-dialog').classList.add('hidden');
        $('dialog-confirm').removeEventListener('click', onConfirm);
        $('dialog-cancel').removeEventListener('click', onCancel);
        $('dialog-confirm').textContent = 'Delete';
      }
      async function onConfirm() {
        cleanup();
        await supabaseClient.auth.signOut();
        partner = null;
        location.hash = '#login';
      }
      function onCancel() { cleanup(); }

      $('dialog-confirm').addEventListener('click', onConfirm);
      $('dialog-cancel').addEventListener('click', onCancel);
    });

    // Nav sign out button
    $('nav-sign-out').addEventListener('click', function () {
      $('settings-sign-out').click();
    });
  }

  // ============================================================
  //  VERIFY CODE
  // ============================================================
  function initVerifyCode() {
    $('verify-code-input').value = '';
    $('verify-result').innerHTML = '';
    $('verify-btn').disabled = true;
    $('verify-code-input').focus();
  }

  function setupVerifyCode() {
    var input = $('verify-code-input');
    var btn = $('verify-btn');

    input.addEventListener('input', function () {
      this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      btn.disabled = this.value.length !== 6;
    });

    btn.addEventListener('click', handleVerify);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && this.value.length === 6) handleVerify();
    });
  }

  async function handleVerify() {
    var code = $('verify-code-input').value.trim().toUpperCase();
    if (code.length !== 6) return;

    var btn = $('verify-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    $('verify-result').innerHTML = '';

    try {
      var res = await supabaseClient.rpc('confirm_redemption_code', {
        p_code: code,
        p_partner_id: partner.userId
      });

      var result = res.data || {};
      if (res.error) throw res.error;

      if (result.success) {
        $('verify-result').innerHTML =
          '<div class="result-card success">' +
            '<div class="result-icon">&#9989;</div>' +
            '<div class="result-title" style="color:var(--green-500);">Code Confirmed!</div>' +
            '<div class="result-deal">' + escapeHTML(result.deal_title || 'Deal') + '</div>' +
            (result.discount_label ? '<div class="result-discount">' + escapeHTML(result.discount_label) + '</div>' : '') +
            '<button class="btn-portal-text" id="verify-another" style="margin-top:16px;">Verify Another Code</button>' +
          '</div>';
      } else {
        var error = result.error || 'Unknown error';
        var isExpired = error.toLowerCase().indexOf('expired') > -1;
        var cardClass = isExpired ? 'warning' : 'error';
        var iconChar = isExpired ? '&#9200;' : '&#10060;';
        var titleColor = isExpired ? 'var(--orange-500)' : 'var(--red-500)';

        $('verify-result').innerHTML =
          '<div class="result-card ' + cardClass + '">' +
            '<div class="result-icon">' + iconChar + '</div>' +
            '<div class="result-title" style="color:' + titleColor + ';">Verification Failed</div>' +
            '<div class="result-error-text">' + escapeHTML(error) + '</div>' +
            '<button class="btn-portal-text" id="verify-another" style="margin-top:16px;">Try Again</button>' +
          '</div>';
      }

      // Bind "Verify Another" / "Try Again"
      var anotherBtn = document.getElementById('verify-another');
      if (anotherBtn) {
        anotherBtn.addEventListener('click', function () {
          initVerifyCode();
        });
      }
    } catch (err) {
      $('verify-result').innerHTML =
        '<div class="result-card error">' +
          '<div class="result-icon">&#10060;</div>' +
          '<div class="result-title" style="color:var(--red-500);">Verification Failed</div>' +
          '<div class="result-error-text">' + escapeHTML(err.message || 'Failed to verify code') + '</div>' +
          '<button class="btn-portal-text" id="verify-another" style="margin-top:16px;">Try Again</button>' +
        '</div>';
      var anotherBtn2 = document.getElementById('verify-another');
      if (anotherBtn2) anotherBtn2.addEventListener('click', function () { initVerifyCode(); });
    } finally {
      btn.disabled = false;
      btn.textContent = 'Verify';
    }
  }

  // ============================================================
  //  INIT
  // ============================================================
  function setupNav() {
    var navLinks = document.querySelectorAll('.portal-nav-link[data-route]');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {
        location.hash = '#' + this.getAttribute('data-route');
      });
    }
  }

  function init() {
    setupNav();
    setupLogin();
    setupDealsPage();
    setupDealForm();
    setupSettings();
    setupVerifyCode();

    // Initialize type pills and day toggles in DOM
    updateTypePills();
    updateDayToggles();

    // Check session
    checkSession();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
