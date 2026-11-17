import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Hero from "./Hero";
import { Experience, Intro } from "./Story";
import Work from "./Work";
import Journey from "./Journey";
import Lab from "./Lab";
import { About, Contact, Hackathons, Skills } from "./Rest";
import { NAV } from "../data";
import { setActiveSection } from "../store";
import { gsap, reduced, ScrollTrigger } from "../lib/motion";
import { settlePage } from "../lib/router";
import { scramble } from "../lib/scramble";

export default function Home() {
  const dispatch = useDispatch();
  const loaded = useSelector((s) => s.ui.loaded);
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el.children, { y: 50, autoAlpha: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loaded) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-scramble]").forEach((el) => ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => scramble(el) }));
    }, root);
    // Active section = the last section (in page order) whose top has crossed 55% of the viewport.
    // Read straight from the DOM, so pinned sections of any length are always measured correctly.
    const ids = ["top", "intro", ...NAV.map(([id]) => id)];
    let raf = 0, last = null;
    const check = () => {
      raf = 0;
      const line = window.innerHeight * 0.55;
      let cur = "top";
      for (const id of ids) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= line) cur = id; }
      if (cur !== last) { last = cur; dispatch(setActiveSection(cur)); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => { settlePage(); check(); }, 80);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); ctx.revert(); };
  }, [loaded, dispatch]);

  return (
    <div ref={root}>
      <Hero />
      <Intro />
      <Work />
      <Experience />
      <Skills />
      <Hackathons />
      <Journey />
      <Lab />
      <About />
      <Contact />
    </div>
  );
}
