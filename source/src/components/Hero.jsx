import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import HeroCanvas from "./HeroCanvas";
import Avatar from "./Avatar";
import Portrait from "./Portrait";
import { Magnetic } from "./Chrome";
import { PORTRAIT, PROFILE } from "../data";
import { finePointer, gsap, reduced, scrollToId, SplitText } from "../lib/motion";
import { scramble } from "../lib/scramble";

export function useClock() {
  const fmt = () => new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 15000); return () => clearInterval(id); }, []);
  return t;
}

const RING = "SOFTWARE ENGINEER · AI AGENTS · FULL-STACK · WEB3 · ";
const ORBITS = [["a", "AI agents"], ["b", "Full-stack"], ["c", "Web3"], ["d", "Product UI"]];

export default function Hero() {
  const loaded = useSelector((s) => s.ui.loaded);
  const root = useRef(null);
  const stage = useRef(null);
  const [role, setRole] = useState(0);
  const clock = useClock();

  useEffect(() => {
    if (!loaded || reduced()) return undefined;
    const id = setInterval(() => setRole((i) => (i + 1) % PROFILE.roles.length), 2400);
    return () => clearInterval(id);
  }, [loaded]);

  // The lens is a small 3D stage: ring, face and chips sit at different depths and tilt with the pointer.
  useEffect(() => {
    if (!finePointer() || reduced() || !stage.current) return undefined;
    const rx = gsap.quickTo(stage.current, "rotationX", { duration: 0.9, ease: "power3" });
    const ry = gsap.quickTo(stage.current, "rotationY", { duration: 0.9, ease: "power3" });
    const move = (e) => {
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      ry(x * 22); rx(-y * 16);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useLayoutEffect(() => {
    if (!loaded) return undefined;
    const ctx = gsap.context(() => {
      if (reduced()) { gsap.set(".hero-inner", { autoAlpha: 1 }); return; }
      const split = new SplitText(".hero-name .line-in", { type: "chars", charsClass: "ch" });
      gsap.set(".hero-inner", { autoAlpha: 1 });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(split.chars, { yPercent: 118, rotate: 7, duration: 1.3, stagger: 0.04 })
        .from(".hero-fade", { y: 26, autoAlpha: 0, duration: 1, stagger: 0.07 }, "-=1.0")
        .from(".hero-lens", { scale: 0.82, autoAlpha: 0, rotate: -8, duration: 1.6 }, "-=1.4")
        .from(".orbit", { scale: 0, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: "back.out(2)" }, "-=1.0")
        .add(() => scramble(root.current.querySelector(".hero-eyebrow .scr"), PROFILE.status.toUpperCase(), { duration: 1 }), 0.3);
      gsap.to(".hero-inner", { yPercent: -14, autoAlpha: 0.15, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-lens", { yPercent: 18, rotate: 6, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [loaded]);

  return (
    <section className="hero" id="top" ref={root}>
      <HeroCanvas />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow hero-fade">
            <span className="dot" /> <span className="scr">{PROFILE.status.toUpperCase()}</span>
          </p>
          <h1 className="hero-name" aria-label={PROFILE.name}>
            <span className="line"><span className="line-in">{PROFILE.first}</span></span>
            <span className="line line--serif"><span className="line-in">{PROFILE.last}</span></span>
          </h1>
          <p className="hero-role hero-fade" aria-live="polite">
            <span className="muted">I'm a</span>
            <span className="role-slot">
              {PROFILE.roles.map((r, i) => (
                <span key={r} className={`role${i === role ? " is-on" : ""}`}>{r}</span>
              ))}
            </span>
          </p>
          <p className="hero-tag hero-fade">{PROFILE.tagline}</p>
          <div className="hero-cta hero-fade">
            <Magnetic><button className="btn btn--solid" onClick={() => scrollToId("work")} data-cursor="Scroll">See the work</button></Magnetic>
            <Magnetic><a className="btn btn--ghost" href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer">Résumé</a></Magnetic>
            <Magnetic><button className="btn btn--ghost" onClick={() => scrollToId("contact")}>Get in touch</button></Magnetic>
          </div>
        </div>
        <div className="hero-lens">
          <div className="lens-stage" ref={stage}>
            <svg className="lens-ring" viewBox="0 0 300 300" aria-hidden="true">
              <defs><path id="ring-path" d="M150,150 m-128,0 a128,128 0 1,1 256,0 a128,128 0 1,1 -256,0" /></defs>
              <text><textPath href="#ring-path">{RING + RING}</textPath></text>
            </svg>
            <div className="lens-face">{PORTRAIT ? <Portrait src={PORTRAIT} /> : <Avatar />}</div>
            {ORBITS.map(([k, label]) => <span key={k} className={`orbit orbit--${k}`}><i />{label}</span>)}
            <p className="lens-hello">Hi, I'm Gourav</p>
          </div>
        </div>
      </div>
      <div className="hero-meta hero-fade">
        <span>IIT Hyderabad, India · {clock} IST</span>
        <button className="scroll-cue" onClick={() => scrollToId("intro")} aria-label="Scroll to introduction"><span>Scroll</span><i /></button>
        <span>Portfolio — 2026</span>
      </div>
    </section>
  );
}
