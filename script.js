/* ============================================================
   BookedEat Landing Page — Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     0. Persona State
     ---------------------------------------------------------- */
  var currentPersona = 'guest';

  /* ----------------------------------------------------------
     1. Typewriter Effect (per persona)
     ---------------------------------------------------------- */
  var personaPhrases = {
    guest: [
      'See where your friends eat.',
      'Read reviews from people you trust.',
      'Discover deals near you.',
      'Redeem with one tap.',
      'Get notified of new offers.',
      'Track your dining stats.',
      'Explore every restaurant on the map.',
    ],
    restaurant: [
      'Reach new customers.',
      'Fill off-peak hours.',
      'Create deals in seconds.',
      'Offer first-time customer benefits.',
      'Run special event promotions.',
      'Track every redemption.',
      'Customize everything your way.',
    ],
  };

  var typewriters = {};

  function createTypewriter(elementId, phrases) {
    var el = document.getElementById(elementId);
    if (!el) return null;

    var state = {
      el: el,
      phrases: phrases,
      phraseIndex: 0,
      charIndex: 0,
      isDeleting: false,
      timer: null,
      active: false,
    };

    function tick() {
      if (!state.active) return;

      var current = state.phrases[state.phraseIndex];

      if (!state.isDeleting) {
        state.charIndex++;
        state.el.textContent = current.substring(0, state.charIndex);

        if (state.charIndex === current.length) {
          state.timer = setTimeout(function () {
            state.isDeleting = true;
            tick();
          }, 2000);
          return;
        }
        state.timer = setTimeout(tick, 60);
      } else {
        state.charIndex--;
        state.el.textContent = current.substring(0, state.charIndex);

        if (state.charIndex === 0) {
          state.isDeleting = false;
          state.phraseIndex = (state.phraseIndex + 1) % state.phrases.length;
          state.timer = setTimeout(tick, 400);
          return;
        }
        state.timer = setTimeout(tick, 35);
      }
    }

    state.start = function () {
      state.active = true;
      state.phraseIndex = 0;
      state.charIndex = 0;
      state.isDeleting = false;
      state.el.textContent = '';
      state.timer = setTimeout(tick, 600);
    };

    state.stop = function () {
      state.active = false;
      if (state.timer) clearTimeout(state.timer);
      state.el.textContent = '';
    };

    return state;
  }

  typewriters.guest = createTypewriter('typewriter', personaPhrases.guest);
  typewriters.restaurant = createTypewriter('typewriter-restaurant', personaPhrases.restaurant);

  // Start guest typewriter by default
  if (typewriters.guest) {
    setTimeout(function () { typewriters.guest.start(); }, 800);
  }

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

    // Update tabs
    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.persona === persona);
    });

    // Switch hero content
    heroContents.forEach(function (content) {
      content.classList.remove('active');
    });
    var activeHero = document.getElementById('persona-' + persona);
    if (activeHero) {
      // Small delay for transition effect
      setTimeout(function () {
        activeHero.classList.add('active');
      }, 30);
    }

    // Switch all persona sections (features, how-it-works, screenshots, cta)
    personaSections.forEach(function (section) {
      if (section.dataset.for === persona) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Switch trust sections
    personaTrusts.forEach(function (trust) {
      if (trust.dataset.for === persona) {
        trust.classList.add('active');
      } else {
        trust.classList.remove('active');
      }
    });

    // Switch typewriters
    Object.keys(typewriters).forEach(function (key) {
      if (typewriters[key]) typewriters[key].stop();
    });
    if (typewriters[persona]) {
      typewriters[persona].start();
    }

    // Switch hero device (phone ↔ laptop)
    if (heroVisualGuest && heroVisualRestaurant) {
      heroVisualGuest.style.display = persona === 'guest' ? '' : 'none';
      heroVisualRestaurant.style.display = persona === 'restaurant' ? '' : 'none';
    }

  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      switchPersona(this.dataset.persona);
    });
  });

  /* ----------------------------------------------------------
     3. Scroll Reveal (IntersectionObserver)
     ---------------------------------------------------------- */
  function setupReveal() {
    var revealSelectors = [
      '.section-header',
      '.feature-card',
      '.step-card',
      '.device-showcase',
      '.trust-card',
      '.cta-content',
      '.hero-stats',
      '.hero-cta',
    ];

    revealSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal');
      });
    });

    document.querySelectorAll('.features-grid, .steps-grid').forEach(function (el) {
      el.classList.add('reveal-stagger');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      observer.observe(el);
    });
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setupReveal();
  }

  /* ----------------------------------------------------------
     4. Nav shadow on scroll
     ---------------------------------------------------------- */
  var nav = document.getElementById('nav');

  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        nav.style.boxShadow = 'var(--shadow-sm)';
      } else {
        nav.style.boxShadow = 'none';
      }
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
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     7. Device Slideshows — phone & laptop
     ---------------------------------------------------------- */
  function initSlideshow(showcaseId, captionId, dotsId, intervalMs) {
    var showcase = document.getElementById(showcaseId);
    var captionEl = document.getElementById(captionId);
    var dotsEl = dotsId ? document.getElementById(dotsId) : null;
    if (!showcase) return null;

    var slides = showcase.querySelectorAll('.device-slide');
    if (!slides.length) return null;

    var state = { current: 0, timer: null, total: slides.length };

    // Build dots (if container provided)
    var dots = [];
    if (dotsEl) {
      for (var i = 0; i < state.total; i++) {
        var dot = document.createElement('button');
        dot.className = 'device-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.dataset.index = i;
        dot.addEventListener('click', function () {
          goTo(parseInt(this.dataset.index, 10));
        });
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
      if (captionEl) {
        captionEl.style.opacity = '0';
        setTimeout(function () {
          captionEl.textContent = slides[state.current].getAttribute('data-caption') || '';
          captionEl.style.opacity = '1';
        }, 200);
      }
      resetTimer();
    }

    function next() {
      goTo((state.current + 1) % state.total);
    }

    function resetTimer() {
      if (state.timer) clearInterval(state.timer);
      state.timer = setInterval(next, intervalMs);
    }

    // Start auto-advance
    resetTimer();

    return state;
  }

  initSlideshow('laptop-showcase', 'laptop-caption', 'laptop-dots', 3500);
  initSlideshow('phone-showcase', 'phone-caption', 'phone-dots', 3000);

  /* ----------------------------------------------------------
     7b. Fan Dock — Dock-style magnification
     ---------------------------------------------------------- */
  var fanDock = document.getElementById('fan-dock');
  var fanCaption = document.getElementById('fan-caption');

  if (fanDock && fanCaption) {
    var fanItems = fanDock.querySelectorAll('.fan-item');
    fanItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        fanCaption.textContent = this.getAttribute('data-caption') || '';
        fanCaption.style.opacity = '1';
      });
      item.addEventListener('mouseleave', function () {
        fanCaption.style.opacity = '0';
      });
    });
  }

  /* ----------------------------------------------------------
     8. Trust numbers — count-up animation
     ---------------------------------------------------------- */
  function animateCountUp(el, target, prefix, suffix, duration) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var trustNumbers = document.querySelectorAll('.trust-number');
  if (trustNumbers.length) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var text = el.textContent.trim();

          var prefix = '';
          if (text.startsWith('$')) prefix = '$';
          else if (text.startsWith('CHF')) prefix = 'CHF ';
          var cleanText = text.replace(/^(CHF\s*|\$)/, '').replace(/,/g, '');
          var suffix = text.includes('+') ? '+' : (text.includes('%') ? '%' : '');
          cleanText = cleanText.replace(/[+%]/g, '');
          var num = parseFloat(cleanText);

          if (!isNaN(num) && num > 1) {
            el.textContent = prefix + '0' + suffix;
            setTimeout(function () {
              animateCountUp(el, num, prefix, suffix, 1500);
            }, 200);
          }

          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    trustNumbers.forEach(function (el) {
      countObserver.observe(el);
    });
  }

})();
