# 02 · Design system

V1's purple identity stays. V2 adds a light theme, a professional type system, a structural "frame" and motion tokens. Every value below is a token — components never use raw hex.

---

## 1. Colour

### 1.1 Brand palette (V1 values marked ★, kept exactly)

| Token | Hex | Use |
|---|---|---|
| `purple-50` | `#F3EEFF` | light-mode tinted panels |
| `purple-100` | `#E6DCFF` | light-mode hover tint |
| `purple-200` | `#CDB8FF` | light-mode chips |
| `purple-300` ★ | `#AD86FF` | dark-mode accent text, links, index numbers, focus ring |
| `purple-400` | `#8F67EA` | shader lanes, glow |
| `purple-450` ★ | `#7A52CF` | primary hover |
| `purple-500` ★ | `#7149C6` | **primary fill**: buttons, chips, active states, the brand |
| `purple-600` | `#5B37A6` | light-mode accent text, pressed |
| `purple-700` | `#462A82` | deep accents, illustration shadows |
| `purple-800` | `#321E5E` | dark-mode tinted panels |
| `purple-900` | `#1E1239` | menu overlay base tint |
| `ink-950` ★ | `#111111` | dark background / light-mode ink |
| `ink-900` ★ | `#161616` | dark surface |
| `ink-850` | `#1C1A22` | dark raised surface (slight purple) |
| `ink-700` ★ | `#2E2E2E` | dark decorative lines |
| `paper-50` ★ | `#F9FAFC` | light background / dark-mode ink |
| `paper-0` | `#FFFFFF` | light surface |
| `paper-100` | `#F1EEF8` | light raised surface (lavender) |
| `menu-950` | `#0B0912` | menu overlay background |

Supporting colours (illustration and shaders only, never UI text): `blue-400 #5B8CFF`, `magenta-400 #C86BFA`, `amber-300 #F2B76B` (headlight, street lamps), `teal-300 #3FC6A8` (MT-15 rim stripe), `gold-400 #D4A72C` (MT-15 forks).

### 1.2 Semantic tokens

| Semantic token | Light | Dark | Notes (contrast measured) |
|---|---|---|---|
| `--bg` | `#F9FAFC` | `#111111` | page |
| `--surface` | `#FFFFFF` | `#161616` | cards, tiles |
| `--surface-2` | `#F1EEF8` | `#1C1A22` | hover cells, meta strips |
| `--ink` | `#111111` | `#F9FAFC` | 18.1:1 both |
| `--ink-muted` | `#55526A` | `#A9A6B8` | body secondary · 7.2:1 / 7.9:1 |
| `--ink-dim` | `#7D7896` | `#7E7A93` | **second line of two-tone headings only** (large text) · 4.0:1 / 4.6:1 |
| `--line` | `#E3DFEE` | `#2E2E2E` | decorative rules, frame lines |
| `--line-strong` | `#8C88A3` | `#6F6B82` | input borders, control outlines · 3.3:1 / 3.7:1 |
| `--accent` | `#7149C6` | `#7149C6` | fills (buttons, chips) |
| `--accent-hover` | `#7A52CF` | `#7A52CF` | |
| `--accent-ink` | `#FFFFFF` | `#FFFFFF` | text on accent · 6.1:1 |
| `--accent-text` | `#5B37A6` | `#AD86FF` | purple text/links · 7.9:1 / 6.9:1 |
| `--accent-soft` | `#F3EEFF` | `#321E5E` | tinted backgrounds |
| `--focus` | `#5B37A6` | `#AD86FF` | 2px outline, 3px offset |
| `--texture` | `rgba(113,73,198,.06)` | `rgba(173,134,255,.05)` | outside-frame line texture |

Rule: `#7149C6` on `#111111` is 3.1:1 → fine for buttons, icons, borders and large display text, **not** for body text.

### 1.3 `src/styles/tokens.css` (starting point)

```css
@import "tailwindcss";

:root,
[data-theme="light"] {
  --bg: #F9FAFC; --surface: #FFFFFF; --surface-2: #F1EEF8;
  --ink: #111111; --ink-muted: #55526A; --ink-dim: #7D7896;
  --line: #E3DFEE; --line-strong: #8C88A3;
  --accent: #7149C6; --accent-hover: #7A52CF; --accent-ink: #FFFFFF;
  --accent-text: #5B37A6; --accent-soft: #F3EEFF; --focus: #5B37A6;
  --texture: rgba(113, 73, 198, 0.06);
  color-scheme: light;
}
[data-theme="dark"] {
  --bg: #111111; --surface: #161616; --surface-2: #1C1A22;
  --ink: #F9FAFC; --ink-muted: #A9A6B8; --ink-dim: #7E7A93;
  --line: #2E2E2E; --line-strong: #6F6B82;
  --accent: #7149C6; --accent-hover: #7A52CF; --accent-ink: #FFFFFF;
  --accent-text: #AD86FF; --accent-soft: #321E5E; --focus: #AD86FF;
  --texture: rgba(173, 134, 255, 0.05);
  color-scheme: dark;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-ink-dim: var(--ink-dim);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-ink: var(--accent-ink);
  --color-accent-text: var(--accent-text);
  --color-accent-soft: var(--accent-soft);
  --font-display: var(--font-clash), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}
```

Default theme: **system**. Toggle in header and menu HUD. Theme switch uses the View Transitions API: a circular reveal growing from the toggle button (`document.startViewTransition`, clip-path circle), falling back to a 200 ms crossfade. The ride scene switches morning ↔ night at the same moment (see `05`).

---

## 2. Typography

### 2.1 Families

| Role | Family | Source | Why |
|---|---|---|---|
| Display (hero, section titles, menu items, big numbers) | **Clash Grotesk** (variable, 200–700) | Fontshare, self-hosted woff2 via `next/font/local` | Confident geometric grotesk with character; reads "crafted", not "template". Thin weights work for the Orano-style wide-tracked menu. |
| Body + UI | **Geist** | `geist` npm package / `next/font` | Highly legible, neutral, made for interfaces; pairs cleanly with Clash. |
| Labels, indices, chips, HUD, code | **Geist Mono** | `geist` | Gives the "engineer's notebook" feel: `01`, `A3`, `PUNE · 09:41 IST`. |

Before shipping, confirm the Fontshare licence page for Clash Grotesk covers commercial web use and keep a copy of it in `/docs/licences/`.
Alternative if Niraj wants a softer look: swap Geist for **Satoshi** (Fontshare). Don't add a fourth family.

### 2.2 Scale (fluid, `clamp()`)

| Token | Size | Line height | Tracking | Family / weight |
|---|---|---|---|---|
| `display-xl` | `clamp(3rem, 6.2vw, 6.5rem)` | 0.98 | -0.035em | Clash 500 — hero title |
| `display-lg` | `clamp(2.5rem, 4.6vw, 4.75rem)` | 1.02 | -0.03em | Clash 500 — section titles |
| `display-md` | `clamp(1.75rem, 2.8vw, 2.75rem)` | 1.08 | -0.02em | Clash 500 — card titles, numbers |
| `menu-item` | `clamp(2.25rem, 5.2vw, 5rem)` | 1.1 | 0.28em, uppercase | Clash 300 |
| `title` | 1.375rem | 1.3 | -0.01em | Geist 600 |
| `body-lg` | 1.125rem | 1.6 | 0 | Geist 400 — hero intro |
| `body` | 1rem | 1.6 | 0 | Geist 400 |
| `small` | 0.875rem | 1.5 | 0 | Geist 400 |
| `label` | 0.75rem | 1.2 | 0.14em, uppercase | Geist Mono 500 — chips, eyebrows |
| `index` | 0.75rem | 1 | 0.08em | Geist Mono 500 — `01`, `A3` |

Two-tone heading pattern: `<h2>Teams I've <span class="text-ink-dim">built with.</span></h2>`. Keep the dim part ≥ 24 px so its contrast counts as large text.

---

## 3. Layout & the frame

- **Frame:** content column `max-width: 1440px`, centred, with 1px `--line` rules on the left and right edges from top to footer. Outside the column: repeating 1px horizontal lines every 4px in `--texture` (CSS `repeating-linear-gradient`).
- **Section boundaries:** full-column 1px top rule + corner ticks (8px L-shapes) at both ends.
- **Section chip:** sits on the top rule, left-aligned at the column's inner padding: `label` type, `--accent` fill, `--accent-ink` text, 4px × 10px padding, no radius (square — matches the engineering-drawing feel).
- **Grid:** 12 columns, 24px gutters ≥ 1024px; 8 columns, 20px ≥ 640px; 4 columns, 16px mobile. Inner column padding: `clamp(16px, 2.2vw, 32px)`.
- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Section vertical padding: `clamp(64px, 10vw, 160px)`.
- **Radius:** 0 for frame, chips, tiles, buttons (sharp, technical). 12px only on images inside cards and on the menu's focus targets. Pills nowhere except the availability badge.
- **Elevation:** no drop shadows. Depth comes from lines, surfaces and WebGL.

---

## 4. Components (visual spec)

- **Button / primary:** `--accent` fill, `--accent-ink` text, Geist 500 15px, 16px × 22px padding, ↗ icon right. Hover: fill `--accent-hover`, arrow moves 2px up-right (Motion, 180 ms). Press: scale .98.
- **Button / ghost:** transparent, 1px `--line-strong` border, `--ink` text. Hover: `--surface-2` fill.
- **Text link:** `--accent-text`, underline 1px offset 4px, underline draws left→right on hover (scaleX).
- **Tool tile:** square, `--surface-2` fill, 1px `--line` border, logo centred (monochrome in rest state), name below in `label`. Hover: border `--accent`, logo switches to brand colour and plays its micro-animation, a one-line "what I use it for" slides up.
- **Worked-at cell:** index `A1` (mono, accent-text), company (title), role (label, ink-muted), one line (small). Hover: `--surface-2` fill, index turns accent.
- **Meta strip:** 4 equal cells (Role · Stack · Year · Live/Code) with `label` headings, `--surface-2` fill, 1px rules.
- **Availability badge:** pill, 8px dot pulsing in `#3FC6A8` + "Open to freelance" (edit in `site.ts`).
- **Local time chip:** `PUNE · 09:41 IST` in Geist Mono, updates every minute (`Intl.DateTimeFormat`, `Asia/Kolkata`).
- **Cursor:** native cursor kept (accessibility + usability). Optional enhancement on desktop: a 10px purple dot follower that grows over links and shows "VIEW" over work cards. Hidden on touch and reduced motion.

---

## 5. Motion tokens (`src/lib/motion.ts`)

```ts
export const ease = {
  out: "expo.out",          // entrances, hovers
  inOut: "power3.inOut",    // menu wave, page transitions
  soft: "sine.inOut",       // loops, bobbing
  snap: "back.out(1.6)",    // small confirmations
} as const;

export const dur = {
  micro: 0.18,   // hover, press
  short: 0.35,   // small reveals
  base: 0.6,     // text line reveals
  long: 1.1,     // menu wave, section intros
  scene: 2.4,    // ride stop/start
} as const;

export const stagger = { chars: 0.018, words: 0.04, lines: 0.08, items: 0.07 } as const;
```

**Signature entrances**
- Headings: SplitText into lines (`mask: "lines"`), lines rise from 100% with `ease.out`, `dur.base`, `stagger.lines`. Trigger at `top 80%`.
- Section chips: ScrambleText from `▖▘▝▗` glyphs to the label, 0.5 s.
- Body copy: opacity 0 → 1 + y 12px, 0.5 s, after the heading.
- Numbers: count up with GSAP (`snap: 1`), 1.2 s.
- Images: clip-path inset 12% → 0 + scale 1.08 → 1.

**Reduced motion:** all of the above become a 150 ms opacity fade, or nothing. The ride shows a still frame (bike parked mid-street). Shaders render one static frame.

---

## 6. Iconography & illustration style

- UI icons: `lucide-react`, 1.5px stroke, 18/20px.
- Illustration (ride scene, AI pipeline, tracks, 404): **line-art with flat fills**. Stroke 1.25px at 1× in `--ink` at 70%; fills from a restricted set: `--surface`, `--surface-2`, `purple-100/200` in light mode; `ink-850`, `purple-800` in dark mode; brand purple for highlights (the bike, the rider's backpack zip, signage). One illustration language across the site.
- Brand logos (AI tools): official SVGs from each brand's press/brand page, stored in `/public/brand/`, monochrome by default via `currentColor` where the brand guidelines allow, full colour on hover.
