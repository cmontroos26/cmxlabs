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
      /* ── Fallback: main-thread diamond particle ring ── */
      const ctx2   = pageCanvas.getContext('2d');
      const TILT2  = 0.46;
      const SPIN2  = 0.00016;
      let spin2    = 0;
      let cw2 = 0, ch2 = 0, lastWidth2 = 0, resizeTimer2 = null;

      const COLS2 = [
        [210, 207, 248],
        [175, 169, 236],
        [127, 119, 221],
        [238, 236, 255],
      ];

      let mainP2 = [], tailP2 = [];

      function diamondPt2(t, R) {
        const seg = Math.floor(t * 4) % 4;
        const u   = (t * 4) % 1;
        const C   = [[0,-1],[1,0],[0,1],[-1,0]];
        const a = C[seg], b = C[(seg+1)%4];
        return { x:(a[0]+(b[0]-a[0])*u)*R, z:(a[1]+(b[1]-a[1])*u)*R };
      }

      function project2(x3, y3, z3, cx, cy) {
        const cs = Math.cos(spin2), ss = Math.sin(spin2);
        const rx = x3*cs + z3*ss, ry = y3, rz = -x3*ss + z3*cs;
        const ct = Math.cos(TILT2), st = Math.sin(TILT2);
        return { sx: cx+rx, sy: cy+ry*ct-rz*st, depth: ry*st+rz*ct };
      }

      function buildP2() {
        const COUNT = isMobile ? 300 : 600;
        const TAIL  = isMobile ?  65 : 130;
        const R     = isMobile ? 180 : 330;
        mainP2 = Array.from({ length: COUNT }, () => {
          const col = COLS2[Math.random()<0.06?3:Math.random()<0.25?2:Math.random()<0.5?1:0];
          return { t:Math.random(), speed:0.00032+Math.random()*0.00052,
            scatter:(Math.random()-0.5)*38, scY:(Math.random()-0.5)*18,
            size:0.4+Math.random()*(Math.random()<0.08?2.2:1.0),
            alpha:0.32+Math.random()*0.58, col, R:R+(Math.random()-0.5)*32 };
        });
        tailP2 = Array.from({ length: TAIL }, () => ({
          t:Math.random(), speed:0.0008+Math.random()*0.0013,
          size:0.3+Math.random()*0.9, alpha:0.16+Math.random()*0.36,
          col:COLS2[Math.random()<0.4?1:0],
          scX:(Math.random()-0.5)*18, scY:(Math.random()-0.5)*9, R
        }));
      }

      function resizeCanvas2() {
        const w = window.innerWidth;
        if (w === lastWidth2 && cw2 !== 0) return;
        lastWidth2 = w;
        cw2 = pageCanvas.width  = w;
        ch2 = pageCanvas.height = window.innerHeight;
        buildP2();
      }

      function drawRingFrame() {
        ctx2.clearRect(0, 0, cw2, ch2);
        spin2 += SPIN2;
        const cx = cw2/2, cy = ch2*0.52;
        for (const p of mainP2) {
          p.t = (p.t + p.speed) % 1;
          const dp = diamondPt2(p.t, p.R);
          const rLen = Math.sqrt(dp.x*dp.x + dp.z*dp.z) || 1;
          const { sx, sy, depth } = project2(dp.x+(dp.x/rLen)*p.scatter, p.scY, dp.z+(dp.z/rLen)*p.scatter, cx, cy);
          const dN    = Math.max(0, Math.min(1, (depth+p.R)/(2*p.R)));
          const alpha = p.alpha*(0.16+dN*0.84);
          const size  = p.size *(0.38+dN*0.70);
          if (alpha<0.015||size<0.1) continue;
          const [r,g,b] = p.col;
          ctx2.beginPath(); ctx2.arc(sx, sy, size, 0, Math.PI*2);
          ctx2.fillStyle = `rgba(${r},${g},${b},${alpha})`; ctx2.fill();
        }
        const R0 = isMobile ? 180 : 330;
        const { sx:tsx, sy:tsy } = project2(0, 0, -R0, cx, cy);
        const bx3=cx+R0*1.75, by3=cy-R0*0.80;
        const bx1=tsx+(bx3-tsx)*0.18, by1=tsy+(by3-tsy)*0.12-R0*0.12;
        const bx2=tsx+(bx3-tsx)*0.62, by2=tsy+(by3-tsy)*0.52;
        for (const p of tailP2) {
          p.t = (p.t + p.speed) % 1;
          const t=p.t, mt=1-t;
          const bx=mt*mt*mt*tsx+3*mt*mt*t*bx1+3*mt*t*t*bx2+t*t*t*bx3;
          const by=mt*mt*mt*tsy+3*mt*mt*t*by1+3*mt*t*t*by2+t*t*t*by3;
          const alpha=p.alpha*(1-t*0.88), size=p.size*(1-t*0.52);
          if (alpha<0.015||size<0.1) continue;
          const [r,g,b] = p.col;
          ctx2.beginPath(); ctx2.arc(bx+p.scX, by+p.scY, size, 0, Math.PI*2);
          ctx2.fillStyle = `rgba(${r},${g},${b},${alpha})`; ctx2.fill();
        }
        requestAnimationFrame(drawRingFrame);
      }

      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer2);
        resizeTimer2 = setTimeout(resizeCanvas2, 250);
      }, { passive: true });

      resizeCanvas2();
      requestAnimationFrame(drawRingFrame);
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
