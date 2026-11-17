// After `vite build`: give every project its own static entry (/projects/<slug>/index.html) with its own
// title and social preview, plus a 404.html, so deep links work on GitHub Pages without a server.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { PROJECTS } from "../src/data.js";

// Absolute site URL for social previews: Vercel provides its production domain at build time.
const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://mr-bathwal.github.io/portfolio";
const dist = new URL("../dist/", import.meta.url);
const html = readFileSync(new URL("index.html", dist), "utf8");
if (!/src="\/[^"]*assets\//.test(html)) {
  console.log("pages: relative build, skipping static routes");
  process.exit(0);
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const set = (doc, re, value) => doc.replace(re, (_, a) => a + esc(value));

let home = set(html, /(<meta property="og:url" content=")[^"]*/, `${SITE}/`);
home = set(home, /(<meta property="og:image" content=")[^"]*/, `${SITE}/og.jpg`);
writeFileSync(new URL("index.html", dist), home);
writeFileSync(new URL("404.html", dist), home);
for (const p of PROJECTS) {
  const title = `${p.title} — ${p.kicker} · Gourav Bathwal`;
  let page = home.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  page = set(page, /(<meta name="description" content=")[^"]*/, p.summary);
  page = set(page, /(<meta property="og:title" content=")[^"]*/, title);
  page = set(page, /(<meta property="og:description" content=")[^"]*/, p.summary);
  page = set(page, /(<meta property="og:url" content=")[^"]*/, `${SITE}/projects/${p.slug}/`);
  page = set(page, /(<meta property="og:image" content=")[^"]*/, `${SITE}/work/${p.images[0]}.webp`);
  mkdirSync(new URL(`projects/${p.slug}/`, dist), { recursive: true });
  writeFileSync(new URL(`projects/${p.slug}/index.html`, dist), page);
}
console.log(`pages: wrote 404.html and ${PROJECTS.length} project entries`);
