# 05 · Hero — "The Pune Ride"

The hero strip re-imagines pleurat's walking street as **Niraj riding his Yamaha MT-15 across Pune to the office**. Buildings are Pune landmarks and the office — not experience entries. The light theme is the **morning commute**; the dark theme is the **night ride home**. This strip is the site's signature; budget real time for the art.

Reference photo: `references/ref-my-bike-yamaha-mt15.png`.

---

## 1. Strip anatomy

- Inline SVG, `viewBox="0 0 2400 200"`, `preserveAspectRatio="xMidYMax slice"`.
- Rendered height: `clamp(120px, 13vw, 200px)`; full width of the content column (edge to edge between the frame rules), with an 80px fade mask on both ends (`mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)`).
- **Readout bar** (24px above the strip, HTML not SVG):
  - Left: `02` (Geist Mono, accent-text) · **Shaniwar Wada** (Clash 500, 22px) · `Kasba Peth` (Geist 14px, ink-muted). Changes with a 0.35 s ScrambleText when the bike passes a landmark's centre.
  - Right: `NEXT STOP → OFFICE` (light theme) / `NEXT STOP → HOME` (dark theme) in Geist Mono label style. When passing the office: `ARRIVED · 09:58` for 2 s.
- Pause/play icon button (24px) at the strip's bottom-right — required because the animation runs longer than 5 s (WCAG 2.2.2).

### Layers (back → front)

Each layer is one **tile** drawn once and placed twice (or 3×) side by side, so wrapping with `mod(tile)` is seamless.

| Group id | Parallax factor | Tile width × copies | Contents |
|---|---|---|---|
| `#sky` | 0 (fixed) | — | Light: sun ring (purple outline), 2–3 clouds drifting slowly, kites. Dark: moon, stars (twinkle), no clouds |
| `#far` | 0.12 | 2400 × 2 | Sahyadri ridge line with **Sinhagad fort** silhouette, **Parvati Hill** temple on its hill, a distant skyline |
| `#mid` | 0.40 | 3600 × 2 | Landmarks + buildings (table below), elevated **Pune Metro** viaduct with a train every ~9 s |
| `#road` | 1.0 | 1200 × 3 | Road surface line, lane dashes, divider with shrubs, kerb |
| `#near` | 1.0 | 2400 × 2 | Lamp posts, traffic signals, gulmohar trees, PMPML bus stop, chai tapri, vada-pav stall, a Puneri signboard easter egg, cycle stand |
| `#traffic` | own speed | — | Auto-rickshaw (slower than the bike — gets overtaken), a scooter going the other way, pigeons |
| `#ride` | 0 (fixed at x = 22% of strip) | — | Bike + rider |
| `#fx` | — | — | Exhaust puffs, headlight beam (dark), speech bubble |

At cruise speed the `#mid` tile scrolls past in 60 s — one full home → office commute per minute.

### Landmark sequence in `#mid` (readout data in `ride/landmarks.ts`)

The ride runs **west across Pune to Hinjewadi**: old city → river → university → highway → IT park → office. Landmarks east of the centre (Railway Station, Aga Khan Palace) are left out because they aren't on the way to Hinjewadi.

| # | Readout name | Area | Drawing notes |
|---|---|---|---|
| 01 | Home | Pune | Housing-society building, balcony plants, society gate with watchman cabin. Generic on purpose; no specific area shown |
| 02 | Shaniwar Wada | Kasba Peth | Fort wall + the big gate (Delhi Darwaza) with spikes, bastions |
| 03 | Dagdusheth Ganpati Temple *(optional)* | Budhwar Peth | Ornate temple facade, kept simple; drop it if Niraj prefers |
| 04 | Mutha River | Deccan | A bridge span over a strip of water (road continues over the bridge — near layer shows railings) |
| 05 | Pune Metro | Deccan | Elevated station; the train passes overhead on the viaduct |
| 06 | Pune University | Ganeshkhind | The university's heritage Main Building: long facade, arched windows, central tower; lawns in front |
| 07 | Highway flyover | Wakad | Overpass of the Mumbai–Bengaluru highway with a few trucks crossing above |
| 08 | Rajiv Gandhi Infotech Park | Hinjewadi | Park entrance gate + glass towers with grid facades, a crane, a food-truck lane |
| 09 | Office | Hinjewadi | **Placeholder office** (`OfficeFacade.tsx`): generic 6-storey IT building, glass + concrete bands, sign reading `PURE TECH CODEX` in plain text (no logo), entry gate, two-wheeler parking. Window lights on at night. Swapped for the real facade when Niraj sends a photo — see `13-asset-placeholders.md` |

Spacing: ~360–420 units between landmark centres; fill gaps with generic Pune buildings (old wadas with tiled roofs, apartment blocks with water tanks, a mall facade, then glass offices as the ride nears Hinjewadi) so the street feels dense and changes character along the way. Keep the line-art style from `02 §6`.

---

## 2. The bike — Yamaha MT-15 (from the photo)

Side profile, **facing right** (as in the photo), riding left → right.

| Part | Colour (light theme) | Notes from the photo |
|---|---|---|
| Fuel-tank shroud | metallic violet `#5A37C0`, highlight `#8E6CF0`, shadow `#2E1C7A` | Large angular shroud; the brand purple ties the bike to the site |
| Side panel / tank flank | white `#ECECF2` with grey `#B8B8C4` shading | White flank under the purple with the purple "V"-shaped graphic and small tuning-fork badge (draw as a generic mark; don't reproduce the Yamaha logo) |
| Headlight | dark housing; single central projector lens; light `#AD86FF`/white glow at night | Compact "single-eye" face with sharp DRL brows |
| Front fork | gold `#D4A72C` upside-down forks | Very visible in the photo — a key identifying detail |
| Front mudguard | white | |
| Wheels | black alloys, teal rim stripe `#3FC6A8` | Thin stripe on the outer rim of both wheels; front disc visible |
| Engine / frame | black `#17171C`, silver accents `#9A9AA6` | Deltabox-style frame lines; silver rear-set brackets |
| Exhaust | black underbelly | Short, under the engine — puffs come out low, ahead of the rear wheel |
| Seat | black, split | Rider seat lower, pillion seat higher |
| Tail | short, sharp, with rear hugger | Small red tail light (glows at night) |
| Mirrors | black, on stalks | |

Dark theme: same colours shifted ~15% darker, plus headlight beam, tail-light glow and a thin rim light on the tank edge in `#AD86FF`.

## 3. The rider — Niraj

### Helmet — LS2 FF320 Stream II (confirmed)
Reference: `references/ref-helmet-ls2-ff320-stream2.png`. Draw it in the same side view as the photo (chin to the right). Colours sampled from the photo:

| Part | Colour | Notes |
|---|---|---|
| Shell base | matte black `#191818` | Most of the shell; matte → no specular highlight on the base |
| Carbon-texture panels | dark grey `#3B3B3B` | Fine diagonal hatching inside the panels (3–4 thin lines), as on the photo |
| Graphic panels — blue | petrol blue `#2D4B5A`, lighter edge `#3F6E82` | Large angular panels on the crown and the rear |
| Graphic panels — sand | warm khaki `#A59C90` | Angular blades sweeping back from the visor, plus the big "LS2"-style blocks on the side → draw as abstract angular blocks, **not** the LS2 wordmark |
| Accent stripes | orange-red `#E4452A` | Thin chevron stripes along the panel edges — the only orange on the whole site, so it pops |
| Outer visor | clear, `rgba(255,255,255,0.18)` with a white edge line | A moving shine sweeps across it every ~6 s |
| Inner sun visor | iridescent gradient `#7B6FC4 → #4C6FA8` | The drop-down tinted visor seen through the clear one — ties the helmet back to the brand purple |
| Vents / chin bar | black, small slots | Top vent spoiler at the back of the crown |

Night ride: graphics darken ~20%, the sand panels catch a faint street-lamp highlight, and the orange stripes stay saturated.

### Outfit — placeholders until Niraj sends a photo
All rider colours live in one file, `src/components/ride/rider.config.ts`, so swapping later is a one-line change per item:

```ts
export const rider = {
  helmet: {
    model: "LS2 FF320 Stream II",                   // confirmed
    shell: "#191818", carbon: "#3B3B3B",
    blue: "#2D4B5A", blueEdge: "#3F6E82",
    sand: "#A59C90", accent: "#E4452A",
    sunVisor: ["#7B6FC4", "#4C6FA8"], outerVisor: "rgba(255,255,255,0.18)",
  },
  jacket:   { base: "#1E1E24", piping: "#7149C6", placeholder: true }, // PLACEHOLDER — dark riding jacket
  gloves:   { base: "#141414", placeholder: true },                     // PLACEHOLDER
  pants:    { base: "#22304A", placeholder: true },                     // PLACEHOLDER — dark jeans
  shoes:    { base: "#E9E9EE", sole: "#2A2A2A", placeholder: true },    // PLACEHOLDER — light sneakers
  backpack: { base: "#151517", zip: "#7149C6", keychain: "</>" },
} as const;
```

- **Backpack:** black laptop backpack, purple zip pull, a small `</>` keychain swinging (physics-ish sway driven by speed changes).
- **Posture:** streetfighter stance — upright with a slight forward lean, elbows bent, knees in against the tank, feet on the rear-set pegs.
- Draw the outfit as **simple flat shapes** so changing colours never needs redrawing. Only if Niraj's real jacket has a distinctive cut or graphic does the art need a revision.

---

## 4. SVG layer contract (ids the engine depends on)

```
#ride
├─ #bike                      (transform-origin: rear axle; suspension bob + pitch)
│  ├─ #bike-body             frame, tank, shroud, seat, tail, engine, exhaust
│  ├─ #bike-fork             forks + mudguard + front brake (compresses on braking: translateY 2u, rotate -1°)
│  ├─ #wheel-front > #wheel-front-rot   (rotating spokes/disc; transform-box: fill-box; origin: center)
│  ├─ #wheel-rear  > #wheel-rear-rot
│  ├─ #headlight, #headlight-beam (dark theme only), #tail-light
├─ #rider                    (pivot: hips; lean)
│  ├─ #rider-torso, #rider-arm-left, #rider-arm-right
│  ├─ #rider-leg-left        (rotates down to put the foot on the road when stopped)
│  ├─ #rider-leg-right
│  ├─ #helmet > #helmet-shell, #helmet-graphics, #helmet-sunvisor, #helmet-visor, #visor-shine
│  └─ #backpack > #keychain
└─ #exhaust-origin           (empty marker <circle r=0> for particle spawn)
```

Every landmark group in `#mid` carries `data-landmark="02"` and `data-center-x="…"` so the readout logic doesn't hard-code positions. Signals carry `data-signal="1"` and a `#signal-1-red`, `#signal-1-green` pair.

---

## 5. Ride engine (`src/components/ride/RideEngine.ts`)

A small class ticked by `gsap.ticker`, paused when the strip is off-screen (IntersectionObserver) or when the user pauses motion.

```ts
type State = "cruise" | "brake" | "stopped" | "launch";

const V_CRUISE = 150;   // world units/s for #road/#near (1.0 factor)
const R_WHEEL = 26;     // wheel radius in SVG units

tick(dt) {
  const boost = clamp(lenisVelocity * 0.004, -0.25, 0.8);     // scrolling speeds the ride up; scrolling up eases it
  const target =
    state === "cruise" ? V_CRUISE * (1 + boost) :
    state === "launch" ? V_CRUISE :
    0;                                                           // brake + stopped
  v = damp(v, target, state === "brake" ? 3.2 : 1.6, dt);        // exponential smoothing
  x += v * dt;

  setX(far,     -mod(x * 0.12, 2400));   // tile widths from the layer table
  setX(mid,     -mod(x * 0.40, 3600));
  setX(road,    -mod(x,        1200));
  setX(near,    -mod(x,        2400));
  wheelDeg += (v * dt / R_WHEEL) * 57.2958;                      // rolling without slipping
  setRotation(wheelFrontRot, wheelDeg); setRotation(wheelRearRot, wheelDeg);
  bob(t, v);                                                     // see below
  updateReadout(x);                                              // which landmark centre is nearest the bike's screen x
  updateSignals(x);                                              // decide brake/stop/launch
}
```

Use `gsap.quickSetter(el, "x", "px")` / `quickSetter(el, "rotation", "deg")` for every per-frame write (no React state per frame).

**Readout:** a landmark's on-screen x is `centerX - mod(x * 0.40, 3600)` (check the second copy at `+3600` too). When it crosses the bike's x (22% of 2400 = 528), switch the readout.

**Signals:** two signals per `#near` tile, so one every ~8 s at cruise. A deterministic schedule turns every 3rd signal red as the bike approaches → **one stop roughly every 25 s**, never two in a row. Sequence:
1. `cruise` → signal 160u ahead turns amber then red → `brake` (fork compresses, rider leans forward 3°, then back).
2. `stopped` at the stop line: left leg rotates down to put the foot on the road (0.4 s, `ease.out`), helmet turns slightly toward the viewer (scaleX trick on visor shine), bike bob settles to idle vibration (0.6u at 18 Hz).
3. After 2.4 s the light goes green → `launch`: foot up, exhaust puffs (4–6 particles from `#exhaust-origin`, drift back and up, fade 0.8 s), backpack keychain swings back, rider leans forward 4° then settles → `cruise`.

**Bob & lean (cruise):** body `y = sin(t·2π·1.4) · 0.8u + roadBump`; rider `rotation = lerp(0, 3°, accel)`; keychain `rotation = spring(−accel · 25°)`. Road bumps: at road-tile seams, a 1.5u dip over 120 ms.

**Traffic:** auto-rickshaw moves at 0.55 × V in world space so the bike overtakes it about every 14 s; the oncoming scooter moves at −0.8 × V on the far lane; the metro train crosses the viaduct in 2.5 s every 9 s (independent of bike speed).

---

## 6. Day / night (bound to theme)

| Element | Light theme — morning commute | Dark theme — night ride home |
|---|---|---|
| Sky | Sun ring, clouds, kites | Moon, twinkling stars |
| Buildings | Flat fills, no lights | Windows lit at random (30%), office lit last ("late deploy") |
| Street lamps | Off | On, with radial glow `amber-300` at 25% |
| Bike | Normal | Headlight beam (gradient cone onto the road), tail-light glow, rim light |
| Readout right | `NEXT STOP → OFFICE` | `NEXT STOP → HOME` |
| Traffic | Auto-rickshaw + scooter | Same, with their own small headlights |

Swap via CSS variables on the SVG root (`--ride-fill-1`, `--ride-window`, `--ride-sky`…) plus `display` toggles for day-only/night-only groups. During the theme View Transition the change is covered by the circular reveal, so no extra tween is needed.

---

## 7. Interaction

- **Hover the bike (desktop):** quick rev — wheels spin 1.5× for 0.6 s, exhaust puff, a small speech bubble "vroom ⚡" pops above the helmet (Motion, spring). With sound enabled: a soft rev sample (≤ 30 KB, opt-in only).
- **Click the bike:** headlight double-flash; the readout shows `HI, I'M NIRAJ 👋` for 2 s.
- **Scroll:** faster scrolling speeds the ride (clamped +80%); scrolling up eases it (never reverses).
- **Strip off-screen:** engine paused, ticker callback removed.

---

## 8. Responsive & reduced motion

- **< 640px:** strip height 120px; `#near` drops every other prop; the readout shows index + name only; the bike sits at 18%.
- **640–1024px:** full scene, fewer traffic actors.
- **Reduced motion / paused:** static still — bike stopped at the signal near Shaniwar Wada, foot down; readout fixed on `02 Shaniwar Wada`. No traffic, no clouds.
- `role="img"` + `aria-label="Illustration: Niraj riding his Yamaha MT-15 through Pune to the office"`; the readout is `aria-hidden` (it changes too often to announce).

---

## 9. Producing the art (realistic workflow)

1. **Collect:** bike photo ✓, helmet (LS2 FF320 Stream II) photo ✓. Outfit and office facade are **placeholders** for now (`rider.config.ts`, `OfficeFacade.tsx`) — Phase 4 doesn't wait for them.
2. **Draw in Figma** on a 2400×200 frame: put the bike photo at 30% opacity, trace a simplified line-art version (keep the identifying cues: purple/white tank, gold forks, teal rim stripes, underbelly exhaust, single-eye headlight). Draw the rider on top. Landmarks from reference photos, simplified to 15–40 paths each.
3. **Name layers exactly as §4**, export SVG with ids, run SVGO with `cleanupIds: false`, `convertShapeToPath: false`.
4. **Claude Code** can draft every landmark and prop directly in SVG — expect 3–5 rounds of screenshot-and-fix. The bike + rider are worth finishing by hand in Figma (they're the most-viewed pixels on the site).
5. Split into React components per layer (`Far.tsx`, `Mid.tsx`, `Near.tsx`, `Bike.tsx`, `Rider.tsx`, `Traffic.tsx`) with colours as CSS variables, so theme switching is pure CSS.
6. Budget: whole ride SVG ≤ 60 KB gzip; ≤ 1,500 DOM nodes.

## 10. Acceptance

- [ ] 60 fps on a mid laptop (Chrome performance panel: scripting < 3 ms/frame for the ride)
- [ ] One signal stop roughly every 25 s, with foot-down and launch puffs visible
- [ ] Readout matches the landmark centred over the bike every time
- [ ] Theme toggle switches morning ↔ night including the readout destination
- [ ] Pause button stops everything; reduced motion shows the still frame
- [ ] Bike is recognisably *Niraj's* MT-15 (purple/white tank, gold forks, teal rim stripes) when shown to him
- [ ] Helmet reads as his LS2 FF320 Stream II colourway (matte black, petrol blue, sand, orange stripes, iridescent sun visor)
- [ ] Changing any colour in `rider.config.ts` updates the drawing with no other code change; `OfficeFacade` can be replaced without touching the engine
