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
