// Twinkling particles behind the menu (06 §4): slow drift + alpha flicker, visible after the wave.
// `hash` is prepended from ../../glsl/hash.glsl.

uniform float uTime;
uniform float uProgress;
uniform float uPixelRatio;
attribute float aSeed;
varying float vAlpha;

void main() {
  vec2 p = position.xy;
  p.x += sin(uTime * 0.05 + aSeed * 6.2831) * 0.04;
  p.y = mod(p.y + 1.0 + uTime * 0.01 * (0.5 + aSeed), 2.0) - 1.0; // slow upward drift, wraps

  float twinkle = 0.5 + 0.5 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 40.0);
  vAlpha = twinkle * smoothstep(0.6, 1.0, uProgress) * 0.7;

  gl_Position = vec4(p, 0.0, 1.0);
  gl_PointSize = (1.0 + hash(vec2(aSeed, 3.0)) * 2.0) * uPixelRatio;
}
