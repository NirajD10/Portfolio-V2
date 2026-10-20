# CLAUDE.md — nirajdeshmukh.com V2

You are building Portfolio V2 for **Niraj Deshmukh**, full-stack developer in Pune (Software Developer at Pure Tech Codex Pvt. Ltd.).
The full plan lives in `docs/plan/`. Read `docs/plan/README.md` first, then only the docs the current phase needs.

## Working rules

- Work **one phase at a time** from `docs/plan/12-build-phases.md`. Plan → show plan → build → verify → summarise. Do not start the next phase.
- Before finishing a phase, run: `pnpm lint && pnpm typecheck && pnpm build`, and open the affected pages in a browser at 1440px and 390px wide, in light and dark mode.
- If a spec is ambiguous, pick the option that is simpler and more accessible, write the choice in `docs/plan/DECISIONS.md`, and continue.
- Never invent facts about Niraj (numbers, clients, results). Use `[[TBD: …]]` placeholders and list them at the end of your summary.
- **Missing assets never block work.** Use the placeholder system in `docs/plan/13-asset-placeholders.md`: every image goes through `asset(id)`, every slot is in `src/content/assets.ts`. Never generate fake photos of Niraj, fake screenshots, or redrawn brand logos.
- Inspiration sites (pleurat.com, orano.group) are **references only**. Never copy their code, SVGs, images, or copy text.

## Stack (do not swap without asking)

- Next.js 16, App Router, TypeScript strict, React 19, pnpm
- Tailwind CSS v4 (tokens defined in CSS with `@theme`, see `src/styles/tokens.css`)
- GSAP 3 + `@gsap/react` (`useGSAP`) — ScrollTrigger, SplitText, ScrambleText, Flip, CustomEase, Observer
- Lenis for smooth scroll, driven by `gsap.ticker` (one RAF loop for the whole site)
- Three.js via `@react-three/fiber` + `@react-three/drei` (`View`, `useTexture`), `@react-three/postprocessing` only for tier-2+ bloom
- Motion (`motion/react`) for component-level micro-interactions, layout and `AnimatePresence`
- `next-themes` (attribute `data-theme`), `next/font` (local Clash Grotesk, `geist` package)
- **Not allowed:** anime.js, jQuery, a second smooth-scroll library, CSS frameworks other than Tailwind, UI kits that ship their own design (MUI, Chakra). shadcn/ui primitives are fine if restyled with our tokens.

## Who animates what (avoid fights)

| Concern                                                                        | Tool                                     |
| ------------------------------------------------------------------------------ | ---------------------------------------- |
| Scroll-linked, pinned, timeline, text split/scramble, SVG scene, menu timeline | GSAP                                     |
| Hover/press micro-interactions, layout changes, mount/unmount of small UI      | Motion                                   |
| Anything in WebGL                                                              | R3F `useFrame`, uniforms tweened by GSAP |
| Smooth scrolling                                                               | Lenis only                               |

Never animate the same property of the same element with two libraries.

## Design tokens

- Use tokens only (`bg-surface`, `text-ink`, `text-accent`…). No raw hex in components. Tokens are in `docs/plan/02-design-system.md`.
- Brand purple `#7149C6` is a **fill** colour. For purple **text** in dark mode use `accent-text` (`#AD86FF`); in light mode `#5B37A6`. Body text never uses `#7149C6` on `#111111` (contrast 3.1:1).
- Fonts: `font-display` (Clash Grotesk), `font-sans` (Geist), `font-mono` (Geist Mono). Nothing else.

## Motion rules

- Easings come from `src/lib/motion.ts` (`ease.out = "expo.out"`, `ease.inOut = "power3.inOut"`, `ease.soft = "sine.inOut"`). Durations from the same file.
- Every animation must respect `prefers-reduced-motion`: no scroll-jacking, no particles, no glitch, no parallax; fades ≤ 200ms only. Use `gsap.matchMedia()` and Motion's `useReducedMotion`.
- Kill/revert every GSAP context on unmount (`useGSAP` scope). No orphan ScrollTriggers after route changes; call `ScrollTrigger.refresh()` after fonts and images load.
- Animate transforms and opacity only. No animating `width/height/top/left` or filters on large areas.

## WebGL rules

- One persistent `<Canvas>` in `src/components/webgl/Stage.tsx` behind all content; scenes render through drei `<View>` tracked to DOM elements. The only other canvas is the menu overlay's, mounted only while the menu is open.
- Dim scenes with shader uniforms (`uIntensity`), not CSS opacity on the canvas (CSS opacity would dim every View).
- GPU tiering via `detect-gpu`: tier 0 → static fallbacks, tier 1 → reduced counts/no bloom, tier 2+ → full. DPR capped at 1.5 (1 on tier 1).
- Pause rendering when `document.hidden` or when no View is on screen (`frameloop="demand"` + invalidate).
- Shader code lives in `.glsl` files under `src/components/webgl/**/shaders/`, imported as strings. Shared chunks (noise, hash) in `src/components/webgl/glsl/`.

## Accessibility (non-negotiable)

- WCAG 2.2 AA. Every interactive thing is reachable and operable by keyboard with a visible focus ring (`outline: 2px solid var(--accent-text)`).
- Decorative SVG/WebGL is `aria-hidden`. Animated/scrambled text keeps its real text in `aria-label` or visually-hidden spans.
- Sound is **off by default**, opt-in only, and never carries information.
- Menu overlay: `role="dialog"`, `aria-modal`, focus trap, Esc to close, focus returns to trigger, background `inert`.

## Performance budgets (fail the phase if exceeded)

- Home first-load JS ≤ **100 KB gzip on top of the framework baseline** (bare Next 16.4 + React 19 = 177 KB, so ≤ 277 KB total) before WebGL; check with `pnpm size`. three/R3F loaded with `next/dynamic` after first paint
- LCP ≤ 2.5 s (mobile, slow 4G), CLS ≤ 0.05, INP ≤ 200 ms
- Lighthouse: Performance ≥ 85 mobile / ≥ 95 desktop; Accessibility, Best Practices, SEO = 100
- Images: AVIF/WebP via `next/image`, explicit sizes; textures ≤ 1024 px long edge

## Commands

```
pnpm dev | pnpm build | pnpm start | pnpm lint | pnpm typecheck | pnpm test:e2e | pnpm assets:check | pnpm size
```

## Folder map (short)

```
src/app/                routes (/, /work, /work/[slug], /ai, /about, /contact, /facts)
src/components/layout/  Header, MenuOverlay, Footer, Frame, ThemeToggle
src/components/sections/ Home + page sections
src/components/ride/    Pune ride SVG scene + engine
src/components/webgl/   Stage, LightCove, GrainyCarousel, MenuGlitch, glsl/
src/content/            site.ts, experience.ts, tools.ts, assets.ts (+ assets.generated.json), work/*.mdx
src/components/ride/rider.config.ts   helmet (final) + outfit (placeholder) colours
scripts/                make-placeholders.ts, assets-sync.ts, assets-check.ts
src/lib/                motion.ts, lenis.ts, gpu.ts, time.ts
src/styles/             tokens.css, globals.css
```
