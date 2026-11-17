# Gourav Bathwal — Portfolio

Live: **https://mr-bathwal.github.io/portfolio/**

A motion-first portfolio built from scratch: a home page plus a full case-study page for every project.

| Layer | Choice |
|---|---|
| UI | React 18 + Vite |
| State | Redux Toolkit (theme, active section, project filter, lab stage) |
| Routing | A small router: real paths (`/projects/<slug>/`) in production, hash URLs in relative builds |
| Motion | GSAP + ScrollTrigger + SplitText + Flip, Lenis smooth scroll on GSAP's ticker |
| 3D | Three.js: a GLSL "silk" shader in the hero and an 18,000-particle morphing field in the Journey section |
| Type | Syne, Instrument Serif, Manrope, JetBrains Mono (self-hosted via Fontsource) |

## What's inside

- **Preloader** with a counter, a decoding tagline and a clip-path curtain reveal.
- **Hero**: WebGL silk, split-character name reveal, a rotating role, and an illustrated face inside a small 3D stage (ring, face and chips at different depths) that tilts with the pointer.
- **Intro**: one line about how I work and six compact stat cards with count-up numbers and 3D tilt.
- **Selected work**: six case studies stacked as sticky cards. Each card opens its own page; YouTube and live-demo buttons go straight out. A filterable index (GSAP Flip) and a GitHub section with the live public-repo count follow.
- **Project pages** (`/projects/<slug>/`): big title reveal, cover image, metrics, overview, the problem, what I built, a large screenshot gallery with a lightbox, the decisions, a YouTube demo card, what's next, the full stack and a "next project" link. Pages change behind a curtain transition.
- **Experience**: a pinned horizontal timeline with cards that turn in 3D as they arrive.
- **Journey, "scroll to generate"**: one particle field becomes a DNA helix, a code editor, a neural network, a block chain and finally the initials GB as you scroll. Particles swirl and glow with speed while they travel.
- **Lab, "scroll to generate"**: an incident card builds itself in five passes (structure, type, colour, motion, responsive) while the matching code appears beside it.
- Skills marquees that skew with scroll velocity, hackathons, education timeline, leadership, and a contact headline that assembles itself from letters scattered in 3D.
- A section HUD with scroll percentage, text-decode effects, film grain, a custom cursor, dark and light themes, full `prefers-reduced-motion` support, and a responsive layout down to 360 px.

## Use a real photo in the hero

Put a square photo at `public/me.jpg` and set `PORTRAIT = "me.jpg"` in `src/data.js`. The hero then renders a particle portrait that scatters around the cursor.

## Edit content

Everything (projects and their case-study text, experience, skills, links) lives in `src/data.js`. Screenshots live in `public/work/` (a full-size `.webp` plus a `-sm.webp`); `src/dims.js` holds their pixel sizes.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/, plus a static entry for every project page
```
