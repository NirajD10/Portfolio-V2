# Roadmap & progress tracker

Phase-by-phase view of `12-build-phases.md`. One phase per session: **plan → show plan → build → verify → summarise → commit**. Never start the next phase in the same session.

Status: ⬜ not started · 🟨 in progress · ✅ done · ⏸ blocked (should never happen; assets run on placeholders)

| # | Phase | Status | Plan mode | Depends on | Specs to read | Effort (evenings) |
|---|---|---|---|---|---|---|
| 0 | Collect assets (Niraj, no code) | 🟨 ongoing | — | — | `README` → "Things only Niraj can provide", `13` | — |
| 1 | Foundations | ✅ | optional | — | `02`, `03`, `13` (+ `01 §1` for V1 data) | 1–2 |
| 2 | Menu overlay | ✅ | optional | 1 | `06` | 2–3 |
| 3 | Home & page sections (no heavy FX) | ✅ (mobile perf open) | optional | 1, 2 | `04`, `09 §2` | 3–4 |
| 4 | The Pune ride | ⬜ | **required** | 3 | `05`, `13 §2.1`, `references/*` | 5–8 |
| 5 | WebGL Stage + Light Cove | ⬜ | **required** | 3 | `03 §5`, `07` | 2–3 |
| 6 | Grainy Carousel | ⬜ | **required** | 5 | `08` | 3–4 |
| 7 | Case studies | ⬜ | optional | 3, 6 | `10` | 3–5 |
| 8 | AI Era page | ⬜ | optional | 4 (mini-bike), 5 | `09` | 2–3 |
| 9 | About, Contact, 404, SEO | ⬜ | optional | 4, 6 | `04`, `11 §4` | 2–3 |
| 10 | Polish, QA, launch | ⬜ | optional | all | `11` | 3–5 |

```
P1 Foundations ─► P2 Menu ─► P3 Sections ─┬─► P4 Ride ───────────────┬─► P8 AI Era ─┐
                                          └─► P5 Stage+Cove ─► P6 Carousel ─► P7 Cases ├─► P9 ─► P10
                                                                                       ┘
```
P4 and P5 don't touch the same files and can be built in either order after P3.

---

## Definition of done — every phase

- [ ] `pnpm lint && pnpm typecheck && pnpm build && pnpm size` pass
- [ ] Affected pages checked at **1440px** and **390px**, **light** and **dark**
- [ ] Reduced-motion checked (no scroll-jacking/particles/parallax; fades ≤ 200 ms)
- [ ] Keyboard pass with visible focus ring on everything new
- [ ] No raw hex in components; easings/durations only from `src/lib/motion.ts`
- [ ] New ambiguities logged in `DECISIONS.md`
- [ ] Summary lists every new `[[TBD: …]]`
- [ ] Commit at a working state

---

## Phase 1 — Foundations
**Deliverables**
- [x] Next.js 16 app: pnpm, TS strict, Tailwind v4, ESLint + Prettier
- [x] `src/styles/tokens.css` (`@theme`, exact values from `02`) + `globals.css`
- [x] Fonts via `next/font`: Clash Grotesk (local, Geist 600 fallback when missing), Geist, Geist Mono
- [x] `next-themes` (`data-theme`, system default) + View-Transition circular theme toggle
- [x] `MotionProvider`: Lenis on `gsap.ticker`, ScrollTrigger, reduced-motion context, motion toggle in `localStorage`
- [x] `src/lib/`: `motion.ts`, `lenis.ts`, `gsap.ts`, `gpu.ts`, `time.ts`, `cn.ts`, `assets.ts`, `fonts.ts`
- [x] Layout: `Frame`, `Header` (wordmark, IST time, availability, theme toggle, placeholder MENU), static `Footer`
- [x] UI: `SectionChip`, `SplitHeading`, `Button`, `TextLink`, `LocalTime`
- [x] Content: `site.ts`, `experience.ts`, `skills.ts`, `tools.ts`, `numbers.ts`, `work/registry.ts` (V1 data, `01 §1` + `13 §2.2`)
- [x] Placeholder system: `assets.ts` manifest, `make-placeholders.ts`, `assets-sync.ts` (predev/prebuild), `asset(id)`, `PlaceholderTag`, `assets:check`, `t()` helper
- [x] Empty routes: `/`, `/work`, `/work/[slug]`, `/ai`, `/about`, `/contact`, `/facts`, 404
- [x] Playwright + CI skeleton

**Done when:** frame/header/footer correct in both themes at 1440/390 · theme persists with no flash · Lenis smooth and off under reduced motion · `/facts` shows real V1 data · `pnpm assets:check` prints the full list from `13` · build works without Clash files.

**Result (2026-10-20):** all criteria met; 26/26 Playwright tests pass (desktop 1440 + mobile 390). Home first-load JS 245.2 KB gzip = 176.8 KB framework + 68.4 KB app, within the revised budget (≤ 100 KB app, see `DECISIONS.md`).

## Phase 2 — Menu overlay
- [x] `MenuButton` morph
- [x] `MenuOverlay` dialog (items, indices, sub-labels, HUD, grid + guide lines)
- [x] GSAP open/close timeline, ScrambleText, RGB split; hover/focus guide-line tracking
- [x] A11y: focus trap, Esc/outside close, `inert` background, focus returns to trigger
- [x] Navigation: same-page scroll vs route change
- [x] CSS 16-strip wave fallback → then `MenuGlitch` shader canvas (tier ≥ 1, mounted only while open)
- [x] `TransitionLink` page transitions with the same wave
- [x] Playwright `menu.spec.ts`

**Done when:** `06 §8` passes; `menu.spec.ts` green.

**Result (2026-10-20):** all `06 §8` items pass; 42/42 Playwright tests (incl. 16 menu tests, desktop + mobile, reduced motion). Glitch canvas mounts only during a curtain run and is gone after close. Home first-load JS 255.3 KB (app 78.5 KB ≤ 100). Light Cove behind the menu → Phase 5.

## Phase 3 — Home & page sections
- [x] Home: Hero (ride slot), Tracks, Numbers (pinned, count-up bars), AI tools tiles, Work reel (plain DOM row), Experience grid + drawer, Final CTA
- [x] About (no illustration/carousel yet), Contact (no scene), Work index (toggle, NDA block, archive), `/facts`, 404 copy
- [x] Preloader (rev counter, first visit per session)
- [x] Scroll entrances from `02 §5`
- [x] Marked slots for ride strip, Grainy Carousel, Light Cove, illustrations

**Done when:** every page complete, responsive, accessible without WebGL · Lighthouse a11y 100 on all routes · no font-load layout shift.

**Result (2026-10-20):** Lighthouse Accessibility / Best Practices / SEO 100 and CLS 0 on all routes; axe clean on every route in both themes, desktop + mobile; 85/85 Playwright tests. Home first-load JS 267.1 KB (app 90.3 KB ≤ 100). Mobile Performance 67–85 (budget ≥ 85) — open item in `DECISIONS.md`.

## Phase 4 — The Pune ride *(plan mode; steps 1–5 first)*
- [ ] 1 · Static layered SVG with `05 §4` ids: landmark placeholders, bike draft, rider (helmet + `rider.config.ts` outfit), `OfficeFacade`
- [ ] 2 · `RideEngine`: cruise, parallax tiles, wheel rotation, bob, readout from `landmarks.ts`
- [ ] 3 · Signals (brake/stop/foot-down/launch, exhaust), traffic, metro
- [ ] 4 · Day/night bound to theme: headlight, lamps, lit windows, destination text
- [ ] 5 · Interactions (rev + bubble, click flash), pause button, reduced-motion still, mobile simplification
- [ ] 6 · Art pass (can run in parallel)
- [ ] 7 · Reuse: footer parked strip, contact arrival, 404 wrong turn, `/ai` mini-bike

**Done when:** `05 §10` passes.

## Phase 5 — WebGL Stage + Light Cove *(plan mode)*
- [ ] `Stage`: one fixed Canvas, `View.Port`, `frameloop="demand"` driven by `gsap.ticker`, loaded with `next/dynamic` after first paint
- [ ] `useGpuTier` (detect-gpu, cached), DPR cap, context-loss fallback, pause when hidden/off-screen
- [ ] `LightCove`: lanes, core + glow + reflection + floor tint; `uIntensity` per theme/section; ink mode for light theme
- [ ] Mouse parallax, scroll boost, menu preset, tier-2 bloom on contact/footer
- [ ] `?still` route → `public/fallback/light-cove.webp`
- [ ] Dev-only tweak panel (stripped from production)

**Done when:** `07 §8` passes · Stage chunk loads after first paint · home LCP within ±100 ms of Phase 3.

## Phase 6 — Grainy Carousel *(plan mode)*
- [ ] DOM carousel first: drag/wheel/keys/autoplay/inertia (Observer + Inertia), loop
- [ ] View tracking with overshoot box
- [ ] Card quad dissolve → then grain points (shared `dissolve.glsl`)
- [ ] Hover re-form, drag streaks, texture loading + DOM crossfade, Points pooling, fallbacks
- [ ] Life-in-frames variant + lightbox; shared-element transition to case-study hero

**Done when:** `08 §6` passes on desktop + a mid Android phone.

## Phase 7 — Case studies
- [ ] MDX setup + registry; components: `Chapter`, `Figure`, `Gallery`, `ArchitectureDiagram`, `Metric`, `ToolList`, `Callout`, `Compare`
- [ ] Template with chapter rail, next-project link with mini-bike hover
- [ ] OG image per slug, JSON-LD
- [ ] First three studies drafted from `assets-inbox/case-notes/` (Niraj reviews every line; metrics `[[TBD]]`)

**Done when:** `10 §5` passes.

## Phase 8 — AI Era page
- [ ] Hero + pipeline scene (mini-rider, six stations, loop, pause, reduced-motion still)
- [ ] "Shipped with AI in the loop", workflow rows (DrawSVG icons), stack tiles, principles
- [ ] Light Cove hue shift toward blue on `/ai`
- [ ] Logos only from `public/brand/` — missing → list them, monogram placeholder, never redraw

**Done when:** `09 §4` passes.

## Phase 9 — About, Contact, 404, SEO
- [ ] About: desk illustration, timeline with travelling bike, Life in frames
- [ ] Contact: arrival scene, copy-email toast (optional form/API)
- [ ] 404 wrong-turn scene
- [ ] Metadata, OG images, sitemap, robots, `/llms.txt`, JSON-LD; preloader polish

**Done when:** all routes complete; `11 §4` passes.

## Phase 10 — Polish, QA, launch
- [ ] Optional cursor follower; opt-in sound (≤ 150 KB, lazy)
- [ ] Micro-interaction + transition consistency pass; copy proofread; image optimisation
- [ ] Perf, a11y, cross-browser pass; `pnpm assets:check --strict` clean
- [ ] Launch report (Lighthouse per route, bundle sizes, remaining TBDs, known issues) + Awwwards kit

**Done when:** every box in `11` ticked; launch steps done.

---

## Session prompt template

> Read `CLAUDE.md` and `docs/plan/README.md`. Then do **Phase N** from `docs/plan/12-build-phases.md`. Plan first, show me the plan, then build.
