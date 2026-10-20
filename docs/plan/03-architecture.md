# 03 · Architecture

## 1. Stack & packages

```bash
pnpm create next-app@latest nirajdeshmukh-v2 --ts --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*"
pnpm add gsap @gsap/react lenis motion three @react-three/fiber @react-three/drei \
         next-themes geist detect-gpu clsx tailwind-merge
pnpm add -D @types/three @next/mdx @mdx-js/loader @mdx-js/react @types/mdx \
         prettier prettier-plugin-tailwindcss @playwright/test @lhci/cli sharp tsx
# Phase 5+ only, tier-2 GPUs:
pnpm add @react-three/postprocessing postprocessing
```

| Package | Job | Notes |
|---|---|---|
| `next` 16.x | App Router, SSG, `next/og` images, `next/font` | Pages are statically generated; no server needed except optional contact API |
| `tailwindcss` v4 | styling via tokens | CSS-first config in `tokens.css` |
| `gsap` + `@gsap/react` | scroll, timelines, SplitText, ScrambleText, Flip | All GSAP plugins are free for commercial use since the Webflow acquisition |
| `lenis` | smooth scroll | Driven by `gsap.ticker`; `lenis.stop()` while menu is open |
| `motion` | micro-interactions, layout, AnimatePresence | import from `motion/react` |
| `three`, `@react-three/fiber`, `@react-three/drei` | WebGL stage, Views, textures | loaded via `next/dynamic` after first paint |
| `detect-gpu` | GPU tiering | result cached in `sessionStorage` |
| `next-themes` | light/dark/system | `attribute="data-theme"`, `disableTransitionOnChange` |
| `@next/mdx` | case-study bodies | MDX files imported through a typed registry |

**Explicitly not used:** anime.js (overlaps GSAP), Framer Motion's old package name (use `motion`), Locomotive Scroll, ScrollSmoother (Lenis instead, one smooth-scroll engine only).

---

## 2. Folder structure

```
src/
├─ app/
│  ├─ layout.tsx               ← fonts, ThemeProvider, MotionProvider (Lenis+GSAP), Frame, Header, MenuOverlay, Stage (dynamic), Footer
│  ├─ page.tsx                 ← Home
│  ├─ work/page.tsx            ← Work index
│  ├─ work/[slug]/page.tsx     ← Case study (generateStaticParams from registry)
│  ├─ ai/page.tsx              ← AI Era
│  ├─ about/page.tsx
│  ├─ contact/page.tsx
│  ├─ facts/page.tsx           ← text-only fact sheet
│  ├─ not-found.tsx            ← "Wrong turn" 404
│  ├─ opengraph-image.tsx      ← default OG (next/og)
│  ├─ sitemap.ts · robots.ts
│  └─ llms.txt/route.ts        ← plain-text summary for AI crawlers
├─ components/
│  ├─ layout/   Frame.tsx, Header.tsx, MenuButton.tsx, MenuOverlay.tsx, Footer.tsx, ThemeToggle.tsx, LocalTime.tsx, SectionChip.tsx, Preloader.tsx
│  ├─ ui/       Button.tsx, TextLink.tsx, ToolTile.tsx, MetaStrip.tsx, SplitHeading.tsx, Counter.tsx
│  ├─ sections/ home/{Hero,Tracks,Numbers,AiTools,WorkReel,WorkedAt,FinalCta}.tsx · ai/* · about/* · work/*
│  ├─ ride/     RideStrip.tsx, RideEngine.ts, scene/{Far,Mid,Near,Bike,Rider,Traffic}.tsx, landmarks.ts
│  └─ webgl/
│     ├─ Stage.tsx             ← single fixed Canvas + View.Port
│     ├─ useGpuTier.ts
│     ├─ glsl/ noise.glsl, hash.glsl, curl.glsl
│     ├─ light-cove/ LightCove.tsx, buildLanes.ts, shaders/{lane.vert,lane.frag,floor.frag}
│     ├─ grainy-carousel/ GrainyCarousel.tsx, CarouselView.tsx, shaders/{card.vert,card.frag,grain.vert,grain.frag,dissolve.glsl}
│     └─ menu-glitch/ MenuGlitch.tsx, shaders/glitch.frag
├─ content/
│  ├─ site.ts          ← name, role, location, socials, availability, email, resume URL
│  ├─ experience.ts    ← companies, roles, dates, bullets (from V1)
│  ├─ skills.ts        ← grouped skills (from V1)
│  ├─ tools.ts         ← AI tools with slug, name, logo, use-case, url
│  ├─ tracks.ts        ← Websites / Web apps / Product development
│  ├─ numbers.ts       ← stats (only real values; TBD placeholders allowed)
│  └─ work/
│     ├─ registry.ts   ← typed list of case studies, import of each MDX
│     └─ *.mdx
├─ lib/  motion.ts, lenis.ts, gsap.ts (registerPlugin once), gpu.ts, time.ts, cn.ts, assets.ts (asset(id) resolver), fonts.ts (Clash → Geist fallback)
└─ styles/ tokens.css, globals.css
scripts/   make-placeholders.ts, assets-sync.ts (predev/prebuild), assets-check.ts   ← see 13-asset-placeholders.md
public/
├─ placeholders/ generated placeholder images (exact final sizes)
├─ brand/    chatgpt.svg, claude.svg, antigravity.svg, manus.svg, cursor.svg, google.svg …
├─ work/     <slug>/cover.avif, screens…, textures/<slug>-1024.webp (for WebGL)
├─ life/     photos for "Life in frames"
├─ fallback/ light-cove.webp (static render), ride-still.svg
└─ resume/Niraj-Deshmukh-Resume.pdf
```

---

## 3. Root layout composition

```tsx
// src/app/layout.tsx (shape, not final code)
<html lang="en" suppressHydrationWarning>
  <body className="bg-bg text-ink font-sans antialiased">
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionProvider>              {/* Lenis + gsap.ticker + ScrollTrigger proxy + reduced-motion context */}
        <StageLoader />             {/* next/dynamic(() => import Stage), ssr:false, mounted after first paint */}
        <Preloader />               {/* first visit only */}
        <Header />                  {/* logo · local time · availability · theme · MENU */}
        <MenuOverlay />             {/* portal, inert unless open */}
        <Frame>                     {/* side rules + outside texture */}
          <main id="main">{children}</main>
          <Footer />
        </Frame>
      </MotionProvider>
    </ThemeProvider>
  </body>
</html>
```

Z-order: `Stage` canvas `position:fixed; inset:0; z-index:0; pointer-events:none` → page content `z-index:1` with **transparent section backgrounds** (the page colour is painted by `body`, so WebGL shows through) → header `z-index:20` → menu overlay `z-index:50`.

---

## 4. Scroll & animation engine

```ts
// src/lib/lenis.ts (shape)
const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

- One RAF loop: `gsap.ticker` drives Lenis, ScrollTrigger, the ride engine and the WebGL Stage invalidation (R3F `frameloop="demand"` + `invalidate()` from the ticker when something is animating).
- Expose `useLenis()` and a tiny store (`zustand` not needed — a module-level event emitter is enough) with `velocity`, `direction`, `progress`; the ride and shaders read velocity from it.
- Reduced motion: Lenis not created (native scroll), ScrollTrigger animations replaced through `gsap.matchMedia()`.
- Route changes: `useGSAP` scopes revert automatically; after navigation call `lenis.scrollTo(0, { immediate: true })` then `ScrollTrigger.refresh()`.
- Page transitions: reuse the menu's block-wave mask (`06`) for internal link clicks between pages: wave covers (`uProgress` 0 → 1, ~0.8 s) → `router.push` → new page signals ready → wave reveals (1 → 0). Use a `TransitionLink` wrapper around `next/link`. Fallback: View Transitions API crossfade.

---

## 5. WebGL stage

```tsx
// src/components/webgl/Stage.tsx (shape)
<Canvas
  eventSource={document.body} eventPrefix="client"
  style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
  dpr={[1, tier >= 2 ? 1.5 : 1]} frameloop="demand"
  gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
>
  <View.Port />
</Canvas>
```

- **Light Cove** renders in a `<View>` attached to a fixed full-viewport div (`<div class="fixed inset-0" data-view="cove">`), so it's behind everything on every page.
- **Grainy Carousel** renders in a `<View>` attached to the carousel section's "overshoot box" (the DOM band + 15vh above and below), so grain can fly beyond the cards.
- Views render in DOM order; the carousel View draws on top of the cove.
- Textures: `useTexture` with `colorSpace = SRGBColorSpace`, preloaded when the section is within 1.5 viewports (IntersectionObserver).
- GPU tiers (`useGpuTier`):
  | Tier | Light Cove | Grainy Carousel | Menu glitch | DPR |
  |---|---|---|---|---|
  | 0 / no WebGL / Save-Data | static `fallback/light-cove.webp` at 20% | plain `<img>` row with CSS edge mask | CSS block wipe (16 divs) | — |
  | 1 | 96 lanes, fake glow, no bloom, 30 fps cap | 60×75 grains per card | shader, 18 rows | 1 |
  | 2–3 | 180 lanes, real bloom on contact section | 120×150 grains per card | shader, 28 rows | 1.5 |
- Context loss: listen for `webglcontextlost`, swap to tier-0 fallbacks.

---

## 6. Content model

```ts
// src/content/work/registry.ts
export type CaseStudy = {
  slug: string; title: string; oneLiner: string;
  tags: ("AI" | "Web app" | "Website" | "E-commerce" | "Product")[];
  role: string; stack: string[]; year: string; company?: string;
  links?: { live?: string; code?: string };
  nda?: boolean;
  cover: string;               // /work/<slug>/cover.avif
  texture: string;             // /work/<slug>/textures/<slug>-1024.webp for the Grainy Carousel
  screens: { src: string; alt: string; device: "desktop" | "mobile" }[];
  summary: string;             // used by /work "Case study" toggle and /facts
  metrics?: { label: string; value: string }[];
  Body: () => Promise<{ default: React.ComponentType }>; // MDX import
};
```

- All structured content in `src/content/*.ts` — the facts page, OG images, sitemap and `llms.txt` read from the same source, so nothing drifts.
- MDX components map (`mdx-components.tsx`): `Chapter`, `Figure`, `Compare`, `ArchitectureDiagram`, `Callout`, `Metric`, `ToolList`.

---

## 7. SEO & metadata

- `generateMetadata` per route; title pattern `"<Page> — Niraj Deshmukh"`; home: `"Niraj Deshmukh — Full-Stack Developer, Pune"`.
- JSON-LD `Person` on home/about (name, jobTitle, worksFor Pure Tech Codex, address locality Pune, sameAs GitHub/LinkedIn), `CreativeWork` on case studies, `BreadcrumbList` on case studies.
- `next/og` OG images: purple frame, title, small MT-15 silhouette; one per case study.
- `/facts` and `/llms.txt` generated from content files.
- Canonical domain `https://nirajdeshmukh.com`. Archive V1 at `v1.nirajdeshmukh.com` (optional) and link it from `/about` ("The 2023 version").

---

## 8. Hosting & ops

- Vercel (preview per branch). Domain stays at nirajdeshmukh.com; flip DNS only after Phase 10 QA.
- Analytics: Vercel Analytics or Plausible (cookieless → no consent banner needed).
- Contact: `mailto:` + copy-email button; optional `/api/contact` with Resend later.
- CI (GitHub Actions): lint, typecheck, build, Playwright smoke, Lighthouse CI on `/`, `/work`, `/ai`.
