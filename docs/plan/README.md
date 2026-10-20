# Niraj Deshmukh — Portfolio V2 · Implementation Plan

Plan pack for building **nirajdeshmukh.com V2** with Claude Code.
Written 20 Oct 2026 after studying V1 (nirajdeshmukh.com), pleurat.com (all pages) and the Orano innovation menu.

> **Goal:** an Awwwards-calibre portfolio (target: Honorable Mention → Site of the Day) that keeps V1's purple identity, adds light + dark mode, and tells one story: *a full-stack developer riding his MT-15 across Pune to the office, building websites, apps and AI-powered products on the way.*

---

## How to use this pack with Claude Code

1. Create the new repo (or a `v2` branch) and copy the **contents** of this pack into the repo root. The layout is already correct:
   ```
   repo/
   ├─ CLAUDE.md                  ← repo root; Claude Code reads it automatically
   └─ docs/plan/
      ├─ README.md               ← this file
      ├─ 01-research-findings.md … 12-build-phases.md
      └─ references/*.png
   ```
2. Open Claude Code in the repo and start every session with:
   > Read `CLAUDE.md` and `docs/plan/README.md`. Then do **Phase N** from `docs/plan/12-build-phases.md`. Plan first, show me the plan, then build.
3. One phase per session. Commit at the end of each phase. Don't let a session start the next phase.
4. Use plan mode for Phases 4, 5, 6 (the hard visual ones) and review the plan before any code is written.

---

## File map

| # | File | What it decides |
|---|------|-----------------|
| — | `CLAUDE.md` (repo root) | Rules Claude Code must follow in every session (stack, tokens, motion, a11y, perf, don'ts) |
| 01 | `01-research-findings.md` | What V1 is, what we take from pleurat.com and Orano, what we don't copy |
| 02 | `02-design-system.md` | Colours (V1 purple kept), light/dark tokens, fonts, grid, motion tokens |
| 03 | `03-architecture.md` | Stack, packages, folders, WebGL stage, scroll engine, content model, budgets |
| 04 | `04-site-map-and-sections.md` | Every page and every home section, with draft copy |
| 05 | `05-hero-pune-ride.md` | The hero ride: Pune skyline, MT-15 + rider illustration brief, animation engine |
| 06 | `06-menu-overlay.md` | Orano-style cinematic hamburger menu, full timeline |
| 07 | `07-light-cove.md` | Light Cove WebGL background (geometry, shaders, opacity rules) |
| 08 | `08-grainy-carousel.md` | Grainy Carousel (sand-dissolve photo row) shader spec |
| 09 | `09-ai-era.md` | AI tools strip + full AI Era page (ChatGPT, Claude, Antigravity, Manus, Cursor, Google AI Mode) |
| 10 | `10-case-studies.md` | Work index, case-study template, which projects to write up |
| 11 | `11-quality-checklist.md` | Awwwards checklist, performance, accessibility, SEO, testing, launch |
| 12 | `12-build-phases.md` | 11 phases, each with a copy-paste Claude Code prompt and acceptance criteria |
| 13 | `13-asset-placeholders.md` | Placeholder system + manifest of every photo, screenshot, logo and number Niraj adds later |

References (in `docs/plan/references/`):
- `ref-pleurat-hero-street.png` — hero layout + walking street strip we are re-imagining
- `ref-my-bike-yamaha-mt15.png` — **the bike to draw** (Yamaha MT-15, purple/white tank, gold forks)
- `ref-helmet-ls2-ff320-stream2.png` — **the helmet to draw** (LS2 FF320 Stream II, matte black / petrol blue / sand / orange)
- `ref-grainy-carousel.png` — Grainy Carousel look
- `ref-light-cove.png` — Light Cove look

---

## Key decisions at a glance

- **Colours:** V1 brand kept exactly — `#7149C6` primary, `#7A52CF` hover, `#AD86FF` light accent, `#111111` / `#161616` dark surfaces, `#F9FAFC` paper. Light mode is new and built from the same values.
- **Fonts:** Roboto → **Clash Grotesk** (display) + **Geist** (body/UI) + **Geist Mono** (labels, indices, HUD).
- **Stack:** Next.js 16 (App Router, TS) · Tailwind CSS v4 · GSAP 3 (ScrollTrigger, SplitText, ScrambleText, Flip — all free now) · Lenis · Three.js via React Three Fiber + drei · Motion (`motion/react`) for component micro-interactions.
- **No anime.js.** GSAP already covers every timeline; a second animation engine adds weight and fights GSAP over the same properties.
- **One WebGL stage** behind the page (Light Cove + Grainy Carousel via drei `<View>`), plus a short-lived canvas inside the menu overlay.
- **The ride is the brand:** hero strip (morning commute in light mode, night ride in dark mode), mini-rider on the AI Era pipeline, parked bike in the footer, wrong-turn bike on the 404.

## Things only Niraj can provide

Nothing here blocks a phase: every open item runs on a placeholder (`13-asset-placeholders.md`) and gets swapped in later.

- [x] Bike — Yamaha MT-15 photo
- [x] Helmet — LS2 FF320 Stream II (photo in `references/`)
- [x] Route — central Pune → Hinjewadi; home shown simply as "Pune"
- [ ] Riding outfit (jacket, gloves, jeans, shoes) — placeholder colours in `rider.config.ts`
- [ ] Office building photo — placeholder Hinjewadi IT building with a plain-text company sign
- [ ] 8–15 personal photos for "Life in frames" — 8 placeholder slots
- [ ] Project screenshots, links and notes (V1 projects + Pure Tech Codex + Innovhub) — seeded from V1 text, image slots on placeholders
- [ ] Real numbers: projects shipped, users/traffic where allowed — `[[TBD]]`
- [ ] Updated resume PDF — links to the V1 resume meanwhile
- [ ] Final hero title (3 options in `04-site-map-and-sections.md`) — option 1 meanwhile
