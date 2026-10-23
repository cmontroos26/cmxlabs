/* ============================================================
   CMX Labs — main.js
   Cursor · Nav · Hamburger · Smooth scroll ·
   Scroll reveal · Magnetic buttons · 3D card tilt ·
   Canvas animation · Animated counters · Form · Work filters
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

    document.querySelectorAll('a,button,input,textarea,select,label')
      .forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('on'); follower.classList.add('on'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('on'); follower.classList.remove('on'); });
      });

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
  }

  /* ----------------------------------------------------------
     2. NAV — glass on scroll
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const tick = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  /* ----------------------------------------------------------
     3. HAMBURGER MENU
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
     4. SMOOTH SCROLL (anchor links, with nav offset)
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
     5. SCROLL REVEAL — staggered IntersectionObserver
  ---------------------------------------------------------- */
  document.querySelectorAll(
    '.footer-nav, .bento-grid, .pillars-grid, .process-steps, .fw-grid, .work-grid'
  ).forEach(parent => {
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
  // Large rootMargin: trigger reveal 1500px before element enters viewport
  // giving lazy images plenty of time to load before becoming visible
  }, { threshold: 0, rootMargin: '0px 0px 1500px 0px' });

  document.querySelectorAll('.sr').forEach(el => {
    const rect = el.getBoundingClientRect();
    // Elements already in or near the viewport on page load: reveal instantly,
    // no transition, so there's never a flash of invisible content on first paint
    if (rect.top < window.innerHeight + 100) {
      el.style.transitionDuration = '0s';
      el.classList.add('vis');
      requestAnimationFrame(() => { el.style.transitionDuration = ''; });
    } else {
      srObserver.observe(el);
    }
  });

  // Safety net: if the observer misses anything (slow device, fast scroll),
  // force-reveal all remaining hidden elements after 400ms
  setTimeout(() => {
    document.querySelectorAll('.sr:not(.vis)').forEach(el => el.classList.add('vis'));
  }, 400);

  /* ----------------------------------------------------------
     6. MAGNETIC BUTTONS
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
     7. 3D CARD TILT
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
     8. PAGE CANVAS — diamond particle ring (Web Worker / fallback)
  ---------------------------------------------------------- */
  const pageCanvas = document.getElementById('pageCanvas');
  if (pageCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    pageCanvas.width  = window.innerWidth;
    pageCanvas.height = window.innerHeight;

    const supportsOffscreen = typeof OffscreenCanvas !== 'undefined' &&
                              typeof pageCanvas.transferControlToOffscreen === 'function';

    if (supportsOffscreen) {
      const offscreen = pageCanvas.transferControlToOffscreen();
      // Absolute path — works from any page depth (/work/slug, etc.)
      const worker = new Worker('/js/canvas-worker.js');

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
      /* Fallback: main-thread diamond particle ring */
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
        const R     = isMobile ? 260 : 480;
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
        const R0 = isMobile ? 260 : 480;
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
     9. ANIMATED COUNTERS
  ---------------------------------------------------------- */
  const counterEls = document.querySelectorAll('.stat-num[data-target]');
  if (counterEls.length) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        counterObs.unobserve(e.target);
        const el = e.target, target = +el.dataset.target;
        const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
        const duration = 1400, start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = prefix + Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.6 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ----------------------------------------------------------
     10. WORK PAGE — category filter
  ---------------------------------------------------------- */
  const filterBtns   = document.querySelectorAll('.work-filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-filter-cat]');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          const show = filter === 'all' || card.dataset.filterCat === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ----------------------------------------------------------
     11. FILMSTRIP — JS-driven drag / swipe scroll
  ---------------------------------------------------------- */
  document.querySelectorAll('.fw-filmstrip-wrap').forEach(wrap => {
    const strip = wrap.querySelector('.fw-filmstrip');
    if (!strip) return;

    const isRight = strip.classList.contains('fw-filmstrip-right');
    // px/s — matches original 30s / 24s CSS durations
    const SPEED   = isRight ? 73 : 58;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hand off from CSS animation to JS
    strip.style.animation = 'none';
    strip.style.cursor    = 'grab';

    let halfW  = 0;
    let x      = 0;
    let tLast  = null;
    let paused = reduced; // respect reduced-motion

    function clamp(v) {
      while (v < -halfW) v += halfW;
      while (v > 0)      v -= halfW;
      return v;
    }

    function tick(now) {
      if (!paused) {
        const dt = tLast ? (now - tLast) / 1000 : 0;
        x = clamp(x + (isRight ? SPEED : -SPEED) * dt);
        strip.style.transform = `translateX(${x}px)`;
      }
      tLast = now;
      requestAnimationFrame(tick);
    }

    function init() {
      halfW = strip.scrollWidth / 2;
      x     = isRight ? -halfW : 0;
      strip.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(tick);
    }

    // Mouse drag
    let dragging = false, mStartX = 0, mStartScroll = 0;

    strip.addEventListener('mousedown', e => {
      dragging = true; paused = true;
      mStartX = e.clientX; mStartScroll = x;
      strip.style.cursor = 'grabbing';
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      x = clamp(mStartScroll + (e.clientX - mStartX));
      strip.style.transform = `translateX(${x}px)`;
    });
    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false; paused = false; tLast = null;
      strip.style.cursor = 'grab';
    });

    // Touch swipe
    let tStartX = 0, tStartScroll = 0;
    strip.addEventListener('touchstart', e => {
      paused = true; tLast = null;
      tStartX = e.touches[0].clientX; tStartScroll = x;
    }, { passive: true });
    strip.addEventListener('touchmove', e => {
      x = clamp(tStartScroll + (e.touches[0].clientX - tStartX));
      strip.style.transform = `translateX(${x}px)`;
    }, { passive: true });
    strip.addEventListener('touchend', () => {
      paused = false; tLast = null;
    });

    // Init after images are measured
    if (document.readyState === 'complete') { init(); }
    else { window.addEventListener('load', init, { once: true }); }
  });

  /* ----------------------------------------------------------
     12. CONTACT FORM (was 11)
  ---------------------------------------------------------- */
  document.querySelectorAll('.contact-form').forEach(form => {
    const successMsg = form.querySelector('.form-success');
    const submitBtn  = form.querySelector('[type="submit"]');

    if (!successMsg || !submitBtn) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('input[required],textarea[required],select[required]').forEach(f => {
        f.classList.remove('error');
        if (!f.value.trim()) {
          valid = false;
          f.classList.add('error');
          setTimeout(() => f.classList.remove('error'), 2400);
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
            alert('Something went wrong. Please email us at info@cmxlabs.io');
          }
        })
        .catch(() => alert('Something went wrong. Please email us at info@cmxlabs.io'))
        .finally(() => {
          submitBtn.innerHTML = orig;
          submitBtn.disabled  = false;
          submitBtn.style.opacity = '1';
        });
    });

    form.querySelectorAll('input,textarea,select').forEach(f => {
      f.addEventListener('input', () => f.classList.remove('error'));
    });
  });

})();
