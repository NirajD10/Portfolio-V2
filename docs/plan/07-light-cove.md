# 07 · Light Cove — WebGL background

> Lanes of light pouring down a wall, round a cove and out across a mirrored floor toward you, pulses running along every one, with a soft bloom. A background for content to sit on — **run at low intensity**.

Reference: `references/ref-light-cove.png`. Lives in the shared Stage (`03 §5`) inside a fixed full-viewport `<View>`, so it sits behind every page.

---

## 1. Scene geometry (world units, camera looking at the wall)

```
  side view (x into the screen)

  y
  ▲   wall (z = 0)
  │   │  lanes run straight down
  H ┤   │
  │   │
  R ┤   ╰─╮  cove: quarter circle, radius R, centre (y = R, z = R)
  │      ╰──────────────────────────────►  floor (y = 0), lanes run toward the camera
  0 ┼──────────┴──────────────────────────┴──── z
            z = R                        z = Zmax (just behind the camera's near plane)
```

- `H = 6`, `R = 1.2`, `Zmax = 7.5`, lanes spread across `x ∈ [-7, 7]`.
- Camera: `PerspectiveCamera(fov 38)`, position `(0, 1.35, 8.2)`, looking at `(0, 2.2, 0)`. Floor lanes fan out naturally through perspective, as in the reference.
- **Lane path** `P(s)`, `s ∈ [0, 1]` by arc length: wall segment `(x, H→R, 0)` → cove arc `(x, R − R·sin θ, R − R·cos θ)` for θ 0→90° → floor segment `(x, 0, R→Zmax)`.
- Lane count: 180 (tier 2+), 96 (tier 1). Distribute x with a slight centre bias: `x = sign(u)·pow(|u|, 0.85)·7` where `u` is evenly spaced in [−1, 1] plus jitter ±0.25 of the spacing. 10% of lanes are "short": they start lower on the wall (`H' = H·rand(0.4, 0.9)`) — breaks the comb look.
- **Ribbon geometry:** each lane is a strip of `M = 96` segments; the two vertices at each sample are offset ±`w/2` along **x** (lanes live in a y–z plane, so x is always the ribbon's width direction). All lanes merged into one `BufferGeometry` → one draw call.
  - Attributes: `position`, `aS` (0 top → 1 nearest the camera), `aAcross` (−1 / +1), `aSeed` (per lane, 0–1), `aColor` (per lane).
  - Widths: core `w = 0.014`; a second "glow" geometry with the same paths, `w = 0.09`, used for fake bloom.

```ts
// buildLanes.ts (shape)
export function buildLanes({ count, segments, width, H, R, zMax, xSpan }: Opts) {
  const total = H - R + (Math.PI * R) / 2 + (zMax - R);       // path length
  // for each lane, for i in 0..segments: s = i / segments → point on wall / cove / floor by arc length
  // push (x - w/2, y, z) and (x + w/2, y, z); aS = s; aAcross = -1 / +1; aSeed = laneSeed; aColor = laneColor
  // indices: two triangles per segment
}
```

---

## 2. Palette

Weighted random per lane (Niraj's purple leads; the reference's blue/amber mix becomes accents):

| Weight | Colour | |
|---|---|---|
| 40% | `#7149C6` | brand |
| 25% | `#8F67EA` | |
| 15% | `#AD86FF` | |
| 12% | `#5B8CFF` | cool accent |
| 5% | `#C86BFA` | magenta accent |
| 3% | `#F2B76B` | warm sparks (very few, like the reference) |

---

## 3. Shaders

### `lane.vert`
```glsl
attribute float aS; attribute float aAcross; attribute float aSeed; attribute vec3 aColor;
uniform vec2 uParallax;            // mouse, −1..1, smoothed
varying float vS; varying float vAcross; varying float vSeed; varying vec3 vColor;
void main() {
  vS = aS; vAcross = aAcross; vSeed = aSeed; vColor = aColor;
  vec3 p = position;
  p.x += uParallax.x * 0.15 * (1.0 - aS);   // far parts move slightly more → depth
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
```

### `lane.frag` (core and glow use the same shader with different uniforms)
```glsl
uniform float uTime, uIntensity, uPulseSpeed, uPulseFreq, uScrollBoost, uCoreSharp, uBase;
varying float vS; varying float vAcross; varying float vSeed; varying vec3 vColor;

void main() {
  float cross = exp(-pow(vAcross * uCoreSharp, 2.0));             // soft profile across the ribbon
  float speed = uPulseSpeed * (0.55 + vSeed * 0.9) + uScrollBoost;
  float ph    = fract(vS * uPulseFreq - uTime * speed + vSeed * 17.31);
  float pulse = smoothstep(0.0, 0.015, ph) * exp(-ph * 26.0);     // sharp head, long tail toward the wall
  float fadeTop  = smoothstep(0.0, 0.10, vS);                      // lanes appear out of the dark at the top
  float fadeNear = 1.0 - smoothstep(0.80, 1.0, vS);               // and dissolve before reaching the camera
  float a = (uBase + pulse * 2.4) * cross * fadeTop * fadeNear * uIntensity;
  gl_FragColor = vec4(vColor * a, a);                              // AdditiveBlending, depthWrite false
}
```
- Core: `uCoreSharp = 2.2`, `uBase = 0.22`. Glow: `uCoreSharp = 1.0`, `uBase = 0.05`, pulse term × 0.6.
- `uPulseFreq = 2.0` (≈ 2 pulses per lane at any time), `uPulseSpeed = 0.09`.

### Mirrored floor
Draw order (all `depthWrite: false`):
1. **Reflection:** the wall + cove part of the lanes again, mirrored about `y = 0` (`scale.y = −1`), intensity × 0.32, with `fadeReflect = exp(-(-worldY) * 0.9)` and a tiny horizontal ripple `x += sin(worldY * 14.0 + uTime) * 0.006`.
2. **Floor tint:** a large plane at `y = 0` with normal blending, colour `#0B0912`, alpha 0.55 — makes the reflection read as a glossy dark floor.
3. **Lanes:** glow, then core.

### Bloom
- Tier 2+: `@react-three/postprocessing` `<Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.18} radius={0.7} />`, **only when the cove intensity > 0.4** (footer CTA, contact page, menu). At background intensity the glow ribbons are enough.
- Tier 1: glow ribbons only.

---

## 4. Intensity rules (the "low opacity" requirement)

Intensity is a uniform (`uIntensity`), never CSS opacity (the canvas is shared with the carousel).

| Context | Dark theme | Light theme |
|---|---|---|
| Site-wide background | **0.18** | **0.08** in "ink mode" |
| Footer CTA in view | ramps to 0.65 (ScrollTrigger scrub) | ramps to 0.22 |
| `/contact` hero | 0.75 + bloom | 0.25 |
| Menu overlay preset | 0.55, behind the glitch blocks | 0.55 (the overlay is always dark) |
| Behind the hero title | masked down to 0.10 under text blocks via a soft radial mask so headings stay crisp | 0.05 |

**Light theme "ink mode":** additive light on a light background is invisible, so in light mode switch the material to `NormalBlending`, colours → `purple-600 #5B37A6` / `purple-400 #8F67EA`, no reflection pass, no bloom. Lanes read as fine purple ink lines with travelling darker pulses.

**Readability guard:** body text must keep ≥ 4.5:1 against the *worst* frame. Add a `--bg` coloured veil (`rgba(bg, 0.6)`) behind long text blocks (case-study chapters) — implement as a section class `.over-cove`.

---

## 5. Motion & interaction

- `uTime` advances only while visible; `uPulseSpeed` × 0 under reduced motion (static frame rendered once).
- `uScrollBoost = clamp(|lenis.velocity| * 0.0015, 0, 0.25)` — scrolling makes pulses rush.
- Mouse parallax: `uParallax` lerps toward the pointer (factor 0.04/frame); camera also yaws ±1.2°.
- Section mood (optional, Phase 10): on `/ai` lanes shift 10% toward `#5B8CFF`; on `/work` slightly more amber sparks. Animate colour weights by tweening a `uHueMix` uniform.

## 6. Performance

- Two draw calls for lanes (core + glow) + one for reflection + one floor plane ≈ 4 draw calls.
- Vertices: 180 lanes × 97 samples × 2 × 2 geometries ≈ 70k — trivial.
- Frame cost target < 1.5 ms on a mid laptop GPU; render at DPR ≤ 1.5; cap at 30 fps on tier 1 (skip every other tick).
- Pause when `document.hidden`, when the menu overlay already renders its own copy, or when intensity is 0.

## 7. Fallback

`public/fallback/light-cove.webp` — a 1920×1080 still rendered from the shader (add a `?still` dev route that renders one frame and lets you save it). Shown as a fixed `<img>` at the same intensity rules (CSS opacity is fine here because there's no shared canvas).

## 8. Acceptance

- [ ] Matches the reference's composition: wall → cove → floor fanning toward the viewer, travelling pulses, glossy reflection
- [ ] At background intensity, all text passes contrast in both themes (spot-check 5 frames)
- [ ] Ink mode looks intentional in light theme (not washed-out)
- [ ] < 1.5 ms GPU frame on mid hardware; 0 ms when the tab is hidden
- [ ] Reduced motion → static frame; tier 0 → still image
