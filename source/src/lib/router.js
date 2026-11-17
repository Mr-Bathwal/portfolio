import { useSyncExternalStore } from "react";
import { gsap, reduced, ScrollTrigger, scrollToId, scrollToY } from "./motion";
import { scramble } from "./scramble";

// Two routes: home ("/") and a page per project ("/projects/<slug>/"), relative to the site base.
// An absolute base (e.g. "/portfolio/") uses real paths; a relative build (the preview) falls back to hash URLs.
const BASE = import.meta.env.BASE_URL;
export const HASH = !BASE.startsWith("/");
export const projectPath = (slug) => `/projects/${slug}/`;
export const href = (path) => (HASH ? "#" + path : BASE + path.replace(/^\//, ""));

const read = () => {
  if (HASH) return location.hash.replace(/^#/, "") || "/";
  const p = location.pathname;
  return p.startsWith(BASE) ? "/" + p.slice(BASE.length) : p;
};
const parse = (path) => {
  const m = path.match(/^\/projects\/([\w-]+)\/?$/);
  return m ? { name: "project", slug: m[1] } : { name: "home" };
};
const same = (a, b) => a.name === b.name && a.slug === b.slug;

let route = parse(read());
const subs = new Set();
function sync() {
  const next = parse(read());
  if (!same(next, route)) { route = next; subs.forEach((f) => f()); }
}

export const useRoute = () =>
  useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => route);

// Where the next page should land once it has mounted: a section id, or a scroll offset.
let pending = null;
let homeY = 0;
let internal = false;
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

window.addEventListener(HASH ? "hashchange" : "popstate", () => {
  if (internal) { internal = false; sync(); return; }
  const prev = route;
  if (prev.name === "home") homeY = window.scrollY;
  sync();
  if (!same(prev, route)) pending = route.name === "home" ? { y: homeY } : { y: 0 };
});

function pushPath(path) {
  if (HASH) {
    if (location.hash !== "#" + path) { internal = true; location.hash = path; }
  } else {
    history.pushState(null, "", href(path));
  }
  sync();
}

// Called by a page once it has mounted: measure ScrollTriggers, then land where navigation asked.
export function settlePage() {
  ScrollTrigger.refresh();
  const p = pending;
  pending = null;
  if (!p) return;
  if (p.id) scrollToId(p.id, { immediate: true });
  else scrollToY(p.y || 0);
  ScrollTrigger.update();
}

let overlay = null;
let busy = false;
export const registerOverlay = (node) => { overlay = node; };

// Navigate with a curtain transition: cover, swap the page underneath, reveal.
export function navigate(path, { label = "", scrollTo = null } = {}) {
  if (busy) return;
  const target = parse(path);
  if (same(target, route)) {
    if (scrollTo) scrollToId(scrollTo);
    else if (target.name === "project") scrollToY(0);
    return;
  }
  if (route.name === "home") homeY = window.scrollY;
  pending = scrollTo ? { id: scrollTo } : target.name === "home" ? { y: homeY } : { y: 0 };
  if (reduced() || !overlay) { pushPath(path); return; }
  busy = true;
  const panels = overlay.querySelectorAll(".pt-panel");
  const text = overlay.querySelector(".pt-label");
  text.textContent = "";
  gsap.timeline({ onComplete: () => { busy = false; gsap.set(overlay, { visibility: "hidden" }); } })
    .set(overlay, { visibility: "visible" })
    .fromTo(panels, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: "expo.inOut", stagger: 0.09 })
    .add(() => scramble(text, label.toUpperCase(), { duration: 0.55 }), "-=0.35")
    .add(() => pushPath(path), "+=0.2")
    .to(panels, { yPercent: -100, duration: 0.85, ease: "expo.inOut", stagger: { each: 0.08, from: "end" } }, "+=0.35");
}
