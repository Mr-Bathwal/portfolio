import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoaded, setMenu, toggleTheme } from "../store";
import { NAV, PROFILE, PROJECTS } from "../data";
import { finePointer, gsap, reduced, scrollToId, stopScroll } from "../lib/motion";
import { navigate, registerOverlay } from "../lib/router";
import { scramble } from "../lib/scramble";

const pad = (n) => String(n).padStart(2, "0");

/* ------------------------------------------------------------ Preloader */
export function Preloader() {
  const dispatch = useDispatch();
  const root = useRef(null);
  const [n, setN] = useState(0);
  useLayoutEffect(() => {
    stopScroll(true);
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const min = reduced() ? 0.2 : 1.6;
      const tl = gsap.timeline({ paused: true });
      tl.to(counter, { v: 100, duration: min, ease: "power2.inOut", onUpdate: () => setN(Math.round(counter.v)) })
        .to(".pre-name span", { yPercent: -110, stagger: 0.03, duration: 0.5, ease: "power3.in" }, "-=0.25")
        .to(".pre-count, .pre-note", { opacity: 0, duration: 0.3 }, "<")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: reduced() ? 0.2 : 0.9, ease: "expo.inOut" })
        .add(() => { dispatch(setLoaded()); stopScroll(false); }, "-=0.45");
      gsap.from(".pre-name span", { yPercent: 110, stagger: 0.035, duration: 0.7, ease: "power3.out" });
      scramble(root.current.querySelector(".pre-note span"), "SOFTWARE · AI · FULL-STACK · WEB3", { duration: 1.2 });
      const go = () => tl.play();
      Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(go);
    }, root);
    return () => ctx.revert();
  }, [dispatch]);
  const word = "GOURAV BATHWAL".split("");
  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pre-name">{word.map((c, i) => <span key={i}>{c === " " ? " " : c}</span>)}</div>
      <div className="pre-count">{String(n).padStart(3, "0")}</div>
      <div className="pre-note"><span /></div>
    </div>
  );
}

/* ------------------------------------------------------------ Cursor */
export function Cursor() {
  const dot = useRef(null), ring = useRef(null), label = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!finePointer() || reduced()) return undefined;
    setOn(true);
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const yd = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const xr = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const yr = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    const move = (e) => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY); };
    const over = (e) => {
      const t = e.target.closest("[data-cursor], a, button");
      const text = t?.getAttribute?.("data-cursor") || "";
      ring.current.classList.toggle("is-link", !!t);
      ring.current.classList.toggle("has-label", !!text);
      label.current.textContent = text;
    };
    const down = () => ring.current.classList.add("is-down");
    const up = () => ring.current.classList.remove("is-down");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.classList.add("has-cursor");
    return () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);
  return (
    <div className={`cursor${on ? " is-on" : ""}`} aria-hidden="true">
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring}><span ref={label} /></div>
    </div>
  );
}

/* ------------------------------------------------------------ Magnetic wrapper */
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reduced()) return undefined;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * strength); yTo((e.clientY - r.top - r.height / 2) * strength); };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [strength]);
  return <span className="magnetic" ref={ref}>{children}</span>;
}

/* ------------------------------------------------------------ Nav */
function ThemeIcon({ theme }) {
  return theme === "dark" ? (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  );
}

const sectionLabel = (id) => (id === "top" ? "Home" : NAV.find(([k]) => k === id)?.[1] || "Home");

export function Nav({ route }) {
  const dispatch = useDispatch();
  const { theme, activeSection, menuOpen, loaded } = useSelector((s) => s.ui);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef(null);
  const onHome = route.name === "home";
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useLayoutEffect(() => {
    if (!menuOpen || !menu.current) return undefined;
    stopScroll(true);
    const ctx = gsap.context(() => gsap.from(".menu-link", { yPercent: 120, opacity: 0, stagger: 0.05, duration: 0.6, ease: "power3.out" }), menu);
    const esc = (e) => e.key === "Escape" && dispatch(setMenu(false));
    window.addEventListener("keydown", esc);
    return () => { ctx.revert(); stopScroll(false); window.removeEventListener("keydown", esc); };
  }, [menuOpen, dispatch]);
  const go = (id) => {
    dispatch(setMenu(false));
    if (!onHome) { navigate("/", { label: sectionLabel(id), scrollTo: id === "top" ? null : id }); return; }
    setTimeout(() => scrollToId(id), menuOpen ? 120 : 0);
  };
  const hover = (e) => { const s = e.currentTarget.querySelector(".scr"); if (s) scramble(s, s.dataset.text || s.textContent, { duration: 0.45 }); };
  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}${loaded ? " is-in" : ""}`}>
        <button className="nav-logo" onClick={() => go("top")} aria-label="Home" data-cursor="Home">
          <span className="mono-mark">GB</span><span className="nav-name">Gourav Bathwal</span>
        </button>
        <nav className="nav-links" aria-label="Sections">
          {NAV.map(([id, label]) => (
            <button key={id} className={onHome && activeSection === id ? "is-active" : ""} onClick={() => go(id)} onMouseEnter={hover}>
              <span className="scr">{label}</span>
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => dispatch(toggleTheme())} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}><ThemeIcon theme={theme} /></button>
          <a className="pill-btn nav-resume" href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer">Résumé</a>
          <button className="icon-btn nav-burger" onClick={() => dispatch(setMenu(!menuOpen))} aria-expanded={menuOpen} aria-label="Open menu">
            <span /><span />
          </button>
        </div>
      </header>
      {menuOpen && (
        <div className="menu" ref={menu} role="dialog" aria-modal="true" aria-label="Menu">
          <button className="menu-close icon-btn" onClick={() => dispatch(setMenu(false))} aria-label="Close menu">×</button>
          {NAV.map(([id, label], i) => (
            <div className="menu-row" key={id}>
              <button className="menu-link" onClick={() => go(id)}><small>0{i + 1}</small>{label}</button>
            </div>
          ))}
          <div className="menu-foot">
            <a href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer">Résumé ↗</a>
            <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
          <a className="menu-mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------ Scroll progress */
export function Progress() {
  const bar = useRef(null);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return <div className="progress" aria-hidden="true"><div ref={bar} /></div>;
}

/* ------------------------------------------------------------ HUD: section index + scroll percentage */
export function Hud({ route }) {
  const active = useSelector((s) => s.ui.activeSection);
  const loaded = useSelector((s) => s.ui.loaded);
  const label = useRef(null), pct = useRef(null);
  let num = "00", text = "Intro";
  if (route.name === "project") {
    const i = PROJECTS.findIndex((p) => p.slug === route.slug);
    num = `C${pad(i + 1)}`; text = PROJECTS[i]?.title || "";
  } else {
    const i = NAV.findIndex(([id]) => id === active);
    if (i >= 0) { num = pad(i + 1); text = NAV[i][1]; }
  }
  useEffect(() => { scramble(label.current, text.toUpperCase(), { duration: 0.6 }); }, [text]);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (pct.current) pct.current.textContent = String(Math.round(h > 0 ? (window.scrollY / h) * 100 : 0)).padStart(3, "0") + "%";
    };
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const show = loaded && !(route.name === "home" && active === "top");
  return (
    <div className={`hud${show ? " is-on" : ""}`} aria-hidden="true">
      <span className="hud-num">[{num}]</span>
      <span className="hud-label" ref={label} />
      <i />
      <span className="hud-pct" ref={pct}>000%</span>
    </div>
  );
}

/* ------------------------------------------------------------ Page transition curtain + film grain */
export function Transition() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.set(ref.current.querySelectorAll(".pt-panel"), { yPercent: 100 });
    registerOverlay(ref.current);
    return () => registerOverlay(null);
  }, []);
  return (
    <div className="pt" ref={ref} aria-hidden="true">
      <div className="pt-panel pt-panel--a" />
      <div className="pt-panel pt-panel--b">
        <span className="pt-kicker">Gourav Bathwal</span>
        <p className="pt-label" />
      </div>
    </div>
  );
}

export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}
