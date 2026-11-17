import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => window.matchMedia("(pointer: fine)").matches;

let lenis = null;
export function startSmoothScroll() {
  if (reduced() || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
  // Scroll velocity drives a subtle skew on elements marked .skew-v (marquees, project grid).
  const skew = { v: 0 };
  const apply = () => {
    const t = `skewY(${skew.v.toFixed(3)}deg)`;
    document.querySelectorAll(".skew-v").forEach((el) => { el.style.transform = t; });
  };
  const skewTo = gsap.quickTo(skew, "v", { duration: 0.7, ease: "power3", onUpdate: apply });
  lenis.on("scroll", (l) => {
    ScrollTrigger.update();
    skewTo(gsap.utils.clamp(-2, 2, (l.velocity || 0) * 0.05));
  });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToId(id, { immediate = false } = {}) {
  const el = id === "top" ? 0 : document.getElementById(id);
  if (el == null) return;
  if (lenis) { lenis.scrollTo(el, { offset: 0, duration: 1.4, immediate, force: true }); return; }
  const behavior = immediate || reduced() ? "auto" : "smooth";
  if (el === 0) window.scrollTo({ top: 0, behavior });
  else el.scrollIntoView({ behavior });
}

export function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  window.scrollTo(0, y);
}

export function stopScroll(stop) { if (lenis) (stop ? lenis.stop() : lenis.start()); }
export { gsap, ScrollTrigger, SplitText };
