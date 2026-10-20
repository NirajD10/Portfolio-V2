# 12 · Build phases (Claude Code playbook)

One phase per Claude Code session. Each phase lists what to read, what to build, a prompt to paste, and "done when". Commit + push a preview at the end of each phase.

Effort guide (focused evenings): P1 1–2 · P2 2–3 · P3 3–4 · P4 5–8 (art heavy) · P5 2–3 · P6 3–4 · P7 3–5 · P8 2–3 · P9 2–3 · P10 3–5.

---

## Phase 0 — Collect (Niraj, no code, never blocking)
Bike ✓, helmet ✓ and route ✓ are done. Everything else in `README.md → Things only Niraj can provide` runs on placeholders (`13-asset-placeholders.md`) and can arrive at any time: reference photos go in `assets-inbox/` (git-ignored), shippable files go straight to their final paths in `public/`.

---

## Phase 1 — Foundations
**Read:** `CLAUDE.md`, `02-design-system.md`, `03-architecture.md`
**Build:** Next.js 16 app (pnpm, TS strict, Tailwind v4), `tokens.css` + `@theme`, fonts (Clash Grotesk local, Geist, Geist Mono), `next-themes` with system default + View-Transition circular theme toggle, `MotionProvider` (Lenis + gsap.ticker + ScrollTrigger + reduced-motion context + global motion toggle stored in `localStorage`), `lib/motion.ts`, `Frame` (side rules + outside texture + corner ticks), `SectionChip`, `SplitHeading` (two-tone + SplitText line reveal), `Button`, `TextLink`, `LocalTime`, Header (wordmark, IST time, availability, theme toggle, placeholder MENU button), Footer (static), content files from V1 data (`site.ts`, `experience.ts`, `skills.ts`, `tools.ts`, `numbers.ts`, `work/registry.ts` seeded with the V1 projects), **the placeholder system from `13`** (manifest, `make-placeholders`, `assets-sync` on predev/prebuild, `asset(id)`, `PlaceholderTag`, `assets:check`, Clash → Geist font fallback) with every placeholder generated, empty routes for every page, ESLint/Prettier, Playwright + CI skeleton.

**Prompt**
> Read `CLAUDE.md`, `docs/plan/02-design-system.md`, `docs/plan/03-architecture.md` and `docs/plan/13-asset-placeholders.md`. Do Phase 1 from `docs/plan/12-build-phases.md`. Use the exact token values from 02. Seed the content files with the V1 data in `docs/plan/01-research-findings.md §1` and the project list in `13 §2.2`. Plan first and show me the file list before writing code.

**Done when:** both themes render the frame, header and footer correctly at 1440/390; theme persists with no flash; Lenis scroll is smooth and disabled under reduced motion; `pnpm build` passes; `/facts` lists real V1 data; `pnpm assets:check` prints the full placeholder list from `13`; the build works without the Clash font files.

---

## Phase 2 — Menu overlay (DOM first, shader second)
**Read:** `06-menu-overlay.md`
**Build:** `MenuButton` morph, `MenuOverlay` dialog (items, indices, sub-labels, HUD, grid + guide lines), open/close GSAP timeline with ScrambleText + RGB split, hover/focus guide-line tracking, focus trap, Esc/outside close, `inert`, navigation (same-page scroll vs route change). **First with the CSS 16-strip wave**, then add `MenuGlitch` shader canvas (own R3F Canvas mounted only while open) and swap it in for tier ≥ 1. Add `TransitionLink` page transitions using the same wave.

**Prompt**
> Read `CLAUDE.md` and `docs/plan/06-menu-overlay.md`. Do Phase 2. Build the DOM + GSAP version with the CSS strip fallback first and show it to me working; then implement the glitch shader from §4 and use it when WebGL is available. Follow the accessibility section exactly.

**Done when:** every item in `06 §8` passes; Playwright `menu.spec.ts` green.

---

## Phase 3 — Home & page sections (no heavy effects yet)
**Read:** `04-site-map-and-sections.md`, `09-ai-era.md §2`
**Build:** all Home sections (Hero with a placeholder strip box, Tracks with simple isometric SVGs, Numbers pinned section with count-up bars, AI tools tiles with hover lines + logos, Work reel as a plain DOM row, Worked-at grid + drawer, Final CTA), About (without illustration + carousel), Contact (without scene), Work index (toggle, NDA block, archive), `/facts`, 404 copy, preloader (rev counter). Scroll entrances from `02 §5`.

**Prompt**
> Read `CLAUDE.md`, `docs/plan/04-site-map-and-sections.md` and `docs/plan/09-ai-era.md §2`. Do Phase 3. Leave clearly marked slots for the ride strip, Grainy Carousel, Light Cove and illustrations — they come later. Use real content from `src/content`; put `[[TBD]]` where data is missing and list them at the end.

**Done when:** every page is complete, responsive and accessible without any WebGL; Lighthouse a11y 100 on all routes; no layout shift when fonts load.

---

## Phase 4 — The Pune ride
**Read:** `05-hero-pune-ride.md`, `13-asset-placeholders.md §2.1`, `references/ref-my-bike-yamaha-mt15.png`, `references/ref-helmet-ls2-ff320-stream2.png`, `references/ref-pleurat-hero-street.png` (mechanics only)
**Build (in this order):**
1. Static layered SVG with the §4 ids: placeholder blocks for landmarks (Pune → Hinjewadi route, `05 §1`), a first-draft bike traced from the photo, the rider with the LS2 FF320 Stream II helmet and outfit colours read from `rider.config.ts`, and the placeholder `OfficeFacade`.
2. `RideEngine` (cruise, parallax tiles, wheel rotation, bob) + readout from `landmarks.ts`.
3. Signals → brake/stop/foot-down/launch with exhaust puffs; traffic actors; metro train.
4. Day/night via CSS variables bound to theme; headlight beam, lamps, lit windows, destination text.
5. Interactions (hover rev + bubble, click flash), pause button, reduced-motion still, mobile simplification.
6. Art pass: replace placeholders with final landmark drawings (Claude Code drafts; Niraj/Figma finishes bike + rider).
7. Reuse pieces: footer parked strip, contact arrival scene, 404 wrong turn, mini-bike for `/ai` pipeline.

**Prompt**
> Read `CLAUDE.md`, `docs/plan/05-hero-pune-ride.md` and `docs/plan/13-asset-placeholders.md §2.1`, and look at the bike and helmet photos in `docs/plan/references/`. The outfit colours and the office building are placeholders — build them so they can be swapped later without touching the engine. Enter plan mode and plan Phase 4 steps 1–5 only. After I approve, build them. Use `gsap.quickSetter` for per-frame writes; no React state per frame. Show me screenshots of light and dark at 1440 and 390 when done.

**Done when:** `05 §10` checklist passes (art pass may continue in parallel).

---

## Phase 5 — WebGL stage + Light Cove
**Read:** `07-light-cove.md`, `03-architecture.md §5`
**Build:** `Stage` (single fixed Canvas, `View.Port`, `frameloop="demand"` driven by gsap.ticker), `useGpuTier`, context-loss fallback, `LightCove` (lane builder, core + glow + reflection + floor tint), intensity rules per theme/section (ScrollTrigger), ink mode for light theme, mouse parallax, scroll boost, menu preset, tier-2 bloom on contact/footer, the `?still` route to export `fallback/light-cove.webp`.

**Prompt**
> Read `CLAUDE.md`, `docs/plan/03-architecture.md §5` and `docs/plan/07-light-cove.md`. Enter plan mode for Phase 5. Then build the Stage and the Light Cove. Expose a dev-only tweak panel (leva or a simple custom one, removed from production) for lane count, intensity, pulse speed, colours. Compare against `docs/plan/references/ref-light-cove.png` and tell me what still differs.

**Done when:** `07 §8` passes; Stage chunk loads after first paint; home LCP unchanged vs Phase 3 (±100 ms).

---

## Phase 6 — Grainy Carousel
**Read:** `08-grainy-carousel.md`
**Build:** DOM carousel with drag/wheel/keys/autoplay/inertia (GSAP Observer + Inertia), View tracking with overshoot box, card quads + grain points sharing `dissolve.glsl`, hover re-form, drag streaks, texture loading + DOM crossfade, Points pooling, fallbacks, Life-in-frames variant with lightbox, shared-element transition to case-study hero.

**Prompt**
> Read `CLAUDE.md` and `docs/plan/08-grainy-carousel.md`. Enter plan mode for Phase 6, then build it. Start with the DOM carousel working perfectly (drag, loop, keyboard) before any shader. Then add the card quad dissolve, then the grains. Compare against `docs/plan/references/ref-grainy-carousel.png`.

**Done when:** `08 §6` passes on desktop + a mid Android phone.

---

## Phase 7 — Case studies
**Read:** `10-case-studies.md`
**Build:** registry + MDX setup + components (`Chapter`, `Figure`, `Gallery`, `ArchitectureDiagram`, `Metric`, `ToolList`, `Callout`, `Compare`), case-study template with chapter rail, next-project link with mini-bike hover, OG image per slug, JSON-LD. Write the first three studies from Niraj's notes (he reviews every line).

**Prompt**
> Read `CLAUDE.md` and `docs/plan/10-case-studies.md`. Do Phase 7: build the template and MDX components, then draft the case studies from the notes in `assets-inbox/case-notes/`. Never invent metrics — use `[[TBD]]`. Show me each draft.

**Done when:** `10 §5` passes.

---

## Phase 8 — AI Era page
**Read:** `09-ai-era.md`
**Build:** hero + pipeline scene (mini-rider, six stations, looping timeline, pause, reduced-motion still), "Shipped with AI in the loop", workflow rows with DrawSVG icons, stack tiles, principles; Light Cove hue shift toward blue on this page.

**Prompt**
> Read `CLAUDE.md` and `docs/plan/09-ai-era.md`. Do Phase 8. Reuse the mini MT-15 from the ride components. Logos come from `public/brand/` — if a logo file is missing, stop and list what's missing instead of drawing a fake one.

**Done when:** `09 §4` passes.

---

## Phase 9 — About, Contact, 404, SEO completion
**Build:** About desk illustration + timeline with travelling bike + Life in frames; Contact arrival scene + copy-email toast (+ optional form/API); 404 wrong-turn scene; all metadata, OG images, sitemap, robots, `/llms.txt`, JSON-LD; preloader polish.

**Prompt**
> Read `CLAUDE.md`, `docs/plan/04-site-map-and-sections.md` (About, Contact, 404) and `docs/plan/11-quality-checklist.md §4`. Do Phase 9.

**Done when:** all routes complete; SEO checklist passes.

---

## Phase 10 — Polish, QA, launch
**Build:** cursor follower (optional), sound (opt-in: UI ticks, bike rev, menu whoosh; ≤ 150 KB total, lazy), micro-interaction pass, transitions consistency, copy proofread, image optimisation, final perf + a11y + cross-browser pass, Awwwards submission kit.

**Prompt**
> Read `CLAUDE.md` and `docs/plan/11-quality-checklist.md`. Do Phase 10: run every check, fix what fails, and give me a launch report with Lighthouse scores per route, bundle sizes, remaining `[[TBD]]`s and known issues.

**Done when:** every box in `11` is ticked and the launch steps are done.

---

## Tips for working with Claude Code on this project
- Paste screenshots of what looks wrong — visual bugs are much faster to fix with an image.
- Keep `docs/plan/DECISIONS.md` updated; when a session drifts, point it back to the plan file.
- For shaders, ask for one change at a time and a before/after screenshot.
- If a phase grows past one session, split it at a working, committed state — never leave the main branch broken.
