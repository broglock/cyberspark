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
  // Collect persona classes first to avoid mutating DOMTokenList during iteration
  const toRemove = [];
  document.body.classList.forEach(cls => {
    if (cls.startsWith('persona-')) toRemove.push(cls);
  });
  toRemove.forEach(cls => document.body.classList.remove(cls));
  if (persona) {
    document.body.classList.add(`persona-${persona.id}`);
  }
}

// Auto-apply on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', applyPersonaStyle);
}
