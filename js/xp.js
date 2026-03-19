/**
 * xp.js — XP award system and badge registry for CyberSpark.
 *
 * Public API:
 *   awardXP(amount, reason)        — adds XP, checks badges, updates nav display
 *   awardPromptCopyXP()            — awards prompt-copy XP with 10-per-session cap
 *   getXP()                        — returns current XP total (number)
 *   getBadges()                    — returns array of earned badge IDs
 *   hasBadge(id)                   — returns true if badge is earned
 *   checkBadges()                  — evaluates all badges, unlocks any newly met
 *   markPageVisited(filename)      — call on each page load to track visits and award XP
 *   BADGE_REGISTRY                 — array of all badge definitions
 *   XP_AWARDS                      — XP values for each action type
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
// Re-entrancy guard for checkBadges (prevents cascading badge grant loops)
let _checkingBadges = false;

// ── Public XP functions ──────────────────────────────────────────────────────
function getXP() {
  return parseInt(localStorage.getItem('cyberspark_xp') || '0', 10);
}

function awardXP(amount, reason) {
  if (!amount || amount <= 0 || isNaN(amount)) {
    if (amount !== 0) console.warn(`[CyberSpark] awardXP called with invalid amount: ${amount} (reason: ${reason})`);
    return;
  }
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
  if (_checkingBadges) return;
  _checkingBadges = true;
  try {
    const state = _buildState();
    for (const badge of BADGE_REGISTRY) {
      if (!hasBadge(badge.id) && badge.unlockFn(state)) {
        _grantBadge(badge);
      }
    }
  } finally {
    _checkingBadges = false;
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
    careersExplored:  parseInt(localStorage.getItem('cyberspark_careers_explored') || '0', 10),
    personaChanged: localStorage.getItem('cyberspark_persona_changed') === '1',
  };
}

// ── Badge Registry (18 badges from spec) ─────────────────────────────────────
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
    id: 'career_explorer', name: 'Career Explorer', icon: '🔭',
    description: 'Explored all 8 cybersecurity career paths.',
    unlockFn: s => (s.careersExplored || 0) >= 8,
  },
  {
    id: 'cyber_champion', name: 'Cyber Champion', icon: '🏆',
    description: 'Earned every other badge.',
    unlockFn: s => {
      const otherIds = BADGE_REGISTRY.filter(b => b.id !== 'cyber_champion').map(b => b.id);
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

  const title = document.createElement('div');
  title.className = 'toast-title';
  title.textContent = `${badge.icon} Badge Unlocked!`;

  const body = document.createElement('div');
  body.className = 'toast-body';
  body.textContent = `${badge.name} — ${badge.description}`;

  toast.appendChild(title);
  toast.appendChild(body);
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('dismissing');
    toast.addEventListener('animationend', () => toast.remove());
    setTimeout(() => toast.remove(), 500); // fallback if animations disabled
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
