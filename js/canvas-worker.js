/* ============================================================
   CMX Labs — canvas-worker.js v2
   Logo mark animation: slow rotation + concentric pulse rings
   ============================================================ */

let ctx, cw, ch, isMobile = false, running = false;
let frame = 0;
const rings = [];
let ringTimer = 0;

const COL_OUTER = [175, 169, 236]; // #AFA9EC — purple-lite (outer diamond, orbit)
const COL_INNER = [127, 119, 221]; // #7F77DD — purple (inner diamond, glow)

/* Rounded-rect path helper */
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

function drawFrame() {
  frame++;
  ctx.clearRect(0, 0, cw, ch);

  const cx = cw / 2;
  const cy = ch * 0.46;          // slightly above center, in hero zone

  /* Scale: outer diamond targets ~460px wide on desktop, ~260px on mobile.
     Original outer rect is 52×52 units in the SVG icon coordinate space. */
  const base = isMobile ? 260 : 460;
  const sc   = base / 52;

  /* Slow rotations — outer CW (60 s), inner CCW (90 s) */
  const outerRot = (frame / 3600) * Math.PI * 2;
  const innerRot = -(frame / 5400) * Math.PI * 2;

  const [or, og, ob] = COL_OUTER;
  const [ir, ig, ib] = COL_INNER;

  /* ── Radial glow ─────────────────────────────────────────── */
  const glowR = base * 1.15;
  const grad  = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
  grad.addColorStop(0,    `rgba(${ir},${ig},${ib},0.052)`);
  grad.addColorStop(0.50, `rgba(${ir},${ig},${ib},0.018)`);
  grad.addColorStop(1,    `rgba(${ir},${ig},${ib},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
  ctx.fill();

  /* ── Outer diamond (rotates CW) ──────────────────────────── */
  {
    const size = 52 * sc;
    const rx   =  7 * sc;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4 + outerRot);
    ctx.strokeStyle = `rgba(${or},${og},${ob},0.10)`;
    ctx.lineWidth   = 2.5 * (sc / 7);
    rr(-size / 2, -size / 2, size, size, rx);
    ctx.stroke();
    ctx.restore();
  }

  /* ── Inner diamond (rotates CCW) ─────────────────────────── */
  {
    const size = 44 * sc;
    const rx   =  6 * sc;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4 + innerRot);
    ctx.fillStyle   = `rgba(${ir},${ig},${ib},0.032)`;
    ctx.strokeStyle = `rgba(${ir},${ig},${ib},0.085)`;
    ctx.lineWidth   = 1.8 * (sc / 7);
    rr(-size / 2, -size / 2, size, size, rx);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  /* ── Orbit ring ───────────────────────────────────────────── */
  ctx.beginPath();
  ctx.arc(cx, cy, 13 * sc, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${or},${og},${ob},0.08)`;
  ctx.lineWidth   = 0.7 * (sc / 7);
  ctx.stroke();

  /* ── Center circle (slow pulse) ───────────────────────────── */
  {
    const pulse = 0.78 + Math.sin(frame * 0.045) * 0.22;
    ctx.beginPath();
    ctx.arc(cx, cy, 6 * sc, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${or},${og},${ob},${0.42 * pulse})`;
    ctx.fill();
  }

  /* ── Inner dot ────────────────────────────────────────────── */
  ctx.beginPath();
  ctx.arc(cx, cy, 2.8 * sc, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,0.32)`;
  ctx.fill();

  /* ── Pulse rings ──────────────────────────────────────────── */
  ringTimer++;
  if (ringTimer >= 90) {   // spawn every ~1.5 s at 60 fps
    ringTimer = 0;
    rings.push({ r: 8 * sc, maxR: isMobile ? 180 : 310 });
  }

  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    ring.r += isMobile ? 0.65 : 1.0;
    const progress = ring.r / ring.maxR;
    if (progress >= 1) { rings.splice(i, 1); continue; }
    ctx.beginPath();
    ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${or},${og},${ob},${0.13 * (1 - progress)})`;
    ctx.lineWidth   = 1.2;
    ctx.stroke();
  }

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
    if (!running) { running = true; drawFrame(); }

  } else if (type === 'resize') {
    cw = ctx.canvas.width  = e.data.width;
    ch = ctx.canvas.height = e.data.height;
    rings.length = 0;
    ringTimer    = 0;
  }
};
