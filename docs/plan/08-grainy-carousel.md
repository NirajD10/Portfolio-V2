# 08 · Grainy Carousel

> A row of photographs whose outer ends blow away like sand. The grain is sampled from the picture itself in a shader, so the specks carry its colour and overshoot the card's own edge.

Reference: `references/ref-grainy-carousel.png`.
Used in two places with one component: **Home → Work reel** (case-study covers) and **About → Life in frames** (personal photos).

---

## 1. Layout & behaviour

- A horizontal, infinitely looping row. If there are fewer than 8 items, the list is rendered twice so the loop never shows a gap (duplicates are `aria-hidden` and not focusable). Card aspect 4:5 (portrait, photo-like). Card width `clamp(220px, 21vw, 360px)`, gap `1.6vw`. The row is wider than the viewport; cards near the **viewport's left and right edges disintegrate**, cards in the middle are crisp.
- **Input:** drag (pointer, with inertia), horizontal wheel/trackpad, and arrow keys when focused. Slow autoplay drift (0.12 cards/s) that pauses on hover, focus, or the pause button.
- **Caption** (DOM, under the centred card): `03` · **PurePlantParadise** · `E-commerce · MERN · [[year]]` · "View case study ↗" (on hover/focus). Changes with ScrambleText when the centre card changes.
- **Hover a card:** its dissolve eases to 0 (the sand flows back in) over 0.6 s and it scales to 1.03; cursor follower shows `VIEW`.
- **Click (Work reel):** shared-element transition — the card's WebGL plane animates (GSAP) to the case-study hero rect while the page transition wave runs; the case-study page's hero `<img>` takes over seamlessly (same image, same rect).
- **Life in frames:** click opens a lightbox (Motion layout animation), no route change.

## 2. DOM ↔ WebGL contract

```tsx
<section className="relative" data-carousel>
  <div data-view-box className="absolute -inset-y-[15vh] inset-x-0" />   {/* the View's rect: overshoot room for grains */}
  <ul role="list" aria-roledescription="carousel" aria-label="Selected work" className="flex …">
    {items.map(i => (
      <li key={i.slug} data-card className="aspect-[4/5] …">
        {/* Real <img> for SEO, a11y and no-WebGL fallback. Hidden visually (opacity 0) once the WebGL texture is ready. */}
        <Link href={`/work/${i.slug}`} aria-label={`${i.title} case study`}>
          <img src={i.cover} alt={i.alt} … />
        </Link>
      </li>
    ))}
  </ul>
</section>
```

- The DOM list is the source of truth for positions. Each frame, read each card's rect (cached; recomputed on resize and from the scroll position — no per-frame `getBoundingClientRect` storm: compute from `trackX + index * (width + gap)`).
- The drei `<View>` tracks `[data-view-box]`. Inside it, an orthographic camera maps 1 unit = 1 CSS px, origin at the View's centre, y up. `uCardPos` is the card centre in that space.
- The loop: move `trackX` (GSAP `Observer` for drag/wheel + `InertiaPlugin` for throw); wrap with `gsap.utils.wrap`.

## 3. Rendering: two layers per card, one shared dissolve rule

1. **Card quad** — the image, crisp, with fragments discarded where dissolved.
2. **Grain points** — a grid of points over the same card; a point is only visible where the quad has dissolved, and it's pushed outward, past the card edge.

Both layers call the **same GLSL function** (`dissolve.glsl`) so the eaten edge of the image matches exactly where grains come from.

```glsl
// dissolve.glsl
// uv: position on the card (0..1). side: −1 card is left of centre, +1 right.
// edge: how close the card is to the viewport edge (0 centre … 1 at the edge), per card uniform.
float dissolveAmount(vec2 uv, float side, float edge, float seed) {
  float outward = side > 0.0 ? uv.x : 1.0 - uv.x;          // 0 = inner edge of the card, 1 = outer edge
  float n = fbm(uv * 5.0 + seed * 3.7) * 0.5 + 0.5;          // 0..1 noise (from glsl/noise.glsl)
  float front = edge * 1.55;                                 // how far the dissolve front has advanced
  float ragged = (n - 0.5) * 0.9 * smoothstep(0.0, 0.2, edge); // noise only once the card starts dissolving
  return clamp((front - (1.0 - outward)) * 2.2 + ragged, 0.0, 1.0);  // edge = 0 → always 0 (crisp)
}
```

Per-card uniforms, updated every frame on the CPU:
- `uEdge = smoothstep(0.42, 1.02, abs(cardCenterNdcX))` — 0 for central cards, 1 as a card reaches the viewport edge. Multiply by `(1 − hover)`.
- `uSide = sign(cardCenterNdcX)`.
- `uVel` = track velocity (px/frame, smoothed) → extra spread and streaking while dragging.

### `card.frag`
```glsl
uniform sampler2D uTex; uniform float uEdge, uSide, uSeed;
varying vec2 vUv;
void main() {
  float d = dissolveAmount(vUv, uSide, uEdge, uSeed);
  if (d > 0.08) discard;                                      // eaten away
  vec3 c = texture2D(uTex, vUv).rgb;
  float rim = smoothstep(0.0, 0.08, d);                       // thin bright erosion rim
  gl_FragColor = vec4(c + rim * 0.25, 1.0);
}
```

### `grain.vert` (Points; one point per grid cell of the card)
```glsl
attribute vec2 aUv; attribute float aRand;
uniform sampler2D uTex; uniform vec2 uCardPos, uCardSize;      // px, from the DOM
uniform float uEdge, uSide, uSeed, uTime, uVel, uSpread, uSize, uDpr;
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = dissolveAmount(aUv, uSide, uEdge, uSeed);
  vec2 p = uCardPos + (aUv - 0.5) * uCardSize;               // home position on the card
  // blow away: outward + slight lift, turbulence grows with d, extra while dragging
  float t = pow(d, 1.5);
  vec2 dir = normalize(vec2(uSide * (0.85 + aRand * 0.6), 0.25 + aRand * 0.5));
  vec2 curl = curlNoise(p * 0.004 + uTime * 0.06 + aRand);    // glsl/curl.glsl
  p += dir * t * uSpread * (0.4 + aRand) * (1.0 + abs(uVel) * 0.04);
  p += curl * t * uSpread * 0.35;
  p.x += uVel * t * 6.0;                                      // streak in drag direction
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  gl_PointSize = mix(uSize, uSize * 0.35, t) * uDpr;
  vColor = texture2D(uTex, aUv).rgb;                          // colour sampled from the photo itself
  vAlpha = step(0.08, d) * (1.0 - smoothstep(0.65, 1.0, d)); // only where the quad is gone; fades far out
}
```

### `grain.frag`
```glsl
varying vec3 vColor; varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = dot(c, c);
  if (r > 0.25) discard;                                      // round grain
  gl_FragColor = vec4(vColor * 1.15, vAlpha * (1.0 - r * 2.0));
}
```

Settings: `uSpread = 0.9 × card width` (grains can travel almost a card-width beyond the edge — the "overshoot"), `uSize = 2.0px`, grid 120 × 150 per card (tier 2+), 60 × 75 (tier 1). Points use `NormalBlending` in light theme, `AdditiveBlending` at 0.8 in dark theme (grains glow slightly on black, like the reference).

## 4. Textures & loading

- Each item has a WebGL texture `/work/<slug>/textures/<slug>-1024.webp` (≤ 1024px long edge, sRGB) separate from the responsive `<img>`.
- Load textures when the section is within 1.5 viewports. Until a texture is ready, the DOM `<img>` stays visible; swap with a 0.3 s crossfade.
- Only cards within the View rect + 1 card margin are drawn; recycle `Points` instances (pool of 8).

## 5. Fallbacks

- **Tier 0 / no WebGL:** DOM row with `mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent)` and a CSS grain overlay (SVG `feTurbulence` noise at 12%) on the outer 18%. Same drag/loop logic.
- **Reduced motion:** no autoplay, no particles, no dissolve; a plain scroll-snap row with buttons (prev/next).
- **Keyboard:** the list is focusable (`tabindex=0`), ←/→ move one card, Enter opens the centred card. Each card link is also tabbable in order.

## 6. Acceptance

- [ ] Centre cards perfectly crisp; outer-end cards dissolve into grains that carry the photo's colours
- [ ] Grains visibly travel beyond the card edge (and beyond the band, up to 15vh)
- [ ] The eroded image edge and the grain source line up (no gap/no double image)
- [ ] Dragging fast streaks grains; releasing settles within ~0.8 s
- [ ] Hovering a dissolving card re-forms it
- [ ] 60 fps while dragging on a mid laptop with 6 visible cards
- [ ] Works with mouse, touch, trackpad, keyboard; reduced motion + tier 0 paths verified
