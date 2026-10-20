# Decisions log

When a spec is ambiguous, pick the simpler, more accessible option, record it here, and continue. Newest first.

## ⚠ Open — needs Niraj

| Date | Phase | Question | Facts | Options |
|---|---|---|---|---|
| 2026-10-20 | 1 | **Home first-load JS budget (≤ 200 KB gzip) can't be met with this stack.** | A bare `create-next-app` (Next 16.4 + React 19.3) already ships **176.8 KB** gzip of JS on `/` (measured; same with `cacheComponents` off). Phase 1 home is **245.2 KB**: +~68 KB is GSAP core + ScrollTrigger + SplitText + ScrambleText + Lenis + next-themes + our code. Motion was already moved out of the root bundle (−45 KB). | (a) Redefine the budget as "≤ 100 KB gzip on top of the framework baseline" (now ~68 KB, so it passes). (b) Raise the absolute budget to ~260 KB. (c) Defer GSAP/Lenis until after first paint (hero text would render without its line reveal until loaded). Recommended: **(a)**. |

## Decided

| Date | Phase | Decision | Why | Spec ref |
|---|---|---|---|---|
| 2026-10-20 | 1 | **Motion is not in the root bundle.** Features using Motion wrap themselves in `<MotionScope>` (LazyMotion + MotionConfig honouring the site's reduced-motion pref). Button hover (arrow nudge, press scale) uses CSS transforms instead of Motion. | Motion's core added ~45 KB gzip to every page for one hover effect. CSS transforms can't fight GSAP (GSAP never touches buttons). Motion stays the tool for layout / AnimatePresence. | CLAUDE.md "Who animates what", perf budgets |
| 2026-10-20 | 1 | Only ScrollTrigger, SplitText and ScrambleText are registered in `src/lib/gsap.ts`. Flip, Observer, Inertia, CustomEase, DrawSVG are imported by the feature that uses them. | Keeps them out of the first-load bundle. | 03 §1 |
| 2026-10-20 | 1 | `SplitHeading` passes its markup as an HTML string (`dangerouslySetInnerHTML`). | SplitText rewrites the heading's children; when React also owns them, client navigation crashed with `removeChild` errors. | 02 §5 |
| 2026-10-20 | 1 | Scroll-reveal elements are hidden before hydration only when JS runs (`html.js` set by an inline script) and fade in after 3 s via CSS if hydration never happens. | No flash of the final state before GSAP takes over, and no permanently hidden text. | 02 §5 |
| 2026-10-20 | 1 | Theme toggle without View Transitions support (or under reduced motion) swaps **instantly** instead of a 200 ms crossfade. | Simpler; `next-themes` already disables transitions during the swap. | 02 §1.3 |
| 2026-10-20 | 1 | Frame column width = `min(1440px, 100% − 2 × gutter)`, gutter = `clamp(0px, 4vw − 16px, 56px)`. Gutter texture is one fixed layer masked to the gutters. | With a hard 1440px column the texture and side rules disappear at exactly the 1440px test width. On phones the gutter is 0. | 02 §3 |
| 2026-10-20 | 1 | Clash Grotesk fallback: `scripts/assets-sync.ts` writes `src/lib/clash.generated.ts` (either `next/font/local` or an empty class) and `--font-display` is `var(--font-clash, var(--font-geist-sans))`. The fallback keeps each heading's specified weight (not forced to 600). | `next/font/local` fails the build when the file is missing; a var() default needs no extra CSS. | 13 §2.5 |
| 2026-10-20 | 1 | AVIF/WebP delivery is done by `next/image` (`images.formats`); the sync script only pre-generates the 1024px WebGL textures. | Pre-generating AVIF duplicates what next/image already does at request time. | 13 §1 |
| 2026-10-20 | 1 | Image slots: the 4 case studies get the full set (cover, hero, 6 desktop, 4 mobile); Fitness Landing + WeathTemp get a cover only (Work reel); Portfolio V1 has no image slots (archive row). | Archive rows never show a gallery; avoids 33 unused placeholders. | 13 §2.2 |
| 2026-10-20 | 1 | Placeholder images are generated (git-ignored) on `predev`/`prebuild`; `assets.generated.json` and `clash.generated.ts` are committed. | Keeps 8 MB of generated WebP out of git while typecheck still works on a fresh clone. | 13 §1 |
| 2026-10-20 | 1 | Placeholder images use one dark palette (ink-850 ground, purple hatching, purple-300 label) in both themes. | A raster can't follow the theme; dark reads well on both. | 13 §1 |
| 2026-10-20 | 1 | Unknown `/work/[slug]` values call `notFound()` instead of `dynamicParams = false`. | `dynamicParams` is not allowed with `cacheComponents` (kept from the Next 16.4 scaffold). | 03 §2 |
| 2026-10-20 | 1 | "Years building" is computed from `careerStart` and `site.contentAsOf` (ISO month), not `new Date()`. | Deterministic static build; `/facts` shows the same date as "Last updated". | 04 · H3 |
| 2026-10-20 | 1 | Until the menu overlay (Phase 2): the MENU trigger jumps to the footer's page list, and the "Reduce motion" toggle lives in the footer bottom bar. | Never a dead control; the toggle is testable from Phase 1. | 06 §2, §6 |
| 2026-10-20 | 1 | Header hide-on-scroll is off under reduced motion, and the header always shows while focus is inside it. | Accessibility. | 04 · Header |
| 2026-10-20 | 1 | LinkedIn uses the V1 footer URL (`/in/niraj-deshmukh-nd10/`); V1's header links `/in/niraj-deshmukh-340aa0167`. | Custom URL looks current — Niraj to confirm. | 01 §1 |
| 2026-10-20 | 1 | Sound slots named `sound.tick`, `sound.rev`, `sound.whoosh` (UI ticks, bike rev, menu whoosh). | 13 §2.5 lists `sound.*` without names. | 12 · Phase 10 |
| 2026-10-20 | 1 | Scaffolded with `create-next-app@16.4.2` in a scratch folder and copied in (package name `nirajdeshmukh-v2`); TypeScript 5.9 as installed by the scaffold. | The folder name "Portfolio V2" isn't a valid package name. | 03 §1 |
| 2026-10-20 | — | Added `ROADMAP.md` as the phase tracker; `12-build-phases.md` remains the source of truth for phase scope. | One place to see status and per-phase checklists. | `12` |
