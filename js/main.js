/* ============================================================
   CMX Labs — main.js v4
   Dot grid · Cursor · Nav · Hamburger · Smooth scroll ·
   Scroll reveal (staggered) · Magnetic buttons ·
   Animated counters · 3D card tilt · Orb parallax · Form
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('follower');

  if (cursor && follower && window.matchMedia('(pointer:fine)').matches) {
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
    (function animCursor() {
      fx += (mx - fx) * 0.1;
      fy += (my - fy) * 0.1;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animCursor);
    })();

    document.querySelectorAll('a,button,input,textarea,.mosaic-tile,.product-mockup,.dev-frame-wrap,label')
      .forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('on'); follower.classList.add('on'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('on'); follower.classList.remove('on'); });
      });

    document.addEventListener('mouseleave', () => { cursor.style.opacity='0'; follower.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity='1'; follower.style.opacity='1'; });
  }

  /* ----------------------------------------------------------
     3. NAV — glass on scroll
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const tick = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  /* ----------------------------------------------------------
     4. HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      nav && nav.classList.remove('menu-open');
    };
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      nav && nav.classList.toggle('menu-open', open);
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
    });
  }

  /* ----------------------------------------------------------
     5. SMOOTH SCROLL (with nav offset)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 20 : 20;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     6. SCROLL REVEAL — staggered IntersectionObserver
  ---------------------------------------------------------- */
  // Stagger delays for card/list containers
  document.querySelectorAll('.footer-nav, .bento-grid, .pillars-grid, .process-steps').forEach(parent => {
    parent.querySelectorAll(':scope > .sr').forEach((el, i) => {
      el.style.setProperty('--delay', (i * 0.06) + 's');
    });
  });

  const srObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        srObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 300px 0px' });

  document.querySelectorAll('.sr').forEach(el => srObserver.observe(el));

  /* ----------------------------------------------------------
     7. MAGNETIC BUTTONS — elastic pull on .btn-magnetic
  ---------------------------------------------------------- */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ----------------------------------------------------------
     9. 3D CARD TILT — depth on .tilt-card (desktop only)
  ---------------------------------------------------------- */
  if (window.matchMedia('(pointer:fine)').matches && window.innerWidth > 768) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ----------------------------------------------------------
     10. PAGE CANVAS — neural network mesh (Web Worker / OffscreenCanvas)
  ---------------------------------------------------------- */
  const pageCanvas = document.getElementById('pageCanvas');
  if (pageCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    // Set canvas dimensions before anything else
    pageCanvas.width  = window.innerWidth;
    pageCanvas.height = window.innerHeight;

    const supportsOffscreen = typeof OffscreenCanvas !== 'undefined' &&
                              typeof pageCanvas.transferControlToOffscreen === 'function';

    if (supportsOffscreen) {
      /* ── Worker path: canvas runs on its own thread ── */
      const offscreen = pageCanvas.transferControlToOffscreen();
      const worker    = new Worker('js/canvas-worker.js');

      worker.postMessage({ type: 'init', canvas: offscreen, isMobile }, [offscreen]);

      let lastWidth   = window.innerWidth;
      let resizeTimer = null;

      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const w = window.innerWidth;
          if (w === lastWidth) return;
          lastWidth = w;
          worker.postMessage({ type: 'resize', width: w, height: window.innerHeight });
        }, 250);
      }, { passive: true });

    } else {
      /* ── Fallback: main-thread logo mark animation ── */
      const ctx2       = pageCanvas.getContext('2d');
      const COL_OUTER2 = [175, 169, 236];
      const COL_INNER2 = [127, 119, 221];
      let cw2 = 0, ch2 = 0, frame2 = 0, lastWidth2 = 0, resizeTimer2 = null;
      const rings2 = [];
      let ringTimer2 = 0;

      function rr2(x, y, w, h, r) {
        ctx2.beginPath();
        ctx2.moveTo(x + r, y);
        ctx2.arcTo(x + w, y,     x + w, y + h, r);
        ctx2.arcTo(x + w, y + h, x,     y + h, r);
        ctx2.arcTo(x,     y + h, x,     y,     r);
        ctx2.arcTo(x,     y,     x + w, y,     r);
        ctx2.closePath();
      }

      function resizeCanvas2() {
        const w = window.innerWidth;
        if (w === lastWidth2 && cw2 !== 0) return;
        lastWidth2 = w;
        cw2 = pageCanvas.width  = w;
        ch2 = pageCanvas.height = window.innerHeight;
        rings2.length = 0; ringTimer2 = 0;
      }

      function drawLogoFrame() {
        frame2++;
        ctx2.clearRect(0, 0, cw2, ch2);

        const cx   = cw2 / 2;
        const cy   = ch2 * 0.46;
        const base = isMobile ? 260 : 460;
        const sc   = base / 52;
        const outerRot = (frame2 / 3600) * Math.PI * 2;
        const innerRot = -(frame2 / 5400) * Math.PI * 2;
        const [or, og, ob] = COL_OUTER2;
        const [ir, ig, ib] = COL_INNER2;

        /* Radial glow */
        const grad = ctx2.createRadialGradient(cx, cy, 0, cx, cy, base * 1.15);
        grad.addColorStop(0,    `rgba(${ir},${ig},${ib},0.052)`);
        grad.addColorStop(0.50, `rgba(${ir},${ig},${ib},0.018)`);
        grad.addColorStop(1,    `rgba(${ir},${ig},${ib},0)`);
        ctx2.fillStyle = grad;
        ctx2.beginPath(); ctx2.arc(cx, cy, base * 1.15, 0, Math.PI * 2); ctx2.fill();

        /* Outer diamond */
        ctx2.save(); ctx2.translate(cx, cy); ctx2.rotate(Math.PI / 4 + outerRot);
        ctx2.strokeStyle = `rgba(${or},${og},${ob},0.10)`;
        ctx2.lineWidth   = 2.5 * (sc / 7);
        rr2(-26 * sc, -26 * sc, 52 * sc, 52 * sc, 7 * sc);
        ctx2.stroke(); ctx2.restore();

        /* Inner diamond */
        ctx2.save(); ctx2.translate(cx, cy); ctx2.rotate(Math.PI / 4 + innerRot);
        ctx2.fillStyle   = `rgba(${ir},${ig},${ib},0.032)`;
        ctx2.strokeStyle = `rgba(${ir},${ig},${ib},0.085)`;
        ctx2.lineWidth   = 1.8 * (sc / 7);
        rr2(-22 * sc, -22 * sc, 44 * sc, 44 * sc, 6 * sc);
        ctx2.fill(); ctx2.stroke(); ctx2.restore();

        /* Orbit ring */
        ctx2.beginPath(); ctx2.arc(cx, cy, 13 * sc, 0, Math.PI * 2);
        ctx2.strokeStyle = `rgba(${or},${og},${ob},0.08)`;
        ctx2.lineWidth   = 0.7 * (sc / 7); ctx2.stroke();

        /* Center circle */
        const pulse = 0.78 + Math.sin(frame2 * 0.045) * 0.22;
        ctx2.beginPath(); ctx2.arc(cx, cy, 6 * sc, 0, Math.PI * 2);
        ctx2.fillStyle = `rgba(${or},${og},${ob},${0.42 * pulse})`; ctx2.fill();

        /* Inner dot */
        ctx2.beginPath(); ctx2.arc(cx, cy, 2.8 * sc, 0, Math.PI * 2);
        ctx2.fillStyle = `rgba(255,255,255,0.32)`; ctx2.fill();

        /* Pulse rings */
        ringTimer2++;
        if (ringTimer2 >= 90) {
          ringTimer2 = 0;
          rings2.push({ r: 8 * sc, maxR: isMobile ? 180 : 310 });
        }
        for (let i = rings2.length - 1; i >= 0; i--) {
          const ring = rings2[i];
          ring.r += isMobile ? 0.65 : 1.0;
          const progress = ring.r / ring.maxR;
          if (progress >= 1) { rings2.splice(i, 1); continue; }
          ctx2.beginPath(); ctx2.arc(cx, cy, ring.r, 0, Math.PI * 2);
          ctx2.strokeStyle = `rgba(${or},${og},${ob},${0.13 * (1 - progress)})`;
          ctx2.lineWidth = 1.2; ctx2.stroke();
        }

        requestAnimationFrame(drawLogoFrame);
      }

      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer2);
        resizeTimer2 = setTimeout(resizeCanvas2, 250);
      }, { passive: true });

      resizeCanvas2();
      requestAnimationFrame(drawLogoFrame);
    }
  }

  /* ----------------------------------------------------------
     8. ANIMATED COUNTERS — count up on scroll into view
  ---------------------------------------------------------- */
  const counterEls = document.querySelectorAll('.stat-num[data-target]');
  if (counterEls.length) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        counterObs.unobserve(e.target);
        const el       = e.target;
        const target   = +el.dataset.target;
        const prefix   = el.dataset.prefix || '';
        const suffix   = el.dataset.suffix || '';
        const duration = 1400;
        const start    = performance.now();
        (function tick(now) {
          const p    = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(ease * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.6 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ----------------------------------------------------------
     11. CONTACT FORM
  ---------------------------------------------------------- */
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');

  if (form && successMsg && submitBtn) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('input[required],textarea[required]').forEach(f => {
        if (!f.value.trim()) {
          valid = false;
          f.style.borderColor = 'rgba(239,68,68,.5)';
          f.style.boxShadow   = '0 0 0 3px rgba(239,68,68,.12)';
          setTimeout(() => { f.style.borderColor=''; f.style.boxShadow=''; }, 2400);
        }
      });
      if (!valid) return;

      const orig = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending\u2026';
      submitBtn.disabled  = true;
      submitBtn.style.opacity = '.65';

      fetch('https://formspree.io/f/maqzendl', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      .then(r => {
        if (r.ok) {
          form.reset();
          successMsg.classList.add('on');
          setTimeout(() => successMsg.classList.remove('on'), 5500);
        } else {
          alert('Something went wrong. Please email us directly at info@cmxlabs.io');
        }
      })
      .catch(() => alert('Something went wrong. Please email us directly at info@cmxlabs.io'))
      .finally(() => {
        submitBtn.innerHTML = orig;
        submitBtn.disabled  = false;
        submitBtn.style.opacity = '1';
      });
    });

    form.querySelectorAll('input,textarea').forEach(f => {
      f.addEventListener('input', () => { f.style.borderColor=''; f.style.boxShadow=''; });
    });
  }

})();
