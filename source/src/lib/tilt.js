import { useEffect } from "react";
import { finePointer, gsap, reduced } from "./motion";

// 3D tilt + moving glare for any element with data-tilt (value = max degrees).
export function useTilt() {
  useEffect(() => {
    if (!finePointer() || reduced()) return undefined;
    const setters = new WeakMap();
    const get = (el) => {
      let s = setters.get(el);
      if (!s) {
        gsap.set(el, { transformPerspective: 900 });
        s = {
          rx: gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" }),
          ry: gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" }),
        };
        setters.set(el, s);
      }
      return s;
    };
    let cur = null;
    const release = () => { if (cur) { const s = get(cur); s.rx(0); s.ry(0); cur = null; } };
    const move = (e) => {
      const el = e.target.closest?.("[data-tilt]") || null;
      if (cur && cur !== el) release();
      if (!el) return;
      cur = el;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const amt = +(el.dataset.tilt || 8);
      const s = get(el);
      s.rx((0.5 - py) * amt);
      s.ry((px - 0.5) * amt);
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    };
    const out = (e) => { if (!e.relatedTarget) release(); };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerout", out);
    return () => { window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerout", out); };
  }, []);
}
