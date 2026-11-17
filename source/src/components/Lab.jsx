import { useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLabStage } from "../store";
import { gsap, reduced } from "../lib/motion";
import { SectionHead } from "./Story";

// "Scroll to generate": the reader's scroll builds an incident card in five passes,
// the way I build any component. The code for the current pass types in beside it.
const STAGES = [
  {
    title: "Structure", note: "Semantic HTML first. Boxes for the chart, the incident, its status and the action, before any styling.",
    code: `<article className="card">
  <figure className="card__chart" />
  <p className="card__meta" />
  <h3 className="card__title" />
  <p className="card__status" />
  <button className="card__cta" />
</article>`,
  },
  {
    title: "Typography", note: "A type scale with real hierarchy: an expressive serif for the headline, mono for metadata, tabular numbers for time.",
    code: `.card__title  { font: 400 2rem/1 "Instrument Serif"; }
.card__meta   { font: .75rem "JetBrains Mono";
                letter-spacing: .12em; text-transform: uppercase; }
.card__status { font-variant-numeric: tabular-nums; }`,
  },
  {
    title: "Colour & data", note: "Design tokens instead of scattered hex codes. The signal gets the colour; everything else steps back.",
    code: `:root { --signal: #7cc4ff; --ink: #0b0d14; }
.card {
  background: radial-gradient(120% 80% at 50% 0%, #17223a, var(--ink));
}
.card__cta { background: var(--signal); color: var(--ink); }`,
  },
  {
    title: "Motion", note: "Motion that explains: the line draws the incident, the live dot pulses, and the button confirms the action.",
    code: `useGSAP(() => {
  gsap.from(".spark path", { drawSVG: 0, duration: 1.4 });
  gsap.to(".pulse", { scale: 2.4, opacity: 0, repeat: -1 });
});
const onApprove = () => dispatch(approveFix(incident)); // Redux Toolkit`,
  },
  {
    title: "Responsive", note: "One component, every screen. A container query reflows it for a phone without a second codebase.",
    code: `.card { container-type: inline-size; }
@container (max-width: 340px) {
  .card       { grid-template-columns: 1fr; }
  .card__cta  { width: 100%; }
}`,
  },
];

function Spark() {
  return (
    <svg className="spark-svg" viewBox="0 0 220 140" aria-hidden="true">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7cc4ff" stopOpacity=".45" /><stop offset="1" stopColor="#7cc4ff" stopOpacity="0" /></linearGradient>
      </defs>
      <g className="spark-grid">{[30, 60, 90, 120].map((y) => <line key={y} x1="10" x2="210" y1={y} y2={y} />)}</g>
      <path className="spark-area" d="M10 110 L40 104 L62 108 L84 96 L104 40 L118 28 L134 70 L152 98 L174 102 L192 100 L210 104 L210 130 L10 130 Z" fill="url(#spark-fill)" />
      <path className="spark-line" pathLength="1" d="M10 110 L40 104 L62 108 L84 96 L104 40 L118 28 L134 70 L152 98 L174 102 L192 100 L210 104" />
      <line className="spark-mark" x1="118" x2="118" y1="18" y2="130" />
      <circle className="pulse" cx="210" cy="104" r="5" />
      <circle className="spark-dot" cx="210" cy="104" r="4" />
    </svg>
  );
}

export default function Lab() {
  const root = useRef(null);
  const dispatch = useDispatch();
  const stage = useSelector((s) => s.ui.labStage);
  const [done, setDone] = useState(false);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) { dispatch(setLabStage(STAGES.length - 1)); return; }
      let last = -1;
      gsap.timeline({
        scrollTrigger: {
          trigger: ".lab-pin", start: "top top", end: () => "+=" + window.innerHeight * 2.8, pin: true, scrub: true,
          onUpdate: (self) => {
            const s = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
            if (s !== last) { last = s; dispatch(setLabStage(s)); }
            root.current.style.setProperty("--lab-p", self.progress.toFixed(3));
          },
        },
      });
    }, root);
    return () => ctx.revert();
  }, [dispatch]);
  const s = STAGES[stage];
  return (
    <section className="lab" id="lab" ref={root}>
      <div className="lab-pin" data-stage={stage}>
        <div className="lab-left">
          <SectionHead num="06" kicker="Lab · scroll to generate" title={<>Watch a component <em>build itself</em></>}>
            Keep scrolling. Each step is one pass I make on every interface I ship.
          </SectionHead>
          <ol className="lab-steps">
            {STAGES.map((st, i) => (
              <li key={st.title} className={i === stage ? "is-on" : i < stage ? "is-done" : ""}>
                <span className="n">0{i + 1}</span><span className="t">{st.title}</span>
              </li>
            ))}
          </ol>
          <p className="lab-note" key={stage}>{s.note}</p>
          <pre className="lab-code" aria-label={`Code for the ${s.title} step`}><code key={stage}>{s.code}</code></pre>
        </div>
        <div className="lab-stage">
          <div className="device">
            <div className="device-bar"><i /><i /><i /><span>{stage >= 4 ? "390 px" : "1280 px"}</span></div>
            <article className="pcard">
              <figure className="pcard-media"><Spark /></figure>
              <div className="pcard-body">
                <p className="pcard-meta">INC-2041 · checkout-api · P1</p>
                <h3 className="pcard-title">Latency spike on checkout</h3>
                <p className="pcard-price">Resolved by agent in 42 s</p>
                <button className={`pcard-cta${done ? " is-added" : ""}`} onClick={() => stage >= 3 && setDone((a) => !a)} tabIndex={stage >= 3 ? 0 : -1}>
                  {done ? "Fix approved ✓" : "Approve fix"}
                </button>
              </div>
            </article>
          </div>
          <div className="lab-meter" aria-hidden="true"><i /></div>
        </div>
      </div>
    </section>
  );
}
