# CyberSpark — Plan 2 Design Specification

**Author:** David Broggy
**Date:** 2026-03-19
**Status:** Approved for Implementation

---

## Table of Contents

1. [Overview](#1-overview)
2. [Feature 1: Dark/Light Mode Toggle](#2-feature-1-darklight-mode-toggle)
3. [Feature 2: Three.js Persona Avatars](#3-feature-2-threejs-persona-avatars)
4. [Feature 3: Explorer Hub Page](#4-feature-3-explorer-hub-page)
5. [File Changes](#5-file-changes)

---

## 1. Overview

Plan 2 adds three features to make CyberSpark visually impressive and practically usable for a demo:

- **Dark/Light mode toggle** — instant theme switching persisted to localStorage
- **Three.js 3D persona avatars** — animated WebGL character on each persona card
- **Explorer Hub** — full career exploration page with cards, salary data, timeline, and XP rewards

---

## 2. Feature 1: Dark/Light Mode Toggle

### Toggle Button

A sun/moon icon button rendered by `nav.js` into the nav-right area, between the XP badge and persona chip.

HTML rendered by nav.js:
```html
<button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark/light mode">
  <span class="theme-icon">🌙</span>
</button>
```

Icon shows 🌙 in dark mode, ☀️ in light mode.

### CSS Implementation

Light mode overrides applied via `[data-theme="light"]` on `<html>`:

```css
[data-theme="light"] {
  --color-bg:         #f8fafc;
  --color-surface:    #ffffff;
  --color-surface-2:  #f1f5f9;
  --color-border:     #e2e8f0;
  --color-text:       #0f172a;
  --color-text-muted: #64748b;

  /* Darkened accent variants for light-mode contrast (WCAG AA on white) */
  --color-blue:   #2563eb;
  --color-green:  #16a34a;
  --color-gold:   #b45309;
  --color-coral:  #c2410c;
  --color-purple: #7c3aed;
}

/* Nav background uses a hardcoded rgba in dark mode — override for light mode */
[data-theme="light"] #site-nav {
  background: rgba(248, 250, 252, 0.95);
  border-bottom-color: #e2e8f0;
}
```

The darkened accent values ensure button labels, stat text, and badge borders pass WCAG AA contrast on the light `#ffffff` surface. The five persona accent variables (`--color-blue`, `--color-green`, etc.) are re-declared in the light-mode block so all downstream consumers automatically pick up the adjusted values without per-component overrides.

### JavaScript

New function `initTheme()` in `js/nav.js`. **Call order:** `initTheme()` is called at the end of `renderNav()`, after the toggle button has been inserted into the DOM. This ensures the button element exists before `initTheme()` queries it by `id="theme-toggle"`. The no-flash inline script in `<head>` handles the visual state before paint — `initTheme()` only wires up the click handler and syncs the icon.

- On load (inside `renderNav()`): reads `localStorage.getItem('cyberspark_theme')`. Updates icon to ☀️ if already in light mode.
- Toggle click: flips `data-theme` attribute on `<html>`, updates icon, saves to localStorage.

### No-Flash Inline Script

Add to every HTML page `<head>` before CSS links:
```html
<script>
  if (localStorage.getItem('cyberspark_theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
</script>
```

This runs synchronously before paint, preventing the white flash on page load.

### Theme Toggle CSS

```css
.theme-toggle {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-xs) var(--space-sm);
  font-size: 1rem;
  cursor: pointer;
  transition: background var(--transition);
  line-height: 1;
}
.theme-toggle:hover { background: var(--color-surface-2); }
```

---

## 3. Feature 2: Three.js Persona Avatars

### Technical Approach

Three.js r128 loaded via CDN in `index.html` only (home page). A new file `js/avatars.js` creates one Three.js scene per persona card canvas.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

### Avatar Canvas Placement

Each persona card in the picker gets a `<canvas>` element above the persona name. The canvas is 160×160px, rendered by Three.js.

The persona card grid on `index.html` uses `class="persona-grid"` (a dedicated CSS rule, not `grid-3`) to accommodate the 160px canvas height. On desktop (≥1024px) the 5 cards display in a single row using `grid-template-columns: repeat(5, 1fr)`. On tablet (640px–1023px) they wrap to 3-then-2. On mobile (<640px) avatars are disabled and cards use a 2-column grid. This replaces the existing `grid-3` class on the persona picker section.

### The 5 Characters

All built from Three.js geometry primitives with `MeshStandardMaterial`. No texture files needed.

**Geometry dimensions reference** (Three.js constructor units, scene scale ~1 unit = visible character-sized):

| Part | Geometry | Key Dimensions |
|---|---|---|
| Explorer helmet | `SphereGeometry` | radius 0.5 |
| Explorer visor | `CylinderGeometry` | radiusTop 0.35, radiusBottom 0.35, height 0.05 |
| Explorer body | `SphereGeometry` | radius 0.35 |
| Explorer arms (×2) | `CylinderGeometry` | radiusTop 0.06, radiusBottom 0.06, height 0.5 |
| Explorer stars (×10) | `IcosahedronGeometry` | radius 0.04 |
| Hacker head | `BoxGeometry` | 0.8 × 0.8 × 0.8 |
| Hacker eyes (×2) | `SphereGeometry` | radius 0.12 |
| Hacker jaw | `BoxGeometry` | 0.6 × 0.15 × 0.4 |
| Hacker antenna | `CylinderGeometry` | radiusTop 0.03, radiusBottom 0.03, height 0.5 |
| Hacker antenna tip | `SphereGeometry` | radius 0.07 |
| Hacker scanlines (×4) | `PlaneGeometry` | 0.8 × 0.05 |
| Builder torso | `BoxGeometry` | 0.6 × 0.8 × 0.4 |
| Builder head | `BoxGeometry` | 0.5 × 0.5 × 0.5 |
| Builder gear | `TorusGeometry` | radius 0.2, tube 0.06 |
| Builder arms (×2) | `BoxGeometry` | 0.15 × 0.5 × 0.15 |
| Builder legs (×2) | `BoxGeometry` | 0.18 × 0.4 × 0.18 |
| Builder rivets (×6) | `SphereGeometry` | radius 0.05 |
| Builder blink light | `SphereGeometry` | radius 0.07 |
| Defender body | `CylinderGeometry` | radiusTop 0.25, radiusBottom 0.4, height 0.9 |
| Defender head | `SphereGeometry` | radius 0.3 |
| Defender visor | `BoxGeometry` | 0.35 × 0.1 × 0.15 |
| Defender shield | `BoxGeometry` | 0.5 × 0.65 × 0.06 |
| Defender shield ring | `TorusGeometry` | radius 0.38, tube 0.04 |
| Entrepreneur nose | `ConeGeometry` | radius 0.18, height 0.45 |
| Entrepreneur body | `CylinderGeometry` | radiusTop 0.18, radiusBottom 0.18, height 0.7 |
| Entrepreneur fins (×3) | `BoxGeometry` | 0.1 × 0.25 × 0.15 |
| Entrepreneur flame | `ConeGeometry` | radius 0.15, height 0.35 |
| Entrepreneur rings (×2) | `TorusGeometry` | radius 0.35, tube 0.03 |

#### Explorer — Astronaut
- Large sphere (helmet) with a smaller flattened cylinder visor (dark, reflective)
- Smaller sphere body below
- Two thin cylinder arms
- 8–12 small icosahedron "star" particles floating around it
- Accent color: electric blue (`#3b82f6`)
- Animation: gentle bob up/down, slow Y rotation, stars orbit slowly

#### Hacker — Cyber Skull Bot
- Rounded box (head) with two glowing sphere eyes (emissive neon green)
- Flat box jaw
- Thin antenna on top with sphere tip
- Scanline effect: thin plane meshes that flicker opacity
- Accent color: neon green (`#22c55e`)
- Animation: head tilt side to side, eyes pulse brightness

#### Builder — Blocky Robot
- Tall box torso, smaller box head
- Torus on chest (spinning gear)
- Box arms, box legs
- Small sphere "rivets" on joints
- Blinking light (sphere on head that emits light pulses)
- Accent color: purple (`#a855f7`)
- Animation: arms swing slightly, gear spins, light blinks

#### Defender — Armored Knight
- Cone/cylinder body (armor silhouette)
- Sphere head with box visor
- Large flat box shield (held out front, tilted)
- Shield has pulsing glow ring (torus around it)
- Accent color: coral/orange (`#f97316`)
- Animation: shield pulse expands and fades, body sways slightly

#### Entrepreneur — Rocket
- Cone nose + cylinder body
- Three small box fins at base
- Animated flame: cone geometry at bottom, orange/yellow emissive, scales up/down
- Two torus rings orbiting the rocket (like coins/orbits)
- Accent color: gold (`#eab308`)
- Animation: rocket tilts and rights itself, flame flickers, rings orbit

### Lighting

Each scene uses:
- `AmbientLight` (0.4 intensity, white)
- `DirectionalLight` (1.0 intensity, persona accent color) — from top-left
- `PointLight` at character position (0.6 intensity, accent color)

This gives each avatar a distinctive colored glow matching the persona accent.

### Interaction

- **Idle:** Float animation + slow rotation (runs always)
- **Hover:** Rotation speed 3×, slight scale up (1.05), camera dolly in
- **Selected:** Accent color point light intensity increases to 2.0, continuous fast spin
- **Mouse move over card:** Subtle X/Y tilt of the avatar mesh toward cursor (max ±15°)

### Performance

- Each canvas is 160×160 at devicePixelRatio capped at 2
- `renderer.setAnimationLoop` used for RAF
- Renderers are disposed when persona section scrolls out of view (IntersectionObserver)
- On mobile (< 640px): avatars disabled, replaced with large emoji icon (saves battery)

### `js/avatars.js` Structure

```javascript
// Public API:
//   initAvatars() — creates all 5 Three.js scenes, called after persona cards render
//   disposeAvatars() — cleans up all renderers

const AVATAR_BUILDERS = {
  explorer:     buildExplorerAvatar,
  hacker:       buildHackerAvatar,
  builder:      buildBuilderAvatar,
  defender:     buildDefenderAvatar,
  entrepreneur: buildEntrepreneurAvatar,
};

function initAvatars() { ... }
function disposeAvatars() { ... }
```

---

## 4. Feature 3: Explorer Hub Page

### Page: `explorer.html`

Full replacement of the "Coming Soon" shell with a complete career exploration experience.

### Section 1: Hero Banner

- Gradient banner with heading "Explorer Hub"
- Subheading: "Discover the careers that will shape the future — and how to get there."
- XP reward callout: "Explore careers to earn XP"

### Section 2: Career Cards Grid

8 career cards in a `grid-4` layout (2 columns on tablet, 1 on mobile). `grid-4` is a **new CSS class** to be added to `css/main.css`: `grid-template-columns: repeat(4, 1fr)` at desktop, 2 columns at tablet, 1 at mobile.

Each card shows:
- Job title
- Salary range (color-coded bar: green for high, yellow for mid)
- One-line description
- Top 3 required skills (tags)
- Expand button → reveals day-in-the-life paragraph + "How to start today" action
- Clicking "How to start today" awards 5 XP

**The 8 careers:**

| ID | Title | Salary Range | Skills |
|---|---|---|---|
| pentester | Penetration Tester | $85K–$140K | Networking, Python, Critical Thinking |
| analyst | Security Analyst | $75K–$115K | SIEM, Incident Response, Communication |
| ai_engineer | AI / ML Engineer | $110K–$175K | Python, Math, Data Science |
| forensics | Digital Forensics Investigator | $70K–$110K | Evidence Analysis, Legal Knowledge, Attention to Detail |
| cloud_security | Cloud Security Architect | $120K–$180K | AWS/Azure, Zero Trust, Architecture |
| ciso | CISO | $150K–$250K | Leadership, Risk Management, Business Strategy |
| devops_sec | DevSecOps Engineer | $100K–$155K | CI/CD, Docker, Security Testing |
| entrepreneur | Cybersecurity Entrepreneur | $0–$unlimited | Vision, Sales, Technical Depth |

Each card expanded view contains a 3–4 sentence "day in the life" and a concrete action step with an external link. The 8 action links:

| Career ID | "How to Start Today" Link |
|---|---|
| pentester | https://tryhackme.com |
| analyst | https://www.cybrary.it |
| ai_engineer | https://www.coursera.org/learn/machine-learning |
| forensics | https://www.sans.org/cyber-ranges/ |
| cloud_security | https://aws.amazon.com/training/learn-about/security/ |
| ciso | https://www.isaca.org/credentialing/cism |
| devops_sec | https://learn.microsoft.com/en-us/training/paths/devsecops-foundations/ |
| entrepreneur | https://www.ycombinator.com/library |

Expanding a card for the first time awards 10 XP.

### Section 3: Career Path Timeline

HTML/CSS timeline (no library) showing a sample path from Grade 9 → First Job:

- **Grade 9–10:** Take CS class, get a free TryHackMe account, watch YouTube
- **Grade 11:** CompTIA IT Fundamentals cert ($0 via voucher programs), first CTF
- **Grade 12:** Python basics on freeCodeCamp, GitHub portfolio started
- **Year 1 (College/Self-study):** CompTIA Security+, internship or bug bounty
- **Year 2–3:** Specialize (cloud, pentesting, AI), build projects
- **First Job:** Junior Security Analyst or Junior AI Engineer, $75K–$100K starting

Each timeline node is a CSS circle + line, with year label and description. Accent color for the circles.

### Section 4: Why This Career Field

Three large stat cards (same design as home page stat chips, larger):
- "3.5 Million cybersecurity jobs unfilled globally by 2025" — ISC² 2023
- "AI and cybersecurity are the #1 and #2 fastest growing tech careers" — LinkedIn 2024
- "Remote-first: 60% of cybersecurity roles allow full remote work" — Flexjobs 2023


### New Badge: Career Explorer

Add to `js/xp.js` BADGE_REGISTRY (appended before `cyber_champion`, making total 18 badges):
```javascript
{
  id: 'career_explorer',
  name: 'Career Explorer',
  icon: '🔭',
  description: 'Explored all 8 cybersecurity career paths.',
  unlockFn: s => (s.careersExplored || 0) >= 8,
}
```

Add `cyberspark_careers_explored` (integer) to `_buildState()` in `js/xp.js`:
```javascript
careersExplored: parseInt(localStorage.getItem('cyberspark_careers_explored') || '0', 10),
```

`explorer.html` increments this counter when a card is expanded for the first time:
```javascript
let explored = parseInt(localStorage.getItem('cyberspark_careers_explored') || '0', 10);
explored += 1;
localStorage.setItem('cyberspark_careers_explored', String(explored));
```

**Impact on `cyber_champion` badge:** `cyber_champion` requires all other badges to be earned first. With `career_explorer` now in BADGE_REGISTRY (18 total), the `cyber_champion` unlockFn (which filters itself out using `b.id !== 'cyber_champion'`) will now require 17 badges including `career_explorer`. This is intentional — players must complete the Explorer Hub to be a true Cyber Champion.

### XP Awards on Explorer Hub

| Action | XP |
|---|---|
| First visit to Explorer Hub | 5 (via markPageVisited) |
| Expand a career card (first time each) | 10 |
| Click "How to start today" | 5 |
| Expand all 8 career cards (bonus) | Triggers `career_explorer` badge grant only — no extra flat XP beyond the badge's built-in BADGE_BONUS award |

The "expand all 8" milestone is detected by checking `careersExplored >= 8` after each increment, then calling `checkBadges()`. The badge grant itself awards XP via the existing `BADGE_BONUS` constant in `xp.js`. No separate 25 XP call is needed.

---

## 5. File Changes

| File | Change |
|---|---|
| `css/main.css` | Add light mode CSS variable overrides |
| `css/components.css` | Add `.theme-toggle` styles, career card styles, timeline styles |
| `js/nav.js` | Add theme toggle button + `initTheme()` + toggle handler |
| `js/xp.js` | Add `career_explorer` badge to BADGE_REGISTRY, add `careersExplored` to `_buildState` |
| `js/avatars.js` | New file — all 5 Three.js avatar builders |
| `index.html` | Add Three.js CDN script, no-flash theme snippet, avatar canvases in persona cards, load avatars.js |
| `explorer.html` | Full page content — hero, career cards, timeline, stats |
| All HTML pages | Add no-flash theme snippet to `<head>` |
