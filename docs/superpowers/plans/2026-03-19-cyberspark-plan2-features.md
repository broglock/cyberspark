# CyberSpark Plan 2 — Dark Mode, Avatars, Explorer Hub

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dark/light mode toggle, Three.js 3D persona avatars, and a fully functional Explorer Hub career page to CyberSpark.

**Architecture:** Three independent features bolted onto the existing vanilla JS static site. CSS custom properties handle theming — a `[data-theme="light"]` attribute on `<html>` activates light mode overrides. Three.js r128 (CDN) renders five geometry-primitive characters in canvas elements on the home page persona picker. The Explorer Hub replaces the "Coming Soon" shell in `explorer.html` with a full career exploration experience backed by `localStorage` state and XP awards.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, Three.js r128 (CDN UMD build), localStorage, IntersectionObserver API

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `css/main.css` | Modify | Add `[data-theme="light"]` overrides, `.persona-grid` layout class |
| `css/components.css` | Modify | Add `.theme-toggle` styles, `[data-theme="light"] #site-nav` override, career card/timeline/stat styles |
| `js/nav.js` | Modify | Add theme toggle button to nav, `initTheme()` function |
| `js/xp.js` | Modify | Add `career_explorer` badge (18th), add `careersExplored` to `_buildState()` |
| `js/avatars.js` | Create | All 5 Three.js avatar builders, `initAvatars()`, `disposeAvatars()` |
| `index.html` | Modify | No-flash snippet, Three.js CDN, persona-grid class, canvas elements per card, call `initAvatars()` |
| `explorer.html` | Replace | Full career hub: hero, 8 career cards, timeline, stats section |
| `hacker.html` | Modify | Add no-flash snippet |
| `builder.html` | Modify | Add no-flash snippet |
| `defender.html` | Modify | Add no-flash snippet |
| `entrepreneur.html` | Modify | Add no-flash snippet |
| `quiz.html` | Modify | Add no-flash snippet |
| `achievements.html` | Modify | Add no-flash snippet |
| `about.html` | Modify | Add no-flash snippet |
| `tests/test-xp.js` | Modify | Update badge count 17→18, add `career_explorer` test |

---

## Task 1: CSS — Light Mode, persona-grid, Component Styles

**Files:**
- Modify: `css/main.css` (after line 49, after line 94)
- Modify: `css/components.css` (after the `#site-nav` block, after `.theme-toggle:hover`)

### Step 1.1: Add light mode CSS variables to main.css

In `css/main.css`, add after the persona accent overrides block (after line 49):

```css
/* === Light Mode Overrides === */
[data-theme="light"] {
  --color-bg:          #f8fafc;
  --color-surface:     #ffffff;
  --color-surface-2:   #f1f5f9;
  --color-border:      #e2e8f0;
  --color-text:        #0f172a;
  --color-text-muted:  #64748b;

  /* Darkened accent variants — pass WCAG AA on white backgrounds */
  --color-blue:        #2563eb;
  --color-green:       #16a34a;
  --color-gold:        #b45309;
  --color-coral:       #c2410c;
  --color-purple:      #7c3aed;
}
```

### Step 1.2: Add .persona-grid class to main.css

**Note:** `.grid-4` already exists in `css/main.css` (lines 95, 98, 103) — do NOT add it again. Only `.persona-grid` is new.

In `css/main.css`, add after the `.grid-4` responsive block (after line 105):

```css
/* Persona picker grid — 5 cards + 160px canvas height */
.persona-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-lg);
}

@media (max-width: 1024px) {
  .persona-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 640px) {
  .persona-grid { grid-template-columns: repeat(2, 1fr); }
}
```

### Step 1.3: Add theme toggle + nav light mode + career page styles to components.css

In `css/components.css`, add after the `#site-nav` block (after line 9):

```css
/* Nav background override for light mode */
[data-theme="light"] #site-nav {
  background: rgba(248, 250, 252, 0.95);
  border-bottom-color: #e2e8f0;
}
```

In `css/components.css`, add after `.footer-links a:hover` rule (end of file):

```css
/* === Theme Toggle Button === */
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

/* === Career Cards (Explorer Hub) === */
.career-card { position: relative; }

.career-card .salary-bar {
  height: 6px;
  border-radius: var(--radius-full);
  margin: var(--space-sm) 0;
}
.salary-high  { background: var(--color-green); }
.salary-mid   { background: var(--color-gold); }

.career-skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

.skill-tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.career-expand-btn {
  width: 100%;
  margin-top: var(--space-md);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition);
}
.career-expand-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.career-details {
  display: none;
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}
.career-details.open { display: block; }

.career-details p { font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.7; }

.start-today-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  margin-top: var(--space-md);
  background: var(--color-accent);
  color: #000;
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition: filter var(--transition);
}
.start-today-btn:hover { filter: brightness(1.15); }

/* === Career Timeline === */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-border);
}

.timeline-node {
  position: relative;
  padding-bottom: var(--space-xl);
}

.timeline-node::before {
  content: '';
  position: absolute;
  left: -2rem;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 3px solid var(--color-bg);
  box-shadow: 0 0 0 2px var(--color-accent);
}

.timeline-year {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: var(--space-xs);
}

.timeline-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.timeline-desc {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* === Explorer Hub Stat Cards === */
.explorer-stat {
  padding: var(--space-xl);
  text-align: center;
}

.explorer-stat .stat-big {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1.3;
}

.explorer-stat .stat-source {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: var(--space-xs);
}

/* === Avatar Canvas === */
.avatar-canvas {
  display: block;
  width: 160px;
  height: 160px;
  margin: 0 auto var(--space-md);
}

.avatar-emoji-fallback {
  font-size: 3rem;
  text-align: center;
  margin-bottom: var(--space-md);
  display: none;
}

@media (max-width: 640px) {
  .avatar-canvas       { display: none; }
  .avatar-emoji-fallback { display: block; }
}
```

- [ ] **Step 1: Add light mode CSS variables block to main.css**

Open `css/main.css`. After line 49 (after the `body.persona-entrepreneur` rule), paste the `[data-theme="light"]` block from Step 1.1 above.

- [ ] **Step 1a: Add .persona-grid class to main.css**

After the `@media (max-width: 640px)` block for grid utilities (after line 105), paste the `.persona-grid` block from Step 1.2 above.

- [ ] **Step 2: Add nav light mode + theme toggle styles to components.css**

Open `css/components.css`. After line 9 (after the closing `}` of `#site-nav`), insert the `[data-theme="light"] #site-nav` block from Step 1.3.

At the very end of `css/components.css`, append all remaining styles from Step 1.3 (`.theme-toggle` through `.avatar-emoji-fallback` media query).

- [ ] **Step 3: Verify no existing tests break**

Open `tests/index.html` in a browser. All 14 tests should still pass (XP system + persona system). The CSS changes have no effect on JS tests.

- [ ] **Step 4: Commit**

```bash
git add css/main.css css/components.css
git commit -m "feat: add light mode CSS variables, persona-grid layout, career + avatar component styles"
```

---

## Task 2: nav.js — Theme Toggle Button + initTheme()

**Files:**
- Modify: `js/nav.js`

### Step 2.1: Update renderNav() to include toggle button

Replace the `nav-right` `div` in `renderNav()` to inject the toggle button between the XP badge and persona chip. Also add `initTheme()` call at end of `renderNav()`.

Full updated `nav.js`:

```javascript
/**
 * nav.js — Renders the shared navigation bar and footer into every page.
 *
 * Reads persona and XP from localStorage, renders nav HTML into #site-nav,
 * renders footer into #site-footer, and handles mobile hamburger toggle.
 * Also manages dark/light theme toggle (initTheme).
 *
 * Depends on: xp.js, persona.js (loaded before this file)
 */

const NAV_PAGES = [
  { href: 'index.html',        label: 'Home' },
  { href: 'explorer.html',     label: 'Explorer Hub' },
  { href: 'hacker.html',       label: 'Hacker Lab' },
  { href: 'builder.html',      label: 'Builder Studio' },
  { href: 'defender.html',     label: 'Defender HQ' },
  { href: 'entrepreneur.html', label: 'Entrepreneur Lab' },
  { href: 'quiz.html',         label: 'Career Quiz' },
  { href: 'achievements.html', label: 'Achievements' },
  { href: 'about.html',        label: 'About' },
];

function _currentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function renderNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  const persona = getPersona();
  const xp = getXP();
  const current = _currentPage();

  const links = NAV_PAGES.map(p =>
    `<a href="${p.href}" class="${current === p.href ? 'active' : ''}">${p.label}</a>`
  ).join('');

  const personaHtml = persona
    ? `<span class="persona-chip" id="persona-chip" title="Change persona">
         ${persona.icon} ${persona.name}
       </span>`
    : `<a href="index.html" class="btn btn-outline btn-sm">Pick Persona</a>`;

  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">⚡ CyberSpark</a>
      <nav class="nav-links" id="nav-links" role="navigation" aria-label="Main navigation">
        ${links}
      </nav>
      <div class="nav-right">
        <div class="xp-badge" aria-label="XP total">
          ⚡ <span id="nav-xp">${xp} XP</span>
        </div>
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark/light mode">
          <span class="theme-icon">🌙</span>
        </button>
        ${personaHtml}
        <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `;

  // Mobile toggle
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  }

  // Persona chip navigation
  const chip = document.getElementById('persona-chip');
  if (chip) {
    chip.addEventListener('click', () => { window.location.href = 'index.html'; });
  }

  // Theme toggle — wires handler and syncs icon AFTER button is in DOM
  initTheme();
}

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const iconEl = btn.querySelector('.theme-icon');
  const isLight = localStorage.getItem('cyberspark_theme') === 'light';

  // Sync icon to current state (no-flash script already applied data-theme)
  if (iconEl) iconEl.textContent = isLight ? '☀️' : '🌙';

  btn.addEventListener('click', () => {
    const currentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (currentlyLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('cyberspark_theme', 'dark');
      if (iconEl) iconEl.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('cyberspark_theme', 'light');
      if (iconEl) iconEl.textContent = '☀️';
    }
  });
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-inner">
      <span class="footer-copy">© 2026 David Broggy — MIT License</span>
      <div class="footer-links">
        <a href="about.html">About</a>
        <a href="achievements.html">Achievements</a>
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
});
```

- [ ] **Step 1: Replace js/nav.js with the full updated version above**

- [ ] **Step 2: Open any page in browser (e.g., index.html)**

Verify: theme toggle button (🌙) appears in the nav bar between the XP badge and persona chip.

Click the button — page switches to light mode (light grey background, dark text). Click again — returns to dark mode.

**Note:** The no-flash verification (confirming light mode loads with no dark flash on refresh) requires the no-flash snippet from Task 4 to be in place first. Skip that check now — confirm it after completing Task 4.

- [ ] **Step 3: Run tests**

Open `tests/index.html`. All 14 tests pass.

- [ ] **Step 4: Commit**

```bash
git add js/nav.js
git commit -m "feat: add dark/light theme toggle to nav bar with localStorage persistence"
```

---

## Task 3: xp.js — career_explorer Badge + careersExplored State

**Files:**
- Modify: `js/xp.js`
- Modify: `tests/test-xp.js`

### Step 3.1: Update test first (TDD)

In `tests/test-xp.js`, update the badge count assertion and add a `career_explorer` test:

```javascript
  it('BADGE_REGISTRY contains all 18 defined badges', () => {
    expect(BADGE_REGISTRY.length).toBe(18);
  });
```

Also add this test after the badge shape test:

```javascript
  it('career_explorer badge unlocks when careersExplored >= 8', () => {
    localStorage.clear();
    localStorage.setItem('cyberspark_careers_explored', '8');
    checkBadges();
    expect(hasBadge('career_explorer')).toBeTruthy();
  });
```

- [ ] **Step 1: Update tests/test-xp.js**

Change line 38 from:
```javascript
  it('BADGE_REGISTRY contains all 17 defined badges', () => {
    expect(BADGE_REGISTRY.length).toBe(17);
```
To:
```javascript
  it('BADGE_REGISTRY contains all 18 defined badges', () => {
    expect(BADGE_REGISTRY.length).toBe(18);
```

Append the `career_explorer` badge test after the badge shape test (after line 48):
```javascript

  it('career_explorer badge unlocks when careersExplored >= 8', () => {
    localStorage.clear();
    localStorage.setItem('cyberspark_careers_explored', '8');
    checkBadges();
    expect(hasBadge('career_explorer')).toBeTruthy();
  });
```

- [ ] **Step 2: Open tests/index.html in browser**

Confirm test `BADGE_REGISTRY contains all 18 defined badges` **FAILS** (still 17).

Confirm `career_explorer badge unlocks` **FAILS** (badge not in registry yet).

- [ ] **Step 3: Add careersExplored to _buildState() in xp.js**

In `js/xp.js`, inside `_buildState()`, add after the `pitchDone` line (after line 118):
```javascript
    careersExplored:  parseInt(localStorage.getItem('cyberspark_careers_explored') || '0', 10),
```

- [ ] **Step 4: Add career_explorer badge to BADGE_REGISTRY in xp.js**

In `js/xp.js`, insert before the `cyber_champion` entry (before the block starting with `id: 'cyber_champion'` near line 209):

```javascript
  {
    id: 'career_explorer', name: 'Career Explorer', icon: '🔭',
    description: 'Explored all 8 cybersecurity career paths.',
    unlockFn: s => (s.careersExplored || 0) >= 8,
  },
```

- [ ] **Step 5: Open tests/index.html in browser**

All 16 tests should now **PASS** (14 original + 2 new).

- [ ] **Step 6: Commit**

```bash
git add js/xp.js tests/test-xp.js
git commit -m "feat: add career_explorer badge and careersExplored state to xp.js"
```

---

## Task 4: No-Flash Snippet in All HTML Pages

**Files:**
- Modify: `index.html`, `explorer.html`, `hacker.html`, `builder.html`, `defender.html`, `entrepreneur.html`, `quiz.html`, `achievements.html`, `about.html`

The no-flash snippet must appear in `<head>` **before the CSS `<link>` tags** so it runs synchronously before paint. Placing it after `<meta charset>` and before `<meta name="viewport">` achieves this — CSS `<link>` tags come after both meta tags. **Do not place it after any `<link rel="stylesheet">` tag or the flash-prevention will not work.**

Snippet to add:
```html
  <!-- No-flash theme: runs synchronously before CSS paint -->
  <script>
    if (localStorage.getItem('cyberspark_theme') === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  </script>
```

- [ ] **Step 1: Add no-flash snippet to index.html**

In `index.html`, insert the snippet after `<meta charset="UTF-8">` and before `<meta name="viewport">`, as shown:

```html
<head>
  <meta charset="UTF-8">
  <!-- No-flash theme: runs synchronously before CSS paint -->
  <script>
    if (localStorage.getItem('cyberspark_theme') === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- [ ] **Step 2: Add no-flash snippet to all 8 remaining HTML shells**

Apply the same change (insert after `<meta charset="UTF-8">`, before `<meta name="viewport">`) to:
- `explorer.html`
- `hacker.html`
- `builder.html`
- `defender.html`
- `entrepreneur.html`
- `quiz.html`
- `achievements.html`
- `about.html`

Each file currently has the same `<head>` structure, so the edit is identical in each.

- [ ] **Step 3: Verify no-flash works**

1. Go to any page, switch to light mode using the theme toggle.
2. Hard-refresh (Cmd+Shift+R on Mac) — the page should load in light mode with no dark flash.
3. Open Developer Tools → Application → Local Storage — confirm `cyberspark_theme` is `'light'`.

- [ ] **Step 4: Commit**

```bash
git add index.html explorer.html hacker.html builder.html defender.html entrepreneur.html quiz.html achievements.html about.html
git commit -m "feat: add no-flash theme script to all HTML pages"
```

---

## Task 5: index.html — Persona Grid + Avatar Canvases + Three.js CDN

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Three.js CDN script tag before closing </body>**

In `index.html`, add before the `<script src="js/xp.js">` line:

```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

- [ ] **Step 2: Add avatars.js script tag after Three.js CDN**

Add after the Three.js CDN line but before the inline `<script>`:

```html
  <script src="js/avatars.js"></script>
```

- [ ] **Step 3: Change persona-grid class from grid-3 to persona-grid**

In `index.html`, find line 56:
```html
      <div class="grid-3" id="persona-grid" style="margin-top:2rem">
```

Change to:
```html
      <div class="persona-grid" id="persona-grid" style="margin-top:2rem">
```

- [ ] **Step 4: Update renderPersonaCards() to include avatar canvas elements**

In `index.html`, replace the `renderPersonaCards()` function body (the `grid.innerHTML = PERSONAS.map(...)` block) with:

```javascript
function renderPersonaCards() {
  const grid = document.getElementById('persona-grid');
  if (!grid) return;
  const current = getPersona();
  const isMobile = window.innerWidth < 640;
  grid.innerHTML = PERSONAS.map(p => `
    <button
      class="card persona-card ${current && current.id === p.id ? 'selected' : ''}"
      onclick="selectPersona('${p.id}')"
      data-persona-id="${p.id}"
      aria-pressed="${current && current.id === p.id}"
      style="text-align:center; cursor:pointer; padding-top:var(--space-md);"
    >
      ${isMobile
        ? `<div class="avatar-emoji-fallback" style="display:block;font-size:3rem;margin-bottom:0.75rem">${p.icon}</div>`
        : `<canvas class="avatar-canvas" data-persona="${p.id}" width="160" height="160" aria-hidden="true"></canvas>`
      }
      <h3 style="font-size:1.1rem">${p.name}</h3>
      <p class="text-muted mt-sm" style="font-size:0.8rem">${p.tagline}</p>
    </button>
  `).join('');
}
```

- [ ] **Step 5: Call initAvatars() after renderPersonaCards() in the DOMContentLoaded init block**

Find the init block at the bottom of the inline script (the `DOMContentLoaded` listener):

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  renderPersonaCards();
  renderSectionCards();
});
```

Change to:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  renderPersonaCards();
  renderSectionCards();
  if (typeof initAvatars === 'function') initAvatars();
});
```

- [ ] **Step 6: Also call initAvatars() in selectPersona() after renderPersonaCards()**

After the `renderPersonaCards()` call inside `selectPersona()`, add:

```javascript
  if (typeof initAvatars === 'function') {
    if (typeof disposeAvatars === 'function') disposeAvatars();
    initAvatars();
  }
```

- [ ] **Step 7: Open index.html in browser**

On desktop (≥ 640px): Each persona card should show a Three.js canvas (black/transparent square if avatars.js isn't written yet — that's expected, Task 6 fills it in).

On mobile (< 640px width via DevTools): Canvas elements are hidden, emoji icons are shown instead.

The persona grid should show 5 cards across on wide screens.

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "feat: add Three.js CDN, persona-grid canvas placeholders, avatar init hooks to index.html"
```

---

## Task 6: avatars.js — Five Three.js Avatar Builders

**Files:**
- Create: `js/avatars.js`

This file depends on `THREE` global from the Three.js r128 CDN. It is only loaded on `index.html`.

```javascript
/**
 * avatars.js — Three.js 3D persona avatars for CyberSpark home page.
 *
 * Public API:
 *   initAvatars()    — creates all 5 Three.js scenes into .avatar-canvas elements
 *   disposeAvatars() — disposes all renderers (call before re-render on persona change)
 *
 * Depends on: THREE global (Three.js r128 CDN loaded before this file)
 * Only loaded on index.html. On mobile (< 640px) this module does nothing —
 * the CSS hides canvases and shows emoji fallbacks instead.
 */

/* eslint-disable no-undef */

const _avatarRenderers = [];
const _avatarObservers = [];

function initAvatars() {
  if (typeof THREE === 'undefined') return;
  if (window.innerWidth < 640) return;

  const canvases = document.querySelectorAll('.avatar-canvas[data-persona]');
  canvases.forEach(canvas => {
    const personaId = canvas.dataset.persona;
    const builder = AVATAR_BUILDERS[personaId];
    if (!builder) return;

    const { renderer, animateFn, pointLight } = builder(canvas);
    _avatarRenderers.push(renderer);

    // Hover: speed up rotation
    const card = canvas.closest('.persona-card');
    if (card) {
      card.addEventListener('mouseenter', () => { canvas._hovered = true; });
      card.addEventListener('mouseleave', () => { canvas._hovered = false; });
    }

    // IntersectionObserver: pause rendering when section off screen
    const section = document.getElementById('persona-section');
    if (section) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            renderer.setAnimationLoop(animateFn);
          } else {
            renderer.setAnimationLoop(null);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(section);
      _avatarObservers.push(obs);
    } else {
      renderer.setAnimationLoop(animateFn);
    }
  });
}

function disposeAvatars() {
  _avatarObservers.forEach(o => o.disconnect());
  _avatarObservers.length = 0;
  _avatarRenderers.forEach(r => {
    r.setAnimationLoop(null);
    r.dispose();
  });
  _avatarRenderers.length = 0;
}

// ── Shared scene setup ───────────────────────────────────────────────────────

function _createBaseScene(canvas, accentHex) {
  const W = 160, H = 160;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.set(0, 0, 3.5);

  const accentColor = new THREE.Color(accentHex);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(accentColor, 1.0);
  dirLight.position.set(-1, 1, 1);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(accentColor, 0.6, 10);
  pointLight.position.set(0, 0, 2);
  scene.add(pointLight);

  return { renderer, scene, camera, pointLight, accentColor };
}

// ── AVATAR 1: Explorer — Astronaut (accent: electric blue #3b82f6) ────────────

function buildExplorerAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#3b82f6');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.4, metalness: 0.3 });

  // Helmet
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), mat('#c8d8f0'));
  helmet.position.set(0, 0.45, 0);
  scene.add(helmet);

  // Visor
  const visor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.1, metalness: 0.9 })
  );
  visor.position.set(0, 0.45, 0.3);
  visor.rotation.x = Math.PI / 2;
  scene.add(visor);

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), mat('#a0b8d8'));
  body.position.set(0, -0.15, 0);
  scene.add(body);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8);
  const armMat = mat('#a0b8d8');
  const armL = new THREE.Mesh(armGeo, armMat);
  armL.position.set(-0.55, -0.1, 0);
  armL.rotation.z = Math.PI / 4;
  scene.add(armL);

  const armR = new THREE.Mesh(armGeo, armMat);
  armR.position.set(0.55, -0.1, 0);
  armR.rotation.z = -Math.PI / 4;
  scene.add(armR);

  // Stars
  const stars = [];
  const starGeo = new THREE.IcosahedronGeometry(0.04, 0);
  const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x3b82f6, emissiveIntensity: 1 });
  for (let i = 0; i < 10; i++) {
    const star = new THREE.Mesh(starGeo, starMat);
    const angle = (i / 10) * Math.PI * 2;
    star.position.set(Math.cos(angle) * 1.0, (Math.random() - 0.5) * 1.2, Math.sin(angle) * 0.3);
    star._baseAngle = angle;
    star._radius = 0.9 + Math.random() * 0.2;
    star._yOffset = (Math.random() - 0.5) * 1.2;
    scene.add(star);
    stars.push(star);
  }

  // Group for rotation
  const group = new THREE.Group();
  [helmet, visor, body, armL, armR].forEach(m => { scene.remove(m); group.add(m); });
  scene.add(group);

  let t = 0;
  function animateFn() {
    t += 0.016;
    group.position.y = Math.sin(t * 1.5) * 0.08;
    group.rotation.y += canvas._hovered ? 0.04 : 0.008;

    stars.forEach(star => {
      star._baseAngle += 0.008;
      star.position.x = Math.cos(star._baseAngle) * star._radius;
      star.position.z = Math.sin(star._baseAngle) * 0.3;
      star.position.y = star._yOffset + Math.sin(t * 2 + star._baseAngle) * 0.1;
    });

    renderer.render(scene, camera);
  }

  return { renderer, animateFn, pointLight };
}

// ── AVATAR 2: Hacker — Cyber Skull Bot (accent: neon green #22c55e) ──────────

function buildHackerAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#22c55e');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.6, metalness: 0.2 });

  const group = new THREE.Group();

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mat('#1a1a2e'));
  group.add(head);

  // Eyes
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.5 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeMat);
  eyeL.position.set(-0.2, 0.1, 0.42);
  group.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeMat);
  eyeR.position.set(0.2, 0.1, 0.42);
  group.add(eyeR);

  // Jaw
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.4), mat('#111122'));
  jaw.position.set(0, -0.46, 0.1);
  group.add(jaw);

  // Antenna
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6),
    mat('#334455')
  );
  antenna.position.set(0, 0.65, 0);
  group.add(antenna);

  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
  antennaTip.position.set(0, 0.93, 0);
  group.add(antennaTip);

  // Scanlines (4 thin planes)
  const scanlineMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e, transparent: true, opacity: 0.15, side: THREE.DoubleSide
  });
  const scanlines = [];
  for (let i = 0; i < 4; i++) {
    const sl = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.05), scanlineMat.clone());
    sl.position.set(0, 0.25 - i * 0.18, 0.42);
    group.add(sl);
    scanlines.push(sl);
  }

  scene.add(group);

  let t = 0;
  function animateFn() {
    t += 0.016;
    group.rotation.z = Math.sin(t * 1.2) * 0.12;
    group.rotation.y += canvas._hovered ? 0.04 : 0.006;

    // Eye pulse
    const pulse = 0.8 + Math.sin(t * 3) * 0.4;
    eyeL.material.emissiveIntensity = pulse;
    eyeR.material.emissiveIntensity = pulse;
    antennaTip.material.emissiveIntensity = pulse;

    // Scanline flicker
    scanlines.forEach((sl, i) => {
      sl.material.opacity = 0.05 + Math.abs(Math.sin(t * 4 + i * 1.2)) * 0.25;
    });

    renderer.render(scene, camera);
  }

  return { renderer, animateFn, pointLight };
}

// ── AVATAR 3: Builder — Blocky Robot (accent: purple #a855f7) ─────────────────

function buildBuilderAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#a855f7');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.5, metalness: 0.4 });

  const group = new THREE.Group();

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), mat('#2a1a4a'));
  torso.position.set(0, -0.1, 0);
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mat('#3a2a5a'));
  head.position.set(0, 0.55, 0);
  group.add(head);

  // Gear (torus on chest)
  const gear = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.06, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.3, metalness: 0.8, roughness: 0.2 })
  );
  gear.position.set(0, -0.05, 0.22);
  group.add(gear);

  // Arms
  const armMat = mat('#3a2a5a');
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.15), armMat);
  armL.position.set(-0.45, -0.15, 0);
  group.add(armL);
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.15), armMat);
  armR.position.set(0.45, -0.15, 0);
  group.add(armR);

  // Legs
  const legMat = mat('#2a1a4a');
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.18), legMat);
  legL.position.set(-0.17, -0.7, 0);
  group.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.18), legMat);
  legR.position.set(0.17, -0.7, 0);
  group.add(legR);

  // Rivets
  const rivetMat = mat('#a855f7');
  const rivetPositions = [
    [-0.32, 0.08, 0.22], [0.32, 0.08, 0.22],
    [-0.32, -0.3, 0.22], [0.32, -0.3, 0.22],
    [-0.18, -0.52, 0.22], [0.18, -0.52, 0.22],
  ];
  rivetPositions.forEach(([x, y, z]) => {
    const r = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), rivetMat);
    r.position.set(x, y, z);
    group.add(r);
  });

  // Blink light on head
  const blinkLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 2 })
  );
  blinkLight.position.set(0, 0.78, 0.26);
  group.add(blinkLight);

  scene.add(group);

  let t = 0;
  function animateFn() {
    t += 0.016;
    gear.rotation.z += 0.03;
    group.rotation.y += canvas._hovered ? 0.04 : 0.007;

    // Arm swing
    armL.rotation.x = Math.sin(t * 1.5) * 0.2;
    armR.rotation.x = -Math.sin(t * 1.5) * 0.2;

    // Blink
    const blink = t % 3 < 0.15 ? 0 : 2;
    blinkLight.material.emissiveIntensity = blink;

    renderer.render(scene, camera);
  }

  return { renderer, animateFn, pointLight };
}

// ── AVATAR 4: Defender — Armored Knight (accent: coral #f97316) ───────────────

function buildDefenderAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#f97316');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.3, metalness: 0.7 });

  const group = new THREE.Group();

  // Body (armor)
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.4, 0.9, 8),
    mat('#2a1a0a')
  );
  body.position.set(0, -0.2, 0);
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), mat('#3a2a1a'));
  head.position.set(0, 0.5, 0);
  group.add(head);

  // Visor
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.1, 0.15),
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 0.5, metalness: 0.8 })
  );
  visor.position.set(0, 0.52, 0.22);
  group.add(visor);

  // Shield
  const shield = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.65, 0.06),
    mat('#8B2200')
  );
  shield.position.set(0.45, 0, 0.3);
  shield.rotation.y = -0.3;
  group.add(shield);

  // Shield glow ring
  const shieldRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.04, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 1.5, transparent: true, opacity: 0.8 })
  );
  shieldRing.position.copy(shield.position);
  shieldRing.rotation.copy(shield.rotation);
  group.add(shieldRing);

  scene.add(group);

  let t = 0;
  function animateFn() {
    t += 0.016;
    group.rotation.z = Math.sin(t * 0.8) * 0.05;
    group.rotation.y += canvas._hovered ? 0.04 : 0.007;

    // Shield pulse
    const pulse = 0.5 + Math.sin(t * 2) * 0.5;
    shieldRing.material.emissiveIntensity = pulse * 2;
    shieldRing.scale.setScalar(1 + pulse * 0.1);
    shieldRing.material.opacity = 0.4 + pulse * 0.5;

    renderer.render(scene, camera);
  }

  return { renderer, animateFn, pointLight };
}

// ── AVATAR 5: Entrepreneur — Rocket (accent: gold #eab308) ────────────────────

function buildEntrepreneurAvatar(canvas) {
  const { renderer, scene, camera, pointLight } = _createBaseScene(canvas, '#eab308');
  const mat = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.4, metalness: 0.5 });

  const group = new THREE.Group();

  // Nose cone
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.45, 8),
    mat('#e0e0f0')
  );
  nose.position.set(0, 0.75, 0);
  group.add(nose);

  // Body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.7, 8),
    mat('#c0c8e0')
  );
  body.position.set(0, 0.25, 0);
  group.add(body);

  // Fins (3)
  const finMat = mat('#eab308');
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.15), finMat);
    const angle = (i / 3) * Math.PI * 2;
    fin.position.set(Math.cos(angle) * 0.22, -0.2, Math.sin(angle) * 0.22);
    fin.rotation.y = angle;
    group.add(fin);
  }

  // Flame
  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 2,
    transparent: true, opacity: 0.85
  });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.35, 8), flameMat);
  flame.position.set(0, -0.57, 0);
  flame.rotation.z = Math.PI;
  group.add(flame);

  // Torus rings (2)
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xeab308, emissive: 0xeab308, emissiveIntensity: 0.6,
    transparent: true, opacity: 0.7
  });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 8, 24), ringMat);
  ring1.position.set(0, 0.1, 0);
  scene.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 8, 24), ringMat.clone());
  ring2.position.set(0, -0.2, 0);
  ring2.rotation.x = Math.PI / 3;
  scene.add(ring2);

  scene.add(group);

  let t = 0;
  function animateFn() {
    t += 0.016;
    group.rotation.z = Math.sin(t * 1.0) * 0.08;
    group.rotation.y += canvas._hovered ? 0.04 : 0.008;
    group.position.y = Math.sin(t * 1.8) * 0.06;

    // Flame flicker
    const flicker = 0.85 + Math.random() * 0.3;
    flame.scale.setScalar(flicker);
    flame.material.emissiveIntensity = 1.5 + Math.random() * 1.5;

    // Ring orbit
    ring1.rotation.y = t * 0.8;
    ring2.rotation.y = -t * 0.6;
    ring2.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.2;

    renderer.render(scene, camera);
  }

  return { renderer, animateFn, pointLight };
}

// ── Avatar builder map ────────────────────────────────────────────────────────

const AVATAR_BUILDERS = {
  explorer:     buildExplorerAvatar,
  hacker:       buildHackerAvatar,
  builder:      buildBuilderAvatar,
  defender:     buildDefenderAvatar,
  entrepreneur: buildEntrepreneurAvatar,
};
```

- [ ] **Step 1: Create js/avatars.js with the full content above**

**Scope note:** The spec describes four interaction behaviors (idle, hover speed, selected-state, mouse-tilt). This plan implements idle animation and hover speed-up only. Selected-state (active persona avatar spins fast with brighter light) and mouse-move tilt (±15° toward cursor) are deferred to a later plan. The implementer should not add them now.

- [ ] **Step 2: Open index.html in browser on desktop**

Expected: Each of the 5 persona cards shows a 3D animated character.
- Explorer: astronaut with orbiting stars
- Hacker: green-eyed skull bot with flickering scanlines
- Builder: purple blocky robot with spinning gear
- Defender: armored knight with pulsing shield ring
- Entrepreneur: rocket with flame and orbiting rings

All 5 should animate continuously. Hovering a card makes it spin faster.

- [ ] **Step 3: Test mobile fallback**

In Chrome DevTools, set viewport to 375px wide. Canvases should hide and emoji icons should display instead. Performance tab should show no Three.js frames being rendered.

- [ ] **Step 4: Run tests/index.html**

All 16 tests still pass. avatars.js has no exported symbols that affect xp.js or persona.js.

- [ ] **Step 5: Commit**

```bash
git add js/avatars.js
git commit -m "feat: add Three.js 3D persona avatars (astronaut, skull-bot, robot, knight, rocket)"
```

---

## Task 7: explorer.html — Full Career Explorer Hub

**Files:**
- Replace: `explorer.html`

This replaces the "Coming Soon" stub entirely.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- No-flash theme: runs synchronously before CSS paint -->
  <script>
    if (localStorage.getItem('cyberspark_theme') === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberSpark — Explorer Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>
  <nav id="site-nav"></nav>
  <main id="main-content">

    <!-- Hero Banner -->
    <section class="hero">
      <div class="container hero-content">
        <span class="hero-eyebrow">Careers · Salaries · Your Path</span>
        <h1 class="hero-title">Explorer <span>Hub</span></h1>
        <p class="hero-subtitle">
          Discover the careers that will shape the future — and exactly how to get there.
        </p>
        <div class="stat-strip">
          <div class="stat-chip animate-fade-in">
            <div class="stat-number" id="xp-earned-display">0 XP</div>
            <div class="stat-label">Earned exploring this page</div>
          </div>
          <div class="stat-chip animate-fade-in" style="animation-delay:100ms">
            <div class="stat-number">8</div>
            <div class="stat-label">Career paths to explore</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Career Cards Grid -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>8 Careers That Will Define the Future</h2>
          <p>Expand each card for a day-in-the-life and your first action step. <strong>Each card earns 10 XP.</strong></p>
        </div>
        <div class="grid-4" id="career-grid" style="margin-top:1.5rem">
          <!-- Rendered by JS below -->
        </div>
      </div>
    </section>

    <!-- Career Path Timeline -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-header">
          <h2>Your Path: Grade 9 → First Job</h2>
          <p>No degree required. Here's the realistic roadmap.</p>
        </div>
        <div class="timeline" style="margin-top:2rem; max-width:640px">
          <div class="timeline-node">
            <div class="timeline-year">Grade 9–10</div>
            <div class="timeline-title">Start Exploring</div>
            <div class="timeline-desc">Take your school's CS class. Create a free TryHackMe account. Watch YouTube channels like NetworkChuck and LiveOverflow.</div>
          </div>
          <div class="timeline-node">
            <div class="timeline-year">Grade 11</div>
            <div class="timeline-title">First Certification</div>
            <div class="timeline-desc">CompTIA IT Fundamentals (ITF+) — free through many school voucher programs. Compete in your first CTF (Capture the Flag) contest.</div>
          </div>
          <div class="timeline-node">
            <div class="timeline-year">Grade 12</div>
            <div class="timeline-title">Build Your Portfolio</div>
            <div class="timeline-desc">Learn Python basics on freeCodeCamp (free). Start a GitHub account and push your first project. This is your resume.</div>
          </div>
          <div class="timeline-node">
            <div class="timeline-year">Year 1</div>
            <div class="timeline-title">College / Self-Study</div>
            <div class="timeline-desc">CompTIA Security+ certification (~$400 or employer-sponsored). Land an internship or start a bug bounty account on HackerOne.</div>
          </div>
          <div class="timeline-node">
            <div class="timeline-year">Years 2–3</div>
            <div class="timeline-title">Specialize</div>
            <div class="timeline-desc">Pick your lane: cloud security, penetration testing, AI engineering, or forensics. Build 2–3 real projects. Contribute to open source.</div>
          </div>
          <div class="timeline-node">
            <div class="timeline-year">First Job</div>
            <div class="timeline-title">🎉 You're Hired</div>
            <div class="timeline-desc">Junior Security Analyst or Junior AI Engineer. Starting salary: $75K–$100K. Fully remote options available from day one.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why This Field -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-header">
          <h2>Why Cybersecurity + AI?</h2>
        </div>
        <div class="grid-3" style="margin-top:1.5rem">
          <div class="card explorer-stat">
            <div class="stat-big">3.5 Million</div>
            <div class="stat-label" style="font-size:0.9rem;margin-top:0.5rem;color:var(--color-text)">Cybersecurity jobs unfilled globally by 2025</div>
            <div class="stat-source">— ISC² Cybersecurity Workforce Study, 2023</div>
          </div>
          <div class="card explorer-stat">
            <div class="stat-big">#1 + #2</div>
            <div class="stat-label" style="font-size:0.9rem;margin-top:0.5rem;color:var(--color-text)">AI and cybersecurity are the fastest-growing tech careers</div>
            <div class="stat-source">— LinkedIn Emerging Jobs Report, 2024</div>
          </div>
          <div class="card explorer-stat">
            <div class="stat-big">60%</div>
            <div class="stat-label" style="font-size:0.9rem;margin-top:0.5rem;color:var(--color-text)">Of cybersecurity roles allow full remote work</div>
            <div class="stat-source">— Flexjobs Remote Work Report, 2023</div>
          </div>
        </div>
      </div>
    </section>

  </main>
  <footer id="site-footer"></footer>
  <div id="toast-container"></div>
  <script src="js/xp.js"></script>
  <script src="js/persona.js"></script>
  <script src="js/nav.js"></script>
  <script>
// ── Career data ────────────────────────────────────────────────────────────────
const CAREERS = [
  {
    id: 'pentester',
    title: 'Penetration Tester',
    salary: '$85K–$140K',
    salaryClass: 'salary-mid',
    desc: 'Hack systems legally. Find vulnerabilities before the bad guys do.',
    skills: ['Networking', 'Python', 'Critical Thinking'],
    dayInLife: 'Your morning starts with a target scope document from a client who hired you to break into their systems. You map their network, probe for open ports, and craft a phishing email to test their employees. By afternoon you\'ve found a SQL injection flaw and documented the full attack chain. You write a report that helps them fix everything before a real attacker finds it.',
    startLink: 'https://tryhackme.com',
    startLabel: 'Start on TryHackMe →',
  },
  {
    id: 'analyst',
    title: 'Security Analyst',
    salary: '$75K–$115K',
    salaryClass: 'salary-mid',
    desc: 'Monitor, detect, and respond to real threats in real time.',
    skills: ['SIEM', 'Incident Response', 'Communication'],
    dayInLife: 'You monitor a Security Operations Center (SOC) dashboard that ingests 10,000 events per minute. An alert fires — unusual login patterns from a foreign IP. You investigate, correlate logs, and confirm it\'s a compromised account. You isolate the machine, reset credentials, and document the incident timeline. Your quick response stopped a data breach.',
    startLink: 'https://www.cybrary.it',
    startLabel: 'Start on Cybrary →',
  },
  {
    id: 'ai_engineer',
    title: 'AI / ML Engineer',
    salary: '$110K–$175K',
    salaryClass: 'salary-high',
    desc: 'Build the models that power the future. Python, math, and creativity.',
    skills: ['Python', 'Math', 'Data Science'],
    dayInLife: 'You\'re training a model to detect malware from behavioral patterns rather than signatures. You clean a dataset of 2 million samples, tune hyperparameters, and evaluate false positive rates. After a breakthrough in precision, you deploy the model to a production pipeline where it now screens 50 million files per day — automatically.',
    startLink: 'https://www.coursera.org/learn/machine-learning',
    startLabel: 'Start on Coursera →',
  },
  {
    id: 'forensics',
    title: 'Digital Forensics Investigator',
    salary: '$70K–$110K',
    salaryClass: 'salary-mid',
    desc: 'Recover evidence from devices. Solve digital crimes.',
    skills: ['Evidence Analysis', 'Legal Knowledge', 'Attention to Detail'],
    dayInLife: 'A law firm hands you a seized laptop from a fraud case. Using write-blockers to preserve evidence integrity, you clone the drive and begin forensic analysis. You recover deleted files, reconstruct browser history, and find encrypted communications. Your report becomes the key exhibit in a federal prosecution.',
    startLink: 'https://www.sans.org/cyber-ranges/',
    startLabel: 'Start on SANS Cyber Ranges →',
  },
  {
    id: 'cloud_security',
    title: 'Cloud Security Architect',
    salary: '$120K–$180K',
    salaryClass: 'salary-high',
    desc: 'Design zero-trust infrastructure for AWS and Azure at scale.',
    skills: ['AWS/Azure', 'Zero Trust', 'Architecture'],
    dayInLife: 'A fintech startup needs to move to AWS without compromising SOC 2 compliance. You design the VPC network, configure IAM policies with least-privilege, set up CloudTrail logging, and build a secrets rotation system using AWS Secrets Manager. When the audit team arrives three months later, zero findings.',
    startLink: 'https://aws.amazon.com/training/learn-about/security/',
    startLabel: 'Start on AWS Training →',
  },
  {
    id: 'ciso',
    title: 'CISO',
    salary: '$150K–$250K',
    salaryClass: 'salary-high',
    desc: 'Lead the entire security strategy for an organization.',
    skills: ['Leadership', 'Risk Management', 'Business Strategy'],
    dayInLife: 'You present a risk report to the board of directors: three critical vulnerabilities, remediation timelines, and projected cost of inaction. After the meeting, you approve a $2M security budget, negotiate a cyber insurance policy, and sign off on the company\'s first Zero Trust architecture roadmap. You bridge technical reality with business impact daily.',
    startLink: 'https://www.isaca.org/credentialing/cism',
    startLabel: 'Explore CISM Certification →',
  },
  {
    id: 'devops_sec',
    title: 'DevSecOps Engineer',
    salary: '$100K–$155K',
    salaryClass: 'salary-high',
    desc: 'Embed security into every stage of the software delivery pipeline.',
    skills: ['CI/CD', 'Docker', 'Security Testing'],
    dayInLife: 'You\'re adding a static analysis stage to a GitHub Actions pipeline that scans every pull request for secrets and vulnerable dependencies. When a developer accidentally commits an AWS key, your pipeline blocks the merge and fires a Slack alert before it ever reaches production. You shift security left so developers catch issues in seconds, not weeks.',
    startLink: 'https://learn.microsoft.com/en-us/training/paths/devsecops-foundations/',
    startLabel: 'Start on Microsoft Learn →',
  },
  {
    id: 'entrepreneur',
    title: 'Cybersecurity Entrepreneur',
    salary: '$0–$unlimited',
    salaryClass: 'salary-high',
    desc: 'Build the companies that protect the world. Vision + hustle.',
    skills: ['Vision', 'Sales', 'Technical Depth'],
    dayInLife: 'You founded a startup that uses AI to automatically detect deepfake voices in executive calls — a $50B fraud problem. Your morning is a product demo for a Fortune 500 CISO. The afternoon is a call with your Series A lead investor. By evening you\'re reviewing a new model trained on 1 million synthetic audio samples. The market doesn\'t exist yet — you\'re building it.',
    startLink: 'https://www.ycombinator.com/library',
    startLabel: 'Explore Y Combinator Library →',
  },
];

// ── Track XP earned on this page ──────────────────────────────────────────────
let pageXpEarned = 0;

function _addPageXP(amount, reason) {
  awardXP(amount, reason);
  pageXpEarned += amount;
  const el = document.getElementById('xp-earned-display');
  if (el) el.textContent = pageXpEarned + ' XP';
}

// ── Render career cards ────────────────────────────────────────────────────────
function renderCareerCards() {
  const grid = document.getElementById('career-grid');
  if (!grid) return;

  grid.innerHTML = CAREERS.map(c => `
    <div class="card career-card" id="card-${c.id}">
      <h3 style="font-size:1rem">${c.title}</h3>
      <div class="salary-bar ${c.salaryClass}" title="Salary range"></div>
      <div style="font-size:0.75rem;color:var(--color-text-muted);margin-bottom:0.25rem;font-family:var(--font-mono)">${c.salary}</div>
      <p style="font-size:0.8rem;color:var(--color-text-muted);margin-bottom:0.5rem">${c.desc}</p>
      <div class="career-skills">
        ${c.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
      <button class="career-expand-btn" data-career="${c.id}">
        ▼ Explore this career (+10 XP)
      </button>
      <div class="career-details" id="details-${c.id}">
        <p>${c.dayInLife}</p>
        <a href="${c.startLink}" target="_blank" rel="noopener" class="start-today-btn" data-career="${c.id}">
          ${c.startLabel}
        </a>
      </div>
    </div>
  `).join('');

  // Expand buttons
  document.querySelectorAll('.career-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.career;
      _expandCareer(id, btn);
    });
  });

  // "How to start today" buttons — award 5 XP on click
  document.querySelectorAll('.start-today-btn').forEach(link => {
    link.addEventListener('click', () => {
      const key = 'cyberspark_start_' + link.dataset.career;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, '1');
        _addPageXP(5, 'how_to_start');
      }
    });
  });
}

function _expandCareer(id, btn) {
  const details = document.getElementById('details-' + id);
  if (!details) return;

  const isOpen = details.classList.contains('open');
  if (isOpen) {
    details.classList.remove('open');
    btn.textContent = '▼ Explore this career (+10 XP)';
    return;
  }

  details.classList.add('open');
  btn.textContent = '▲ Close';

  // Award XP first time this career is expanded
  const key = 'cyberspark_career_explored_' + id;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, '1');
    _addPageXP(10, 'career_expand');

    // Increment career_explorer counter
    let count = parseInt(localStorage.getItem('cyberspark_careers_explored') || '0', 10);
    count += 1;
    localStorage.setItem('cyberspark_careers_explored', String(count));
    checkBadges();
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  markPageVisited('explorer.html'); // awards 5 XP on first visit (handled by xp.js)
  renderCareerCards();
});
  </script>
</body>
</html>
```

- [ ] **Step 1: Replace explorer.html entirely with the content above**

- [ ] **Step 2: Open explorer.html in browser**

Verify:
1. Hero banner shows "Explorer Hub" heading
2. Stat strip shows "0 XP / 8 Career paths"
3. Career grid shows 8 cards in a 4-column grid (desktop)
4. Each card shows title, salary bar (green for high-paying, gold for mid), description, 3 skill tags
5. Click "Explore this career" → details panel expands, shows day-in-the-life text and "How to start today" link
6. XP counter in hero stat chip increases by 10 on first expand
7. "How to start today" link awards 5 XP (check `cyberspark_xp` in localStorage)
8. Expanding all 8 cards: `cyberspark_careers_explored` reaches 8, `career_explorer` badge is awarded (toast appears)
9. Career path timeline renders correctly with 6 nodes
10. Three stat cards at bottom show correctly
11. Back button to index.html — XP is persisted in localStorage

- [ ] **Step 3: Verify XP persistence across pages**

Note XP total on explorer.html. Navigate to index.html. XP badge in nav should show the same total.

- [ ] **Step 4: Run tests/index.html**

All 16 tests pass.

- [ ] **Step 5: Commit**

```bash
git add explorer.html
git commit -m "feat: build Explorer Hub with 8 career cards, timeline, stats, and XP rewards"
```

---

## Final Verification

- [ ] **Open index.html**

Checklist:
- Theme toggle button visible in nav
- Persona picker shows `.persona-grid` layout (5 cards across on desktop)
- Each card has an animated Three.js avatar
- Selecting a persona triggers the welcome toast and avatar re-renders
- Switching to light mode: background goes light grey, text goes dark, avatars still render

- [ ] **Open explorer.html**

Checklist:
- Theme toggle works on this page too (light mode persisted from index.html)
- Career cards render in grid-4 layout
- All XP awards fire correctly
- Timeline is readable
- Stats section has 3 large cards

- [ ] **Open tests/index.html**

All 16 tests pass. No regressions.

- [ ] **Final commit if anything was missed**

```bash
git add -p
git commit -m "fix: final plan 2 cleanup"
```
