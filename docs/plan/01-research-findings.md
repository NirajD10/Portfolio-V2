# 01 · Research findings

Studied on 20 Oct 2026 in a live browser: V1 at nirajdeshmukh.com (after the loading screen), every top-level page of pleurat.com plus one case study, and the Orano innovation slider + menu.

---

## 1. V1 — nirajdeshmukh.com (what we keep, what we drop)

**Tech:** Next.js, React, Tailwind, Framer Motion. Single page: Home → About → Experience (tabs) → Skills (carousels) → Projects → Connect footer.

**Brand values pulled from the live CSS (these stay in V2):**

| Role in V1 | Value |
|---|---|
| Primary purple (active nav pill, buttons, chips) | `#7149C6` / `rgb(113,73,198)` |
| Purple hover | `#7A52CF` |
| Light purple accent (links, highlights) | `#AD86FF` |
| Page background | `#111111` |
| Surface / cards | `#161616` |
| Scrollbar track / dividers | `#2E2E2E` |
| Text | `#F9FAFC` |
| Hero glow | `linear-gradient(#111111, rgba(113,73,198,.663), #111111)` |
| Font | Roboto (everything) |

**V1 hero:** giant outlined "NIRAJ" behind "Hello, I'm Niraj Deshmukh", purple horizontal glow band, "SOUND ON" vertical toggle on the right edge, pill nav centred, GitHub/LinkedIn/Resume top-right.

**V1 content to migrate (verbatim source for V2 copy):**

- Tagline: *Passionate Indian Full Stack Developer. Enthusiastic about coding, always learning and staying updated with the latest technologies.*
- About: born with hearing impairment; full-stack with JavaScript, React, Node/Express; front-end + back-end; B.Sc. Computer Science, Sir Parashurambhau College (S.P. College), Pune, 2020. → Keep Niraj's own words; update the stack and role.
- Experience:
  | Company | Role | Dates | Highlights |
  |---|---|---|---|
  | Pure Tech Codex Pvt. Ltd. | Software Developer | Nov 2024 – Present | Scalable web apps with React, Next.js, Tailwind, shadcn/ui, Node.js, Fastify, TypeScript; Generative AI + RAG solutions; apps that passed high-level VAPT security testing |
  | Osumare Marketing Solutions | Full Stack Developer – Intern | Jul 2024 – Nov 2024 | MERN + Tailwind; GitHub reviews; led team projects with Scrum; deployed on AWS EC2/S3, Docker, Jenkins; basic React Native |
  | Spellsys Technologies | Full Stack Developer | Feb 2022 – Feb 2023 | JS, React, Node/Express, MySQL/PostgreSQL, PHP; +30% site traffic through SEO; WordPress sites |
  | Innovhub Systems Pvt. Ltd. | Former Director | Sep 2021 – Oct 2023 | Led R&D + assembly for 3D-printer prototypes; built/maintained A3DXYZ and Spare3D sites (WordPress, React); ran e-commerce ops for 3D-printer spare parts; inventory management |
- Skills (34 items): HTML, CSS, JavaScript, TypeScript, React, Tailwind · Next.js, Framer Motion, EJS · Node, Express, Fastify, Firebase · PostgreSQL, Prisma, Drizzle, MySQL, MongoDB, Mongoose, Sequelize · Claude Code, Codex, Ollama, RAG, Generative AI, LangChain · AWS EC2, Jenkins, Docker, AWS S3, AWS SNS · Git · Figma, Photoshop
- Projects: PurePlantParadise (MERN indoor-plant e-commerce), Portfolio V1, Fitness Landing Page, WeathTemp.

**Drop in V2:**
- The 5–6 s loading screen. Awwwards juries score usability at 30%; a long forced wait costs more than it earns. V2 preloader ≤ 1.5 s, skipped on repeat visits (see `04`).
- Sound on by default. V2 sound is opt-in only.
- Roboto (generic) → professional display/body pair (see `02`).
- The four small projects as headline work → V2 leads with real work (GenAI/RAG at Pure Tech Codex, A3DXYZ/Spare3D, PurePlantParadise, this portfolio) and moves the small ones to an Archive list.

---

## 2. pleurat.com — what to borrow (structure and ideas, not assets)

**Global frame**
- Centred content column (~1430 px) with **1px vertical rules** on both sides; outside the column a faint horizontal line texture. Corner tick marks where sections meet.
- **Section tag chips** sitting on the top border of each section ("TRACKS", "BY THE NUMBERS", "AI TOOLS", "TEAMS") in the accent colour. → V2 uses the same device in purple with Geist Mono.
- Headings use a **two-tone split**: first phrase in ink, second phrase in a dimmed tone ("I design apps, websites, / and AI-powered systems"). → V2 keeps this pattern.
- Inline top nav + accent "Contact" button + theme toggle. → V2 replaces inline nav with the Orano-style full-screen menu.
- Footer: Contact / Sitemap / Elsewhere / Studio columns, a big "Explore portfolio" button, and a second animated strip (a robot walking along a circuit board carrying tool names).

**Hero (the part Niraj loves)**
- Left: big two-line title. Right: 3-line intro + two buttons (filled "View selected work ↗", ghost "About me ↗").
- Below: **"street view" strip**, inline SVG `viewBox="0 0 2320 151"`. Three parallax groups: `far`, `mid` (two copies at x=0 and x=2200 for a seamless loop), `near`. The walker is fixed at x≈300 (scale 1.62) while the layers translate left at different speeds.
- Walk cycle is pure CSS keyframes, 840 ms per step: separate animations for body bob, thigh, knee, foot, shoulder, carry-arm.
- A readout above the strip updates as the walker passes buildings: index ("03"), name ("Sena"), role ("AI-based SaaS app"), and "NEXT PROJECTS" on the right.

**Home sections in order:** Hero + street → "Primarily focused on" tracks (isometric line illustration + title + years + prev/next) → "Ten years, by the numbers" (pinned section ~2400 px tall, hatched bars rise to 10+, 150+, 50+, 10+) → "AI is part of how I design & build, every day" (10 square tool tiles; hover = accent border + logo animates) → "Where I've worked" (2×5 grid A1–A10: name, role, one line; hover tints cell) → project screen mosaic (scroll-driven zoomed grid) → footer CTA + strip.

**Other pages**
- `/work` — "The work, as it shipped." Sticky left index (project name, AI tag, one-liner, **Final work / Case study toggle**, "Read the full case study ↗"), right column shows the final screens or a case-study summary card. NDA notice block. "Everything, up close." gallery.
- `/work/<slug>` — back link, title, one-liner, **meta strip (Role · Tools · Year · Live)**, big hero, then chapters: overview → scope → alignment → personas → identity → journey map → product → design system → AI imagery → live → "What shipped".
- `/ai` — "AI does not design. It does the other 80%". Hero is a **pipeline diagram** (Prompt → Router → Build/Audit/Docs → Gate → Commit) with a little robot walking along it. Then "Here's what I built with AI", "AI as part of my everyday workflow" (8 numbered rows: category label · title · description), "The stack, and what each is for" (tiles).
- `/about` — centred statement paragraph (last line dimmed), illustrated home scene, story, "Where I've worked", e-book promo.
- `/contact` — "Let's talk", contact tiles (Email filled, others ghost), illustrated street where the character arrives at a house door.
- `/facts` — plain, text-only fact sheet (summary, at a glance, numbers, experience, case studies). Great for SEO and for AI search engines. → V2 copies the idea (`/facts` + `/llms.txt`).

**Take:** frame + rules, section chips, two-tone headings, hero layout, parallax strip mechanics, tracks, numbers, AI tools tiles, worked-at grid, work index with toggle, case-study meta strip, AI pipeline hero, contact arrival scene, facts page.
**Don't take:** their illustrations, their cream/amber palette, their copy, their code. Awwwards penalises derivative work; the Pune ride, the purple identity and the WebGL layers make V2 its own.

---

## 3. Orano innovation — the menu we're re-creating

Observed behaviour (desktop, 1568×751):

- **Trigger:** top-right text label ("LIVE THE EXPERIENCES") + a 3-line icon with uneven line lengths. Top-left: a small accent bar + uppercase tagline.
- **Open:** URL changes to `/menu`. A **pixel-block glitch wipe** sweeps across the screen from right to left: horizontal strips of rectangular blocks of random widths in hot colours (yellow, orange, salmon, mauve, slate), with the dark page visible through gaps. Behind the wave the screen settles to deep navy with faint, slowly drifting dark-blue blocks and twinkling particles.
- **Items:** right-aligned, very wide letter-spacing, thin uppercase techno face (Blender Pro), ~40 px cap height on a 751 px viewport. Index numbers 01–04 in the accent yellow sit in a column to the right.
- **Hover:** hovered item goes full white, others stay grey; two thin horizontal **guide lines snap above and below** the hovered item and a vertical guide line moves to the index column — like a targeting reticle. Background blocks keep drifting.
- **Close:** trigger becomes "CLOSE —— ×". Closing fades the blocks and the page returns; the page title re-enters with an **RGB-split scramble** (a letter shown with red/green offsets) and a particle burst.
- Stack seen: GSAP, a full-screen 2D canvas for the blocks, fonts Blender Pro + Nunito Sans.

**V2 translation:** same choreography, Niraj's palette (purples, lavender, a hot magenta, cool blue), Clash Grotesk thin uppercase for items, Geist Mono for indices/HUD, Light Cove lanes glowing behind the blocks. Full spec in `06-menu-overlay.md`.

---

## 4. The two effect references

- **Grainy Carousel** (`references/ref-grainy-carousel.png`): row of images on black; the outer ends of the row disintegrate into coloured grain that drifts outward past the image edge; centre images stay crisp. Spec in `08`.
- **Light Cove** (`references/ref-light-cove.png`): hundreds of thin light lanes run down a back wall, curve through a cove, and run across a reflective floor toward the viewer; pulses travel along them; soft bloom; mostly blue/amber on black. V2 recolours to purple-led and runs it at low intensity behind content. Spec in `07`.

---

## 5. Awwwards fit

Awwwards juries score **Design 40% · Usability 30% · Creativity 20% · Content 10%**. Implications:
- Creativity: the Pune ride (day/night with theme), the Orano-grade menu, two bespoke shaders. That's the "wow".
- Usability: no long preloader, real keyboard support, reduced-motion mode, fast LCP, readable type, working on mobile.
- Content: case studies with real problems, decisions and results — not screenshots alone.
- Design: one consistent system (purple, rules, chips, mono labels) applied everywhere, including 404 and `/facts`.
