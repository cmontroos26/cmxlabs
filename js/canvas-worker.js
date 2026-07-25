/* ============================================================
   CMX Labs — canvas-worker.js v3
   3-D tilted diamond particle ring + comet tail
   ============================================================ */

let ctx, cw, ch, isMobile = false, running = false;

/* ── Config ─────────────────────────────────────────────────── */
const TILT      = 0.46;    // X-axis tilt in radians (~26°) — how flat the ring looks
const SPIN_SPD  = 0.00016; // Y-axis rotation per frame (~1 full spin per 10 min)
let   spin      = 0;

/* Light purple → brand purple → near-white */
const COLS = [
  [210, 207, 248],  // very light purple  (most common)
  [175, 169, 236],  // #AFA9EC
  [127, 119, 221],  // #7F77DD
  [238, 236, 255],  // near-white purple  (rare bright ones)
];

let mainP = [];  // ring particles
let tailP = [];  // comet-tail particles

/* ── Diamond path ───────────────────────────────────────────── */
// t ∈ [0, 1) → point on diamond in XZ plane (Y = 0)
// Corners: top(0, -R), right(R, 0), bottom(0, R), left(-R, 0)
function diamondPt(t, R) {
  const seg = Math.floor(t * 4) % 4;
  const u   = (t * 4) % 1;
  const C   = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const a = C[seg], b = C[(seg + 1) % 4];
  return {
    x: (a[0] + (b[0] - a[0]) * u) * R,
    z: (a[1] + (b[1] - a[1]) * u) * R,
  };
}

/* ── 3-D → screen projection ───────────────────────────────── */
// 1. Y-axis rotation (slow spin)
// 2. X-axis rotation (tilt so ring looks like a plate viewed at an angle)
// 3. Orthographic project to canvas
function project(x3, y3, z3, cx, cy) {
  // Y-rotation (spin)
  const cs = Math.cos(spin), ss = Math.sin(spin);
  const rx = x3 * cs + z3 * ss;
  const ry = y3;
  const rz = -x3 * ss + z3 * cs;
  // X-rotation (tilt)
  const ct = Math.cos(TILT), st = Math.sin(TILT);
  return {
    sx:    cx + rx,
    sy:    cy + ry * ct - rz * st,
    depth: ry * st + rz * ct,   // positive = near viewer
  };
}

/* ── Particle factory ───────────────────────────────────────── */
function buildParticles() {
  const COUNT = isMobile ? 300 : 600;
  const TAIL  = isMobile ?  65 : 130;
  const R     = isMobile ? 260 : 480;

  mainP = Array.from({ length: COUNT }, () => {
    const col = COLS[
      Math.random() < 0.06 ? 3 :
      Math.random() < 0.25 ? 2 :
      Math.random() < 0.50 ? 1 : 0
    ];
    return {
      t:       Math.random(),
      speed:   0.00032 + Math.random() * 0.00052,
      scatter: (Math.random() - 0.5) * 38,  // radial scatter (ring width)
      scY:     (Math.random() - 0.5) * 18,  // Y scatter (ring thickness)
      size:    0.4 + Math.random() * (Math.random() < 0.08 ? 2.2 : 1.0),
      alpha:   0.32 + Math.random() * 0.58,
      col,
      R:       R + (Math.random() - 0.5) * 32,
    };
  });

  tailP = Array.from({ length: TAIL }, () => ({
    t:    Math.random(),
    speed: 0.0008 + Math.random() * 0.0013,
    size:  0.3 + Math.random() * 0.9,
    alpha: 0.16 + Math.random() * 0.36,
    col:   COLS[Math.random() < 0.4 ? 1 : 0],
    scX:  (Math.random() - 0.5) * 18,   // fixed perpendicular scatter off bezier
    scY:  (Math.random() - 0.5) * 9,
    R,
  }));
}

/* ── Draw loop ──────────────────────────────────────────────── */
function drawFrame() {
  ctx.clearRect(0, 0, cw, ch);

  spin += SPIN_SPD;

  const cx = cw / 2;
  const cy = ch * 0.52;

  /* ── Main ring particles ──────────────────────────────────── */
  for (const p of mainP) {
    p.t = (p.t + p.speed) % 1;

    const dp  = diamondPt(p.t, p.R);

    /* Radial scatter (no corner-jump artifacts) */
    const rLen = Math.sqrt(dp.x * dp.x + dp.z * dp.z) || 1;
    const x3   = dp.x + (dp.x / rLen) * p.scatter;
    const y3   = p.scY;
    const z3   = dp.z + (dp.z / rLen) * p.scatter;

    const { sx, sy, depth } = project(x3, y3, z3, cx, cy);

    /* Depth → brightness / size (far = dim & small, near = bright & large) */
    const depthN = Math.max(0, Math.min(1, (depth + p.R) / (2 * p.R)));
    const alpha  = p.alpha * (0.16 + depthN * 0.84);
    const size   = p.size  * (0.38 + depthN * 0.70);

    if (alpha < 0.015 || size < 0.1) continue;

    const [r, g, b] = p.col;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
  }

  /* ── Comet tail ───────────────────────────────────────────── */
  /* Attach tail to the "top" corner of the diamond (local: x=0, z=-R).
     The bezier destination drifts toward the upper-right in screen space. */
  const R0 = isMobile ? 260 : 480;
  const { sx: tsx, sy: tsy } = project(0, 0, -R0, cx, cy);

  /* Fixed destination — upper-right quadrant */
  const bx3 = cx + R0 * 1.75;
  const by3 = cy - R0 * 0.80;

  /* Control points blend between rotating start and fixed end */
  const bx1 = tsx + (bx3 - tsx) * 0.18;
  const by1 = tsy + (by3 - tsy) * 0.12 - R0 * 0.12;
  const bx2 = tsx + (bx3 - tsx) * 0.62;
  const by2 = tsy + (by3 - tsy) * 0.52;

  for (const p of tailP) {
    p.t = (p.t + p.speed) % 1;
    const t  = p.t;
    const mt = 1 - t;

    /* Cubic bezier position */
    const bx = mt*mt*mt*tsx + 3*mt*mt*t*bx1 + 3*mt*t*t*bx2 + t*t*t*bx3;
    const by = mt*mt*mt*tsy + 3*mt*mt*t*by1 + 3*mt*t*t*by2 + t*t*t*by3;

    const alpha = p.alpha * (1 - t * 0.88);
    const size  = p.size  * (1 - t * 0.52);

    if (alpha < 0.015 || size < 0.1) continue;

    const [r, g, b] = p.col;
    ctx.beginPath();
    ctx.arc(bx + p.scX, by + p.scY, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
  }

  setTimeout(drawFrame, 16);
}

/* ── Message handler ────────────────────────────────────────── */
self.onmessage = function (e) {
  const { type } = e.data;
  if (type === 'init') {
    const canvas = e.data.canvas;
    isMobile = e.data.isMobile;
    ctx = canvas.getContext('2d');
    cw  = canvas.width;
    ch  = canvas.height;
    buildParticles();
    if (!running) { running = true; drawFrame(); }
  } else if (type === 'resize') {
    cw = ctx.canvas.width  = e.data.width;
    ch = ctx.canvas.height = e.data.height;
    buildParticles();
  }
};
