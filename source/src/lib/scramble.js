// Decode effect: characters cycle through glyphs and lock in left to right.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function scramble(el, text, { duration = 0.8 } = {}) {
  if (!el) return;
  const final = text ?? el.dataset.text ?? el.textContent;
  el.dataset.text = final;
  cancelAnimationFrame(el._scr || 0);
  if (reducedMotion()) { el.textContent = final; return; }
  const start = performance.now();
  let last = 0;
  let noise = "";
  const tick = (now) => {
    const p = Math.min(1, (now - start) / (duration * 1000));
    if (now - last > 45) {
      last = now;
      noise = Array.from(final, (c) => (c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
    }
    const locked = Math.floor(p * final.length);
    el.textContent = final.slice(0, locked) + noise.slice(locked);
    if (p < 1) el._scr = requestAnimationFrame(tick);
    else el.textContent = final;
  };
  el._scr = requestAnimationFrame(tick);
}
