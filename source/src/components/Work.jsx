import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Flip } from "gsap/Flip";
import { FILTERS, GITHUB, MORE, PROJECTS } from "../data";
import { DIMS } from "../dims";
import { setFilter } from "../store";
import { gsap, reduced, stopScroll } from "../lib/motion";
import { HASH, href, navigate, projectPath } from "../lib/router";
import { SectionHead } from "./Story";

gsap.registerPlugin(Flip);
export const img = (name, small) => `${import.meta.env.BASE_URL}work/${name}${small ? "-sm" : ""}.webp`;
export const dims = (name) => DIMS[name] || [1600, 1000];
const pad = (n) => String(n).padStart(2, "0");

export function Arrow() {
  return <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function YouTubeIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 28 20" width={size} height={(size * 20) / 28} aria-hidden="true" className="yt-icon">
      <path d="M27.4 3.1A3.5 3.5 0 0 0 24.9.6C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 0 0 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 0 0 2.5-2.5C28 14.7 28 10 28 10s0-4.7-.6-6.9Z" fill="currentColor" />
      <path d="m11.2 14.3 7.3-4.3-7.3-4.3v8.6Z" className="yt-play" />
    </svg>
  );
}

export function openProject(p, e) {
  e?.preventDefault();
  navigate(projectPath(p.slug), { label: p.title });
}

export function ProjectLinks({ p, caseStudy = false }) {
  const ext = { target: "_blank", rel: "noopener noreferrer" };
  return (
    <div className="case-links">
      {caseStudy && (
        <a className="btn btn--solid" href={href(projectPath(p.slug))} onClick={(e) => openProject(p, e)} data-cursor="Open">Case study<Arrow /></a>
      )}
      {p.links.youtube && <a className="btn btn--yt" href={p.links.youtube} {...ext} data-cursor="Play"><YouTubeIcon />Watch on YouTube</a>}
      {p.links.live && <a className="btn btn--live" href={p.links.live} {...ext}><span className="live-dot" />Live demo<Arrow /></a>}
      {p.links.code && <a className="btn btn--ghost" href={p.links.code} {...ext}>Source code<Arrow /></a>}
    </div>
  );
}

function Case({ p, i, total }) {
  // The whole card opens the project page; its own links (YouTube, live, code) still work as normal.
  const onCard = (e) => { if (!e.target.closest("a, button")) openProject(p, e); };
  return (
    <article className="case" style={{ "--accent": p.accent, zIndex: i + 1 }} data-index={i}>
      <div className="case-inner" onClick={onCard} data-cursor="Open">
        <div className="case-text">
          <p className="case-count">{pad(i + 1)}<span> / {pad(total)}</span></p>
          <p className="case-kicker">{p.kicker}</p>
          <h3 className="case-title"><a href={href(projectPath(p.slug))} onClick={(e) => openProject(p, e)}>{p.title}</a></h3>
          <p className="case-context">{p.context} · {p.year}</p>
          <p className="case-summary">{p.summary}</p>
          <div className="case-decisions">
            <p className="label">Decisions I made</p>
            <ul>{p.decisions.slice(0, 2).map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
          <dl className="case-metrics">
            {p.metrics.map(([v, l]) => <div key={l}><dt>{v}</dt><dd>{l}</dd></div>)}
          </dl>
          <ul className="chips">{p.stack.slice(0, 6).map((s) => <li key={s}>{s}</li>)}</ul>
          <ProjectLinks p={p} caseStudy />
        </div>
        <a className="case-visual" href={href(projectPath(p.slug))} onClick={(e) => openProject(p, e)} data-cursor="Open" aria-label={`Open the ${p.title} case study`}>
          <span className="browser" data-tilt="6">
            <span className="browser-bar"><i /><i /><i /><span>{(p.links.live || p.links.code || "").replace("https://", "")}</span></span>
            <span className="browser-shot"><img src={img(p.images[0])} srcSet={`${img(p.images[0], true)} 760w, ${img(p.images[0])} 1600w`} sizes="(max-width: 900px) 92vw, 52vw" alt={`${p.title} screenshot`} width={dims(p.images[0])[0]} height={dims(p.images[0])[1]} loading="lazy" /></span>
          </span>
          {p.images.slice(1, 3).map((name, k) => (
            <span key={name} className={`float-shot float-shot--${k}`}>
              <img src={img(name, true)} alt="" loading="lazy" />
            </span>
          ))}
          <span className="case-open"><span>View case study</span><Arrow /></span>
        </a>
      </div>
    </article>
  );
}

export function Lightbox({ state, onClose }) {
  const [idx, setIdx] = useState(state.idx);
  const box = useRef(null);
  const n = state.p.images.length;
  useEffect(() => {
    stopScroll(true);
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % n);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + n) % n);
    };
    window.addEventListener("keydown", key);
    box.current?.querySelector("button")?.focus();
    return () => { window.removeEventListener("keydown", key); stopScroll(false); };
  }, [n, onClose]);
  useLayoutEffect(() => {
    if (reduced()) return;
    gsap.fromTo(box.current.querySelector(".lb-img"), { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" });
  }, [idx]);
  const name = state.p.images[idx];
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${state.p.title} screenshots`} ref={box} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="lb-close icon-btn" onClick={onClose} aria-label="Close">×</button>
      <img className="lb-img" src={img(name)} alt={state.p.captions?.[name] || `${state.p.title} screenshot ${idx + 1} of ${n}`} />
      <div className="lb-bar">
        <button className="icon-btn" onClick={() => setIdx((i) => (i - 1 + n) % n)} aria-label="Previous screenshot">‹</button>
        <span>{state.p.title} · {idx + 1} / {n}</span>
        <button className="icon-btn" onClick={() => setIdx((i) => (i + 1) % n)} aria-label="Next screenshot">›</button>
      </div>
      {state.p.captions?.[name] && <p className="lb-cap">{state.p.captions[name]}</p>}
    </div>
  );
}

// Live public-repo count (the deployed site asks the GitHub API; the preview keeps the saved number).
export function useRepoCount() {
  const [n, setN] = useState(GITHUB.repos);
  useEffect(() => {
    if (HASH) return undefined;
    let off = false;
    fetch(`https://api.github.com/users/${GITHUB.user}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!off && d && d.public_repos) setN(d.public_repos); })
      .catch(() => {});
    return () => { off = true; };
  }, []);
  return n;
}

function GithubCta() {
  const n = useRepoCount();
  // A contribution-graph style field of cells that light up at random.
  const cells = useMemo(() => {
    let s = 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 7 * 34 }, () => ({ l: Math.floor(rnd() * 5), d: (rnd() * 6).toFixed(2) }));
  }, []);
  return (
    <a className="gh-cta reveal-solo" href={GITHUB.url} target="_blank" rel="noopener noreferrer" data-cursor="GitHub">
      <span className="gh-grid" aria-hidden="true">
        {cells.map((c, i) => <i key={i} className={`l${c.l}`} style={{ animationDelay: `${c.d}s` }} />)}
      </span>
      <span className="gh-copy">
        <span className="sec-kicker"><span>↗</span><span className="sk-t" data-scramble>github.com/{GITHUB.user}</span></span>
        <span className="gh-title">There's more on <em>GitHub</em>.</span>
        <span className="gh-text">Explore all <b>{n}</b> of my public repositories in detail: experiments, assignments, hackathon builds and the full source behind everything above.</span>
        <span className="btn btn--solid gh-btn">Explore my GitHub<Arrow /></span>
      </span>
      <span className="gh-count" aria-hidden="true"><b>{n}</b><small>public repositories</small></span>
    </a>
  );
}

function ProjectIndex() {
  const dispatch = useDispatch();
  const filter = useSelector((s) => s.work.filter);
  const grid = useRef(null);
  const flip = useRef(null);
  const items = [
    ...PROJECTS.map((p) => ({ title: p.title, note: p.kicker, cats: p.cats, stack: p.stack.slice(0, 3), project: p, thumb: p.images[0], accent: p.accent })),
    ...MORE,
  ];
  const choose = (f) => {
    if (f === filter) return;
    if (!reduced()) flip.current = Flip.getState(grid.current.querySelectorAll(".idx-card"));
    dispatch(setFilter(f));
  };
  useLayoutEffect(() => {
    if (!flip.current) return;
    Flip.from(flip.current, {
      duration: 0.65, ease: "power3.inOut", scale: true, absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.5, delay: 0.15 }),
    });
    flip.current = null;
  }, [filter]);
  const count = items.filter((it) => filter === "all" || it.cats.includes(filter)).length;
  return (
    <div className="index">
      <div className="index-head reveal">
        <h3>Everything I've built <span className="muted">({count})</span></h3>
        <div className="filters" role="group" aria-label="Filter projects">
          {FILTERS.map(([k, label]) => (
            <button key={k} className={filter === k ? "is-active" : ""} aria-pressed={filter === k} onClick={() => choose(k)}>{label}</button>
          ))}
        </div>
      </div>
      <ul className="idx-grid skew-v" ref={grid}>
        {items.map((it) => {
          const show = filter === "all" || it.cats.includes(filter);
          const props = it.project
            ? { href: href(projectPath(it.project.slug)), onClick: (e) => openProject(it.project, e), "data-cursor": "Case study" }
            : it.url ? { href: it.url, target: "_blank", rel: "noopener noreferrer", "data-cursor": "GitHub" } : null;
          const Tag = props ? "a" : "div";
          return (
            <li key={it.title} className={`idx-card${show ? "" : " is-out"}${it.thumb ? " has-thumb" : ""}`} style={{ "--accent": it.accent || "var(--gold)" }}>
              <Tag {...(props || {})} className="idx-link" data-tilt="7">
                {it.thumb && <span className="idx-thumb"><img src={img(it.thumb, true)} alt="" loading="lazy" /></span>}
                <span className="idx-title">{it.title}{props && <Arrow />}</span>
                <span className="idx-note">{it.note}</span>
                <span className="idx-stack">{it.stack.join(" · ")}</span>
                {it.project && <span className="idx-tag">Case study</span>}
              </Tag>
            </li>
          );
        })}
      </ul>
      <GithubCta />
    </div>
  );
}

export default function Work() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      const cases = gsap.utils.toArray(".case");
      cases.forEach((c, i) => {
        const inner = c.querySelector(".case-inner");
        gsap.from(c.querySelectorAll(".case-text > *"), { y: 40, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 70%" } });
        gsap.fromTo(c.querySelector(".browser"), { clipPath: "inset(12% 10% 12% 10% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 65%" } });
        gsap.fromTo(c.querySelector(".browser-shot img"), { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.08, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(c.querySelectorAll(".float-shot"), { y: 140, z: -200, rotate: (k) => (k ? -8 : 8), autoAlpha: 0, transformPerspective: 900, duration: 1.3, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: c, start: "top 60%" } });
        if (i < cases.length - 1) {
          gsap.to(inner, { scale: 0.9, rotationX: 6, autoAlpha: 0.25, filter: "blur(2px)", transformPerspective: 1400, ease: "none", scrollTrigger: { trigger: cases[i + 1], start: "top bottom", end: "top 15%", scrub: true } });
        }
      });
      gsap.from(".gh-cta", { y: 80, autoAlpha: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".gh-cta", start: "top 88%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="work" id="work" ref={root}>
      <SectionHead num="01" kicker="Selected work" title={<>Products, not <em>practice pages</em></>}>
        Six builds I'm proud of. Open any card for the full story: the problem, what I built, the decisions and big screenshots.
      </SectionHead>
      <div className="cases">
        {PROJECTS.map((p, i) => <Case key={p.slug} p={p} i={i} total={PROJECTS.length} />)}
      </div>
      <ProjectIndex />
    </section>
  );
}
