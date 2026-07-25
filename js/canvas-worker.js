/* ============================================================
   CMX Labs — canvas-worker.js
   Neural network mesh animation running on a Web Worker thread,
   completely independent from the main thread / scroll / DOM.
   ============================================================ */

let ctx, cw, ch, nodes = [], isMobile = false, running = false;

const NODE_COLS = [
  [83,  74,  183],
  [45,  212, 191],
  [127, 119, 221],
  [175, 169, 236],
];

function buildNodes() {
  const COUNT = isMobile ? 40 : 72;
  nodes = Array.from({ length: COUNT }, () => {
    const hub = Math.random() < 0.15;
    return {
      x:  Math.random() * cw,
      y:  Math.random() * ch,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r:  hub ? (Math.random() * 2.5 + 3.5) : (Math.random() * 2.0 + 1.5),
      col:   NODE_COLS[Math.floor(Math.random() * NODE_COLS.length)],
      phase: Math.random() * Math.PI * 2,
      ps:    0.016 + Math.random() * 0.014,
      hub,
    };
  });
}

function drawFrame() {
  const LINK_DIST = isMobile ? 150 : 180;

  ctx.clearRect(0, 0, cw, ch);

  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy; n.phase += n.ps;
    if (n.x < 0)  n.x = cw;
    if (n.x > cw) n.x = 0;
    if (n.y < 0)  n.y = ch;
    if (n.y > ch) n.y = 0;
  });

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

  nodes.forEach(n => {
    const [r, g, bl] = n.col;
    const opacity = 0.65 + Math.sin(n.phase) * 0.28;
    if (n.hub && !isMobile) {
      ctx.shadowBlur  = 12;
      ctx.shadowColor = `rgba(${r},${g},${bl},0.7)`;
    }
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${bl},${opacity})`;
    ctx.fill();
    if (n.hub && !isMobile) {
      ctx.shadowBlur  = 0;
      ctx.shadowColor = 'transparent';
    }
  });

  setTimeout(drawFrame, 16);
}

self.onmessage = function (e) {
  const { type } = e.data;

  if (type === 'init') {
    const canvas = e.data.canvas;
    isMobile = e.data.isMobile;
    ctx = canvas.getContext('2d');
    cw  = canvas.width;
    ch  = canvas.height;
    buildNodes();
    if (!running) { running = true; drawFrame(); }

  } else if (type === 'resize') {
    const w = e.data.width;
    const h = e.data.height;
    ctx.canvas.width  = w;
    ctx.canvas.height = h;
    cw = w; ch = h;
    buildNodes();
  }
};
