// Glitch-block wave (docs/plan/06 §4). uProgress 0 = transparent, 1 = menu base + residual blocks.
// The wave sweeps right → left; reversing uProgress plays it back left → right.
// `hash` is prepended from ../../glsl/hash.glsl.

uniform float uProgress;
uniform float uTime;
uniform float uRows;
uniform vec3 uHot[5];
uniform vec3 uBase;
uniform vec3 uResidual;
varying vec2 vUv;

void main() {
  float row = floor((1.0 - vUv.y) * uRows);
  float rr = hash(vec2(row, 1.0));

  // Variable-width columns per row: denser rows have narrower blocks.
  float cols = mix(8.0, 34.0, rr);
  float shift = hash(vec2(row, 7.0)) * 5.0;
  float xs = vUv.x * cols + shift;
  float col = floor(xs);
  float cr = hash(vec2(row, col));

  // Reveal time: right side first, jittered per block. All blocks have started by 0.75.
  float cx = clamp((col + 0.5 - shift) / cols, 0.0, 1.0);
  float tStart = (1.0 - cx) * 0.5 + cr * 0.25;
  float local = (uProgress - tStart) / 0.22;

  vec3 color = vec3(0.0);
  float alpha = 0.0;

  if (local >= 0.0) {
    color = uBase;
    alpha = 1.0;

    // Hot phase: a bright block that decays to the base colour.
    float hot = 1.0 - smoothstep(0.0, 1.0, local);
    if (hot > 0.0 && cr > 0.25) {
      int idx = int(mod(floor(cr * 13.0), 5.0));
      vec3 h = uHot[0];
      if (idx == 1) h = uHot[1];
      else if (idx == 2) h = uHot[2];
      else if (idx == 3) h = uHot[3];
      else if (idx == 4) h = uHot[4];
      color = mix(color, h, hot * (0.55 + 0.45 * cr));
    }

    // Residual drifting blocks (~20% of cells) once the wave has passed.
    if (cr > 0.8) {
      float drift = sin(uTime * 0.25 + row * 1.7) * 0.015;
      float on = step(0.5, fract(vUv.x * cols + drift * cols));
      color = mix(color, uResidual, (1.0 - hot) * 0.55 * on);
    }
  }

  gl_FragColor = vec4(color * alpha, alpha);
}
