import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { JOURNEY } from "../data";
import { finePointer, gsap, reduced } from "../lib/motion";
import { scramble } from "../lib/scramble";
import { SectionHead } from "./Story";

/* "Scroll to generate", in 3D: one particle field that becomes each chapter's shape as you scroll.
   Shape 0 is a loose cloud; shapes 1-5 are DNA, code, a neural network, a block chain and the initials GB.
   Particles flow between shapes with per-particle delay, swirl while they travel and glow with speed. */

const VERT = /* glsl */ `
attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3; attribute vec3 aP4; attribute vec3 aP5;
attribute vec4 aRnd;
uniform float uMorph; uniform float uTime; uniform float uSize; uniform float uMotion;
varying float vSpeed; varying float vRnd; varying float vFade;
vec3 pick(float k) {
  vec3 p = position * (1.0 - step(0.5, k));
  p += aP1 * (step(0.5, k) - step(1.5, k));
  p += aP2 * (step(1.5, k) - step(2.5, k));
  p += aP3 * (step(2.5, k) - step(3.5, k));
  p += aP4 * (step(3.5, k) - step(4.5, k));
  p += aP5 * step(4.5, k);
  return p;
}
void main() {
  float m = clamp(uMorph, 0.0, 5.0);
  float k = min(floor(m), 4.0);
  float f = m - k;
  float d = aRnd.x * 0.45;
  float t = smoothstep(d, d + 0.55, f);
  vec3 p = mix(pick(k), pick(k + 1.0), t);
  float speed = sin(t * 3.14159265);
  vec3 swirl = vec3(
    sin(p.y * 2.3 + uTime * 0.9 + aRnd.y * 6.2832),
    sin(p.z * 2.1 + uTime * 0.7 + aRnd.z * 6.2832),
    sin(p.x * 1.9 + uTime * 0.8 + aRnd.w * 6.2832));
  p += swirl * speed * 0.6 * uMotion;
  p += 0.022 * vec3(sin(uTime * 1.3 + aRnd.y * 40.0), cos(uTime * 1.1 + aRnd.z * 40.0), sin(uTime * 0.9 + aRnd.w * 40.0)) * uMotion;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  vSpeed = speed;
  vRnd = aRnd.x;
  vFade = smoothstep(10.0, 5.0, -mv.z);
  gl_PointSize = uSize * (0.5 + aRnd.w * 0.9) * (1.0 + speed * 1.3) / -mv.z;
}`;

const FRAG = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uHot; uniform float uLight;
varying float vSpeed; varying float vRnd; varying float vFade;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  vec3 col = mix(uA, uB, step(0.64, fract(vRnd * 7.31)));
  col = mix(col, uHot, vSpeed * 0.8);
  float glow = 1.0 + vSpeed * 0.7 * (1.0 - uLight);
  gl_FragColor = vec4(col * glow, a * (0.45 + 0.55 * vFade) * mix(0.8, 0.95, uLight));
}`;

/* ---------- shape generators (all roughly within a 4.6 x 3.2 box) */
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
const rot = (x, y, z, rx, ry, rz) => {
  let cy = Math.cos(rx), sy = Math.sin(rx);
  [y, z] = [y * cy - z * sy, y * sy + z * cy];
  cy = Math.cos(ry); sy = Math.sin(ry);
  [x, z] = [x * cy + z * sy, -x * sy + z * cy];
  cy = Math.cos(rz); sy = Math.sin(rz);
  [x, y] = [x * cy - y * sy, x * sy + y * cy];
  return [x, y, z];
};

function cloud(n, r) {
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 2.2 + Math.pow(r(), 0.6) * 2.6;
    const s = Math.sqrt(1 - u * u);
    a.set([Math.cos(th) * s * rad, u * rad * 0.65, Math.sin(th) * s * rad], i * 3);
  }
  return a;
}

function helix(n, r) {
  const a = new Float32Array(n * 3), R = 0.8, turns = 2.4, H = 3.9, rungs = 24;
  for (let i = 0; i < n; i++) {
    let x, y, z;
    const q = r();
    if (q < 0.76) {
      const t = r(), ang = t * Math.PI * 2 * turns + (q < 0.38 ? 0 : Math.PI);
      y = (t - 0.5) * H; x = Math.cos(ang) * R; z = Math.sin(ang) * R;
      x += (r() - 0.5) * 0.09; y += (r() - 0.5) * 0.09; z += (r() - 0.5) * 0.09;
    } else {
      const k = Math.floor(r() * rungs), t = (k + 0.5) / rungs, ang = t * Math.PI * 2 * turns, s = 1 - 2 * r();
      y = (t - 0.5) * H + (r() - 0.5) * 0.03; x = Math.cos(ang) * R * s; z = Math.sin(ang) * R * s;
    }
    a.set(rot(x, y, z, 0.15, 0, 0.42), i * 3);
  }
  return a;
}

function code(n, r) {
  const a = new Float32Array(n * 3), W = 4.2, Hh = 3.0;
  const indents = [0, 1, 2, 2, 3, 3, 2, 1, 2, 2, 1, 0];
  const lines = indents.map((ind, j) => {
    const toks = [];
    let x = -W / 2 + 0.35 + ind * 0.3;
    const count = 1 + Math.floor(r() * 3);
    for (let t = 0; t < count; t++) { const len = 0.25 + r() * 0.9; toks.push([x, x + len]); x += len + 0.12; }
    return { y: Hh / 2 - 0.62 - j * 0.2, toks };
  });
  const segs = lines.flatMap((l) => l.toks.map(([x0, x1]) => ({ y: l.y, x0, x1, len: x1 - x0 })));
  const total = segs.reduce((s, g) => s + g.len, 0);
  for (let i = 0; i < n; i++) {
    let x, y, z = (r() - 0.5) * 0.08;
    const q = r();
    if (q < 0.2) {
      const per = r() * (2 * W + 2 * Hh);
      if (per < W) { x = -W / 2 + per; y = Hh / 2; } else if (per < 2 * W) { x = -W / 2 + per - W; y = -Hh / 2; }
      else if (per < 2 * W + Hh) { x = -W / 2; y = -Hh / 2 + per - 2 * W; } else { x = W / 2; y = -Hh / 2 + per - 2 * W - Hh; }
    } else if (q < 0.26) {
      x = -W / 2 + r() * W; y = Hh / 2 - 0.34;
    } else if (q < 0.3) {
      const k = Math.floor(r() * 3), ang = r() * Math.PI * 2, rad = Math.sqrt(r()) * 0.07;
      x = -W / 2 + 0.25 + k * 0.22 + Math.cos(ang) * rad; y = Hh / 2 - 0.17 + Math.sin(ang) * rad;
    } else {
      let pickLen = r() * total, g = segs[0];
      for (const s of segs) { if (pickLen <= s.len) { g = s; break; } pickLen -= s.len; }
      x = g.x0 + r() * g.len; y = g.y + (r() - 0.5) * 0.06; z += (g.y * 0.15);
    }
    a.set(rot(x, y, z, 0.18, -0.5, 0.03), i * 3);
  }
  return a;
}

function network(n, r) {
  const a = new Float32Array(n * 3), xs = [-1.9, -0.65, 0.65, 1.9], counts = [4, 6, 6, 3];
  const nodes = xs.map((x, L) => Array.from({ length: counts[L] }, (_, i) => {
    const c = counts[L], y = (i - (c - 1) / 2) * 0.62;
    return [x, y, Math.sin(i * 1.7 + L * 0.9) * 0.55];
  }));
  for (let i = 0; i < n; i++) {
    let x, y, z;
    if (r() < 0.36) {
      const L = Math.floor(r() * 4), nd = nodes[L][Math.floor(r() * counts[L])];
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = Math.cbrt(r()) * 0.11, s = Math.sqrt(1 - u * u);
      x = nd[0] + Math.cos(th) * s * rad; y = nd[1] + u * rad; z = nd[2] + Math.sin(th) * s * rad;
    } else {
      const L = Math.floor(r() * 3), A = nodes[L][Math.floor(r() * counts[L])], B = nodes[L + 1][Math.floor(r() * counts[L + 1])], u = r();
      x = A[0] + (B[0] - A[0]) * u; y = A[1] + (B[1] - A[1]) * u + (r() - 0.5) * 0.015; z = A[2] + (B[2] - A[2]) * u;
    }
    a.set(rot(x, y, z, 0.1, -0.35, 0), i * 3);
  }
  return a;
}

function chain(n, r) {
  const a = new Float32Array(n * 3), h = 0.3, blocks = 5;
  const C = Array.from({ length: blocks }, (_, i) => ({ c: [-2.0 + i * 1.0, Math.sin(i * 1.1) * 0.35, 0], rx: 0.5 + i * 0.22, ry: 0.6 + i * 0.4 }));
  for (let i = 0; i < n; i++) {
    let p;
    const q = r();
    if (q < 0.86) {
      const b = C[Math.floor(r() * blocks)];
      let v;
      if (q < 0.66) {
        const axis = Math.floor(r() * 3), s1 = r() < 0.5 ? -h : h, s2 = r() < 0.5 ? -h : h, t = (r() * 2 - 1) * h;
        v = axis === 0 ? [t, s1, s2] : axis === 1 ? [s1, t, s2] : [s1, s2, t];
      } else {
        const axis = Math.floor(r() * 3), s = r() < 0.5 ? -h : h, u = (r() * 2 - 1) * h, w = (r() * 2 - 1) * h;
        v = axis === 0 ? [s, u, w] : axis === 1 ? [u, s, w] : [u, w, s];
      }
      const [x, y, z] = rot(v[0], v[1], v[2], b.rx, b.ry, 0);
      p = [x + b.c[0], y + b.c[1], z + b.c[2]];
    } else {
      const k = Math.floor(r() * (blocks - 1)), A = C[k].c, B = C[k + 1].c, u = 0.3 + r() * 0.4, off = r() < 0.5 ? -0.05 : 0.05;
      p = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u + off, (r() - 0.5) * 0.02];
    }
    a.set(rot(p[0], p[1], p[2], 0.2, -0.28, 0), i * 3);
  }
  return a;
}

function initials(n, r, text = "GB") {
  const a = new Float32Array(n * 3);
  const cv = document.createElement("canvas");
  cv.width = 520; cv.height = 260;
  const g = cv.getContext("2d");
  const pts = [];
  if (g) {
    g.fillStyle = "#fff";
    g.font = "800 230px Syne, 'Segoe UI', sans-serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(text, 260, 140);
    const data = g.getImageData(0, 0, 520, 260).data;
    for (let y = 0; y < 260; y += 2) for (let x = 0; x < 520; x += 2) if (data[(y * 520 + x) * 4 + 3] > 128) pts.push([x, y]);
  }
  for (let i = 0; i < n; i++) {
    if (!pts.length) { a.set([(r() - 0.5) * 3, (r() - 0.5) * 2, (r() - 0.5)], i * 3); continue; }
    const [px, py] = pts[Math.floor(r() * pts.length)];
    a.set([(px / 520 - 0.5) * 4.6 + (r() - 0.5) * 0.02, -(py / 260 - 0.5) * 2.3, (r() - 0.5) * 0.35], i * 3);
  }
  return a;
}

const SHAPES = { helix, code, network, chain, gb: initials };

function mapProgress(p, n) {
  // Plateaus: each shape holds for a while before the next morph starts.
  const raw = Math.min(n, Math.max(0, p * (n + 0.5) - 0.15));
  const k = Math.floor(raw), f = raw - k;
  return Math.min(n, k + gsap.parseEase("power2.inOut")(Math.min(1, Math.max(0, (f - 0.12) / 0.66))));
}

export default function Journey() {
  const root = useRef(null);
  const canvas = useRef(null);
  const target = useRef(0);
  const theme = useSelector((s) => s.ui.theme);
  const themeRef = useRef(theme);
  const [stage, setStage] = useState(0);
  const [failed, setFailed] = useState(false);
  const api = useRef(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: el, antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return undefined;
    }
    const small = window.innerWidth < 900;
    const N = small ? 9000 : 18000;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 7.8);
    const geo = new THREE.BufferGeometry();
    const r = rng(20261116);
    geo.setAttribute("position", new THREE.BufferAttribute(cloud(N, r), 3));
    const rnd = new Float32Array(N * 4);
    for (let i = 0; i < rnd.length; i++) rnd[i] = r();
    geo.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 4));
    const build = () => JOURNEY.forEach((st, i) => geo.setAttribute(`aP${i + 1}`, new THREE.BufferAttribute(SHAPES[st.shape](N, rng(101 + i)), 3)));
    // Placeholder shapes so the first frame is valid; the initials are re-sampled once the display font is ready.
    build();
    (document.fonts?.load ? document.fonts.load("800 230px Syne") : Promise.resolve()).then(() => {
      geo.setAttribute("aP5", new THREE.BufferAttribute(initials(N, rng(105)), 3));
    }).catch(() => {});
    const uniforms = {
      uMorph: { value: 0 }, uTime: { value: 0 }, uSize: { value: 30 }, uMotion: { value: reduced() ? 0 : 1 },
      uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uHot: { value: new THREE.Color() }, uLight: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    const group = new THREE.Group();
    group.add(pts);
    scene.add(group);

    const paint = (t) => {
      const light = t === "light";
      uniforms.uLight.value = light ? 1 : 0;
      uniforms.uA.value.set(light ? "#9c6b1e" : "#e7c27d");
      uniforms.uB.value.set(light ? "#2f58c4" : "#8fb8ff");
      uniforms.uHot.value.set(light ? "#c2410c" : "#ffffff");
      mat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      mat.needsUpdate = true;
    };
    paint(themeRef.current);

    let w = 0, h = 0, offX = 0, offY = 0, scale = 1;
    const resize = () => {
      w = el.clientWidth; h = el.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const wide = w >= 900;
      const halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const perPx = (2 * halfH * camera.aspect) / w;
      if (wide) {
        // Shapes live in the free area right of the text column.
        const left = Math.min(w * 0.45, 600), right = w - 48;
        offX = ((left + right) / 2 - w / 2) * perPx;
        offY = 0;
        scale = Math.min(1, ((right - left) * perPx) / 4.9, (2 * halfH * 0.86) / 4.2);
      } else {
        offX = 0;
        offY = halfH * 0.36;
        scale = Math.min(0.9, (w * perPx * 0.94) / 4.8);
      }
      uniforms.uSize.value = 34 * dpr * Math.max(0.75, h / 900);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5; };
    if (finePointer() && !reduced()) window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0, visible = false, morph = 0, mx = 0, my = 0;
    const clock = new THREE.Clock();
    const frame = () => {
      raf = 0;
      const dt = Math.min(clock.getDelta(), 0.05);
      const still = reduced();
      morph += (target.current - morph) * (still ? 1 : Math.min(1, dt * 4.5));
      uniforms.uMorph.value = morph;
      if (!still) uniforms.uTime.value += dt;
      mx += (mouse.x - mx) * 0.05; my += (mouse.y - my) * 0.05;
      const tm = uniforms.uTime.value;
      const settle = 1 - 0.75 * Math.min(1, Math.max(0, morph - 4));
      group.rotation.y = (Math.sin(tm * 0.22) * 0.5 + mx * 0.6) * settle;
      group.rotation.x = (Math.sin(tm * 0.17) * 0.08 + my * 0.3) * settle;
      group.position.set(offX, offY, 0);
      group.scale.setScalar(scale);
      renderer.render(scene, camera);
      if (visible && (!still || Math.abs(target.current - morph) > 0.001)) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && visible) { clock.getDelta(); raf = requestAnimationFrame(frame); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }, { rootMargin: "100px" });
    io.observe(el);
    api.current = { kick, paint };
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose(); mat.dispose(); renderer.dispose();
      api.current = null;
    };
  }, []);

  useEffect(() => { themeRef.current = theme; api.current?.paint(theme); api.current?.kick(); }, [theme]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      let last = -1;
      gsap.timeline({
        scrollTrigger: {
          trigger: ".jr-pin", start: "top top", end: () => "+=" + window.innerHeight * 4.6, pin: true, scrub: true,
          onUpdate: (self) => {
            const m = mapProgress(self.progress, JOURNEY.length);
            target.current = m;
            api.current?.kick();
            const s = Math.max(0, Math.min(JOURNEY.length - 1, Math.round(m) - 1));
            if (s !== last) { last = s; setStage(s); }
            root.current?.style.setProperty("--jr-p", self.progress.toFixed(3));
          },
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = root.current?.querySelector(`.jr-step[data-i="${stage}"] .jr-kicker b`);
    if (el) scramble(el, JOURNEY[stage].kicker.toUpperCase(), { duration: 0.6 });
  }, [stage]);

  return (
    <section className="journey" id="journey" ref={root}>
      <div className={`jr-pin${failed ? " is-flat" : ""}`}>
        <canvas className="jr-canvas" ref={canvas} aria-hidden="true" />
        <div className="jr-shade" aria-hidden="true" />
        <div className="jr-copy">
          <SectionHead num="05" kicker="Journey · scroll to generate" title={<>How I got <em>here</em></>} />
          <div className="jr-steps" aria-live="polite">
            {JOURNEY.map((st, i) => (
              <div key={st.shape} className={`jr-step${i === stage ? " is-on" : ""}`} data-i={i}>
                <p className="jr-kicker"><span>{String(i + 1).padStart(2, "0")}</span><b>{st.kicker.toUpperCase()}</b></p>
                <h3 className="jr-title">{st.title} <em>{st.em}</em></h3>
                <p className="jr-text">{st.text}</p>
              </div>
            ))}
          </div>
          <ol className="jr-rail" aria-hidden="true">
            {JOURNEY.map((st, i) => <li key={st.shape} className={i === stage ? "is-on" : i < stage ? "is-done" : ""}><span>{st.kicker}</span></li>)}
          </ol>
        </div>
        <p className="jr-hint" aria-hidden="true">Keep scrolling: the particles rebuild themselves</p>
        <div className="jr-meter" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
