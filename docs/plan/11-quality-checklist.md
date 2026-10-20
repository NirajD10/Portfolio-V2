# 11 · Quality checklist (Awwwards, performance, accessibility, SEO, launch)

Run the relevant parts at the end of every phase; run all of it in Phase 10.

---

## 1. Awwwards readiness (Design 40 · Usability 30 · Creativity 20 · Content 10)

**Design**
- [ ] One system everywhere: frame rules, chips, two-tone headings, mono labels, purple accents — including 404, `/facts`, empty states, focus rings
- [ ] Typographic rhythm checked at 1440, 1280, 1024, 768, 390 widths (no orphans in headings: use `text-wrap: balance`)
- [ ] Light and dark themes both look intentional (not one "real" theme and one inverted)
- [ ] Every image has the same treatment (radius, reveal, captions)

**Usability**
- [ ] First meaningful content < 1.5 s; preloader only on first visit
- [ ] Menu works with mouse, touch, keyboard, screen reader
- [ ] Every animation has a reason; nothing blocks reading; scroll never hijacked (Lenis smoothing only)
- [ ] Mobile is designed, not shrunk: ride strip, menu, carousel all have mobile specs

**Creativity**
- [ ] The Pune ride (day/night with theme, signal stop, readout)
- [ ] Orano-grade menu + wave page transitions
- [ ] Light Cove + Grainy Carousel tuned to the brand
- [ ] Small surprises: rev-counter preloader, bike hover "vroom", 404 wrong turn, parked footer bike, local IST clock

**Content**
- [ ] ≥ 3 deep case studies + "how I built this"
- [ ] AI Era page with honest, specific workflow
- [ ] Copy proofread; no `[[…]]` placeholders left (`grep -rn "\[\[" src` must return nothing)

**Submission kit:** 1600×1200 cover, 3–5 screenshots (hero light, hero dark, menu open, work reel mid-dissolve, case study), a 30–60 s screen recording, short description + credits (fonts, libraries), tags (portfolio, WebGL, GSAP, Three.js, animation).

---

## 2. Performance

| Metric | Budget |
|---|---|
| LCP (mobile, slow 4G, Moto G-class) | ≤ 2.5 s |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |
| Home JS before WebGL | ≤ 200 KB gzip |
| Three/R3F chunk | lazy, after first paint |
| Ride SVG | ≤ 60 KB gzip, ≤ 1,500 nodes |
| Fonts | ≤ 3 woff2 files preloaded (Clash 500, Geist 400, Geist Mono 500); others `display: swap` |
| WebGL frame | < 4 ms GPU total on a mid laptop; 0 when hidden |
| Lighthouse | Perf ≥ 85 mobile / ≥ 95 desktop; A11y, BP, SEO = 100 |

Checks: `next build` output, `@next/bundle-analyzer`, Chrome Performance panel (scripting per frame during ride + carousel drag), `renderer.info.render.calls` in dev overlay, Lighthouse CI in GitHub Actions on `/`, `/work`, `/ai`, one case study.

Hero LCP element is the **title text** (not an image or canvas) — keep it server-rendered and visible before JS (SplitText runs after hydration with `autoAlpha` set via a `.js-ready` class to avoid a flash).

---

## 3. Accessibility (WCAG 2.2 AA)

- [ ] Contrast: tokens verified (`02 §1.2`); spot-check text over Light Cove frames
- [ ] **2.2.2 Pause, Stop, Hide:** ride strip, AI pipeline, carousel autoplay and Light Cove all stop via their pause buttons and the global `⏸ MOTION` toggle in the menu
- [ ] `prefers-reduced-motion` honoured everywhere (test with DevTools rendering emulation)
- [ ] Keyboard: logical tab order, visible focus, skip link "Skip to content", no traps except the menu dialog (which releases on Esc)
- [ ] Screen readers (VoiceOver + NVDA): headings outline is sensible (one `h1` per page), decorative SVG/canvas hidden, scrambled text exposes real text, carousel has `aria-roledescription` and labelled slides
- [ ] Touch targets ≥ 44×44 px
- [ ] Sound off by default; nothing depends on sound
- [ ] Zoom to 200% and 400% (reflow) without loss of content
- [ ] Forms (if added): labels, error text, `autocomplete`

Tools: axe DevTools, Lighthouse, Playwright + `@axe-core/playwright` in CI.

---

## 4. SEO & sharing
- [ ] Unique `<title>` and description per route; canonical URLs
- [ ] JSON-LD Person / CreativeWork / BreadcrumbList validate (Rich Results Test)
- [ ] OG + Twitter images per route (`next/og`), checked in a share debugger
- [ ] `sitemap.xml`, `robots.txt`, `/facts`, `/llms.txt`
- [ ] All case-study images have descriptive alt text; the carousel's hidden `<img>`s stay in the DOM
- [ ] 301 redirects for any V1 URLs that had traffic (check Search Console before switching)

---

## 5. Cross-browser / device matrix

| | Chrome | Safari | Firefox | Edge |
|---|---|---|---|---|
| macOS | ✓ | ✓ (WebGL + View Transitions fallback) | ✓ | — |
| Windows | ✓ | — | ✓ | ✓ |
| iOS 17+ | — | ✓ (Lenis off on touch, `syncTouch: false`) | — | — |
| Android | ✓ (mid-range phone, tier 1) | — | — | — |

Plus: 120 Hz display (animations time-based, not frame-based), high-contrast mode on Windows, a low-power laptop on battery.

---

## 6. Automated tests (Playwright)

- `menu.spec.ts` — open with click and Enter; focus trapped; Esc closes; item navigates; `aria-expanded` toggles
- `theme.spec.ts` — toggle persists across reload; no theme flash on load (screenshot diff of first frame)
- `reduced-motion.spec.ts` — with `reducedMotion: "reduce"`: no running GSAP tweens after 2 s (`gsap.globalTimeline.getChildren().length` check), ride shows still
- `routes.spec.ts` — every route 200, has one `h1`, has OG meta
- `a11y.spec.ts` — axe: 0 violations on each route, both themes
- Visual snapshots (light/dark) of hero, menu open, work index, a case study

---

## 7. Launch steps
1. Freeze content; remove all `[[TBD]]`
2. Lighthouse CI green; axe green; manual screen-reader pass
3. Deploy to Vercel preview → share with 2–3 people for a 10-minute usability test (watch them find a case study and the contact email)
4. Archive V1 (subdomain or `/v1` static export) and set redirects
5. Point nirajdeshmukh.com to V2; verify HTTPS, `www` redirect, analytics
6. Submit sitemap in Google Search Console
7. Submit to Awwwards (+ CSS Design Awards, The FWA if desired); share build notes on LinkedIn with the screen recording
