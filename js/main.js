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
  document.querySelectorAll('.footer-nav, .svc-blocks, .metrics-inner').forEach(parent => {
    parent.querySelectorAll(':scope > .sr, :scope > .metric, :scope > .svc-block').forEach((el, i) => {
      el.style.setProperty('--delay', (i * 0.1) + 's');
    });
  });

  const srObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        srObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });

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
     10. HERO CANVAS — neural network mesh
  ---------------------------------------------------------- */
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = heroCanvas.getContext('2d');

    const NODE_COUNT = 72;
    const LINK_DIST  = 180;
    const NODE_COLS  = [
      [83,  74,  183],  // brand purple
      [45,  212, 191],  // teal
      [127, 119, 221],  // light purple
      [175, 169, 236],  // lavender
    ];

    let nodes = [], cw = 0, ch = 0;

    function buildNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => {
        const hub = Math.random() < 0.15; // 15% are larger hub nodes
        return {
          x:  Math.random() * cw,
          y:  Math.random() * ch,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r:  hub ? (Math.random() * 2.5 + 3.5) : (Math.random() * 2.0 + 1.5),
          col: NODE_COLS[Math.floor(Math.random() * NODE_COLS.length)],
          phase: Math.random() * Math.PI * 2,
          ps:   0.016 + Math.random() * 0.014,
          hub,
        };
      });
    }

    function resizeCanvas() {
      cw = heroCanvas.width  = heroCanvas.offsetWidth;
      ch = heroCanvas.height = heroCanvas.offsetHeight;
      buildNodes();
    }

    function drawFrame() {
      ctx.clearRect(0, 0, cw, ch);

      // Move nodes, wrap edges
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.phase += n.ps;
        if (n.x < 0)  n.x = cw;
        if (n.x > cw) n.x = 0;
        if (n.y < 0)  n.y = ch;
        if (n.y > ch) n.y = 0;
      });

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.40;
            const [r, g, bl] = a.col;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw nodes (hub nodes get a glow)
      nodes.forEach(n => {
        const [r, g, bl] = n.col;
        const opacity = 0.65 + Math.sin(n.phase) * 0.28;
        if (n.hub) {
          ctx.shadowBlur  = 12;
          ctx.shadowColor = `rgba(${r},${g},${bl},0.7)`;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${bl},${opacity})`;
        ctx.fill();
        if (n.hub) {
          ctx.shadowBlur  = 0;
          ctx.shadowColor = 'transparent';
        }
      });

      requestAnimationFrame(drawFrame);
    }

    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(heroCanvas);
    resizeCanvas();
    requestAnimationFrame(drawFrame);
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
