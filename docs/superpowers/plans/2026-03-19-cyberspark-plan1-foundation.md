# CyberSpark — Plan 1: Foundation & Core Systems

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete project scaffold, CSS design system, shared JavaScript systems (persona, XP/badges, nav), and the home page — everything that all subsequent pages depend on.

**Architecture:** Multi-page static site with no build tools. All HTML pages share a CSS design system via `<link>` tags and shared JS via `<script>` tags. State is managed entirely via `localStorage` with the `cyberspark_` prefix. Testing uses a browser-loadable `tests/index.html` that runs a minimal vanilla JS test harness.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), Google Fonts (CDN), Lucide Icons (CDN). No npm, no bundler, no framework.

**Subsequent Plans:**
- Plan 2: Hacker Lab & Defender HQ (mini-games + threat scenarios)
- Plan 3: Explorer Hub, Builder Studio, Career Quiz, Achievements
- Plan 4: AI Entrepreneur Lab & About/Pitch Page

---

## File Map

| File | Responsibility |
|---|---|
| `index.html` | Home page: hero, persona picker, section cards, stat strip |
| `explorer.html` | Explorer Hub shell (empty, filled in Plan 3) |
| `hacker.html` | Hacker Lab shell (empty, filled in Plan 2) |
| `builder.html` | Builder Studio shell (empty, filled in Plan 3) |
| `defender.html` | Defender HQ shell (empty, filled in Plan 2) |
| `entrepreneur.html` | Entrepreneur Lab shell (empty, filled in Plan 4) |
| `quiz.html` | Career Quiz shell (empty, filled in Plan 3) |
| `achievements.html` | Achievements shell (empty, filled in Plan 3) |
| `about.html` | About/Pitch shell (empty, filled in Plan 4) |
| `css/main.css` | CSS custom properties, reset, typography, layout grid |
| `css/components.css` | Cards, buttons, badges, form elements, hero banners |
| `css/animations.css` | Particle hero, badge unlock toast, progress bar fills, hover glows |
| `js/persona.js` | Persona data, selection, localStorage persistence, home page reordering |
| `js/xp.js` | XP award function, badge registry, badge unlock checker, toast trigger |
| `js/nav.js` | Shared nav HTML, persona badge display, XP counter, page-visited tracking, mobile menu |
| `tests/index.html` | Browser-loadable test runner |
| `tests/test-xp.js` | Tests for xp.js logic |
| `tests/test-persona.js` | Tests for persona.js logic |
| `README.md` | Setup, usage, contribution guide |
| `LICENSE` | MIT license |
| `.nojekyll` | GitHub Pages: disables Jekyll so files like `_` prefixed assets work |

---

## Task 1: Project Scaffold

**Files:**
- Create: all HTML shells, `css/`, `js/`, `assets/icons/`, `assets/badges/`, `assets/images/`, `tests/`
- Create: `README.md`, `LICENSE`, `.nojekyll`

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p css js/games assets/icons assets/badges assets/images tests
```

- [ ] **Step 2: Create `.nojekyll`**

Create an empty file at `.nojekyll` (required for GitHub Pages to serve files with underscores in their name without Jekyll interference).

```bash
touch .nojekyll
```

- [ ] **Step 3: Create `LICENSE`**

Create `LICENSE` with MIT license text, author "David Broggy", year 2026.

- [ ] **Step 4: Create `README.md`**

```markdown
# CyberSpark

A free, open-source platform inspiring students in grades 6–12 to explore careers
in cybersecurity and AI. No accounts. No data collection. Works in any browser.

## Quick Start

1. Clone or download this repository.
2. Open `index.html` in any modern browser.
3. No build step, no server, no npm required.

## Deploy to GitHub Pages

1. Push to GitHub.
2. Go to Settings → Pages → Source: Deploy from branch → main → / (root).
3. Your site will be live at `https://[username].github.io/cyber-spark/`.

## Classroom Leaderboard Note

The class session leaderboard works on a single device (teacher's browser).
It uses localStorage and cannot sync across multiple student devices.
This is intentional — no server required.

## Contributing

- Open an issue to suggest a new career card, game, or business idea.
- Fork and submit a PR — content lives in plain JS data files, no framework needed.

## License

MIT — David Broggy, 2026
```

- [ ] **Step 5: Create all HTML shell pages**

Each shell page (`index.html`, `explorer.html`, `hacker.html`, `builder.html`, `defender.html`, `entrepreneur.html`, `quiz.html`, `achievements.html`, `about.html`) gets this identical boilerplate — only `<title>` and `<h1>` differ per page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberSpark — [Page Name]</title>
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
    <h1>[Page Name] — Coming Soon</h1>
  </main>
  <footer id="site-footer"></footer>
  <div id="toast-container"></div>
  <script src="js/xp.js"></script>
  <script src="js/persona.js"></script>
  <script src="js/nav.js"></script>
</body>
</html>
```

Page titles:
- `index.html` → "CyberSpark — Home"
- `explorer.html` → "CyberSpark — Explorer Hub"
- `hacker.html` → "CyberSpark — Hacker Lab"
- `builder.html` → "CyberSpark — Builder Studio"
- `defender.html` → "CyberSpark — Defender HQ"
- `entrepreneur.html` → "CyberSpark — AI Entrepreneur Lab"
- `quiz.html` → "CyberSpark — Career Quiz"
- `achievements.html` → "CyberSpark — Achievements"
- `about.html` → "CyberSpark — About"

- [ ] **Step 6: Create empty CSS and JS files**

Create these empty files (content added in later tasks):
`css/main.css`, `css/components.css`, `css/animations.css`,
`js/xp.js`, `js/persona.js`, `js/nav.js`

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: project scaffold — all HTML shells, directories, README, LICENSE"
```

---

## Task 2: CSS Design System — `css/main.css`

**Files:**
- Write: `css/main.css`

- [ ] **Step 1: Write `css/main.css`**

```css
/* === CSS Custom Properties === */
:root {
  /* Colors */
  --color-bg:          #0f172a;
  --color-surface:     #1e293b;
  --color-surface-2:   #263348;
  --color-border:      #334155;
  --color-blue:        #3b82f6;
  --color-green:       #22c55e;
  --color-gold:        #f59e0b;
  --color-coral:       #f97316;
  --color-purple:      #a855f7;
  --color-text:        #f8fafc;
  --color-text-muted:  #94a3b8;

  /* Persona accent (overridden per persona via JS class on body) */
  --color-accent:      var(--color-blue);

  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Spacing */
  --space-xs:  0.25rem;
  --space-sm:  0.5rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xl:  2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Transitions */
  --transition: 200ms ease;
  --transition-slow: 400ms ease;
}

/* Persona accent color overrides — added to <body> by persona.js */
body.persona-explorer  { --color-accent: var(--color-blue); }
body.persona-hacker    { --color-accent: var(--color-green); }
body.persona-builder   { --color-accent: var(--color-purple); }
body.persona-defender  { --color-accent: var(--color-coral); }
body.persona-entrepreneur { --color-accent: var(--color-gold); }

/* === Reset === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font: inherit; border: none; background: none; }
ul, ol { list-style: none; }
input, textarea, select { font: inherit; }

/* === Base === */
html { font-size: 16px; scroll-behavior: smooth; }

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.6;
  min-height: 100vh;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: 1.2;
  font-weight: 700;
}

h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); }
h3 { font-size: clamp(1.125rem, 2vw, 1.5rem); }

code, pre, .mono {
  font-family: var(--font-mono);
  font-size: 0.9em;
}

/* === Layout === */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-lg); }

@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .container { padding: 0 var(--space-md); }
}

/* === Utilities === */
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
.text-muted { color: var(--color-text-muted); }
.text-accent { color: var(--color-accent); }
.text-center { text-align: center; }
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }
.mt-sm { margin-top: var(--space-sm); }
.mt-md { margin-top: var(--space-md); }
.mt-lg { margin-top: var(--space-lg); }
.mt-xl { margin-top: var(--space-xl); }
.section { padding: var(--space-3xl) 0; }
```

- [ ] **Step 2: Open `index.html` in browser and verify**

The page should load with a dark navy background and no visible errors in the browser console. Font load may take a second on first visit.

- [ ] **Step 3: Commit**

```bash
git add css/main.css
git commit -m "feat: CSS design system — custom properties, reset, typography, layout, utilities"
```

---

## Task 3: CSS Components — `css/components.css`

**Files:**
- Write: `css/components.css`

- [ ] **Step 1: Write `css/components.css`**

```css
/* === Navigation === */
#site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 var(--space-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.nav-logo {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
  transition: color var(--transition);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.nav-links a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.nav-links a:hover,
.nav-links a.active { color: var(--color-text); }

.nav-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.xp-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--font-mono);
  color: var(--color-gold);
}

.persona-chip {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--color-surface);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-full);
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-accent);
  cursor: pointer;
  transition: background var(--transition);
}

.persona-chip:hover { background: var(--color-surface-2); }

/* Mobile nav */
.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: var(--space-xs);
}

.nav-hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: var(--transition);
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-links.open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-lg);
    gap: var(--space-md);
  }
  .nav-hamburger { display: flex; }
}

/* === Cards === */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
}

.card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 20%, transparent);
  transform: translateY(-2px);
}

.card-accent {
  border-color: var(--color-accent);
  box-shadow: 0 0 24px rgba(59, 130, 246, 0.1);
}

/* === Buttons === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  border-radius: var(--radius-sm);
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all var(--transition);
  cursor: pointer;
}

.btn-primary {
  background: var(--color-accent);
  color: #000;
}

.btn-primary:hover { filter: brightness(1.15); }

.btn-outline {
  border: 1.5px solid var(--color-accent);
  color: var(--color-accent);
  background: transparent;
}

.btn-outline:hover {
  background: var(--color-accent);
  color: #000;
}

.btn-ghost {
  color: var(--color-text-muted);
  background: transparent;
}

.btn-ghost:hover { color: var(--color-text); background: var(--color-surface); }

.btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8rem; }
.btn-lg { padding: 0.875rem 1.75rem; font-size: 1rem; }

/* === Hero Banner === */
.hero {
  position: relative;
  overflow: hidden;
  padding: var(--space-3xl) 0;
  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%);
  border-bottom: 1px solid var(--color-border);
}

.hero-content { position: relative; z-index: 1; }

.hero-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.hero-title { color: var(--color-text); }

.hero-title span { color: var(--color-accent); }

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin-top: var(--space-md);
}

/* === Stat Chips === */
.stat-strip {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.stat-chip {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-lg);
  min-width: 180px;
}

.stat-chip .stat-number {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-accent);
}

.stat-chip .stat-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: var(--space-xs);
}

/* === Badges === */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.badge-earned {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(59, 130, 246, 0.1);
}

/* === Progress Bar === */
.progress-bar-wrap {
  background: var(--color-surface);
  border-radius: var(--radius-full);
  height: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-purple));
  border-radius: var(--radius-full);
  transition: width 600ms ease;
  width: 0%;
}

/* === Toast Notification === */
#toast-container {
  position: fixed;
  bottom: var(--space-xl);
  right: var(--space-xl);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.toast {
  background: var(--color-surface);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-lg);
  min-width: 280px;
  max-width: 360px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  animation: toastIn 300ms ease forwards;
}

.toast-title {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-accent);
}

.toast-body { font-size: 0.8rem; color: var(--color-text-muted); margin-top: var(--space-xs); }

/* === Section Divider === */
.section-header { margin-bottom: var(--space-xl); }
.section-header h2 { color: var(--color-text); }
.section-header p { color: var(--color-text-muted); margin-top: var(--space-sm); }

/* === Footer === */
#site-footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-xl) 0;
  margin-top: var(--space-3xl);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.footer-copy { font-size: 0.8rem; color: var(--color-text-muted); }

.footer-links {
  display: flex;
  gap: var(--space-lg);
}

.footer-links a {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.footer-links a:hover { color: var(--color-accent); }
```

- [ ] **Step 2: Open `index.html` in browser — no console errors**

- [ ] **Step 3: Commit**

```bash
git add css/components.css
git commit -m "feat: CSS components — nav, cards, buttons, hero, badges, toast, footer"
```

---

## Task 4: CSS Animations — `css/animations.css`

**Files:**
- Write: `css/animations.css`

- [ ] **Step 1: Write `css/animations.css`**

```css
/* === Keyframes === */
@keyframes toastIn {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes toastOut {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(20px); }
}

@keyframes badgePulse {
  0%   { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); }
  70%  { box-shadow: 0 0 0 12px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}

@keyframes particleDrift {
  0%   { transform: translate(0, 0) scale(1);   opacity: 0.6; }
  50%  { transform: translate(var(--dx), var(--dy)) scale(1.2); opacity: 1; }
  100% { transform: translate(0, 0) scale(1);   opacity: 0.6; }
}

@keyframes countUp {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}

/* === Particle Hero Background === */
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-accent);
  opacity: 0.4;
  animation: particleDrift var(--duration, 8s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}

/* === Utility Animation Classes === */
.animate-fade-in      { animation: fadeIn 400ms ease forwards; }
.animate-float        { animation: float 3s ease-in-out infinite; }
.badge-pulse          { animation: badgePulse 600ms ease; }

/* === Page Transition === */
main#main-content { animation: fadeIn 300ms ease forwards; }

/* === Toast dismissal === */
.toast.dismissing { animation: toastOut 300ms ease forwards; }

/* === Persona card selection glow === */
.persona-card {
  transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition-slow);
}

.persona-card:hover {
  transform: translateY(-4px) scale(1.02);
}

.persona-card.selected {
  border-color: var(--color-accent);
  box-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 35%, transparent);
}

/* === Game feedback === */
.correct-flash {
  animation: badgePulse 400ms ease;
  border-color: var(--color-green) !important;
}

.wrong-shake {
  animation: shake 300ms ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/animations.css
git commit -m "feat: CSS animations — particles, toast, badge pulse, page fade, game feedback"
```

---

## Task 5: XP & Badge System — `js/xp.js`

**Files:**
- Write: `js/xp.js`
- Write: `tests/test-xp.js`
- Write: `tests/index.html`

- [ ] **Step 1: Write the test harness `tests/index.html` first**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CyberSpark Tests</title>
  <style>
    body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 2rem; }
    h1 { color: #3b82f6; margin-bottom: 1rem; }
    .pass { color: #22c55e; }
    .fail { color: #f97316; }
    .suite { margin-top: 1.5rem; font-size: 1.1rem; font-weight: bold; }
    #summary { margin-top: 2rem; font-size: 1.25rem; font-weight: bold; }
  </style>
</head>
<body>
  <h1>CyberSpark Test Runner</h1>
  <div id="results"></div>
  <div id="summary"></div>
  <script>
    // Minimal test harness
    let passed = 0, failed = 0;
    const out = document.getElementById('results');
    function describe(name, fn) {
      const div = document.createElement('div');
      div.className = 'suite';
      div.textContent = name;
      out.appendChild(div);
      fn();
    }
    function it(name, fn) {
      const div = document.createElement('div');
      try {
        fn();
        div.className = 'pass';
        div.textContent = '  ✓ ' + name;
        passed++;
      } catch(e) {
        div.className = 'fail';
        div.textContent = '  ✗ ' + name + ' — ' + e.message;
        failed++;
      }
      out.appendChild(div);
    }
    function expect(val) {
      return {
        toBe: (expected) => {
          if (val !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
        },
        toEqual: (expected) => {
          if (JSON.stringify(val) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
        },
        toBeTruthy: () => { if (!val) throw new Error(`Expected truthy, got ${val}`); },
        toBeFalsy: () => { if (val) throw new Error(`Expected falsy, got ${val}`); },
        toContain: (item) => {
          if (!val.includes(item)) throw new Error(`Expected array to contain ${JSON.stringify(item)}`);
        },
        toBeGreaterThan: (n) => { if (!(val > n)) throw new Error(`Expected ${val} > ${n}`); }
      };
    }
    window.addEventListener('load', () => {
      const s = document.getElementById('summary');
      s.textContent = `${passed} passed, ${failed} failed`;
      s.style.color = failed === 0 ? '#22c55e' : '#f97316';
    });
  </script>
  <script src="../js/xp.js"></script>
  <script src="test-xp.js"></script>
  <script src="../js/persona.js"></script>
  <script src="test-persona.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write the failing tests `tests/test-xp.js`**

```javascript
describe('XP System', () => {
  // Reset localStorage before each test group
  localStorage.clear();

  it('awardXP increases cyberspark_xp in localStorage', () => {
    localStorage.setItem('cyberspark_xp', '0');
    awardXP(25, 'test');
    expect(parseInt(localStorage.getItem('cyberspark_xp'))).toBe(25);
  });

  it('awardXP accumulates multiple awards', () => {
    localStorage.setItem('cyberspark_xp', '0');
    awardXP(25, 'first');
    awardXP(50, 'second');
    expect(parseInt(localStorage.getItem('cyberspark_xp'))).toBe(75);
  });

  it('getXP returns current XP total', () => {
    localStorage.setItem('cyberspark_xp', '100');
    expect(getXP()).toBe(100);
  });

  it('getXP returns 0 if not set', () => {
    localStorage.removeItem('cyberspark_xp');
    expect(getXP()).toBe(0);
  });

  it('getBadges returns empty array if none earned', () => {
    localStorage.removeItem('cyberspark_badges');
    expect(getBadges()).toEqual([]);
  });

  it('hasBadge returns false for unearned badge', () => {
    localStorage.setItem('cyberspark_badges', '[]');
    expect(hasBadge('first_cipher')).toBeFalsy();
  });

  it('BADGE_REGISTRY contains all 17 defined badges', () => {
    expect(BADGE_REGISTRY.length).toBe(17);
  });

  it('BADGE_REGISTRY badge has required fields', () => {
    const badge = BADGE_REGISTRY[0];
    expect(typeof badge.id).toBe('string');
    expect(typeof badge.name).toBe('string');
    expect(typeof badge.icon).toBe('string');
    expect(typeof badge.unlockFn).toBe('function');
  });
});
```

- [ ] **Step 3: Open `tests/index.html` in browser — all XP tests should FAIL (functions not defined)**

- [ ] **Step 4: Write `js/xp.js`**

```javascript
/**
 * xp.js — XP award system and badge registry for CyberSpark.
 *
 * Public API:
 *   awardXP(amount, reason)  — adds XP, checks badges, updates nav display
 *   getXP()                  — returns current XP total (number)
 *   getBadges()              — returns array of earned badge IDs
 *   hasBadge(id)             — returns true if badge is earned
 *   checkBadges()            — evaluates all badges, unlocks any newly met
 *   BADGE_REGISTRY           — array of all badge definitions
 */

// ── XP Award Table (from spec) ──────────────────────────────────────────────
const XP_AWARDS = {
  PERSONA_SELECT:        10,
  PAGE_VISIT:             5,
  CIPHER_TIER1:          25,
  CIPHER_TIER2:          50,
  CIPHER_TIER3:         100,
  PHISHING_ROUND:        40,
  PASSWORD_ARENA:        30,
  BINARY_DECODER:        20,
  THREAT_SCENARIO:       50,
  SECURITY_CHECKLIST:    15,
  CAREER_QUIZ:           60,
  PROMPT_COPY:            5,   // max 10 per session, tracked in memory
  IDEA_GENERATE:         15,
  PITCH_FORM:            40,
  BADGE_BONUS:           25,
};

// In-memory session cap for prompt copies (resets on page refresh)
let sessionPromptsCopied = 0;

// ── Public XP functions ──────────────────────────────────────────────────────
function getXP() {
  return parseInt(localStorage.getItem('cyberspark_xp') || '0', 10);
}

function awardXP(amount, reason) {
  if (amount <= 0) return;
  const newTotal = getXP() + amount;
  localStorage.setItem('cyberspark_xp', String(newTotal));
  _updateNavXP(newTotal);
  checkBadges();
}

function awardPromptCopyXP() {
  if (sessionPromptsCopied >= 10) return;
  sessionPromptsCopied++;
  const count = parseInt(localStorage.getItem('cyberspark_prompts_copied') || '0', 10) + 1;
  localStorage.setItem('cyberspark_prompts_copied', String(count));
  awardXP(XP_AWARDS.PROMPT_COPY, 'prompt_copy');
}

// ── Badge functions ──────────────────────────────────────────────────────────
function getBadges() {
  try {
    return JSON.parse(localStorage.getItem('cyberspark_badges') || '[]');
  } catch {
    return [];
  }
}

function hasBadge(id) {
  return getBadges().includes(id);
}

function _grantBadge(badge) {
  const earned = getBadges();
  if (earned.includes(badge.id)) return;
  earned.push(badge.id);
  localStorage.setItem('cyberspark_badges', JSON.stringify(earned));
  _showBadgeToast(badge);
  awardXP(XP_AWARDS.BADGE_BONUS, 'badge_bonus');
}

function checkBadges() {
  const state = _buildState();
  for (const badge of BADGE_REGISTRY) {
    if (!hasBadge(badge.id) && badge.unlockFn(state)) {
      _grantBadge(badge);
    }
  }
}

function _buildState() {
  return {
    xp:             getXP(),
    badges:         getBadges(),
    visited:        _getVisited(),
    promptsCopied:  parseInt(localStorage.getItem('cyberspark_prompts_copied') || '0', 10),
    // Game completion flags — set by each game module via localStorage
    cipherTier1:    localStorage.getItem('cyberspark_cipher_t1') === '1',
    cipherTier2:    localStorage.getItem('cyberspark_cipher_t2') === '1',
    cipherTier3:    localStorage.getItem('cyberspark_cipher_t3') === '1',
    phishingDone:   localStorage.getItem('cyberspark_phishing') === '1',
    passwordDone:   localStorage.getItem('cyberspark_password') === '1',
    binaryDone:     localStorage.getItem('cyberspark_binary') === '1',
    scenariosDone:  parseInt(localStorage.getItem('cyberspark_scenarios') || '0', 10),
    quizDone:       localStorage.getItem('cyberspark_quiz') === '1',
    ideaGenerated:  localStorage.getItem('cyberspark_idea') === '1',
    pitchDone:      localStorage.getItem('cyberspark_pitch') === '1',
    personaChanged: localStorage.getItem('cyberspark_persona_changed') === '1',
  };
}

// ── Badge Registry (17 badges from spec) ─────────────────────────────────────
const BADGE_REGISTRY = [
  {
    id: 'first_cipher', name: 'First Cipher Cracked', icon: '🔓',
    description: 'Completed your first cipher challenge.',
    unlockFn: s => s.cipherTier1,
  },
  {
    id: 'cipher_master', name: 'Cipher Master', icon: '🧩',
    description: 'Completed all 3 cipher difficulty tiers.',
    unlockFn: s => s.cipherTier1 && s.cipherTier2 && s.cipherTier3,
  },
  {
    id: 'phishing_detective', name: 'Phishing Detective', icon: '🎣',
    description: 'Completed a Phishing Spotter round.',
    unlockFn: s => s.phishingDone,
  },
  {
    id: 'password_pro', name: 'Password Pro', icon: '🔐',
    description: 'Completed all Password Strength Arena levels.',
    unlockFn: s => s.passwordDone,
  },
  {
    id: 'binary_brain', name: 'Binary Brain', icon: '💾',
    description: 'Completed Binary Decoder in both directions.',
    unlockFn: s => s.binaryDone,
  },
  {
    id: 'incident_commander', name: 'Incident Commander', icon: '🚨',
    description: 'Completed all 3 threat response scenarios.',
    unlockFn: s => s.scenariosDone >= 3,
  },
  {
    id: 'idea_spark', name: 'Idea Spark', icon: '💡',
    description: 'Generated your first AI business idea.',
    unlockFn: s => s.ideaGenerated,
  },
  {
    id: 'pitch_ready', name: 'Pitch Ready', icon: '📊',
    description: 'Completed and copied a business pitch.',
    unlockFn: s => s.pitchDone,
  },
  {
    id: 'career_compass', name: 'Career Compass', icon: '🧭',
    description: 'Completed the Career Quiz.',
    unlockFn: s => s.quizDone,
  },
  {
    id: 'prompt_explorer', name: 'Prompt Explorer', icon: '🤖',
    description: 'Copied 5 prompts from Builder Studio.',
    unlockFn: s => s.promptsCopied >= 5,
  },
  {
    id: 'prompt_pro', name: 'AI Prompt Pro', icon: '⚡',
    description: 'Copied 10 prompts from Builder Studio.',
    unlockFn: s => s.promptsCopied >= 10,
  },
  {
    id: 'world_traveler', name: 'World Traveler', icon: '🗺️',
    description: 'Visited all 8 sections of CyberSpark.',
    unlockFn: s => {
      const all = ['explorer.html','hacker.html','builder.html','defender.html',
                   'entrepreneur.html','quiz.html','achievements.html','about.html'];
      return all.every(p => s.visited.includes(p));
    },
  },
  {
    id: 'persona_curious', name: 'Persona Curious', icon: '🎭',
    description: 'Switched personas at least once.',
    unlockFn: s => s.personaChanged,
  },
  {
    id: 'cyber_100', name: 'Cyber Cadet', icon: '🌱',
    description: 'Earned 100 XP.',
    unlockFn: s => s.xp >= 100,
  },
  {
    id: 'cyber_300', name: 'Cyber Analyst', icon: '🔵',
    description: 'Earned 300 XP.',
    unlockFn: s => s.xp >= 300,
  },
  {
    id: 'cyber_600', name: 'Cyber Expert', icon: '🟣',
    description: 'Earned 600 XP.',
    unlockFn: s => s.xp >= 600,
  },
  {
    id: 'cyber_champion', name: 'Cyber Champion', icon: '🏆',
    description: 'Earned every other badge.',
    unlockFn: s => {
      const otherIds = BADGE_REGISTRY.slice(0,-1).map(b => b.id);
      return otherIds.every(id => s.badges.includes(id));
    },
  },
];

// ── Page visit tracking ───────────────────────────────────────────────────────
function _getVisited() {
  try {
    return JSON.parse(localStorage.getItem('cyberspark_visited') || '[]');
  } catch {
    return [];
  }
}

function markPageVisited(filename) {
  const visited = _getVisited();
  if (visited.includes(filename)) return;
  visited.push(filename);
  localStorage.setItem('cyberspark_visited', JSON.stringify(visited));
  if (filename !== 'index.html') {
    awardXP(XP_AWARDS.PAGE_VISIT, 'page_visit');
  }
}

// ── DOM helpers (no-ops in test environment) ─────────────────────────────────
function _updateNavXP(total) {
  const el = document.getElementById('nav-xp');
  if (el) el.textContent = total + ' XP';
}

function _showBadgeToast(badge) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast badge-pulse';
  toast.innerHTML = `
    <div class="toast-title">${badge.icon} Badge Unlocked!</div>
    <div class="toast-body">${badge.name} — ${badge.description}</div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('dismissing');
    toast.addEventListener('animationend', () => toast.remove());
  }, 4000);
}

// Auto-run on page load in browser context
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    markPageVisited(page);
    _updateNavXP(getXP());
  });
}
```

- [ ] **Step 5: Open `tests/index.html` in browser — all XP tests should now PASS**

- [ ] **Step 6: Commit**

```bash
git add js/xp.js tests/index.html tests/test-xp.js
git commit -m "feat: XP and badge system with full badge registry and test harness"
```

---

## Task 6: Persona System — `js/persona.js`

**Files:**
- Write: `js/persona.js`
- Write: `tests/test-persona.js`

- [ ] **Step 1: Write failing tests `tests/test-persona.js`**

```javascript
describe('Persona System', () => {
  localStorage.clear();

  it('PERSONAS contains 5 personas', () => {
    expect(PERSONAS.length).toBe(5);
  });

  it('each persona has required fields', () => {
    for (const p of PERSONAS) {
      expect(typeof p.id).toBe('string');
      expect(typeof p.name).toBe('string');
      expect(typeof p.icon).toBe('string');
      expect(typeof p.tagline).toBe('string');
      expect(typeof p.color).toBe('string');
      expect(Array.isArray(p.primarySections)).toBeTruthy();
    }
  });

  it('getPersona returns null if not set', () => {
    localStorage.removeItem('cyberspark_persona');
    expect(getPersona()).toBe(null);
  });

  it('setPersona stores persona id in localStorage', () => {
    setPersona('hacker');
    expect(localStorage.getItem('cyberspark_persona')).toBe('hacker');
  });

  it('getPersona returns the stored persona object', () => {
    setPersona('builder');
    const p = getPersona();
    expect(p.id).toBe('builder');
  });

  it('setPersona sets persona_changed flag on second call', () => {
    localStorage.setItem('cyberspark_persona', 'explorer');
    setPersona('hacker');
    expect(localStorage.getItem('cyberspark_persona_changed')).toBe('1');
  });
});
```

- [ ] **Step 2: Open `tests/index.html` — persona tests should FAIL**

- [ ] **Step 3: Write `js/persona.js`**

```javascript
/**
 * persona.js — Persona data and selection system for CyberSpark.
 *
 * Public API:
 *   PERSONAS            — array of all persona definitions
 *   getPersona()        — returns current persona object or null
 *   setPersona(id)      — saves persona, applies CSS class, awards XP
 *   applyPersonaStyle() — applies stored persona class to body (call on page load)
 */

const PERSONAS = [
  {
    id: 'explorer',
    name: 'Explorer',
    icon: '🔭',
    tagline: 'Curious about the future? Map your path to a cybersecurity career.',
    color: 'blue',
    primarySections: ['explorer.html', 'quiz.html'],
    welcomeMessage: 'Welcome, Explorer! Your journey into cyber careers starts here.',
  },
  {
    id: 'hacker',
    name: 'Hacker',
    icon: '💻',
    tagline: 'Love cracking puzzles? Think like a hacker — the legal kind.',
    color: 'green',
    primarySections: ['hacker.html', 'defender.html'],
    welcomeMessage: 'Welcome, Hacker! Time to break things — responsibly.',
  },
  {
    id: 'builder',
    name: 'Builder',
    icon: '⚙️',
    tagline: 'Ideas become real when you build them. Start with AI.',
    color: 'purple',
    primarySections: ['builder.html', 'entrepreneur.html'],
    welcomeMessage: 'Welcome, Builder! Let\'s make something amazing.',
  },
  {
    id: 'defender',
    name: 'Defender',
    icon: '🛡️',
    tagline: 'Someone has to protect the internet. Why not you?',
    color: 'coral',
    primarySections: ['defender.html', 'hacker.html'],
    welcomeMessage: 'Welcome, Defender! The digital world needs you.',
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    icon: '🚀',
    tagline: 'The biggest opportunity in history is here. Build the future.',
    color: 'gold',
    primarySections: ['entrepreneur.html', 'builder.html'],
    welcomeMessage: 'Welcome, Entrepreneur! Your AI startup story starts now.',
  },
];

function getPersona() {
  const id = localStorage.getItem('cyberspark_persona');
  if (!id) return null;
  return PERSONAS.find(p => p.id === id) || null;
}

function setPersona(id) {
  const previous = localStorage.getItem('cyberspark_persona');
  if (previous && previous !== id) {
    localStorage.setItem('cyberspark_persona_changed', '1');
  }
  const isFirst = !previous;
  localStorage.setItem('cyberspark_persona', id);
  applyPersonaStyle();
  if (isFirst && typeof awardXP === 'function') {
    awardXP(10, 'persona_select');
  }
}

function applyPersonaStyle() {
  const persona = getPersona();
  // Remove all persona classes
  document.body.classList.forEach(cls => {
    if (cls.startsWith('persona-')) document.body.classList.remove(cls);
  });
  if (persona) {
    document.body.classList.add(`persona-${persona.id}`);
  }
}

// Auto-apply on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', applyPersonaStyle);
}
```

- [ ] **Step 4: Open `tests/index.html` — all tests PASS**

- [ ] **Step 5: Commit**

```bash
git add js/persona.js tests/test-persona.js
git commit -m "feat: persona system with 5 personas, localStorage persistence, body class application"
```

---

## Task 7: Shared Nav Component — `js/nav.js`

**Files:**
- Write: `js/nav.js`

- [ ] **Step 1: Write `js/nav.js`**

```javascript
/**
 * nav.js — Renders the shared navigation bar and footer into every page.
 *
 * Reads persona and XP from localStorage, renders nav HTML into #site-nav,
 * renders footer into #site-footer, and handles mobile hamburger toggle.
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
    ? `<span class="persona-chip" id="persona-chip" title="Change persona" onclick="window.location.href='index.html'">
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

- [ ] **Step 2: Open any shell page in the browser — nav should appear with logo, links, XP badge, and footer**

- [ ] **Step 3: Resize the browser to mobile width (< 768px) — hamburger menu should appear and links should toggle**

- [ ] **Step 4: Commit**

```bash
git add js/nav.js
git commit -m "feat: shared nav and footer component with persona chip, XP badge, mobile hamburger"
```

---

## Task 8: Home Page — `index.html`

**Files:**
- Modify: `index.html` (replace shell with full home page)

- [ ] **Step 1: Replace `index.html` content**

Replace the `<main>` contents with the following (keep all `<head>` and `<script>` tags intact):

```html
<main id="main-content">

  <!-- Hero -->
  <section class="hero" id="hero">
    <div class="particles" id="particles" aria-hidden="true"></div>
    <div class="container hero-content">
      <span class="hero-eyebrow">Free · Open Source · No Account Needed</span>
      <h1 class="hero-title">
        Your future in<br><span>cybersecurity</span> starts now.
      </h1>
      <p class="hero-subtitle">
        Explore careers, crack ciphers, build AI-powered businesses, and discover
        the skills that will define the next generation of tech leaders.
      </p>

      <!-- Stat Strip -->
      <div class="stat-strip">
        <div class="stat-chip animate-fade-in">
          <div class="stat-number">750K+</div>
          <div class="stat-label">Cybersecurity jobs unfilled in the US<br><em>Source: ISC², 2024</em></div>
        </div>
        <div class="stat-chip animate-fade-in" style="animation-delay:100ms">
          <div class="stat-number">$120K</div>
          <div class="stat-label">Average cybersecurity salary<br><em>Source: BLS, 2024</em></div>
        </div>
        <div class="stat-chip animate-fade-in" style="animation-delay:200ms">
          <div class="stat-number">$1.8T</div>
          <div class="stat-label">AI market size by 2030<br><em>Source: McKinsey, 2023</em></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Persona Picker -->
  <section class="section" id="persona-section">
    <div class="container">
      <div class="section-header text-center">
        <h2>Who are you?</h2>
        <p>Pick your persona and we'll build your personalized path.</p>
      </div>
      <div class="grid-3" id="persona-grid" style="margin-top:2rem">
        <!-- Rendered by JS below -->
      </div>
      <p class="text-center text-muted mt-lg" style="font-size:0.85rem">
        You can always change your persona later.
      </p>
    </div>
  </section>

  <!-- Section Cards -->
  <section class="section" id="explore-section" style="padding-top:0">
    <div class="container">
      <div class="section-header">
        <h2>Explore CyberSpark</h2>
        <p>Every section is a new skill, challenge, or career opportunity.</p>
      </div>
      <div class="grid-3" id="section-cards" style="margin-top:1.5rem">
        <!-- Rendered by JS below -->
      </div>
    </div>
  </section>

</main>
```

- [ ] **Step 2: Add the home page script at the bottom of `index.html`, after `nav.js` is loaded**

```html
<script>
// ── Particle hero background ─────────────────────────────────────────────────
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dx: ${(Math.random() - 0.5) * 60}px;
      --dy: ${(Math.random() - 0.5) * 60}px;
      --duration: ${6 + Math.random() * 8}s;
      --delay: ${Math.random() * 4}s;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

// ── Section cards data ───────────────────────────────────────────────────────
const SECTIONS = [
  { href:'explorer.html',     icon:'🔭', title:'Explorer Hub',       desc:'Map career paths, salaries, and day-in-the-life stories.' },
  { href:'hacker.html',       icon:'💻', title:'Hacker Lab',         desc:'Crack ciphers, spot phishing, test passwords. No jail time.' },
  { href:'builder.html',      icon:'⚙️', title:'Builder Studio',     desc:'Explore AI prompts and project ideas to build real things.' },
  { href:'defender.html',     icon:'🛡️', title:'Defender HQ',        desc:'Respond to real-world incidents and protect the network.' },
  { href:'entrepreneur.html', icon:'🚀', title:'AI Entrepreneur Lab', desc:'Generate AI business ideas and pitch them like a founder.' },
  { href:'quiz.html',         icon:'🧭', title:'Career Quiz',         desc:'10 questions → your ideal cybersecurity career match.' },
  { href:'achievements.html', icon:'🏆', title:'Achievements',        desc:'Earn XP and badges as you explore CyberSpark.' },
  { href:'about.html',        icon:'📋', title:'About / Pitch',       desc:'School board pitch page with career data and curriculum alignment.' },
];

// ── Render persona cards ─────────────────────────────────────────────────────
function renderPersonaCards() {
  const grid = document.getElementById('persona-grid');
  if (!grid) return;
  const current = getPersona();
  grid.innerHTML = PERSONAS.map(p => `
    <button
      class="card persona-card ${current && current.id === p.id ? 'selected' : ''}"
      onclick="selectPersona('${p.id}')"
      aria-pressed="${current && current.id === p.id}"
      style="text-align:left; cursor:pointer;"
    >
      <div style="font-size:2.5rem; margin-bottom:0.75rem">${p.icon}</div>
      <h3 style="font-size:1.25rem">${p.name}</h3>
      <p class="text-muted mt-sm" style="font-size:0.875rem">${p.tagline}</p>
    </button>
  `).join('');
}

// ── Select persona handler ───────────────────────────────────────────────────
function selectPersona(id) {
  setPersona(id);
  renderPersonaCards();
  renderNav();
  const persona = getPersona();
  // Show welcome toast
  const container = document.getElementById('toast-container');
  if (container && persona) {
    container.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-title">${persona.icon} Persona Selected!</div>
      <div class="toast-body">${persona.welcomeMessage}</div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('dismissing');
      toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
  }
  // Reorder section cards to surface persona's primary sections first
  renderSectionCards();
}

// ── Render section cards ─────────────────────────────────────────────────────
function renderSectionCards() {
  const grid = document.getElementById('section-cards');
  if (!grid) return;
  const persona = getPersona();
  const primary = persona ? persona.primarySections : [];
  const sorted = [
    ...SECTIONS.filter(s => primary.includes(s.href)),
    ...SECTIONS.filter(s => !primary.includes(s.href)),
  ];
  grid.innerHTML = sorted.map(s => `
    <a href="${s.href}" class="card" style="display:block">
      <div style="font-size:2rem; margin-bottom:0.75rem">${s.icon}</div>
      <h3 style="font-size:1.1rem">${s.title}</h3>
      <p class="text-muted mt-sm" style="font-size:0.875rem">${s.desc}</p>
    </a>
  `).join('');
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  renderPersonaCards();
  renderSectionCards();
});
</script>
```

- [ ] **Step 3: Open `index.html` in the browser**

Verify:
- Dark navy hero with floating particles
- Stat strip shows 3 chips (750K+, $120K, $1.8T)
- Persona grid shows 5 persona cards
- Clicking a persona: card gets glow, welcome toast appears, nav shows persona chip
- Section cards grid renders all 8 sections
- Clicking a persona reorders section cards so persona's primary sections appear first
- Nav XP badge shows current XP

- [ ] **Step 4: Test on mobile width (< 640px)**

All sections should stack to single column. Nav hamburger should work.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: home page — hero, particles, persona picker, section cards, stat strip"
```

---

## Task 9: Final Verification & GitHub Pages Check

**Files:** none modified

- [ ] **Step 1: Open `tests/index.html` — all tests pass (green)**

Expected summary: `14 passed, 0 failed`

- [ ] **Step 2: Verify all 9 pages load without console errors**

Open each HTML file. Each should show the nav, footer, XP badge. No red errors in the browser console.

- [ ] **Step 3: Verify localStorage persistence**

On `index.html`:
1. Pick a persona.
2. Reload the page.
3. Persona chip should still show in nav. Persona cards should show the selection highlighted.

- [ ] **Step 4: Push to GitHub and enable GitHub Pages**

```bash
git push origin main
```

In GitHub repo settings → Pages → Source: Deploy from branch → main → / (root) → Save.

Wait ~60 seconds, then verify the live site URL loads correctly.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: plan 1 complete — foundation verified on GitHub Pages"
```

---

## Note for Plan 2+ Implementers

**Lucide Icons:** The spec calls for Lucide Icons via CDN. Plan 1 uses emoji icons only. When Plan 2+ pages need SVG icons, add this `<script>` tag to those pages' `<head>` sections:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

Then call `lucide.createIcons()` after DOM load to replace `<i data-lucide="icon-name">` elements with SVGs.

**GitHub repo URL:** The footer in `nav.js` links to `https://github.com` as a placeholder. Update this to the actual repo URL before or during Plan 4.

---

## What's Next

- **Plan 2:** Hacker Lab (`hacker.html`) — 4 mini-games (cipher, phishing, password, binary) + Defender HQ (`defender.html`) — threat scenarios, checklists, Hall of Fame
- **Plan 3:** Explorer Hub, Builder Studio, Career Quiz, Achievements page
- **Plan 4:** AI Entrepreneur Lab + About/Pitch Page
