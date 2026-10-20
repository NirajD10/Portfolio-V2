# 13 · Asset placeholders & manifest

**Rule:** the build never waits for Niraj's assets. Every photo, screenshot, logo, colour or number he'll add later has a **slot** with a placeholder that already has the final size and aspect ratio, so layouts, animations and WebGL are built for real and nothing shifts when the real file arrives.

---

## 1. How the system works

| Piece | File | Job |
|---|---|---|
| Manifest | `src/content/assets.ts` | One entry per slot: `id`, final path, size, format, where it's used, placeholder label |
| Placeholder generator | `scripts/make-placeholders.ts` (uses `sharp`) | Renders a placeholder for every image slot at the exact size: purple diagonal hatching (same as the Numbers bars), 1px frame, Geist Mono label like `PLACEHOLDER · LIFE 03 · 1600×2000`. Writes to `public/placeholders/` |
| Sync script | `scripts/assets-sync.ts` (runs on `predev` and `prebuild`) | For each slot: if the final file exists in `public/`, use it; otherwise use the placeholder. Also auto-makes WebGL textures (1024px long edge WebP) and AVIF versions from any final image. Writes `src/content/assets.generated.json` |
| Resolver | `asset(id)` in `src/lib/assets.ts` | Components never hard-code paths: `<Image src={asset("work.pureplantparadise.cover")} … />` |
| Dev badge | `<PlaceholderTag />` | On `pnpm dev` and preview deployments, placeholder images show a small `PLACEHOLDER` tag in the corner. Never rendered in production |
| Checker | `pnpm assets:check` | Prints every slot still on a placeholder plus every `[[…]]` text placeholder in `src/content`. `--strict` (Phase 10) fails if anything remains |

Text and data placeholders use `[[TBD: …]]` in `src/content/*.ts`. A tiny `t()` helper renders them as a purple dashed highlight in dev/preview so they're impossible to miss, and `assets:check` lists them.

**Never** replace a missing asset with something invented: no AI-generated "photos of Niraj", no redrawn brand logos, no made-up project screenshots or numbers.

---

## 2. Manifest

### 2.1 Ride (Phase 4)

| id | Status | Final source | Notes |
|---|---|---|---|
| `ride.bike` | ✅ reference in hand | `docs/plan/references/ref-my-bike-yamaha-mt15.png` | Drawn as SVG in `Bike.tsx` |
| `ride.helmet` | ✅ confirmed | `docs/plan/references/ref-helmet-ls2-ff320-stream2.png` | LS2 FF320 Stream II; colours in `05 §3` |
| `ride.outfit` | 🟣 placeholder | `assets-inbox/rider/outfit.jpg` (reference only, not shipped) | Colours in `ride/rider.config.ts` flagged `placeholder: true` — jacket, gloves, jeans, shoes |
| `ride.office` | 🟣 placeholder | `assets-inbox/office/facade.jpg` (reference only) | `OfficeFacade.tsx`: generic Hinjewadi IT building with `PURE TECH CODEX` plain-text sign. Redraw from the photo when it arrives |
| `ride.home` | ✅ decided | — | Readout shows "Home · Pune"; generic housing society |

### 2.2 Projects (seeded from V1 — Niraj adds screenshots/links later)

Each project's data starts from the V1 cards (`01 §1`). Image slots per project:

| Slot suffix | Size | Format | Used by |
|---|---|---|---|
| `.cover` | 1600 × 2000 (4:5) | JPG/PNG/WebP original | Work reel (Grainy Carousel), `/work` index card |
| `.hero` | 2400 × 1350 (16:9) | original | Case-study hero |
| `.screen-desktop-01…06` | 2880 × 1800 (16:10) | PNG | Final work gallery |
| `.screen-mobile-01…04` | your phone's native screenshot (e.g. 1170 × 2532) | PNG | Final work gallery |
| `.texture` | auto | WebP 1024 | WebGL — generated from `.cover` by the sync script, nothing to supply |

Final files go in `public/work/<slug>/` with the slot name as the file name (`cover.jpg`, `hero.jpg`, `screen-desktop-01.png`…).

| slug | Title | Type | Stack (from V1) | Placement | Status |
|---|---|---|---|---|---|
| `pureplantparadise` | PurePlantParadise | E-commerce | React, Express.js, Node.js, MongoDB, Tailwind CSS, Firebase | Case study + Work reel | 🟣 text seeded from V1; images, year, links `[[TBD]]` |
| `genai-rag-platform` | GenAI / RAG platform — Pure Tech Codex | AI · Web app | React, Next.js, Node.js, Fastify, TypeScript, RAG | Case study + Work reel | 🟣 placeholder (NDA-safe write-up later) |
| `a3dxyz-spare3d` | A3DXYZ & Spare3D — Innovhub | Website · E-commerce | WordPress, React | Case study + Work reel | 🟣 placeholder |
| `portfolio-v2` | This site | Website · AI | Next.js, GSAP, Three.js | Case study + Work reel | Written in Phase 10 from the build itself |
| `fitness-landing` | Fitness Landing Page | Website | React, Framer Motion, CSS | Archive row + Work reel | 🟣 text from V1; cover + links `[[TBD]]` |
| `weathtemp` | WeathTemp | Web app | HTML, CSS, JavaScript, Tailwind CSS | Archive row + Work reel | 🟣 text from V1; cover + links `[[TBD]]` |
| `portfolio-v1` | Portfolio V1 (2023) | Website | Next.js, React, Framer Motion, Tailwind CSS | Archive row | 🟣 links `[[TBD]]` (copy from V1 project card) |

Live/Code URLs: copy them from the V1 project cards ("Code" and "Live" buttons) into `registry.ts`.

Optional later (see `10 §1`): `secure-enterprise-apps` (Pure Tech Codex, VAPT) and `spellsys-seo` (mini case study). Add them to the manifest when Niraj has the material.

### 2.3 Life in frames (About page, Grainy Carousel)

| id | Size | Notes |
|---|---|---|
| `life.01` … `life.08` (up to `life.15`) | 1600 × 2000 (4:5) original, JPG/WebP | Rides, Pune, desk, events. Final path `public/life/life-01.jpg`… Each needs an alt text line in `src/content/life.ts` |

### 2.4 Brand logos (AI tools)

| id | Final path | Placeholder |
|---|---|---|
| `brand.chatgpt`, `brand.claude`, `brand.antigravity`, `brand.manus`, `brand.cursor`, `brand.google-ai-mode` (+ `claude-code`, `codex`, `ollama`, `langchain` chips) | `public/brand/<slug>.svg`, downloaded from each company's official brand/press page | Monogram tile: two letters (`CG`, `CL`, `AG`, `MA`, `CU`, `GA`) in Geist Mono inside the tile — never a redrawn logo |

### 2.5 Files

| id | Final path | Placeholder |
|---|---|---|
| `file.resume` | `public/resume/Niraj-Deshmukh-Resume.pdf` | Link points to the V1 resume URL until the new PDF is added |
| `font.clash` | `src/fonts/ClashGrotesk-Variable.woff2` (download from Fontshare after checking the licence) | `src/lib/fonts.ts` falls back to Geist 600 for `--font-display` when the file is missing, so the build never breaks |
| `sound.*` (Phase 10) | `public/sound/*.mp3` | Sound toggle hidden until files exist |

### 2.6 Text & numbers

| Where | Placeholder |
|---|---|
| `numbers.ts` → projects shipped | `[[TBD: projects shipped]]` (bar hidden until set) |
| `site.ts` → hero title | Option 1 from `04` until Niraj picks |
| `tools.ts` → use / detail lines | Drafts from `09 §1`, flagged `draft: true` |
| `site.ts` → reply-time promise | `[[TBD: reply time]]` |
| Case-study metrics | `[[TBD]]` per metric (metric card hidden while TBD) |

---

## 3. How Niraj swaps a placeholder

1. Put the file at the **final path** from the tables above (same name, any of jpg/png/webp).
2. Run `pnpm dev` (or just commit — `prebuild` runs the sync on Vercel).
3. The sync script picks it up, makes AVIF + WebGL texture versions, and the `PLACEHOLDER` tag disappears.
4. For colours (outfit) edit `rider.config.ts` and set `placeholder: false`.
5. Run `pnpm assets:check` to see what's left.

Claude Code prompt for a batch swap:
> I added files to `public/work/` and `public/life/`. Run `pnpm assets:check`, wire up anything that needs code changes (alt text, captions, registry fields), and show me what's still a placeholder.

---

## 4. Build order

- **Phase 1** builds the whole system (manifest, generator, sync, resolver, tag, checker, font fallback) and generates every placeholder listed here.
- **Phases 3–9** use `asset(id)` everywhere.
- **Phase 10** runs `pnpm assets:check --strict` — launch is blocked until it's clean (or a slot is consciously removed from the manifest).
