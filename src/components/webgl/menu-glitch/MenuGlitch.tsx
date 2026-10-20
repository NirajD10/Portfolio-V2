"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LinearSRGBColorSpace,
  ShaderMaterial,
} from "three";
import type { GpuTier } from "@/lib/gpu";
import hash from "../glsl/hash.glsl";
import glitchFrag from "./shaders/glitch.frag";
import vert from "./shaders/fullscreen.vert";
import particlesFrag from "./shaders/particles.frag";
import particlesVert from "./shaders/particles.vert";

/**
 * The menu's glitch-block wave (06 §4) in its own small canvas, mounted only while the curtain is
 * running. Progress comes from the curtain (a ref, read every frame) — GSAP owns the tween.
 */

type Props = { progressRef: RefObject<number>; tier: GpuTier };

/** Read a colour token from CSS (tokens.css, @theme static) without colour-space conversion. */
function token(name: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new Color().setStyle(value, LinearSRGBColorSpace);
}

/** Deterministic PRNG (mulberry32) so particle layout is pure and stable between renders. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Blocks({ progressRef, tier }: Props) {
  const size = useThree((s) => s.size);
  const material = useMemo(() => {
    const rows = size.width < 768 ? 14 : tier >= 2 && size.height > 900 ? 28 : 18;
    return new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: `${hash}\n${glitchFrag}`,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uRows: { value: rows },
        uHot: {
          value: [
            token("--color-purple-500"),
            token("--color-purple-300"),
            token("--color-magenta-400"),
            token("--color-blue-400"),
            token("--color-purple-50"),
          ],
        },
        uBase: { value: token("--color-menu-950") },
        uResidual: { value: token("--color-menu-residual") },
      },
    });
  }, [size.width, size.height, tier]);

  const mat = useRef<ShaderMaterial>(null);
  useFrame((_, delta) => {
    const u = mat.current!.uniforms;
    u.uProgress.value = progressRef.current;
    u.uTime.value += delta;
  });

  return (
    <mesh frustumCulled={false}>
      <primitive ref={mat} object={material} attach="material" />
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

function Particles({ progressRef, count }: { progressRef: RefObject<number>; count: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const rand = seeded(7);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = rand() * 2 - 1;
      pos[i * 3 + 1] = rand() * 2 - 1;
      seed[i] = rand();
    }
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new BufferAttribute(seed, 1));
    return g;
  }, [count]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: `${hash}\n${particlesVert}`,
        fragmentShader: particlesFrag,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uPixelRatio: { value: dpr },
          uColor: { value: token("--color-purple-200") },
        },
      }),
    [dpr],
  );

  const mat = useRef<ShaderMaterial>(null);
  useFrame((_, delta) => {
    const u = mat.current!.uniforms;
    u.uProgress.value = progressRef.current;
    u.uTime.value += delta;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <primitive ref={mat} object={material} attach="material" />
    </points>
  );
}

export default function MenuGlitch({ progressRef, tier }: Props) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particles = mobile ? 0 : tier >= 2 ? 300 : 120;
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={1}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      flat
      linear
    >
      <Blocks progressRef={progressRef} tier={tier} />
      {particles > 0 && <Particles progressRef={progressRef} count={particles} />}
    </Canvas>
  );
}
