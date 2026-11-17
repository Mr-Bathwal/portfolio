import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { reduced } from "../lib/motion";

// A domain-warped noise field rendered as flowing silk: ink shadows, champagne sheen,
// a faint ice-blue undertone. The pointer pulls a soft light across it.
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uLight; uniform float uScroll;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }
  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    float t = uTime * 0.05;
    vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float md = length(p - m);
    vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t + 3.1));
    vec2 r = vec2(fbm(p * 1.3 + 2.0 * q + vec2(1.7, 9.2) + t * 1.3 + 0.3 * m), fbm(p * 1.3 + 2.0 * q + vec2(8.3, 2.8) - t));
    float f = fbm(p * 1.15 + 2.2 * r);
    float bands = sin((f * 6.0 + r.x * 3.0) * 3.14159);
    float sheen = smoothstep(0.55, 1.0, bands) * smoothstep(0.25, 0.9, f);
    float glow = exp(-md * 2.4) * 0.32;
    vec3 ink  = mix(vec3(0.031, 0.035, 0.051), vec3(0.945, 0.945, 0.933), uLight);
    vec3 deep = mix(vec3(0.075, 0.082, 0.14), vec3(0.87, 0.865, 0.84), uLight);
    vec3 gold = mix(vec3(0.91, 0.76, 0.49), vec3(0.66, 0.47, 0.17), uLight);
    vec3 ice  = mix(vec3(0.56, 0.72, 1.0), vec3(0.23, 0.39, 0.79), uLight);
    vec3 col = mix(ink, deep, f);
    col += gold * sheen * mix(0.5, 0.32, uLight);
    col += ice * pow(r.y, 3.0) * mix(0.22, 0.12, uLight);
    col += gold * glow * mix(1.0, 0.6, uLight);
    col *= mix(1.0, mix(0.5, 0.92, uLight), smoothstep(0.45, 1.35, length(p)));
    col = mix(col, ink, clamp(uScroll, 0.0, 1.0) * 0.65);
    col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.03;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function HeroCanvas() {
  const ref = useRef(null);
  const api = useRef(null);
  const theme = useSelector((s) => s.ui.theme);

  useEffect(() => {
    const canvas = ref.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      canvas.classList.add("no-webgl");
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const scene = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(0.62, 0.55) },
      uLight: { value: document.documentElement.dataset.theme === "light" ? 1 : 0 }, uScroll: { value: 0 },
    };
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag });
    scene.add(new THREE.Mesh(geo, mat));

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      renderer.render(scene, cam);
    };
    const target = new THREE.Vector2(0.62, 0.55);
    const onMove = (e) => target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    resize();

    const still = reduced();
    let raf = 0, visible = true;
    const start = performance.now();
    const tick = () => {
      uniforms.uTime.value = (performance.now() - start) / 1000;
      uniforms.uMouse.value.lerp(target, 0.045);
      uniforms.uScroll.value = Math.min(1, window.scrollY / window.innerHeight);
      renderer.render(scene, cam);
      if (visible && !still) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) tick();
    });
    io.observe(canvas);
    api.current = { uniforms, draw: () => renderer.render(scene, cam) };

    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!api.current) return;
    api.current.uniforms.uLight.value = theme === "light" ? 1 : 0;
    api.current.draw();
  }, [theme]);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
