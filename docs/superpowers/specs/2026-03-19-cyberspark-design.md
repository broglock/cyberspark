# CyberSpark — Design Specification

**Author:** David Broggy
**Date:** 2026-03-19
**Status:** Approved for Implementation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Success Criteria](#2-goals--success-criteria)
3. [Target Audience](#3-target-audience)
4. [Site Architecture](#4-site-architecture)
5. [Persona System](#5-persona-system)
6. [Gamification System](#6-gamification-system)
7. [Page-by-Page Feature Design](#7-page-by-page-feature-design)
8. [Visual Design System](#8-visual-design-system)
9. [School Board Pitch Page](#9-school-board-pitch-page)
10. [Technical Architecture](#10-technical-architecture)
11. [Open Source & GitHub Strategy](#11-open-source--github-strategy)
12. [Content Sources & Citations](#12-content-sources--citations)

---

## 1. Project Overview

**CyberSpark** is a free, open-source, static multi-page web application that inspires students in grades 6–12 to explore careers in cybersecurity and artificial intelligence. It is designed to be used in classrooms, libraries, after-school programs, or independently at any time of year.

The platform is built to:

- Be deployed instantly to GitHub Pages with zero infrastructure cost.

- Require no accounts, no data collection, and no backend.

- Be forkable and extensible by teachers, students, and contributors.

- Serve as a compelling pitch to school boards by demonstrating career impact, curriculum relevance, and student engagement.

---

## 2. Goals & Success Criteria

### Primary Goals

- Inspire students to consider cybersecurity and AI as viable, exciting career paths.

- Provide hands-on, interactive learning tools that engage different learning styles (visual, kinesthetic, analytical, creative, entrepreneurial).

- Give school boards a clear, evidence-based case for adoption: career data, curriculum alignment, and engagement mechanics.

### Success Criteria

- A student can arrive, pick a persona, complete at least one interactive activity, and earn a badge in under 10 minutes.

- The About/Pitch page alone is sufficient to present to a school board without additional materials.

- The site is fully functional offline after first load (PWA-ready architecture for future enhancement).

- All pages render correctly on Chromebooks, tablets, and phones.

---

## 3. Target Audience

### Primary Users: Students, Grades 6–12 (ages 11–18)

- Wide range of prior knowledge — content must be accessible to complete beginners.

- Diverse interests — the persona system routes students to content that matches their natural strengths.

- Short attention spans — each interactive module is completable in 3–10 minutes.

### Secondary Users: Teachers & School Administrators

- Teachers need ready-made lesson plan suggestions and a printable/presentable pitch page.

- Administrators (school board) need career outcome data, curriculum alignment, and safety assurances (no data collection, no external accounts).

### Tertiary Users: General Public (GitHub audience)

- Open source community members who may contribute content, games, or translations.

- Parents researching career pathways for their children.

---

## 4. Site Architecture

**Deployment:** GitHub Pages (static hosting, zero cost)

**Structure:** Multi-page static site — each section is an independent HTML file sharing a common CSS design system and JS utilities.

### Page Map

| Page | URL Path | Primary Purpose |
|---|---|---|
| Home / Persona Picker | `/` | Entry point, persona selection, hero stats, pitch hook |
| Explorer Hub | `/explorer.html` | Careers map, salary data, day-in-the-life stories |
| Hacker Lab | `/hacker.html` | CTF mini-games, cipher challenges, phishing spotter |
| Builder Studio | `/builder.html` | AI prompt playground, project ideas |
| Defender HQ | `/defender.html` | Threat scenarios, incident response simulations |
| AI Entrepreneur Lab | `/entrepreneur.html` | Business idea generator, 50+ startup ideas, prompts |
| Career Quiz | `/quiz.html` | Persona recommender, job-fit profiler |
| Achievements | `/achievements.html` | Badge wall, XP summary, shareable results |
| About / Pitch | `/about.html` | School board pitch page, NICE framework alignment |

### Shared Components (via shared JS/CSS includes)

- Top navigation bar with persona badge and XP counter.

- Footer with GitHub link, open source badge, and citation links.

- Badge unlock notification system.

- XP award helper function.

### File Structure

```
cyber-spark/
├── index.html
├── explorer.html
├── hacker.html
├── builder.html
├── defender.html
├── entrepreneur.html
├── quiz.html
├── achievements.html
├── about.html
├── css/
│   ├── main.css          # Design system, variables, typography
│   ├── components.css    # Cards, badges, buttons, nav
│   └── animations.css    # CSS-only animations and transitions
├── js/
│   ├── xp.js             # XP and badge system (localStorage)
│   ├── persona.js        # Persona selection and routing
│   ├── games/
│   │   ├── cipher.js
│   │   ├── phishing.js
│   │   ├── password.js
│   │   └── binary.js
│   ├── quiz.js
│   ├── entrepreneur.js   # Idea spark generator
│   └── nav.js            # Shared nav component
├── assets/
│   ├── icons/
│   ├── badges/
│   └── images/
└── docs/
    └── superpowers/
        └── specs/
```

---

## 5. Persona System

Students select a persona on the home page. The choice is stored in `localStorage` under the key `cyberspark_persona`. No account or login is required.

### Personas

| Persona | Icon | Vibe | Primary Sections | Accent Color |
|---|---|---|---|---|
| Explorer | Telescope | Curious, career-focused | Explorer Hub, Career Quiz | Electric Blue |
| Hacker | Laptop | Challenge-driven, competitive | Hacker Lab, Defender HQ | Neon Green |
| Builder | Gear | Creative, maker mindset | Builder Studio, Entrepreneur Lab | Purple |
| Defender | Shield | Protector instinct, problem-solver | Defender HQ, Hacker Lab | Coral |
| Entrepreneur | Rocket | Ambitious, business-minded | Entrepreneur Lab, Builder Studio | Gold |

### Behavior

- Persona selection triggers a short animated welcome screen with a custom tagline.

- The top nav displays the student's chosen persona badge throughout the session.

- The home page reorders the section cards to surface the persona's primary sections first.

- All sections remain accessible regardless of persona — the system guides, not gates.

- Students may change their persona at any time via the nav.

---

## 6. Gamification System

All state is stored in `localStorage`. No server is required.

### XP System

- Every meaningful interaction awards XP: completing a game level, finishing the quiz, generating a business idea, copying a prompt.

- XP values are weighted by depth of engagement (e.g., finishing all cipher levels = more XP than completing one).

- XP total is displayed persistently in the top nav.

### Badge System

Badges are unlocked by reaching milestones. Each badge has:

- A name and icon (SVG).

- An unlock condition checked on every XP award.

- A brief description shown on the Achievements page.

**Example badges:**

- "First Cipher Cracked" — complete first Hacker Lab puzzle.

- "Phishing Detective" — correctly identify 5 phishing emails.

- "Idea Spark" — generate first business idea in Entrepreneur Lab.

- "Career Compass" — complete the Career Quiz.

- "Full Stack Explorer" — visit all 5 persona home pages.

- "AI Prompt Pro" — copy 10 prompts from Builder Studio.

- "Cyber Champion" — earn 1,000 XP.

### School Leaderboard Mode (No Backend)

- A teacher generates a 6-character class code (randomly generated, stored client-side).

- Students enter the class code on the home page; their XP is stored under `cyberspark_xp_[classcode]` in `localStorage`.

- When viewed on the same browser/device, a class ranking is shown.

- This is intentionally simple — it works for a single classroom demo without any infrastructure.

---

## 7. Page-by-Page Feature Design

### 7.1 Home Page (`/`)

- **Hero section:** Bold headline ("Your future in cybersecurity starts now"), animated stat panel showing workforce gap (750,000+ unfilled jobs), average salary ($120K), and AI market size ($1.8T by 2030).

- **Persona picker:** 5 large, clickable cards with icons, persona names, and one-line descriptions. Selection triggers welcome animation.

- **Section preview cards:** Scrollable grid of all site sections, reordered by persona.

- **"Why This Matters" strip:** Three bold statistics with sources cited inline.

### 7.2 Explorer Hub (`/explorer.html`)

- **Careers Map:** Visual grid of 8+ cybersecurity/AI careers (Penetration Tester, Security Analyst, AI Engineer, CISO, Forensic Investigator, Cloud Security Architect, etc.).

- Each career card shows: title, salary range, required skills, day-in-the-life summary, and a "How to start today" action.

- **Career Path Timeline:** Visual HTML/CSS timeline showing a sample path from 9th grade to first job.

- **Video Row:** Embedded YouTube video thumbnails (links only, no tracking embed) of real practitioners.

### 7.3 Hacker Lab (`/hacker.html`)

- **Cipher Cracker:** Caesar cipher puzzles with 3 difficulty tiers. Pure JS. Animated decryption reveal on success.

- **Phishing Spotter:** Displays fake email screenshots. User clicks on suspicious elements. Scored on accuracy with explanations.

- **Password Strength Arena:** Live entropy meter as user types. Shows estimated crack time. Educational, never stores input.

- **Binary Decoder:** Enter binary, get ASCII. Enter text, get binary. Learn how bits become data.

- All games award XP on completion and display encouraging feedback.

### 7.4 Builder Studio (`/builder.html`)

- **AI Prompt Library:** Categorized collection of 40+ curated prompts.

- Categories: Build a website, Analyze data, Write a business plan, Debug code, Create a lesson, Detect threats, Generate art prompts.

- Each prompt shows: the prompt text, an example output, and a "Copy + Try in ChatGPT" button.

- **Project Ideas Board:** 20+ beginner project ideas with estimated time, tools needed, and a starter prompt.

### 7.5 Defender HQ (`/defender.html`)

- **Threat Scenario Simulator:** Text-based choose-your-own-adventure style incidents (ransomware attack, data breach, social engineering attempt). Student chooses responses, sees consequences.

- **Security Checklist Tools:** Interactive checklists for "Securing your home network", "Safe social media habits", "Recognizing a scam".

- **Real Incident Hall of Fame:** Cards describing famous real-world cyberattacks (sanitized, educational) — what happened, what could have prevented it.

### 7.6 AI Entrepreneur Lab (`/entrepreneur.html`)

- **Idea Spark Generator:** A JS-powered randomizer combining:

  - Problem domain (healthcare, education, agriculture, finance, safety, environment, accessibility)

  - AI capability (image recognition, natural language processing, prediction, automation, personalization)

  - Target market (small businesses, schools, hospitals, individuals, governments)

  - Output: A unique business concept with a catchy name suggestion, one-sentence pitch, and starter prompt.

- **50+ Curated Business Ideas:** Organized by category. Each idea includes:

  - The real-world problem it solves.

  - Example AI tools to use (ChatGPT, Gemini, Midjourney, etc.).

  - Estimated startup cost range.

  - Potential revenue model.

  - A ready-to-use prompt to start building it today.

- **Example categories and ideas:**

  - *Healthcare:* AI symptom checker for rural clinics; medication reminder app with NLP.

  - *Education:* Personalized tutoring bot; AI essay feedback tool for ESL students.

  - *Environment:* Satellite image analyzer for deforestation tracking; smart recycling sorter.

  - *Safety:* AI-powered crosswalk alert system; neighborhood hazard reporting app.

  - *Finance:* Teen budgeting coach powered by AI; micro-investment advisor for students.

  - *Agriculture:* Crop disease detector using phone camera; weather-adaptive planting scheduler.

  - *Accessibility:* Real-time sign language translator; AI reading assistant for dyslexic students.

- **"Pitch Your Idea" Template:** A fillable HTML form that generates a one-page business pitch students can copy or print.

### 7.7 Career Quiz (`/quiz.html`)

- 10 questions about interests and strengths (no wrong answers, no prior knowledge required).

- Maps to 8 careers using a weighted scoring algorithm.

- Result card shows: career title, salary range, day-in-the-life paragraph, top 3 skills needed, and "How to start today".

- Result is screenshot-optimized with a shareable card layout.

- Awards XP and a badge on completion.

### 7.8 Achievements (`/achievements.html`)

- Full badge wall — earned badges are bright, unearned are greyed out.

- XP total and progress bar toward next milestone.

- "Share Your Progress" button generates a text summary students can copy.

- Shows which sections have been visited and which badges remain.

### 7.9 About / Pitch Page (`/about.html`)

- See Section 9 below.

---

## 8. Visual Design System

### Color Palette

| Role | Color | Hex |
|---|---|---|
| Background | Deep Navy | `#0f172a` |
| Surface | Dark Slate | `#1e293b` |
| Primary Accent | Electric Blue | `#3b82f6` |
| Success / Hacker | Neon Green | `#22c55e` |
| Warning / Entrepreneur | Gold | `#f59e0b` |
| Danger / Defender | Coral | `#f97316` |
| Builder / Creative | Purple | `#a855f7` |
| Text Primary | White | `#f8fafc` |
| Text Secondary | Slate Gray | `#94a3b8` |

### Typography

- **Headings:** `Space Grotesk` (Google Fonts) — bold, techy, distinctive.

- **Body:** `Inter` (Google Fonts) — clean, highly legible.

- **Code/Prompts:** `JetBrains Mono` (Google Fonts) — monospace for prompts and game elements.

### UI Components

- Cards with subtle border glow on hover (CSS box-shadow animation).

- Rounded corners (`border-radius: 12px`) throughout.

- Bold gradient hero banners, unique per section using persona accent colors.

- CSS-only floating particle animation on the home page hero.

- Progress bars with smooth CSS fill animations.

- Badge unlock: pulse glow animation + slide-in notification toast.

### Responsive Design

- Mobile-first CSS with breakpoints at 640px, 768px, and 1024px.

- All games and interactive tools are fully functional on touchscreens.

- Navigation collapses to a hamburger menu on mobile.

### External Dependencies (CDN only, no npm)

- Google Fonts: Space Grotesk, Inter, JetBrains Mono.

- Lucide Icons (SVG via CDN) for iconography.

- No JavaScript frameworks — vanilla JS only.

---

## 9. School Board Pitch Page (`/about.html`)

This page is designed to stand alone as a complete pitch document.

### Sections

1. **Why Cybersecurity & AI Matter Now** — workforce gap statistics, economic impact, national security framing.

2. **What Students Experience** — overview of all learning modules with screenshots.

3. **What Students Learn** — mapped explicitly to NICE Cybersecurity Workforce Framework work categories.

4. **Career Outcomes** — visual bar chart of 8 careers with salary ranges (HTML/CSS chart, no library).

5. **Student Engagement Design** — explanation of persona system, gamification, and zero data collection.

6. **How to Use in the Classroom** — three suggested use cases: single-period intro, multi-week elective module, after-school club.

7. **Safety & Privacy** — no accounts, no data leaves the browser, no third-party tracking, fully open source.

8. **Open Source & Community** — GitHub link, contribution guidelines, fork-and-customize invitation.

9. **Sources & Citations** — all statistics cited with source name and year.

---

## 10. Technical Architecture

### Constraints

- No build tools required — pure HTML, CSS, and vanilla JavaScript.

- No npm, no bundler, no server.

- All dependencies loaded via CDN with integrity hashes where available.

- Works offline after first load (future PWA manifest can be added with one file).

### State Management

- All user state in `localStorage` with the prefix `cyberspark_`.

- Keys: `cyberspark_persona`, `cyberspark_xp`, `cyberspark_badges` (JSON array), `cyberspark_visited` (JSON array of page names).

- No cookies, no analytics, no external calls (except Google Fonts and CDN icon library).

### Accessibility

- Semantic HTML throughout (`<nav>`, `<main>`, `<section>`, `<article>`).

- ARIA labels on interactive elements.

- Keyboard navigable — all games playable without a mouse.

- Color contrast ratios meet WCAG AA minimum.

### Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge).

- Chrome on Chromebook is the primary target for school environments.

---

## 11. Open Source & GitHub Strategy

- **License:** MIT — maximum freedom for schools and contributors.

- **README:** Clear setup instructions (download ZIP or clone, open index.html), contribution guide, and content roadmap.

- **GitHub Pages:** Enabled from the `main` branch root.

- **Issues & Discussions:** Templates for "Add a new game", "Add a career card", "Fix a bug".

- **No CI/CD required** — static files deploy automatically via GitHub Pages.

---

## 12. Content Sources & Citations

All statistics will be cited inline with source and year. Key sources:

- U.S. Bureau of Labor Statistics (BLS) — cybersecurity job growth and salary data.

- Cybersecurity and Infrastructure Security Agency (CISA) — workforce gap figures.

- NICE Cybersecurity Workforce Framework (NIST SP 800-181) — curriculum alignment.

- McKinsey Global Institute — AI market size projections.

- ISC² Cybersecurity Workforce Study — global workforce shortage data.

- World Economic Forum — Future of Jobs Report.
