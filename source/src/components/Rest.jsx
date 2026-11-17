import { useLayoutEffect, useRef, useState } from "react";
import { BEYOND, EDUCATION, HACKATHONS, MARQUEE, PROFILE, SKILLS } from "../data";
import { gsap, reduced, scrollToId, SplitText } from "../lib/motion";
import { SectionHead } from "./Story";
import { Magnetic } from "./Chrome";
import { useClock } from "./Hero";

/* ------------------------------------------------------------ Skills */
export function Skills() {
  const root = useRef(null);
  const rows = MARQUEE;
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      gsap.from(".skill-group", { y: 50, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".skill-groups", start: "top 82%" } });
      gsap.utils.toArray(".marquee").forEach((m, i) => {
        gsap.fromTo(m, { xPercent: i % 2 ? -4 : 4 }, { xPercent: i % 2 ? 4 : -4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="skills" id="skills" ref={root}>
      <SectionHead num="03" kicker="Toolkit" title={<>The stack I <em>reach for</em></>}>
        Comfortable across the stack: interfaces, APIs, agents and smart contracts, so I can own a feature from the data model to the last animation frame.
      </SectionHead>
      <div className="marquees skew-v" aria-hidden="true">
        {rows.map((row, i) => (
          <div className={`marquee marquee--${i}`} key={i}>
            <div className="marquee-track">
              {[...row, ...row].map((s, k) => <span key={k}>{s}<i>✦</i></span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="skill-groups">
        {SKILLS.map((g) => (
          <article className="skill-group" key={g.group} data-tilt="6">
            <h3>{g.group}</h3>
            <ul className="chips">{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Hackathons */
export function Hackathons() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      gsap.utils.toArray(".hack-row").forEach((r) => gsap.from(r, { y: 50, autoAlpha: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: r, start: "top 90%" } }));
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="hacks" id="hackathons" ref={root}>
      <SectionHead num="04" kicker="Hackathons & milestones" title={<>Built under a <em>deadline</em></>} />
      <ol className="hack-list">
        {HACKATHONS.map((h) => (
          <li className="hack-row" key={h.name}>
            <span className="hack-when">{h.when}</span>
            <span className="hack-name">{h.name}</span>
            <span className="hack-where">{h.where}</span>
            <span className="hack-what">{h.what}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------ About: education + beyond */
export function About() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      gsap.fromTo(".edu-line i", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".edu", start: "top 75%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray(".edu-item, .beyond-card").forEach((el) => gsap.from(el, { y: 40, autoAlpha: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } }));
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="about" id="about" ref={root}>
      <SectionHead num="07" kicker="About" title={<>Off the <em>keyboard</em></>}>
        A biotech degree taught me to work with messy real-world data; leading teams and playing cricket taught me to ship with people.
      </SectionHead>
      <div className="about-grid">
        <div className="edu">
          <h3 className="col-title">Education</h3>
          <div className="edu-line" aria-hidden="true"><i /></div>
          <ol>
            {EDUCATION.map((e) => (
              <li className="edu-item" key={e.school}>
                <span className="edu-when">{e.when}</span>
                <span className="edu-school">{e.school}</span>
                <span className="edu-what">{e.what}</span>
                <span className="edu-score">{e.score}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="beyond">
          <h3 className="col-title">Leadership & sport</h3>
          <div className="beyond-grid">
            {BEYOND.map((b) => (
              <article className="beyond-card" key={b.title} data-tilt="6">
                <h4>{b.title}</h4>
                <p className="beyond-org">{b.org}</p>
                <p>{b.note}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Contact + footer */
export function Contact() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);
  const clock = useClock();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      // Scroll to generate: the headline assembles itself out of letters scattered in 3D space.
      const split = new SplitText(".contact-title .ln", { type: "words,chars", wordsClass: "wd", charsClass: "ch" });
      const r = gsap.utils.random;
      gsap.fromTo(split.chars,
        { x: () => r(-260, 260), y: () => r(-200, 200), z: () => r(-900, 300), rotationX: () => r(-120, 120), rotationY: () => r(-120, 120), autoAlpha: 0, transformPerspective: 700 },
        { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, ease: "power2.out", stagger: { each: 0.012, from: "random" },
          scrollTrigger: { trigger: ".contact-title", start: "top 95%", end: "top 30%", scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, []);
  const copy = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(PROFILE.email).then(done, () => {});
  };
  return (
    <section className="contact" id="contact" ref={root}>
      <p className="sec-kicker"><span>08</span><span className="sk-t" data-scramble>Contact</span></p>
      <h2 className="contact-title">
        <span className="ln-wrap"><span className="ln">Let's build</span></span>
        <span className="ln-wrap"><span className="ln ln--serif">something people</span></span>
        <span className="ln-wrap"><span className="ln">remember.</span></span>
      </h2>
      <div className="contact-row">
        <a className="contact-mail" href={`mailto:${PROFILE.email}`} data-cursor="Write">{PROFILE.email}</a>
        <button className="pill-btn" onClick={copy} aria-live="polite">{copied ? "Copied" : "Copy email"}</button>
      </div>
      <div className="contact-links">
        <Magnetic><a className="btn btn--solid" href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></Magnetic>
        <Magnetic><a className="btn btn--ghost" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer">GitHub</a></Magnetic>
        <Magnetic><a className="btn btn--ghost" href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer">Résumé (PDF)</a></Magnetic>
      </div>
      <footer className="footer">
        <span>© 2026 {PROFILE.name}</span>
        <span>Designed and built from scratch with React, Redux Toolkit, GSAP, Lenis and Three.js</span>
        <span>Hyderabad · {clock} IST</span>
        <button className="pill-btn" onClick={() => scrollToId("top")}>Back to top ↑</button>
      </footer>
    </section>
  );
}
