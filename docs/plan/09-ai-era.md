# 09 · AI tools & the AI Era page

Niraj's daily AI stack is a headline feature: a strip on Home (`04 · H4`) and a full page at `/ai`. Tone: practical and honest — AI speeds up the work; Niraj owns architecture, review, security and what ships.

---

## 1. The tools (source of truth: `src/content/tools.ts`)

Primary six, in this order. "Use" lines are **drafts** — Niraj rewrites them in his own words.

| Slug | Name shown | Maker | Draft "what I use it for" (hover line on Home, longer on `/ai`) |
|---|---|---|---|
| `chatgpt` | ChatGPT | OpenAI | Research, brainstorming, explaining unfamiliar APIs, first drafts of copy and docs |
| `claude` | Claude | Anthropic | Long-context reasoning: specs, architecture reviews, refactor plans, code review; Claude Code in the terminal for multi-file changes |
| `antigravity` | Antigravity | Google | Agent-first IDE: hand off multi-step tasks across editor, terminal and browser, then review the agent's plans and screenshots |
| `manus` | Manus | Manus AI | Autonomous agent for research-heavy, multi-step jobs — competitor scans, data gathering, report drafts |
| `cursor` | Cursor | Anysphere | Day-to-day coding in existing codebases: inline edits, multi-file refactors, quick fixes |
| `google-ai-mode` | Google AI Mode | Google | Fast, cited answers for docs, errors and "what changed in v-next" questions |

Secondary chips (from V1 skills): **Claude Code · Codex · Ollama · LangChain · RAG · Generative AI**.

```ts
// src/content/tools.ts (shape)
export type Tool = {
  slug: string; name: string; maker: string;
  logo: string;               // /brand/<slug>.svg (official asset)
  logoMono?: boolean;         // true if brand rules allow a single-colour version
  use: string;                // one line (Home hover)
  detail: string;             // 2–3 lines (/ai)
  stages: Stage[];            // where it appears in the pipeline (§3)
  url: string;
};
type Stage = "research" | "plan" | "build" | "automate" | "review" | "ship";
```

**Logos:** download from each company's official brand/press page, keep their licence notes in `/docs/licences/brands.md`, don't recolour where the brand rules forbid it (then the rest state is greyscale via CSS `filter: grayscale(1) opacity(.7)` instead of recolouring the paths). Never hotlink.

## 2. Home strip (`AiTools.tsx`)

- Chip `03 / AI TOOLKIT`; heading "Six AI tools, / *open every workday.*"; one-line intro.
- 6 square tiles (desktop: one row of 6; tablet: 3×2; mobile: 2×3). Tile spec in `02 §4`.
- Hover/focus: border → accent, logo → full colour + micro-animation (below), the `use` line slides up from the tile's bottom edge (Motion, 0.25 s).
- Micro-animations (CSS/GSAP, ≤ 0.8 s, once per hover): ChatGPT knot rotates 30°; Claude burst pulses (scale 1 → 1.12 → 1); Antigravity mark floats up 4px and bobs; Manus mark tilts; Cursor cube turns (fake 3D via skew); Google mark spins its four colours once.
- Reveal on scroll: tiles enter with `stagger 0.06` from y 24px.
- CTA "See how I work with AI →".

---

## 3. `/ai` page

### A1 · Hero
- Title: "AI writes the first draft. / *I own what ships.*" (alt: "Built with AI. / *Reviewed by me.*")
- Right intro: "I use AI across the whole workflow — research, planning, coding, testing and automation — to ship faster without lowering the bar on architecture, security or quality."
- Buttons: `The workflow ↙` (scrolls to A3) · `What I built ↙` (to A2).
- **Pipeline scene** (SVG, same line-art language as the ride): a road with six "stations" (small booths with signboards). A **mini MT-15 with Niraj** rides through them; at each station the booth lights up, its tool logos pop on the roof, and a mono caption types out.

| Station | Caption (mono) | Tools on the roof |
|---|---|---|
| RESEARCH | `scan docs · compare options` | Google AI Mode, ChatGPT, Manus |
| PLAN | `spec.md · architecture · risks` | Claude, ChatGPT |
| BUILD | `feat/rag-search · 42 files` | Cursor, Antigravity, Claude Code |
| AUTOMATE | `agents · data · reports` | Manus, Antigravity |
| REVIEW | `tests ✓ · VAPT checklist ✓` | Claude, Cursor |
| SHIP | `deploy → prod` | (a small rocket-shaped flag; no logo) |

  Driven by a GSAP timeline that loops every ~14 s; scroll velocity speeds it up like the hero. Reduced motion: bike parked at SHIP, all booths lit.

### A2 · "Shipped / *with AI in the loop.*" — chip `SHIPPED`
Cards (2 per row) linking to case studies:
- **GenAI / RAG platform** (Pure Tech Codex, NDA-safe summary) — retrieval over company documents, grounded answers, security-reviewed (VAPT).
- **This portfolio** — planned with Claude, built with Claude Code + Cursor, shaders iterated with AI; "how it was made" case study.
- [[TBD]] — any internal tool/automation Niraj built with agents.

### A3 · "How AI fits / *into my day.*" — chip `WORKFLOW`
Numbered rows like pleurat's (index · category label · title · description). Hover: row tints, index turns accent, a small line icon draws (DrawSVG).

| # | Label | Title | Draft description |
|---|---|---|---|
| 01 | RESEARCH | Research & discovery | Compare libraries, read changelogs, summarise docs before writing a line of code |
| 02 | PLANNING | Specs & architecture | Turn a brief into a spec, data model and task list; stress-test it for edge cases |
| 03 | DEVELOPMENT | Code & refactors | Scaffold features, multi-file refactors, migrations — every diff reviewed |
| 04 | DEBUGGING | Debugging | Paste the stack trace, get hypotheses, verify them in the code myself |
| 05 | TESTING | Tests & validation | Generate test cases, edge cases and accessibility checks |
| 06 | SECURITY | Security review | Walk code against VAPT-style checklists before the real audit |
| 07 | AGENTS | Agents & automation | Multi-step agents (Antigravity, Manus) for research, data and repetitive tasks |
| 08 | AI PRODUCTS | Building AI features | RAG pipelines, Generative AI features, local models with Ollama, LangChain orchestration |

### A4 · "My AI stack, / *tool by tool.*" — chip `STACK`
The six tiles again, larger (2 per row on desktop), each with logo, name, maker, the `detail` paragraph, and the stations it appears in as mono chips. Secondary chips row below.

### A5 · Principles — chip `RULES`
Four short cards: **Human in the loop** (I read every diff) · **Security first** (AI output goes through the same VAPT mindset) · **Measure, don't vibe** (tests and metrics decide) · **Right tool, right job** (no single-tool loyalty).

### A6 · Footer (shared)

---

## 4. Acceptance
- [ ] All six tools present with official logos and licence notes recorded
- [ ] Hover + keyboard focus both reveal the use line; tiles are links to the tool's site (`rel="noopener"`, opens in new tab with visible ↗)
- [ ] Pipeline scene loops smoothly, pauses off-screen, has a pause button and a reduced-motion still
- [ ] Copy reviewed by Niraj (no claims he doesn't stand behind)
