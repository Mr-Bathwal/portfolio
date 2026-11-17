import { useLayoutEffect, useRef } from "react";
import { EXPERIENCE, MANIFESTO, NUMBERS, PROFILE } from "../data";
import { gsap, reduced, scrollToId, SplitText } from "../lib/motion";

export function SectionHead({ num, title, kicker, children }) {
  return (
    <header className="sec-head reveal">
      <p className="sec-kicker"><span>{num}</span><span className="sk-t" data-scramble>{kicker}</span></p>
      <h2 className="sec-title">{title}</h2>
      {children && <p className="sec-lede">{children}</p>}
    </header>
  );
}

/* ------------------------------------------------------------ Intro: one line + stat cards, one screen */
export function Intro() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      const split = new SplitText(".manifesto", { type: "words", wordsClass: "w" });
      gsap.fromTo(split.words, { opacity: 0.15, y: 12 }, {
        opacity: 1, y: 0, stagger: 0.035, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".manifesto", start: "top 82%" },
      });
      gsap.from(".stat", { y: 40, rotationX: -25, autoAlpha: 0, transformPerspective: 900, stagger: 0.07, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".stats", start: "top 85%" } });
      gsap.utils.toArray(".stat").forEach((tile) => {
        const el = tile.querySelector(".num-v"), target = +el.dataset.v, dec = +(el.dataset.d || 0), o = { v: 0 };
        gsap.to(o, { v: target, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: tile, start: "top 92%" }, onUpdate: () => { el.textContent = o.v.toFixed(dec); } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="intro" id="intro" ref={root}>
      <div className="intro-grid">
        <div className="intro-copy">
          <p className="sec-kicker"><span>00</span><span className="sk-t" data-scramble>In one line</span></p>
          <p className="manifesto">{MANIFESTO}</p>
          <div className="intro-cta">
            <button className="pill-btn" onClick={() => scrollToId("work")} data-cursor="Scroll">Selected work ↓</button>
            <a className="pill-btn" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </div>
        <div className="stats">
          {NUMBERS.map((n, i) => (
            <article key={n.label} className="stat" data-tilt="12">
              <span className="stat-i">{String(i + 1).padStart(2, "0")}</span>
              <p className="stat-v"><span className="num-v" data-v={n.value} data-d={n.decimals || 0}>{n.value.toFixed(n.decimals || 0)}</span>{n.suffix}</p>
              <p className="stat-l">{n.label}</p>
              <p className="stat-n">{n.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Experience: pinned horizontal track */
export function Experience() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current.querySelector(".xp-track");
        const bar = root.current.querySelector(".xp-bar i");
        const dist = () => track.scrollWidth - window.innerWidth + 48;
        const tween = gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: {
            trigger: ".xp-pin", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
            onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress})`; },
          },
        });
        gsap.utils.toArray(".xp-card").forEach((card) => {
          gsap.from(card.querySelectorAll(".xp-points li"), {
            x: 60, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 75%" },
          });
          gsap.fromTo(card, { rotationY: -14, transformPerspective: 1200 }, { rotationY: 0, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "left 35%", scrub: true } });
          gsap.fromTo(card.querySelector(".xp-index"), { xPercent: 30 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
      });
      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".xp-card").forEach((card) => gsap.from(card, { y: 60, autoAlpha: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%" } }));
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="xp" id="experience" ref={root}>
      <div className="xp-pin">
        <div className="xp-top">
          <SectionHead num="02" kicker="Experience" title={<>Where I've <em>shipped</em></>}>
            Three internships across AI agents, fintech product UI and full-stack engineering, plus campus leadership.
          </SectionHead>
          <div className="xp-bar" aria-hidden="true"><i /></div>
        </div>
        <div className="xp-track">
          {EXPERIENCE.map((x, i) => (
            <article className="xp-card" key={x.company}>
              <span className="xp-index" aria-hidden="true">0{i + 1}</span>
              <div className="xp-meta"><span>{x.period}</span><span>{x.kind}</span></div>
              <h3 className="xp-company">{x.company}</h3>
              <p className="xp-role">{x.role}</p>
              <p className="xp-summary">{x.summary}</p>
              <ul className="xp-points">{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <ul className="chips">{x.stack.map((s) => <li key={s}>{s}</li>)}</ul>
            </article>
          ))}
          <div className="xp-end" aria-hidden="true"><span>Next</span><em>your team?</em></div>
        </div>
      </div>
    </section>
  );
}
