uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.3, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(uColor * a, a);
}
