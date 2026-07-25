# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static marketing site for CMX Labs — a digital product studio. Single-page layout (`index.html`) with no build system, bundler, or dependencies. Deployed on Vercel (project: `cmxlabs`).

## Development

Open `index.html` directly in a browser, or use any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

Deploy:

```bash
vercel --prod
```

Pushing to `main` also triggers an automatic Vercel deploy.

## Architecture

Three source files:

- **`index.html`** — entire page markup (single-page, section-based layout: `#home`, `#services`, `#work`, `#contact`)
- **`css/style.css`** — all styles; uses CSS custom properties (tokens) defined in `:root` for colors, spacing, and easing curves
- **`js/main.js`** — all interactive behavior (IIFE, no modules)
- **`js/canvas-worker.js`** — neural network mesh animation that runs on a Web Worker via `OffscreenCanvas`; `main.js` falls back to main-thread rendering if `OffscreenCanvas` is unsupported

## Key JS systems in main.js

| Feature | How it works |
|---|---|
| Custom cursor | `#cursor` + `#follower` elements; only active on `pointer:fine` devices |
| Nav glass effect | Adds `.scrolled` class to `#nav` after 20px scroll |
| Hamburger menu | Toggles `.open` on `#navLinks`; closed by nav-link click or Escape key |
| Scroll reveal | Elements with `.sr` class become visible (`.vis`) via `IntersectionObserver` |
| Magnetic buttons | `.btn-magnetic` elements elastically follow cursor on hover |
| 3D card tilt | `.tilt-card` elements tilt on hover (desktop only) |
| Canvas animation | `pageCanvas` handed off to `canvas-worker.js` via `transferControlToOffscreen()` |

## CSS design tokens

Defined in `:root`:
- Colors: `--purple` (`#7C6EFA`), `--teal` (`#2DD4BF`), `--bg` (`#07070C`), `--t1/--t2/--t3` (text opacity levels)
- Layout: `--nav-h` (72px), `--section-pad` (120px, 72px on mobile)
- Easing: `--ease-spring`, `--ease-out`, `--ease-std`

## Contact form

Handled by Formspree (`https://formspree.io/f/maqzendl`) via `fetch` in `main.js`. No server-side code.
