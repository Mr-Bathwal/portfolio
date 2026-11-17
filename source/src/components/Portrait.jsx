import { useEffect, useRef } from "react";
import { reduced } from "../lib/motion";

// Particle portrait: samples a photo into dots that drift home and scatter away from the pointer.
// Used only when PORTRAIT in data.js points to a photo in /public.
export default function Portrait({ src }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const img = new Image();
    let raf = 0, pts = [], mouse = { x: -999, y: -999 };
    const size = 360, dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr; canvas.height = size * dpr; ctx.scale(dpr, dpr);
    img.onload = () => {
      const off = document.createElement("canvas"); off.width = off.height = 120;
      const o = off.getContext("2d");
      const s = Math.min(img.width, img.height);
      o.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 120, 120);
      const d = o.getImageData(0, 0, 120, 120).data;
      for (let y = 0; y < 120; y += 2) for (let x = 0; x < 120; x += 2) {
        const i = (y * 120 + x) * 4, lum = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255;
        if (lum < 0.08) continue;
        const hx = (x / 120) * size, hy = (y / 120) * size;
        pts.push({ hx, hy, x: Math.random() * size, y: Math.random() * size, r: 0.6 + lum * 1.7, c: `rgba(${d[i]},${d[i + 1]},${d[i + 2]},0.95)` });
      }
      const still = reduced();
      const draw = () => {
        ctx.clearRect(0, 0, size, size);
        for (const p of pts) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.hypot(dx, dy);
          if (dist < 46 && !still) { p.x += (dx / dist) * 3; p.y += (dy / dist) * 3; }
          p.x += (p.hx - p.x) * (still ? 1 : 0.08); p.y += (p.hy - p.y) * (still ? 1 : 0.08);
          ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
        if (!still) raf = requestAnimationFrame(draw);
      };
      draw();
    };
    img.src = src;
    const move = (e) => { const r = canvas.getBoundingClientRect(); mouse = { x: ((e.clientX - r.left) / r.width) * size, y: ((e.clientY - r.top) / r.height) * size }; };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, [src]);
  return <canvas ref={ref} className="portrait" role="img" aria-label="Particle portrait of Gourav" />;
}
