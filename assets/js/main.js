/* ==========================================================================
   Northwind Studio — interactions
   Everything degrades gracefully: with JS off the site is fully readable.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------ hero intro --- */
  // Staggered rise for hero lines / fades. Fires as soon as the markup is
  // parsed — waiting on `load` would hold the headline back until every
  // screenshot had downloaded.
  function playIntro() {
    document.documentElement.classList.add('is-ready');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(playIntro);
    });
  } else {
    requestAnimationFrame(playIntro);
  }
  // Belt and braces: whatever happens above, the hero is never left hidden.
  setTimeout(playIntro, 900);

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  /* ----------------------------------------------------------- header --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;

    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle('is-stuck', y > 12);

      // Hide on scroll down, reveal on scroll up — but never while the
      // mobile drawer is open, and never near the very top.
      var drawerOpen = nav && nav.classList.contains('is-open');
      if (!drawerOpen && y > 240) {
        header.classList.toggle('is-hidden', y > lastY + 6);
      } else {
        header.classList.remove('is-hidden');
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------ mobile nav ---- */
  if (toggle && nav) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false); toggle.focus();
      }
    });
    // Reset when resizing back up to desktop.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setNav(false);
    });
  }

  /* -------------------------------------------------- scroll reveals ---- */
  var revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      revealables.forEach(function (el) {
        // Auto-stagger siblings that share a [data-stagger] parent.
        var parent = el.parentElement;
        if (parent && parent.hasAttribute('data-stagger') && !el.style.getPropertyValue('--d')) {
          var sibs = Array.prototype.filter.call(parent.children, function (c) {
            return c.hasAttribute('data-reveal');
          });
          var step = parseInt(parent.getAttribute('data-stagger'), 10) || 90;
          el.style.setProperty('--d', (sibs.indexOf(el) * step) + 'ms');
        }
        io.observe(el);
      });
    }
  }

  /* -------------------------------------------------------- count up ---- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (reduced || isNaN(target)) { el.textContent = prefix + target + suffix; return; }

      var dur = 1400, start = null;
      var tick = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          co.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* --------------------------------------------------------- marquee ---- */
  // Duplicate the group so the -50% keyframe loops seamlessly.
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    var group = track.querySelector('.marquee-group');
    if (group) track.appendChild(group.cloneNode(true));
  });

  /* ------------------------------------------------------ hero glow ----- */
  // The warm blob drifts slightly toward the pointer. Desktop + motion only.
  var glow = document.querySelector('.hero-glow');
  if (glow && !reduced && window.matchMedia('(pointer: fine)').matches) {
    var hero = glow.closest('.hero');
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var dx = ((e.clientX - r.left) / r.width - 0.5) * 46;
      var dy = ((e.clientY - r.top) / r.height - 0.5) * 30;
      glow.style.transform = 'translate(calc(-50% + ' + dx + 'px), ' + dy + 'px)';
    });
    hero.addEventListener('pointerleave', function () {
      glow.style.transform = 'translate(-50%, 0)';
    });
  }

  /* ------------------------------------------------ browser-shot tilt --- */
  // Very subtle 3D response on work mockups.
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -4;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 4;
        el.style.transform = 'perspective(1100px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transform = 'perspective(1100px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ----------------------------------------------------------- video ---- */
  // The intro video is optional. If the file isn't there yet we keep the
  // placeholder card visible instead of showing a broken player.
  document.querySelectorAll('[data-video]').forEach(function (frame) {
    var video = frame.querySelector('video');
    var placeholder = frame.querySelector('.video-placeholder');
    if (!video || !placeholder) return;

    var source = video.querySelector('source');
    var src = source && source.getAttribute('src');
    if (!src) return;

    // Probe for the file before swapping the placeholder out.
    fetch(src, { method: 'HEAD' })
      .then(function (res) {
        if (!res.ok) throw new Error('missing');
        placeholder.hidden = true;
        video.hidden = false;
        video.setAttribute('controls', '');
      })
      .catch(function () { /* keep placeholder — nothing to do */ });
  });

  /* ------------------------------------------------------------ year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ----------------------------------------------------- contact form --- */
  // No backend on a static site: hand off to the visitor's mail client and
  // tell them plainly what happened.
  var form = document.querySelector('[data-mailto-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var to = form.getAttribute('data-mailto-form');
      var get = function (n) {
        var f = form.elements[n];
        return f ? f.value.trim() : '';
      };
      var subject = 'Website enquiry from ' + (get('name') || 'your site');
      var body =
        'Name: ' + get('name') + '\n' +
        'Business: ' + get('business') + '\n' +
        'Email: ' + get('email') + '\n' +
        'Phone: ' + get('phone') + '\n\n' +
        get('message');

      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      var note = form.querySelector('[data-form-note]');
      if (note) { note.hidden = false; }
    });
  }
})();
