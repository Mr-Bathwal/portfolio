import { useEffect, useRef, useState } from "react";
import { reduced } from "../lib/motion";

// An illustrated, living portrait: the head turns toward the pointer, the eyes follow it,
// it blinks on its own, and it smiles when you hover it.
export default function Avatar() {
  const root = useRef(null);
  const [blink, setBlink] = useState(false);
  const [happy, setHappy] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const still = reduced();
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const dy = (e.clientY - (r.top + r.height * 0.45)) / (window.innerHeight / 2);
      tx = Math.max(-1, Math.min(1, dx)); ty = Math.max(-1, Math.min(1, dy));
      if (!raf && !still) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      el.style.setProperty("--hx", cx.toFixed(3));
      el.style.setProperty("--hy", cy.toFixed(3));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    let timer;
    const scheduleBlink = () => {
      timer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
        scheduleBlink();
      }, 2200 + Math.random() * 3200);
    };
    if (!still) scheduleBlink();
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); clearTimeout(timer); };
  }, []);

  return (
    <div
      className={`avatar${blink ? " is-blink" : ""}${happy ? " is-happy" : ""}`}
      ref={root}
      onPointerEnter={() => setHappy(true)}
      onPointerLeave={() => setHappy(false)}
      data-cursor="Hi!"
    >
      <svg viewBox="0 0 240 280" role="img" aria-label="Illustrated portrait of Gourav that follows your cursor">
        <defs>
          <radialGradient id="av-skin" cx="45%" cy="38%" r="70%">
            <stop offset="0" stopColor="#d9a57a" />
            <stop offset="1" stopColor="#b9825a" />
          </radialGradient>
          <linearGradient id="av-hood" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#273250" />
            <stop offset="1" stopColor="#141a2c" />
          </linearGradient>
          <linearGradient id="av-hair" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#2a2329" />
            <stop offset="1" stopColor="#141015" />
          </linearGradient>
        </defs>
        {/* body */}
        <g className="av-body">
          <path d="M34 280 C38 236 72 212 106 206 L134 206 C168 212 202 236 206 280 Z" fill="url(#av-hood)" />
          <path d="M86 210 C96 236 144 236 154 210" fill="none" stroke="#0e1322" strokeWidth="6" strokeLinecap="round" />
          <path d="M108 226 L105 256" stroke="#e7c27d" strokeWidth="3" strokeLinecap="round" />
          <path d="M132 226 L135 256" stroke="#e7c27d" strokeWidth="3" strokeLinecap="round" />
          <circle cx="105" cy="259" r="3.2" fill="#e7c27d" />
          <circle cx="135" cy="259" r="3.2" fill="#e7c27d" />
          <rect x="106" y="186" width="28" height="28" rx="10" fill="#a8734d" />
        </g>
        {/* head */}
        <g className="av-head">
          <ellipse cx="72" cy="142" rx="8" ry="13" fill="#b9825a" />
          <ellipse cx="168" cy="142" rx="8" ry="13" fill="#b9825a" />
          <path d="M72 128 C72 92 96 78 120 78 C146 78 168 94 168 128 C168 170 148 198 120 200 C92 198 72 170 72 128 Z" fill="url(#av-skin)" />
          <g className="av-hair">
            <path d="M68 132 C60 96 82 62 122 60 C160 60 182 88 172 132 C168 116 160 104 146 98 C136 106 108 112 88 104 C80 112 72 120 68 132 Z" fill="url(#av-hair)" />
            <path d="M92 70 C112 50 150 52 162 74 C146 66 126 66 110 76 Z" fill="#2e262c" />
          </g>
          <g className="av-brows">
            <path d="M86 121 Q97 114 109 119" fill="none" stroke="#1b1519" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M131 119 Q143 114 154 121" fill="none" stroke="#1b1519" strokeWidth="4.5" strokeLinecap="round" />
          </g>
          <g className="av-eyes">
            <g className="av-eye">
              <ellipse cx="98" cy="139" rx="9.5" ry="7" fill="#fbf8f2" />
              <g className="av-pupil"><circle cx="98" cy="139" r="4.4" fill="#1d1820" /><circle cx="99.6" cy="137.4" r="1.4" fill="#fff" /></g>
            </g>
            <g className="av-eye">
              <ellipse cx="142" cy="139" rx="9.5" ry="7" fill="#fbf8f2" />
              <g className="av-pupil"><circle cx="142" cy="139" r="4.4" fill="#1d1820" /><circle cx="143.6" cy="137.4" r="1.4" fill="#fff" /></g>
            </g>
          </g>
          <path d="M120 142 Q115 160 122 164" fill="none" stroke="#9c6a45" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="90" cy="162" rx="9" ry="5" fill="#e08d7a" opacity=".28" />
          <ellipse cx="150" cy="162" rx="9" ry="5" fill="#e08d7a" opacity=".28" />
          <path className="av-mouth av-mouth--calm" d="M106 178 Q120 187 134 178" fill="none" stroke="#6b3a2c" strokeWidth="3.4" strokeLinecap="round" />
          <path className="av-mouth av-mouth--happy" d="M102 175 Q120 198 138 175 Z" fill="#6b3a2c" />
          <path className="av-mouth av-mouth--happy" d="M106 177 Q120 184 134 177" fill="none" stroke="#fbf8f2" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
