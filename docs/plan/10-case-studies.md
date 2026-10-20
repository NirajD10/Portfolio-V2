# 10 · Work & case studies

Awwwards' Content score and every hiring manager reward the same thing: **real problems, real decisions, real outcomes**. V2 leads with fewer, deeper case studies.

---

## 1. What to write up

| Priority | Slug | Project | Type | Source / notes |
|---|---|---|---|---|
| 1 | `genai-rag-platform` | GenAI + RAG platform at Pure Tech Codex | AI · Web app | NDA-safe: describe the problem, architecture and your role; anonymise data; blur UI if needed. Mention VAPT if allowed |
| 2 | `secure-enterprise-apps` | Secure web apps that passed VAPT (Pure Tech Codex) | Web app | Could merge into #1 if there isn't enough to say separately |
| 3 | `a3dxyz-spare3d` | A3DXYZ & Spare3D — 3D-printer brand sites + spare-parts e-commerce (Innovhub) | Website · E-commerce | WordPress + React; R&D/director angle: you ran the business side too |
| 4 | `pureplantparadise` | PurePlantParadise — indoor-plant store | E-commerce · MERN | V1 project; rebuild the screenshots, add what you'd do differently |
| 5 | `portfolio-v2` | This site — "How I built it with AI" | Website · AI | Process, shaders, the ride, perf numbers; great for the AI Era page and the Awwwards jury |
| 6 | `spellsys-seo` *(mini)* | +30% traffic through SEO (Spellsys) | Website | Short format: problem → 3 changes → result |

**Archive** (one row each on `/work`): Fitness Landing Page, WeathTemp, Portfolio V1 (2023).

For each one Niraj supplies: screenshots (desktop + mobile), his role, team size, timeline, stack, 1–3 measurable outcomes (or honest qualitative ones), and what's allowed under NDA.

**Until then:** every project is already in `registry.ts`, seeded with its V1 text and stack, with image slots on placeholders and missing fields as `[[TBD]]` (slot sizes and paths in `13-asset-placeholders.md §2.2`). The template, Work reel and `/work` index are built and tested on those placeholders; Niraj drops in screenshots and notes later.

---

## 2. `/work` index

Spec in `04 · Work`. Key behaviours:
- Sticky left index; ScrollTrigger marks the project whose right-side block is in view (`top 50%`).
- **Final work / Case study** segmented toggle per project (Motion `layoutId` for the sliding highlight; content crossfades with `AnimatePresence`, 0.3 s).
- Screens open in a lightbox with keyboard arrows; images use `next/image` with `sizes`.

## 3. Case-study page template (`/work/[slug]`)

```
← ALL WORK                                                    (mono, accent-text)

PurePlantParadise                                             (display-lg)
An indoor-plant store built on the MERN stack — from catalogue to checkout.   (body-lg, ink-muted)

┌ ROLE ─────────┬ STACK ───────────────┬ YEAR ──┬ LINKS ─────────────┐
│ Full-stack    │ React · Node · Mongo │ [[yr]] │ Live ↗  Code ↗     │       (MetaStrip)
└───────────────┴──────────────────────┴────────┴────────────────────┘

[ Hero media — full column, 16:9, clip-path reveal on load ]

01  Overview           What it is, who it's for, why it mattered
02  My role            What I owned; team; timeline
03  The problem        Constraints, users, what was broken or missing
04  Approach           Options considered → decision (with a small diagram)
05  Architecture       SVG diagram (DrawSVG reveal on scroll): client → API → DB/services
06  Key screens        Final work gallery (desktop + mobile pairs)
07  Hard parts         2–3 specific problems and how I solved them (code snippets allowed, short)
08  AI in the loop     Which tools, for what, what I checked by hand
09  Results            Metric cards (count-up) or honest qualitative outcomes
10  What I'd do next   One paragraph

Delivered              Checklist of deliverables

── Next project ──────────────────────────────────────────────
A3DXYZ & Spare3D  →          (huge Clash link; hovering sends the mini-bike riding across the row)
```

- Chapter headings: index in mono + title in Clash; a sticky chapter rail on the left on desktop (≥ 1280px) highlights the current chapter.
- MDX components: `<Chapter n="05" title="Architecture">`, `<Figure>`, `<Gallery>`, `<ArchitectureDiagram>` (SVG authored per study), `<Metric value="30%" label="organic traffic" />`, `<ToolList tools={["claude","cursor"]} />`, `<Callout>`, `<Compare before after />`.
- Long text sits on a `.over-cove` veil (see `07 §4`) so the Light Cove never hurts readability.
- `generateStaticParams` from `registry.ts`; `generateMetadata` + OG image per slug; JSON-LD `CreativeWork`.

### Entry transition
Coming from the Work reel: shared-element (WebGL plane → hero image, `08 §1`). Coming from anywhere else: page wave, then hero clip-path inset 12% → 0 and title lines rise.

## 4. Writing guide (for Niraj)

- One sentence per idea; numbers over adjectives; "I" for what you did, "we" for the team.
- Every screenshot gets a caption that says *why* it matters, not *what* it is.
- Say what didn't work. Juries and hiring managers trust that.
- NDA: describe the shape of the problem and your decisions; never client names, data, or internal URLs unless cleared.

## 5. Acceptance
- [ ] Minimum 3 full case studies + the portfolio "how I built it" before launch
- [ ] Every case study has role, stack, year, at least one outcome, and alt text on every image
- [ ] Next-project link loops through all studies
- [ ] Each page passes Lighthouse a11y 100 and has a unique OG image
