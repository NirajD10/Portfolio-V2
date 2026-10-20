# 06 · Cinematic menu overlay (Orano-inspired)

Full-screen, dark, glitchy, staggered — the site's only navigation. Behaviour observed on the Orano innovation experience is in `01 §3`; this file is the V2 build spec.

---

## 1. Anatomy

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ▌ BUILDING WEB, APPS & AI — FROM PUNE                       CLOSE ──── ✕   │  ← HUD top
│ ┊                    ┊                      ┊                ┊             │  ← faint vertical grid lines (4)
│                                                                            │
│                                              H O M E          01           │
│ ─────────────────────────────────────────────────────────────────────────  │  ← guide line (snaps to hovered item)
│                                              W O R K          02           │
│ ─────────────────────────────────────────────────────────────────────────  │
│                                           A I   E R A         03           │
│                                            A B O U T          04           │
│                                         C O N T A C T         05           │
│                                                                            │
│ niraj.            PUNE 18.52°N 73.86°E · 09:41 IST    ◐ THEME  ♪ SOUND  ⏸ MOTION │  ← HUD bottom
│ GitHub ↗  LinkedIn ↗  Resume ↗  hello@…                        © 2026       │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Background:** `--menu-950` (`#0B0912`) + the glitch-block layer (shader, §4) + Light Cove lanes at intensity 0.55 behind the blocks (reuse the scene with a `menu` preset) + drifting particles.
- **Items:** right-aligned to column 9 of 12; `menu-item` type (Clash Grotesk 300, uppercase, tracking 0.28em). Idle colour `#9A96B0` (6.9:1 on the overlay), hover/active `#F9FAFC`.
- **Indices:** Geist Mono 12px, `#AD86FF`, in a column 48px right of the items, vertically centred on each item.
- **Sub-labels** (appear on hover, under the index, Geist Mono 11px, ink-muted): `HOME → 4 SECTIONS`, `WORK → {n} PROJECTS` (n from `registry.ts`), `AI ERA → 6 DAILY TOOLS`, `ABOUT → SINCE 2021`, `CONTACT → REPLIES IN 24H`.
- **Grid lines:** 4 vertical 1px lines at 12% white, 2 horizontal guide lines (full width) that bracket the hovered item.
- **HUD:** top-left accent bar (4×20px `#7149C6`) + tagline; top-right trigger in its "CLOSE ──── ✕" state; bottom row with wordmark, coordinates + live IST time, theme / sound / motion toggles, socials, resume, email, ©.
- **Current page** is marked: its index shows `●` before the number and its text is white at rest.

## 2. Trigger button (in the header)

- Label `MENU` (Geist Mono, label style) + icon of 3 lines with uneven lengths (24px, 16px, 20px; 1.5px stroke; 6px gap), right-aligned.
- **Open morph (0.45 s, `power3.inOut`):** top line rotates 45° and moves to centre, bottom line −45° to centre, middle line `scaleX(0)` from the right; label scrambles `MENU` → `CLOSE` and a 40px line draws between label and icon (`scaleX` 0→1 from the right).
- **Close morph:** exact reverse.
- `<button aria-expanded aria-controls="site-menu" aria-label="Open menu">` — label toggles to "Close menu".

---

## 3. Timelines (GSAP)

All in one `gsap.timeline({ paused: true })` built once per mount; open = `play()`, close = `timeScale(1.35).reverse()`. Item/HUD tweens use `fromTo` so reversing is exact.

### Open

| t (s) | What |
|---|---|
| 0.00 | `lenis.stop()`; set `inert` on `<main>`, header and footer; mount overlay (`visibility: visible`), mount glitch canvas; trigger morph starts |
| 0.00 → 1.10 | Glitch shader `uProgress` 0 → 1 (`power3.inOut`): coloured block wave sweeps **right → left** revealing the dark overlay; residual blocks remain |
| 0.10 → 0.80 | Page behind: `scale 1 → 0.985`, `filter: brightness(0.7)` — only on `<main>`, subtle push-back (skip on tier 1) |
| 0.40 → 1.10 | Items enter one by one (`stagger 0.07`): **ScrambleText** from glyph set `▖▘▝▗▚▞░▒` to the real word (0.6 s each), with an RGB split (`text-shadow: -2px 0 #C86BFA, 2px 0 #5B8CFF`) fading 2px → 0 over 0.35 s; `x: 40 → 0`, `opacity 0 → 1` |
| 0.55 → 1.10 | Indices fade in (`stagger 0.07`) |
| 0.70 → 1.20 | HUD elements slide `y: 12 → 0` + fade (`stagger 0.04`); grid lines draw (`scaleY 0 → 1` from top) |
| 1.20 | Focus moves to the first item (or the current page's item); focus trap active |

### Close (reverse at 1.35×, ≈ 0.9 s)
Triggered by: the ✕ button, `Esc`, clicking empty overlay space (any click whose target isn't a link, button or the HUD), or selecting an item. On complete: unmount glitch canvas, remove `inert`, `lenis.start()`, return focus to the trigger (unless navigating).

### Selecting an item
1. Clicked item flashes: colour `#F9FAFC → #AD86FF → #F9FAFC` (0.18 s) + a 1-frame RGB split of 4px; other items fade to 0.15.
2. **Same page, different section** (e.g. Home sections): start the close timeline; at 60% of it call `lenis.scrollTo(target, { duration: 1.2, easing: easeInOutCubic })`.
3. **Different route:** the overlay is already fully opaque (`uProgress = 1`), so: fade items + HUD out (0.25 s) → `router.push(href)` behind the overlay → wait for the new page's first paint (the page calls `signalPageReady()` in an effect) → tween `uProgress` 1 → 0, so the wave sweeps back and reveals the new page. The menu's wave doubles as the page transition. Regular in-page links reuse it the other way round: 0 → 1 (cover) → push → 1 → 0.
4. Update `aria-current="page"` on the new item.

---

## 4. Glitch-block shader (`webgl/menu-glitch/shaders/glitch.frag`)

Full-screen quad in its own small R3F `<Canvas>` inside the overlay (mounted only while the menu is open). `uProgress` is tweened by GSAP.

```glsl
uniform float uProgress;     // 0 = closed (transparent), 1 = open (dark + residual blocks)
uniform float uTime;
uniform vec2  uRes;
uniform vec3  uHot[5];       // #7149C6, #AD86FF, #C86BFA, #5B8CFF, #F3EEFF
uniform vec3  uBase;         // #0B0912
uniform vec3  uResidual;     // #1E1239 / #241A4A mix
varying vec2  vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  float rows = uRes.y > 900.0 ? 28.0 : 18.0;
  float row  = floor(vUv.y * rows);
  float rr   = hash(vec2(row, 1.0));

  // variable-width columns per row: denser rows have narrower blocks
  float cols = mix(8.0, 34.0, rr);
  float xs   = vUv.x * cols + hash(vec2(row, 7.0)) * 5.0;
  float col  = floor(xs);
  float cr   = hash(vec2(row, col));

  // reveal time: right side first, jittered per block
  float cx     = clamp((col + 0.5 - hash(vec2(row, 7.0)) * 5.0) / cols, 0.0, 1.0); // block centre in uv.x
  float tStart = (1.0 - cx) * 0.5 + cr * 0.25;                      // 0..0.75
  float local  = (uProgress - tStart) / 0.22;                        // 0..1 while the block is "hot" (all cool by 0.97)

  vec3  col3 = vec3(0.0);
  float a    = 0.0;

  if (local >= 0.0) {
    // after the wave passes: overlay base
    col3 = uBase; a = 1.0;
    // the hot phase: bright block, decaying
    float hot = 1.0 - smoothstep(0.0, 1.0, local);
    if (hot > 0.0 && cr > 0.25) {
      vec3 h = uHot[int(mod(floor(cr * 13.0), 5.0))];
      col3 = mix(col3, h, hot * (0.55 + 0.45 * cr));
    }
    // residual drifting blocks (20% of cells), visible after the wave
    if (cr > 0.8) {
      float drift = sin(uTime * 0.25 + row * 1.7) * 0.015;
      float on = step(0.5, fract(vUv.x * cols + drift * cols));      // half-cell flicker
      col3 = mix(col3, uResidual, (1.0 - hot) * 0.55 * on);
    }
  }
  gl_FragColor = vec4(col3, a);
}
```

Notes:
- Reversing `uProgress` plays the wave backwards (left → right) — matches "reverse animation" for close.
- The page underneath is fully hidden once every block has started (`uProgress ≥ 0.75`); route changes happen at `uProgress = 1` (see §3).
- Twinkling particles: a separate `<Points>` (300 points tier 2, 120 tier 1) with slow random drift and alpha flicker.
- **CSS fallback (tier 0 / no WebGL):** 16 horizontal strips (`div`s), each `scaleX` 0 → 1 from the right with `stagger: { each: 0.03, from: "random" }`, coloured from the hot palette, then fading to the base colour.

---

## 5. Hover & focus (same visuals for mouse hover and keyboard focus)

Using `gsap.quickTo` for the guide lines (0.45 s, `expo.out`):
- Top guide line → `item.top − 10px`, bottom guide line → `item.bottom + 10px`.
- The nearest vertical grid line slides to the index column's x.
- Hovered item: colour → `#F9FAFC`, tracking 0.28em → 0.31em (0.35 s), one RGB-split jitter (2 frames, 2px) on enter.
- Other items: opacity → 0.4.
- Index: `01` → `→ 01` (arrow slides in 8px), sub-label types in with ScrambleText (0.3 s).
- Cursor area: the whole row (item + index) is the hit area (min 48px tall).
- Leaving the list: guide lines ease back to their rest positions (above the first / below the last item), all items back to idle.

---

## 6. Accessibility

- Overlay: `<div id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu">` containing `<nav aria-label="Primary"><ol>…</ol></nav>`.
- Each link keeps its real name: `<a href="/work" aria-label="Work"><span aria-hidden="true">{scrambledText}</span></a>`.
- Focus trap (custom: first/last focusable loop on Tab/Shift+Tab), `Esc` closes, focus returns to the trigger.
- Background is `inert` while open; `aria-expanded` on the trigger mirrors state.
- **Reduced motion:** no wave, no scramble, no RGB split, no page push-back. Overlay fades in over 200 ms; items appear together; guide lines jump without easing. Light Cove behind is a static frame.
- Motion toggle in the HUD (`⏸ MOTION`) sets a site-wide "reduce motion" preference (saved in `localStorage`) that behaves exactly like `prefers-reduced-motion`.

## 7. Mobile (< 768px)

- Items centred, `clamp(2rem, 9vw, 3rem)`, tracking 0.18em, indices to the right of each word.
- Guide lines follow the touched item on `pointerdown`.
- HUD bottom collapses to two rows: toggles; socials.
- Shader rows = 14; particles off.

## 8. Acceptance

- [ ] Open/close feel identical in reverse; no flash of the page between wave and overlay
- [ ] Hover guide lines track items smoothly in both directions, also with keyboard focus
- [ ] Route change happens under full block cover; no layout jump on the new page
- [ ] Esc, outside click, ✕ and item click all close; focus lands correctly each time
- [ ] Screen reader announces "Site menu, dialog" and real item names (no scrambled glyphs)
- [ ] Reduced motion and tier-0 fallback both work
- [ ] Glitch canvas is destroyed after close (check `renderer.info` / no lingering contexts)
