import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GITHUB, PROFILE, PROJECTS } from "../data";
import { gsap, reduced, SplitText } from "../lib/motion";
import { href, navigate, projectPath, settlePage } from "../lib/router";
import { Arrow, Lightbox, ProjectLinks, YouTubeIcon, dims, img, openProject } from "./Work";

const pad = (n) => String(n).padStart(2, "0");
const HOME_TITLE = document.title;

function backToWork(e) {
  e?.preventDefault();
  navigate("/", { label: "Selected work", scrollTo: "work" });
}

function Shot({ name, p, k, onOpen, cover = false }) {
  const [w, h] = dims(name);
  return (
    <img
      src={img(name)}
      srcSet={`${img(name, true)} 760w, ${img(name)} 1600w`}
      sizes={cover ? "100vw" : "(max-width: 900px) 100vw, 80vw"}
      width={w} height={h}
      alt={p.captions?.[name] || `${p.title} screenshot ${k + 1}`}
      loading={cover ? "eager" : "lazy"}
      onClick={onOpen}
    />
  );
}

export default function ProjectPage({ slug }) {
  const loaded = useSelector((s) => s.ui.loaded);
  const i = PROJECTS.findIndex((x) => x.slug === slug);
  const p = PROJECTS[i];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const root = useRef(null);
  const [lb, setLb] = useState(null);

  useEffect(() => {
    if (!p) return undefined;
    document.title = `${p.title} — ${p.kicker} · Gourav Bathwal`;
    return () => { document.title = HOME_TITLE; };
  }, [p]);

  useLayoutEffect(() => {
    if (!p || !loaded) return undefined;
    const ctx = gsap.context(() => {
      if (reduced()) return;
      const split = new SplitText(".pp-title", { type: "words,chars", wordsClass: "wd", charsClass: "ch" });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.25 });
      tl.from(split.chars, { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.035 })
        .from(".pp-fade", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.06 }, "-=1.0")
        .fromTo(".pp-cover", { clipPath: "inset(14% 10% 14% 10% round 32px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.6 }, "-=1.1")
        .from(".pp-cover img", { scale: 1.3, duration: 1.8 }, "<");
      gsap.fromTo(".pp-cover img", { yPercent: 0 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".pp-cover", start: "top top", end: "bottom top", scrub: true } });
      gsap.from(".pp-metrics .stat", { y: 50, rotationX: -30, autoAlpha: 0, transformPerspective: 900, stagger: 0.07, duration: 1, scrollTrigger: { trigger: ".pp-metrics", start: "top 88%" } });
      gsap.utils.toArray(".pp-reveal").forEach((el) => gsap.from(el.children, { y: 50, autoAlpha: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } }));
      gsap.from(".pp-feature", { y: 60, autoAlpha: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".pp-features", start: "top 85%" } });
      gsap.utils.toArray(".pp-shot").forEach((fig) => {
        const frame = fig.querySelector(".pp-shot-frame"), im = fig.querySelector("img");
        gsap.fromTo(frame, { clipPath: "inset(18% 0% 18% 0% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "expo.out", duration: 1.5, scrollTrigger: { trigger: fig, start: "top 82%" } });
        gsap.fromTo(im, { scale: 1.18, yPercent: -4 }, { scale: 1.02, yPercent: 4, ease: "none", scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(fig.querySelector("figcaption"), { y: 20, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: fig, start: "top 70%" } });
      });
      const nextSplit = new SplitText(".pp-next-t", { type: "words,chars", wordsClass: "wd", charsClass: "ch" });
      gsap.from(nextSplit.chars, { yPercent: 100, autoAlpha: 0, stagger: 0.025, ease: "none", scrollTrigger: { trigger: ".pp-next", start: "top 95%", end: "top 45%", scrub: true } });
    }, root);
    const t = setTimeout(settlePage, 60);
    return () => { clearTimeout(t); ctx.revert(); };
  }, [p, loaded]);

  if (!p) {
    return (
      <section className="pp pp--missing">
        <h1 className="pp-title">Not found</h1>
        <p className="pp-summary">That project doesn't exist, or it has moved.</p>
        <a className="btn btn--solid" href={href("/")} onClick={backToWork}>Back to all work</a>
      </section>
    );
  }

  const open = (k) => setLb({ p, idx: k });
  const gallery = p.images.slice(1);
  return (
    <article className="pp" ref={root} style={{ "--accent": p.accent }}>
      <header className="pp-hero">
        <div className="pp-crumbs pp-fade">
          <a className="pp-back" href={href("/")} onClick={backToWork} data-cursor="Back"><span aria-hidden="true">←</span> All work</a>
          <span>Case {pad(i + 1)} / {pad(PROJECTS.length)}</span>
        </div>
        <p className="pp-kicker pp-fade"><span className="dot" />{p.kicker}</p>
        <h1 className="pp-title">{p.title}</h1>
        <div className="pp-intro">
          <p className="pp-summary pp-fade">{p.summary}</p>
          <dl className="pp-meta pp-fade">
            <div><dt>Context</dt><dd>{p.context}</dd></div>
            <div><dt>Year</dt><dd>{p.year}</dd></div>
            <div><dt>Scope</dt><dd>{p.scope}</dd></div>
            <div><dt>Built with</dt><dd>{p.stack.slice(0, 4).join(", ")}</dd></div>
          </dl>
        </div>
        <div className="pp-fade"><ProjectLinks p={p} /></div>
      </header>

      <figure className="pp-cover" data-cursor="View">
        <Shot name={p.images[0]} p={p} k={0} cover onOpen={() => open(0)} />
      </figure>

      <div className="pp-metrics">
        {[...p.metrics, ...(p.extra || [])].map(([v, l]) => (
          <div className="stat" key={l} data-tilt="10"><p className="stat-v">{v}</p><p className="stat-l">{l}</p></div>
        ))}
      </div>

      <section className="pp-row pp-reveal">
        <h2 className="pp-label"><span>01</span>Overview</h2>
        <div className="pp-body">{p.overview.map((t) => <p key={t}>{t}</p>)}</div>
      </section>

      <section className="pp-row pp-reveal">
        <h2 className="pp-label"><span>02</span>The problem</h2>
        <div className="pp-body"><p className="pp-big">{p.problem}</p></div>
      </section>

      <section className="pp-row pp-row--wide">
        <h2 className="pp-label pp-reveal"><span>03</span>What I built</h2>
        <div className="pp-features">
          {p.features.map(([t, d], k) => (
            <article className="pp-feature" key={t} data-tilt="6">
              <span className="pp-feature-n">{pad(k + 1)}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="pp-gallery" aria-label={`${p.title} screenshots`}>
          {gallery.map((name, k) => (
            <figure className="pp-shot" key={name} data-cursor="View">
              <div className="pp-shot-frame"><Shot name={name} p={p} k={k + 1} onOpen={() => open(k + 1)} /></div>
              <figcaption><span>{pad(k + 2)}</span>{p.captions?.[name]}</figcaption>
            </figure>
          ))}
        </section>
      )}

      <section className="pp-row pp-reveal">
        <h2 className="pp-label"><span>04</span>Decisions that mattered</h2>
        <ol className="pp-decisions">{p.decisions.map((d) => <li key={d}>{d}</li>)}</ol>
      </section>

      {p.links.youtube && (
        <a className="pp-video pp-reveal-solo" href={p.links.youtube} target="_blank" rel="noopener noreferrer" data-cursor="Play">
          <img src={img(p.images[Math.min(2, p.images.length - 1)])} alt="" loading="lazy" />
          <span className="pp-video-shade" />
          <span className="pp-play"><YouTubeIcon size={64} /></span>
          <span className="pp-video-t"><small>Demo video</small>Watch {p.title} running on YouTube</span>
        </a>
      )}

      {p.next && (
        <section className="pp-row pp-reveal">
          <h2 className="pp-label"><span>05</span>What's next</h2>
          <div className="pp-body"><p>{p.next}</p></div>
        </section>
      )}

      <section className="pp-row pp-reveal">
        <h2 className="pp-label"><span>{p.next ? "06" : "05"}</span>Full stack</h2>
        <div className="pp-body"><ul className="chips chips--lg">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul></div>
      </section>

      <a className="pp-next" href={href(projectPath(next.slug))} onClick={(e) => openProject(next, e)} data-cursor="Next" style={{ "--accent": next.accent }}>
        <span className="pp-next-k">Next project · {pad(((i + 1) % PROJECTS.length) + 1)}</span>
        <span className="pp-next-t">{next.title}</span>
        <span className="pp-next-sub">{next.kicker}<Arrow /></span>
        <span className="pp-next-img"><img src={img(next.images[0], true)} alt="" loading="lazy" /></span>
      </a>

      <footer className="pp-foot">
        <a href={href("/")} onClick={backToWork}>← All work</a>
        <a href={GITHUB.url} target="_blank" rel="noopener noreferrer">More on GitHub ↗</a>
        <a href={`mailto:${PROFILE.email}`}>Email me</a>
      </footer>

      {lb && <Lightbox state={lb} onClose={() => setLb(null)} />}
    </article>
  );
}
