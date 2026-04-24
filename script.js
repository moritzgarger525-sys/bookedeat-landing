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
     7b. Screenshot Carousel — cursor-driven speed + typewriter caption
     ---------------------------------------------------------- */
  (function () {
    var carousel = document.getElementById('screenshot-carousel');
    var captionEl = document.getElementById('carousel-caption-text');
    if (!carousel || !captionEl) return;

    var items = carousel.querySelectorAll('.screenshot-item');
    var track = carousel.querySelector('.screenshot-track');
    var currentCaption = '';
    var targetCaption = '';
    var charIndex = 0;
    var isDeleting = false;
    var timer = null;

    // Cursor-driven scrolling: speed + direction based on cursor position
    var scrollSpeed = 0; // pixels per frame, negative = left, positive = right
    var scrollPos = 0;
    var trackWidth = 0;
    var isHovering = false;

    function measureTrack() {
      if (!track) return;
      trackWidth = track.scrollWidth / 2; // half because items are duplicated
    }
    measureTrack();
    window.addEventListener('resize', measureTrack);

    // Default auto-scroll speed (slow)
    var baseSpeed = 0.5;

    carousel.addEventListener('mouseenter', function () { isHovering = true; });
    carousel.addEventListener('mouseleave', function () { isHovering = false; scrollSpeed = 0; });

    carousel.addEventListener('mousemove', function (e) {
      var rect = carousel.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var w = rect.width;
      // Normalize to -1 (left edge) to +1 (right edge)
      var ratio = (x / w - 0.5) * 2;
      // Dead zone in center 20%
      if (Math.abs(ratio) < 0.1) { scrollSpeed = 0; return; }
      // Exponential ramp — gentle near center, fast at edges, max ~10px/frame
      var sign = ratio > 0 ? 1 : -1;
      scrollSpeed = sign * Math.pow(Math.abs(ratio), 1.8) * 10;
    });

    function animate() {
      var speed = isHovering ? scrollSpeed : baseSpeed;
      scrollPos += speed;
      if (trackWidth > 0) {
        if (scrollPos >= trackWidth) scrollPos -= trackWidth;
        if (scrollPos < 0) scrollPos += trackWidth;
      }
      track.style.transform = 'translateX(' + (-scrollPos) + 'px)';
      requestAnimationFrame(animate);
    }

    // Stop CSS animation, use JS instead
    track.style.animation = 'none';
    requestAnimationFrame(animate);

    // Typewriter + center highlight
    function getCenterItem() {
      var center = carousel.getBoundingClientRect().left + carousel.offsetWidth / 2;
      var closest = null;
      var closestDist = Infinity;
      items.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        var itemCenter = rect.left + rect.width / 2;
        var dist = Math.abs(itemCenter - center);
        if (dist < closestDist) { closestDist = dist; closest = item; }
      });
      return closest;
    }

    function typewrite() {
      if (!isDeleting) {
        charIndex++;
        captionEl.textContent = targetCaption.substring(0, charIndex);
        if (charIndex >= targetCaption.length) { currentCaption = targetCaption; return; }
        timer = setTimeout(typewrite, 55);
      } else {
        charIndex--;
        captionEl.textContent = currentCaption.substring(0, charIndex);
        if (charIndex <= 0) { isDeleting = false; currentCaption = ''; captionEl.textContent = ''; timer = setTimeout(typewrite, 150); return; }
        timer = setTimeout(typewrite, 30);
      }
    }

    var currentHighlight = null;
    function checkCenter() {
      var item = getCenterItem();
      if (!item) return;
      if (item !== currentHighlight) {
        if (currentHighlight) currentHighlight.classList.remove('is-center');
        item.classList.add('is-center');
        currentHighlight = item;
      }
      var caption = item.getAttribute('data-caption') || '';
      if (caption !== targetCaption) {
        targetCaption = caption;
        if (timer) clearTimeout(timer);
        if (currentCaption) { isDeleting = true; charIndex = currentCaption.length; }
        else { isDeleting = false; charIndex = 0; }
        typewrite();
      }
    }

    setInterval(checkCenter, 200);
    checkCenter();
  })();

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

  /* ----------------------------------------------------------
     9. Waitlist / Book a Call form (restaurant)
     ---------------------------------------------------------- */
  var API_BASE = 'https://9j1rcg9aeb.execute-api.eu-north-1.amazonaws.com';

  var waitlistForm = document.getElementById('waitlist-form');
  var waitlistSuccess = document.getElementById('waitlist-success');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        restaurant: document.getElementById('wl-restaurant').value,
        email: document.getElementById('wl-email').value,
        action: 'call'
      };
      fetch(API_BASE + '/waitlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(function () {});
      waitlistForm.style.display = 'none';
      if (waitlistSuccess) waitlistSuccess.style.display = 'block';
    });
  }

  /* ----------------------------------------------------------
     10. Beta signup form (guest)
     ---------------------------------------------------------- */
  var betaForm = document.getElementById('beta-form');
  var betaSuccess = document.getElementById('beta-success');

  if (betaForm) {
    betaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        email: document.getElementById('beta-email').value,
        action: 'beta'
      };
      fetch(API_BASE + '/waitlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(function () {});
      betaForm.style.display = 'none';
      if (betaSuccess) betaSuccess.style.display = 'block';
    });
  }

})();
