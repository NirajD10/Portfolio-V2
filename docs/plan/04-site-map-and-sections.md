# 04 · Site map & sections

Copy below is **draft** — written from V1 content. Niraj edits before launch. `[[TBD]]` = needs a real value.

## Site map

| Route | Purpose | Menu label |
|---|---|---|
| `/` | Home — story in one scroll | 01 HOME |
| `/work` | Work index with Final work / Case study toggle | 02 WORK |
| `/work/[slug]` | Case studies | — |
| `/ai` | AI Era — how AI runs through the workflow | 03 AI ERA |
| `/about` | Profile, story, experience, skills, Life in frames | 04 ABOUT |
| `/contact` | Say hello + arrival scene | 05 CONTACT |
| `/facts` | Plain fact sheet (SEO / AI crawlers), linked from footer | — |
| `/resume` | Redirect to PDF | menu HUD |
| 404 | "Wrong turn" | — |

---

## Global chrome

### Preloader (first visit per session only, ≤ 1.5 s)
A **rev counter** instead of a progress bar: a thin purple arc (tachometer) with a needle and a Geist Mono counter `0000 → 9000 RPM` that tracks real asset loading (fonts + hero SVG + first texture). At 100% the needle flicks to the red line, a short "ignition" flash runs across the screen, and the hero title lines rise. `sessionStorage` flag skips it on repeat visits; reduced motion shows a 300 ms fade.

### Header (fixed, 72px, transparent until scrolled → `--bg` at 85% + 1px bottom rule)
- Left: wordmark **niraj.** (Clash Grotesk 600; the dot is `--accent`). Links home.
- Centre (≥1024px): `PUNE · 09:41 IST` + availability badge "Open to freelance".
- Right: theme toggle (sun/moon morph), `MENU` label + hamburger icon (opens `06`).
- Hide on scroll down, show on scroll up (GSAP, 0.35 s). Always visible when the menu is open.

### Footer (every page)
1. Big CTA: "Got a product in mind? *Let's build it.*" + primary button "Start a project ↗" (→ `/contact`) + email copy button.
2. **Parked strip:** 120px SVG strip — the MT-15 parked outside the office, helmet on the mirror, a chai cup steaming on the wall. Small loop animations only (steam, blinking office sign, a passing auto-rickshaw every 12 s).
3. Columns: **Contact** (email, "Replies within [[24 hours — confirm]]") · **Pages** · **Online** (GitHub ↗, LinkedIn ↗, Resume ↗) · **Based in** (Pune, India · IST, UTC+5:30).
4. Bottom bar: `© 2026 NIRAJ DESHMUKH` · `FACTS` · `V1 (2023)` · `BUILT WITH NEXT.JS, GSAP & THREE.JS`.
Light Cove intensity ramps up behind the footer CTA (see `07`).

---

## Home `/`

### H1 · Hero (+ Pune ride strip)
Layout: 12-col; title spans cols 1–7, intro + buttons cols 9–12, aligned to the title's first line baseline. Strip below spans the full column.

**Title options (pick one — keep the wording clearly different from pleurat's "I design apps, websites, and AI-powered systems"):**
1. "I turn ideas into web apps / *and AI-powered products.*" ← default
2. "Full-stack developer / *shipping web & AI products.*"
3. "From idea to production — / *web apps with AI inside.*"

**Intro (right):** "5+ years building with React, Next.js and Node.js — from e-commerce stores to Generative AI and RAG platforms. Software Developer at Pure Tech Codex, riding across Pune to work every morning."

**Buttons:** `View selected work ↗` (primary → `/work`) · `About me ↗` (ghost → `/about`).

**Strip readout (above the strip):** left `02  Shaniwar Wada  · Kasba Peth` (index, landmark, area — updates as the bike passes), right `NEXT STOP → OFFICE`. Full spec: `05-hero-pune-ride.md`.

**Entrance:** after preloader: title lines rise (SplitText lines), intro fades, buttons slide 12px, strip draws from left (`DrawSVG` on the road line, then layers fade in), bike rides in from off-screen left and settles at 22%.

### H2 · What I build — chip `01 / BUILD`
"What I *build.*" — three tracks, one visible at a time on desktop (prev/next arrows like pleurat), stacked on mobile.

| # | Track | Line | Isometric line illustration |
|---|---|---|---|
| 01 | Websites | Fast, accessible, SEO-ready marketing sites and storefronts — WordPress to Next.js. | browser window with layered panels |
| 02 | Web apps | Full-stack products with auth, dashboards, APIs and databases — React, Next.js, Node, Fastify, Postgres. | dashboard + phone floating above a slab |
| 03 | AI products | RAG pipelines, Generative AI features and agents built into real apps — secure enough to pass VAPT. | slab with a glowing core and wires to small modules |

Each card: title, years label (`SINCE 2021` / `SINCE 2022` / `SINCE 2024`), line, 4 stack chips. Illustration pieces float apart slightly on hover (GSAP, 0.6 s).

### H3 · Numbers — chip `02 / NUMBERS`
"Since 2021, / *in plain numbers.*" Pinned for ~150vh; one hatched bar per number rises as you scroll while the numbers count up.

| Value | Label | Source |
|---|---|---|
| 5+ | Years building for the web | Sep 2021 → today |
| 4 | Companies | V1 experience |
| 30+ | Tools & technologies | V1 skills list (34) |
| 30% | Traffic lift from SEO work | Spellsys |
| [[TBD]] | Projects shipped | Niraj |

Bars use `--accent` hatching for the first two and outline hatching for the rest (echoes pleurat's mix, in purple). Link: "More about me →" (`/about`).

### H4 · AI tools — chip `03 / AI TOOLKIT`
"Six AI tools, / *open every workday.*" + one line: "Not a gimmick — these are the tools I reach for to go from an idea to a shipped, tested product."
Six tiles in this order: **ChatGPT · Claude · Antigravity · Manus · Cursor · Google AI Mode**. Hover reveals a one-line use case. Below: secondary chips (Claude Code, Codex, Ollama, LangChain) and link "See how I work with AI →" (`/ai`). Full spec: `09-ai-era.md`.

### H5 · Work reel — chip `04 / SELECTED WORK`
"Selected work, / *in motion.*" → **Grainy Carousel** of 5–6 case-study covers (`08`). Caption under the centred card: index, title, tags, year; "View case study ↗" appears on hover. Right-aligned link "All work →".

### H6 · Experience — chip `05 / EXPERIENCE`
"Teams I've / *built with.*" + "From a 3D-printing startup I helped run, to enterprise apps that passed VAPT."
Grid of 4 cells (A1–A4, from `experience.ts`) + one education cell (E1 · S.P. College, Pune · B.Sc. Computer Science · 2020). Hover tints the cell. Clicking a cell opens a small drawer (Motion layout animation) with the V1 bullet points.

### H7 · Final CTA → footer (above)

**Home scroll rhythm:** Hero (100vh) → Tracks → Numbers (pinned) → AI tools → Work reel → Worked → CTA/footer. Each section starts with chip + two-tone heading; nothing else repeats.

---

## Work `/work`
- Hero: "Things I've built / *and shipped.*" + right intro "Start with the finished product; switch to the case study for the decisions behind it." + button `Jump to case studies ↙`.
- Index: sticky left column (cols 1–4) listing projects (name in Clash, tags, one-liner, **Final work / Case study** segmented toggle, "Read the full case study ↗"). The active project is the one whose right-column block is in view (ScrollTrigger). Right column (cols 5–12): screens stacked (Final work) or a summary card with Problem / Role / Stack / Outcome (Case study). Toggle animates with Motion `AnimatePresence` (crossfade + 8px y).
- NDA block: "Some of my best work sits behind NDAs at Pure Tech Codex. Happy to walk through it on a call."
- Archive list (smaller projects): Fitness Landing Page, WeathTemp, Portfolio V1 — single rows with year, stack, Live ↗ / Code ↗.

## Case study `/work/[slug]` → see `10-case-studies.md`

## AI Era `/ai` → see `09-ai-era.md`

## About `/about`
1. Statement (centred, Clash 500, `display-md`): "I'm Niraj, a full-stack developer from Pune. I've built storefronts, 3D-printing businesses, enterprise apps and AI products — *and I still get excited every time something ships.*"
2. Illustration: Niraj's desk at home — laptop with code, MT-15 helmet on the shelf, a Shaniwar Wada postcard pinned to the wall, chai, plant (nod to PurePlantParadise). Swap any object for something Niraj actually has on his desk. Small loop animations (steam, cursor blink, plant sway).
3. Story (2 columns): V1 About text (Niraj's own words), updated: hearing-impairment line kept exactly as he wrote it if he wants it; education; path from Innovhub → Spellsys → Osumare → Pure Tech Codex.
4. Experience timeline: vertical, years in Geist Mono on the left, company + role + bullets on the right; a small bike icon travels down the timeline line with scroll progress.
5. Skills: grouped chips from `skills.ts` (Frontend · Frameworks · Backend · Databases · AI · Deployment · Version control · Design).
6. **Life in frames:** Grainy Carousel with personal photos (rides, Pune, desk, events). Built on 8 placeholder slots (`life.01`–`life.08`, `13 §2.3`) until the photos arrive.
7. "The 2023 version" — link to V1 archive.

## Contact `/contact`
- Eyebrow `CONTACT — PUNE · IST (UTC+5:30)`; title "Say *hello.*"; line "Websites, web apps and AI features — for teams and founders anywhere."
- Tiles: **Email** (filled purple, copies on click with a toast "Copied") · GitHub ↗ · LinkedIn ↗ · Resume ↗.
- Optional short form (name, email, what are you building, budget range) → `/api/contact` (later).
- **Arrival scene:** the bike rides in from the left, slows, parks at the office gate; Niraj takes the helmet off and walks in; the office window light turns on. Plays once when in view; "replay" icon button.
- Light Cove at higher intensity behind the title.

## Facts `/facts`
Text-only, no animation, max-width 680px: Summary · At a glance (role, company, location, years, stack) · Experience · Case studies (title + one-line + link) · AI tools · Contact. "Last updated <date>" in mono. Generated from `src/content`.

## 404
"Wrong turn." / "This road doesn't go anywhere — but the office is this way." The bike rides into a dead-end with a Puneri-style signboard ("No parking. No honking. No 404s." — playful, in Marathi + English if Niraj wants), U-turns, and the button "Back to home ↗" appears.
