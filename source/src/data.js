// All portfolio content lives here. Edit this file to update the site.
// Set PORTRAIT to "me.jpg" (put the photo in /public) to swap the illustrated face for a particle portrait.
export const PORTRAIT = null;

export const PROFILE = {
  name: "Gourav Kumar Bathwal",
  first: "Gourav",
  last: "Bathwal",
  roles: ["Software Engineer", "AI Agent Builder", "Full-Stack Developer", "Product-minded Builder", "Web3 Developer"],
  tagline:
    "I build software end to end: LLM agents at EY, a rebuilt product at Fletch, real-time dashboards, and on-chain apps shipped at national hackathons.",
  status: "IIT Hyderabad · Class of 2027 · Open to opportunities",
  email: "bt23btech11008@iith.ac.in",
  links: {
    github: "https://github.com/Mr-Bathwal",
    linkedin: "https://www.linkedin.com/in/gourav-kumar-bathwal-16057430a/",
    resume: "https://drive.google.com/file/d/142PJWvKCe_HzR1kGIdetPCA5PMkM0yb4/view?usp=drive_link",
  },
};

// Public repositories on github.com/Mr-Bathwal. The live site refreshes this from the GitHub API.
export const GITHUB = { user: "Mr-Bathwal", url: "https://github.com/Mr-Bathwal?tab=repositories", repos: 20 };

export const MANIFESTO =
  "I build software that feels effortless: agents that check their own work, interfaces that stay fast under load, and code a teammate can read on Monday morning.";

export const NUMBERS = [
  { value: 500, suffix: "+", label: "DSA problems", note: "LeetCode · Codeforces" },
  { value: 3, suffix: "", label: "Internships", note: "EY · Fletch · AlgoUniversity" },
  { value: 3, suffix: "", label: "Hackathon products", note: "Avalanche · Rise In · Solana" },
  { value: 9, suffix: "", label: "Smart contracts live", note: "Algorand TestNet" },
  { value: 33, suffix: "", label: "Agent tools wired", note: "Aurora Ops at EY" },
  { value: 8.0, suffix: "", decimals: 2, label: "CGPA", note: "IIT Hyderabad" },
];

export const EXPERIENCE = [
  {
    company: "EY",
    role: "AI Analyst Intern",
    period: "Jun 2026 — Present",
    kind: "Internship",
    summary: "Building agentic AI products with LangChain and LangGraph, from the agent graph to the console people actually use.",
    points: [
      "Built Aurora Ops: three specialist LLM agents, an orchestrator that routes plain-English symptoms, and a diagnose → decide → act → verify chain.",
      "Cut a routine diagnose-and-remediate sweep from about 30 minutes by hand to under 10 seconds.",
      "Developed a Support Ticket Triage Agent and an IT Ops Assistant Hub that automate classification, routing and routine operations.",
      "Designed the Next.js 16 console with React 19, Tailwind v4 and Three.js, audited with Playwright across every route.",
    ],
    stack: ["Next.js 16", "React 19", "LangGraph", "LangChain", "FastAPI", "Groq", "Three.js", "Playwright"],
  },
  {
    company: "Fletch Technologies",
    role: "Frontend & Full-Stack Developer Intern",
    period: "Dec 2025 — May 2026",
    kind: "6-month semester internship",
    summary: "Embedded financial-services distribution. Rebuilt the product's interface from the ground up.",
    points: [
      "Rebuilt the entire Fletch UI/UX and shipped full-stack features across React, Node.js and Express.",
      "Built reusable no-code widget components so non-technical users can assemble embedded financial-services workflows.",
      "Designed and integrated REST APIs and third-party services into unified, automated business workflows.",
    ],
    stack: ["React", "JavaScript", "Node.js", "Express", "REST APIs", "Component systems"],
  },
  {
    company: "AlgoUniversity",
    role: "Software Engineering Co-op (Training)",
    period: "Apr 2025 — Nov 2025",
    kind: "Selective co-op",
    summary: "Selected through a competitive three-stage process for an intensive full-stack and DSA programme.",
    points: [
      "Built production-style full-stack applications under daily, high-pressure problem-solving sprints.",
      "Daily data-structures and algorithms practice alongside every full-stack build.",
    ],
    stack: ["MERN", "C++", "DSA", "System design basics"],
  },
  {
    company: "Internshala",
    role: "Internshala Student Partner",
    period: "Jun 2026 — Present",
    kind: "Campus ambassador",
    summary: "Selected as the official face of Internshala at IIT Hyderabad.",
    points: [
      "Drive campus-wide awareness and engagement for internships and skilling programmes through on-ground and digital outreach.",
    ],
    stack: ["Community", "Marketing", "Outreach"],
  },
];

// Order here is the order on the site. Each project gets its own page at /projects/<slug>/.
export const PROJECTS = [
  {
    slug: "aurora-ops",
    title: "Aurora Ops",
    kicker: "Agentic IT operations platform",
    context: "EY · AI Analyst internship",
    year: "2026",
    scope: "Agents · API · Console UI",
    cats: ["ai", "fullstack", "frontend"],
    accent: "#7cc4ff",
    summary:
      "A console for running LLM agents against real machines. Describe a symptom in plain English, an orchestrator routes it to the right specialist, and a remediation chain diagnoses, decides, acts and then verifies its own work.",
    overview: [
      "Aurora Ops is an agentic AI platform for first-line IT operations, built during my AI Analyst internship at EY. Three specialist LLM agents inspect a machine, an orchestrator routes a plain-English request to the right one, and a remediation chain diagnoses, decides, acts and then verifies its own work.",
      "The backend is FastAPI with two LangGraph state machines running on Groq. The console is a Next.js 16 app: a run view that streams every tool call, a live agent graph, a fleet dashboard and a Three.js landing scene.",
    ],
    problem:
      "First-line IT work is a loop of the same checks: CPU, memory, disk, services, logs, a backup, then confirming the fix. By hand, a routine diagnose-and-remediate sweep takes around 30 minutes, and confirming the fix is the step that gets skipped.",
    features: [
      ["Three specialist agents", "System Health (18 tools) and Log Analyzer (7 tools) are read-only. Backup & DR (8 tools) is the only agent allowed to change anything."],
      ["Plain-English orchestrator", "An LLM router reads the request and hands it to the right specialist. No menus, no command syntax."],
      ["A chain that checks itself", "Diagnose → decide → act → verify. The verify step runs no tools: it reviews what happened and states whether the issue is actually resolved."],
      ["Reaches a whole fleet", "Local, SSH, or an outbound-only agent daemon that enrols with a single-use token and polls for work every 3 seconds."],
      ["Secure by default", "scrypt password hashes, tokens stored only as SHA-256 digests, encrypted SSH credentials, and an AST validator that denies LLM-generated code by default."],
      ["A console people can read", "Every tool call streams into the run view, the agent graph lights up as work moves, and every route was audited with Playwright."],
    ],
    decisions: [
      "Only the backup agent can change anything; the health and log agents are read-only by design.",
      "An outbound-only agent daemon polls every 3 s, so it installs on managed endpoints without opening a single inbound port.",
      "One external service and a local SQLite file: no cloud database, no extra keys, nothing to migrate.",
      "The model is swappable for a local one in a single line.",
    ],
    next: "Production hardening is next: refuse to start without a secret key, pin SSH host keys, and move from single-process SQLite to a multi-tenant store.",
    metrics: [["3", "specialist agents"], ["33", "tools, chosen live"], ["<10 s", "vs ~30 min by hand"]],
    stack: ["Next.js 16", "React 19", "Tailwind v4", "framer-motion", "Three.js", "FastAPI", "LangGraph", "LangChain", "Groq", "SQLite", "Playwright"],
    images: ["aurora-landing", "aurora-scene", "aurora-console", "aurora-graph", "aurora-workflow", "aurora-dashboard"],
    captions: {
      "aurora-landing": "Landing page: “Infrastructure fails at 3am. Your team shouldn't have to.”",
      "aurora-scene": "The agent system as a 3D scene: three specialists around the orchestrator.",
      "aurora-console": "Specialist agents: pick one, watch it reason, call tools and produce a verified report.",
      "aurora-graph": "Live agent graph: decision router, specialists and the chain supervisor.",
      "aurora-workflow": "The remediation intelligence chain, from log diagnosis to supervisor decision.",
      "aurora-dashboard": "Fleet dashboard: operational rhythm, fleet overview and outcome breakdown.",
    },
    links: { youtube: "https://youtu.be/0EZnk7h80Dw", code: "https://github.com/Mr-Bathwal/aurora-itops" },
  },
  {
    slug: "matchpulse",
    title: "MatchPulse",
    kicker: "Provably-fair World Cup companion",
    context: "TxODDS × Solana World Cup Hackathon",
    year: "2026",
    scope: "Product design · Frontend · On-chain pipeline",
    cats: ["web3", "frontend"],
    accent: "#8ff0a4",
    summary:
      "Live scores, odds and win probability for every match. Fans call a result before kickoff; the pick is SHA-256 hashed, signed and anchored on Solana, then settled against verified results.",
    overview: [
      "MatchPulse is a World Cup 2026 companion where fans don't just watch, they call it and prove it. Live scores, 1X2 odds, win probability, momentum, lineups and head-to-head for every match, driven by the TxLINE feed.",
      "Before kickoff a fan picks a result. The pick is SHA-256 hashed, signed with the fan's own key and anchored on Solana through a relayer. When TxLINE publishes the verified result, predictions settle automatically, so every leaderboard point traces back to a commitment nobody could back-date.",
    ],
    problem:
      "Prediction games die when players suspect results are edited after the fact, and most Web3 versions lose people at the wallet-and-gas step before they ever make a pick.",
    features: [
      ["Watch", "Real-time scores, odds, win probability, momentum, stats, lineups and head-to-head, kept live with SWR polling."],
      ["Predict", "Picks are hashed, signed with an in-browser ed25519 key and anchored with Solana's Memo program; the relayer pays the fee."],
      ["Prove", "Results come from TxLINE's verified feed, whose Merkle root TxODDS anchors on Solana, so settlement is deterministic."],
      ["Interactive 3D", "A procedurally textured football under stadium floodlights in React Three Fiber, and lineups on a pitch that leans with your mouse."],
      ["Three themes", "Night Match, Turf and Royal recolour both the interface and the WebGL scenes."],
      ["Gamified", "Odds-weighted scoring where bold calls pay more, streaks, accuracy and a podium leaderboard."],
    ],
    decisions: [
      "Zero-friction Web3: a keypair is created invisibly in the browser and a relayer pays fees. No wallet, no seed phrase.",
      "Provider-swappable data layer: the whole UI runs on a deterministic mock feed or the live TxLINE feed by flipping one env var.",
      "Open editorial design instead of dashboard boxes: hairline rules, kicker headings and display-size numerals.",
      "The server verifies the author's signature before it hashes and anchors a pick.",
    ],
    metrics: [["0", "wallets or gas for fans"], ["SHA-256", "picks anchored on Solana"], ["1 env var", "mock ↔ live feed"]],
    stack: ["Next.js 16", "React 19", "Tailwind v4", "React Three Fiber", "GSAP", "Lenis", "Solana web3.js", "tweetnacl", "SWR"],
    images: ["match-hero", "match-matches", "match-points", "match-board"],
    captions: {
      "match-hero": "Landing: “The beautiful game, provably fair.”",
      "match-matches": "Match Center: every score and every odds move, straight from the TxLINE feed.",
      "match-points": "Odds-weighted scoring: bold calls earn bigger points.",
      "match-board": "The table: a podium leaderboard where every score is backed by an on-chain proof.",
    },
    links: { code: "https://github.com/Mr-Bathwal/TXodds_WC" },
  },
  {
    slug: "cutlist",
    title: "CUTLIST",
    kicker: "AI promo cut sheets from a screenplay",
    context: "Kuku · AI Generalist assignment",
    year: "2026",
    scope: "Pipeline · Evaluation · Review UI",
    cats: ["ai", "frontend"],
    accent: "#b4a8ff",
    summary:
      "Reads 50 episodes of a microdrama and returns a ranked list of 20–60 second promo clips: the hook, the cliffhanger, the reason, and frame-exact cut points an editor can drop into Premiere.",
    overview: [
      "CUTLIST reads a show's screenplays and returns a ranked list of 20–60 second promo clips: the hook, the cliffhanger, the reason, and frame-exact cut points an editor can drop straight into Premiere.",
      "On the supplied pack, 50 episodes of a microdrama, it parsed 3,727 timed beats and 102.7 minutes of screenplay in 1.6 seconds, with no API key and no installs. It returned 156 verified promo candidates and exported the top 20 with edit decision lists.",
    ],
    problem:
      "A microdrama studio needs a steady stream of short promos for every show. Finding the moments that hook and cutting them on exact frames is slow, manual work, and a model that invents a cut point is worse than useless.",
    features: [
      ["Screenplay parser", "Turns 50 episodes into 3,727 timed beats, so every candidate clip starts and ends on a real beat boundary."],
      ["Ranked cut list", "Scores each window for hook and cliffhanger and writes down the reason, so a marketing lead can trust the order."],
      ["Editor-ready export", "CMX3600 EDLs for Premiere, Resolve and Avid, plus a CSV schedule and a readable cut sheet."],
      ["The film", "A scroll-driven 35 mm reel of all fifty episodes, and a grounding wall of 61,612 cells with the 3,419 real beat starts lit."],
      ["The review desk", "A keyboard-driven queue: Enter approves, R rejects, J/K/L scrub, I/O nudge a cut by exactly one beat, E exports."],
      ["Optional model pass", "Rules alone produce the full list; a model review pass on any OpenAI-compatible, Anthropic or Gemini endpoint is one environment variable away."],
    ],
    decisions: [
      "Every cut point is a beat boundary lifted from the screenplay, so no cut can be hallucinated.",
      "Standard-library Python only: no API key, no installs, and the whole run takes under two seconds.",
      "Every number, curve and lit cell on the page is read from the same run output as the EDLs, so the page can't claim something the pipeline didn't do.",
      "Tested on a show it had never seen: an original three-episode thriller in a different genre.",
    ],
    metrics: [["3,727", "timed beats parsed"], ["156", "verified promo cuts"], ["0", "dependencies"]],
    extra: [["44", "unit tests"], ["25", "browser checks"], ["16.7 ms", "median frame while scrolling"]],
    stack: ["Python", "JavaScript", "HTML & CSS", "Canvas", "CMX3600 EDL", "Playwright checks"],
    images: ["cutlist-hero", "cutlist-desk"],
    captions: {
      "cutlist-hero": "The film opens on the numbers, every one read from the run.",
      "cutlist-desk": "Fifty episodes as pressure curves: where a promo was found, the window is cut into the frame.",
    },
    links: { code: "https://github.com/Mr-Bathwal/Kuku_Assesment" },
  },
  {
    slug: "axiom-trade-pulse",
    title: "Axiom Trade Pulse",
    kicker: "Real-time DeFi trading dashboard",
    context: "Pixel-accurate frontend build",
    year: "2025",
    scope: "Frontend architecture · UI · Real-time data",
    cats: ["frontend"],
    accent: "#9fe2bf",
    summary:
      "A pixel-accurate trading interface: a live token table with streaming prices, sortable columns and quick-trade actions, plus a Pulse board that sorts tokens into New Pairs, Final Stretch and Migrated.",
    overview: [
      "A pixel-accurate rebuild of a professional token-discovery interface: a live token table with streaming prices, sparklines, sortable columns and quick-trade actions, and a Pulse board that sorts tokens into New Pairs, Final Stretch and Migrated.",
      "It is built like production code: Next.js 16 and TypeScript, Redux Toolkit for interface state, React Query for server data, TanStack Table for the grid, and shadcn/ui on Radix primitives for accessible popovers, tooltips and modals.",
    ],
    problem:
      "Trading interfaces are dense and never stop moving. Hundreds of cells update every few seconds, and any jank, layout shift or stale number costs the user's trust.",
    features: [
      ["Live token table", "TanStack Table with sortable price, 24h change, volume, market cap and liquidity columns, plus quick-trade actions."],
      ["Pulse board", "Three live columns, New Pairs, Final Stretch and Migrated, driven by each token's category."],
      ["Real-time updates", "Prices refresh every 3 seconds over Pusher and Moralis, with memoised rows so only changed cells re-render."],
      ["Rich interactions", "Hover popovers with token details, explanatory tooltips on every data point, and a tabbed token detail modal."],
      ["Motion with purpose", "Framer Motion transitions and micro-interactions that guide the eye without slowing the table down."],
      ["Responsive and typed", "A mobile-first Tailwind layout and end-to-end TypeScript."],
    ],
    decisions: [
      "Redux Toolkit owns complex table state and selections; React Query owns server data and caching, so the two never fight.",
      "WebSocket-driven updates and memoised rows keep the table smooth while prices tick.",
      "Radix primitives under shadcn/ui, so popovers, tooltips and modals are keyboard and screen-reader friendly from the start.",
    ],
    metrics: [["Redux", "Toolkit + React Query"], ["Live", "WebSocket price feeds"], ["Mobile-first", "responsive layout"]],
    stack: ["Next.js 16", "TypeScript", "Redux Toolkit", "React Query", "TanStack Table", "Framer Motion", "Tailwind v4", "shadcn/ui", "Radix UI"],
    images: ["axiom-table", "axiom-pulse"],
    captions: {
      "axiom-table": "The trending table: live prices, sparklines, sortable columns and quick buy.",
      "axiom-pulse": "The Pulse board: New Pairs, Final Stretch and Migrated, side by side.",
    },
    links: { youtube: "https://www.youtube.com/watch?v=Xn2VcfuVOhE", code: "https://github.com/Mr-Bathwal/Axiom-trade-pulse_Clone" },
  },
  {
    slug: "algorand-did",
    title: "Algorand DID",
    kicker: "Self-sovereign identity, gasless",
    context: "Rise In National Hackathon · T-Hub",
    year: "2025",
    scope: "Smart contracts · dApp · UX",
    cats: ["web3", "frontend"],
    accent: "#f6c177",
    summary:
      "Anchor an Aadhaar-verified identity on-chain, issue and hold verifiable credentials, and transact with zero fees through account-abstraction smart wallets. Personal data stays off-chain; only hashes are anchored.",
    overview: [
      "Self-sovereign identity on Algorand. Anchor an Aadhaar-verified identity on-chain, issue and hold verifiable credentials, and transact with zero fees through account-abstraction smart wallets.",
      "Nine PyTeal contracts are live on Algorand TestNet, covering identity, organisations, certificates, badges, trust scores, governance, disputes, a smart wallet and a paymaster. The React and TypeScript dApp walks through the whole flow, with a demo mode that needs no wallet.",
    ],
    problem:
      "On-chain identity is hard to start with: fees, wallet UX and fragmented standards turn people away, while custodial KYC leaks the very data it is meant to protect.",
    features: [
      ["Gasless by design", "A paymaster sponsors whitelisted calls in a two-transaction group. Users sign once and pay nothing."],
      ["Smart wallet", "Guardians, daily limits and social recovery, with the feel of a normal web app."],
      ["Privacy-first verification", "Face liveness and Aadhaar Secure-QR run client-side; only hashes and commitments go on-chain."],
      ["Credentials and badges", "Issue, verify, revoke and transfer certificates, with batch issue and reputation badges."],
      ["Trust and governance", "Weighted trust scores, endorsements, proposals and votes, and a dispute process with jury selection."],
      ["Demo mode", "With no wallet connected, the dashboards render realistic sample data so anyone can walk the full flow."],
    ],
    decisions: [
      "A paymaster sponsors whitelisted calls in a two-transaction group, so users sign once and pay nothing.",
      "Personal data stays off-chain; only commitments are anchored.",
      "Smart wallets with guardians, daily limits and social recovery instead of a single fragile key.",
    ],
    next: "Zero-knowledge proofs are next on the roadmap: client-side proof generation with on-chain verification for common claims, and IPFS-only storage for anything personal.",
    metrics: [["9", "PyTeal contracts on TestNet"], ["0", "fees for users"], ["Live", "demo, no wallet needed"]],
    stack: ["React 18", "TypeScript", "Vite", "algosdk", "Pera / Defly", "PyTeal", "Python"],
    images: ["algo-hero", "algo-wallet"],
    captions: {
      "algo-hero": "Landing: live on Algorand TestNet with nine contracts deployed.",
      "algo-wallet": "Sign once, pay nothing: the sponsored two-transaction group, explained in the product.",
    },
    links: { live: "https://mr-bathwal.github.io/Algorand_DID/", code: "https://github.com/Mr-Bathwal/Algorand_DID" },
  },
  {
    slug: "ticketverse",
    title: "TicketVerse",
    kicker: "NFT ticketing with anti-scalping",
    context: "Avalanche National Hackathon · Draper House",
    year: "2025",
    scope: "Smart contracts · dApp · WebGL",
    cats: ["web3", "frontend"],
    accent: "#ff9db0",
    summary:
      "Event tickets as ERC-721 NFTs that cannot be forged, with a resale marketplace whose +20% price cap is enforced by the contract itself, not the UI. Fixed-price sales, timed auctions and organiser royalties.",
    overview: [
      "TicketVerse turns event tickets into ERC-721 NFTs, so they can't be duplicated or forged, and enforces fair resale on-chain so scalpers can't mark them up. Buy, verify and resell from one dApp.",
      "Organisers deploy a dedicated ticket contract per event through a factory. Attendees verify once, mint a seat, and resell through a marketplace with fixed-price listings or timed auctions, all on Avalanche Fuji.",
    ],
    problem:
      "Ticket resale is where fans get hurt: forged tickets, bots bulk-buying, and resale prices several times face value. A rule that lives only in the interface is a rule a scalper can bypass.",
    features: [
      ["Tickets are NFTs", "Each ERC-721 ticket carries its seat, tier and venue, so it can't be copied or counterfeited."],
      ["Anti-scalping resale", "The marketplace caps resale at +20% over the last sale price, enforced by the contract."],
      ["Human verification", "A UserVerifier contract gates sensitive actions behind a verification level to deter bots and bulk buying."],
      ["Auctions", "Timed auctions with reserve prices, minimum bid increments and anti-snipe extensions."],
      ["Escrow settlement", "Buyers deposit into an event escrow, so purchases and bids settle against balances."],
      ["WebGL hero and demo mode", "A 3D ticket hero, and mock data so anyone can browse every flow without a wallet."],
    ],
    decisions: [
      "The price cap lives on-chain, so no frontend tweak can bypass it.",
      "A factory deploys one contract per event, so each organiser's rules stay isolated.",
      "A full demo mode with a WebGL ticket hero lets judges explore every flow without a wallet.",
    ],
    metrics: [["+20%", "resale cap, on-chain"], ["6/6", "contract tests passing"], ["Live", "on Avalanche Fuji"]],
    stack: ["React 19", "Vite 7", "Tailwind v4", "wagmi", "viem", "RainbowKit", "Solidity", "Hardhat", "IPFS"],
    images: ["ticket-landing", "ticket-market", "ticket-auction", "ticket-profile"],
    captions: {
      "ticket-landing": "Landing with a WebGL 3D ticket hero.",
      "ticket-market": "The ticket marketplace, where resale is capped by the contract.",
      "ticket-auction": "The auction chamber: reserve prices, bid increments and anti-snipe extensions.",
      "ticket-profile": "Profile: verification level, tickets owned and events created.",
    },
    links: { live: "https://mr-bathwal.github.io/Avalanche-Hacking/", code: "https://github.com/Mr-Bathwal/Avalanche-Hacking" },
  },
  {
    slug: "procureflow",
    title: "ProcureFlow",
    kicker: "An ERP agent that verifies its own writes",
    context: "Independent project · ERPNext procure-to-pay",
    year: "2026",
    scope: "Agent graph · Policy engine · Evaluation record",
    cats: ["ai", "fullstack"],
    accent: "#ddd6c7",
    summary:
      "An agent that runs procure-to-pay inside ERPNext and treats every one of its own actions as something to verify rather than trust. Every write is read back and compared, every decision cites a rule from a written policy, and the published evaluation record recomputes its figures in the browser from the committed results file.",
    overview: [
      "ProcureFlow reads a purchase-request email or a supplier quote, checks it against a procurement policy of sixteen written rules, raises the Material Request and the Purchase Order in ERPNext, stops for a named approver with the authority to say yes, then records the goods receipt and the invoice and runs a three-way match. The model only reads: everything that decides is deterministic, in integer paise, and cites the rule it applied.",
      "The premise is that an HTTP 200 means ERPNext accepted a request, not that the stored document says what the agent believes it says. So every write is read back and compared, and a failure to verify is its own error type that is never folded into a generic one. The evaluation record is a static page that reads the committed results JSON in the browser, so no figure on it can drift from the repository.",
    ],
    problem:
      "Agent demos stop at the happy path: the call returned 200, the screenshot looks right, the run is declared a success. In a finance workflow that gap is where the money goes — a retry that quietly creates a second purchase order, an approval given for one total and submitted against another, an invoice paid without anyone checking what actually arrived.",
    features: [
      ["Every write is read back", "A document is created, then fetched and compared field by field. VerificationError is its own type and is never folded into a generic ERP error."],
      ["The approval is bound to a digest", "An approval is tied to a SHA-256 digest of exactly what the approver saw. Before submitting, the order is re-read and the digest recomputed; if they differ, the approval is void and nothing is submitted."],
      ["A policy you can read", "Sixteen rules live in a Markdown document rather than in the code. The agent parses them, cites a rule id on every decision, and fails closed if a rule cannot be read."],
      ["Idempotent retries", "Every create carries an idempotency key in a unique ERPNext field, so after an ambiguous timeout the agent looks the document up before re-sending it."],
      ["Documents are screened first", "Hidden PDF text, invisible Unicode, embedded instructions and bank-detail changes are caught before any model reads the file, and every extracted value must appear on the page."],
      ["A fixed graph, not a free agent", "Eleven nodes in one direction. submit_purchase_order is reachable only through the approval gate, which the test suite asserts rather than the prompt requesting it."],
    ],
    decisions: [
      "The policy is a document, not configuration: a finance owner can change a threshold without touching Python, and every decision quotes the rule id it applied.",
      "Money is integer paise through Decimal. No float ever touches a total.",
      "The agent cannot create a Supplier. Master data is read-only in the allowlist, and a test asserts that it stays that way.",
      "The whole suite runs against an in-memory ERPNext double, so the evaluation is reproducible offline and in CI with no credentials and no spend.",
      "Every figure on the evaluation page is computed in the browser from the committed results file; none is typed into the markup.",
    ],
    next: "A live ERPNext run behind the same verification contract, and an extraction pass with a real model. Both are recorded on the page as not yet run rather than estimated.",
    metrics: [["48/48", "scenarios in the v3 suite"], ["0", "of 33 that should stop went through"], ["239", "offline tests, no credentials"]],
    stack: ["Python 3.11", "LangGraph", "LangChain Core", "Pydantic v2", "ChromaDB", "FastAPI", "httpx", "pypdf", "pytest", "Hypothesis", "GitHub Actions", "GSAP", "three.js"],
    images: ["pf-hero", "pf-flow", "pf-attacks", "pf-approval", "pf-numbers", "pf-policy"],
    captions: {
      "pf-hero": "The premise, stated plainly: a successful-looking write is not a completed write.",
      "pf-flow": "The eleven nodes read sideways, one card per node, in the only order the graph allows.",
      "pf-attacks": "Untrusted input: hidden instructions and bank-detail changes, each quarantined before a model read the file.",
      "pf-approval": "The approval is void — the order was edited while it waited, the digests differ, and nothing was submitted.",
      "pf-numbers": "Every figure with its denominator, read from the eval's own JSON when the page loads.",
      "pf-policy": "Sixteen rules in a Markdown document, each with the number of scenarios that cite it.",
    },
    links: { live: "https://procureflow-nu-ten.vercel.app", code: "https://github.com/Mr-Bathwal/ERP" },
  },
];

export const MORE = [
  { title: "Identity Verification dApp", note: "Wizard flow (face → Aadhaar → income), glassmorphism UI, installable PWA.", cats: ["web3", "frontend"], stack: ["React", "Solidity", "PWA"], url: "https://github.com/Mr-Bathwal/identity-dapp" },
  { title: "Super-Calculator", note: "Single-page calculator for complex maths and engineering problems.", cats: ["frontend"], stack: ["React", "JavaScript"], url: "https://github.com/Mr-Bathwal/Super-Calculator" },
  { title: "Currency Converter", note: "Live exchange rates with progressive-web-app features.", cats: ["frontend"], stack: ["JavaScript", "PWA"], url: "https://github.com/Mr-Bathwal/currency-converter" },
  { title: "WanderWise", note: "Five-page travel site in pure HTML and CSS with original SVG illustrations.", cats: ["frontend"], stack: ["HTML5", "CSS3", "SVG"], url: "https://github.com/Mr-Bathwal/wanderwise" },
  { title: "Therawin Prototype", note: "Interactive product prototype and visual design system.", cats: ["frontend"], stack: ["React", "Vite", "Design"], url: "https://github.com/Mr-Bathwal/Therawin_prototype_design" },
  { title: "Online Judge Engine", note: "A competitive-programming judge engine.", cats: ["fullstack"], stack: ["Node.js", "Full-stack"], url: "https://github.com/Mr-Bathwal/OJ" },
  { title: "Renal Tumor Stage Predictor", note: "Deep-learning pipeline on DICOM/NIfTI MRI volumes, validated with medical experts.", cats: ["ai"], stack: ["Python", "TensorFlow", "3D Slicer"], url: null },
];

export const FILTERS = [
  ["all", "Everything"],
  ["ai", "AI & agents"],
  ["frontend", "Frontend"],
  ["web3", "Web3"],
  ["fullstack", "Full-stack"],
];

// "Scroll to generate": the particle field becomes each shape in turn as the reader scrolls.
export const JOURNEY = [
  { shape: "helix", kicker: "Roots", title: "Biology taught me", em: "systems", text: "A B.Tech in Biotechnology & Bioinformatics at IIT Hyderabad: messy real-world data, and a tumour-staging model built on MRI volumes." },
  { shape: "code", kicker: "Engineering", title: "Then I learned to", em: "ship", text: "A selective co-op at AlgoUniversity, 500+ DSA problems in C++, and a product UI rebuilt from scratch at Fletch Technologies." },
  { shape: "network", kicker: "AI", title: "Agents that check", em: "their own work", text: "At EY I build LangGraph agents: three specialists, 33 tools, and a remediation chain that verifies its own fix." },
  { shape: "chain", kicker: "Web3", title: "Trust you can", em: "verify", text: "Nine smart contracts on Algorand TestNet, NFT tickets on Avalanche, and predictions anchored on Solana." },
  { shape: "gb", kicker: "Now", title: "One engineer,", em: "end to end", text: "From the data model to the last animation frame. That's the person you'd be hiring." },
];

export const SKILLS = [
  { group: "Languages", items: ["C++", "JavaScript", "TypeScript", "Python", "Solidity", "SQL"] },
  { group: "AI & agents", items: ["LangChain", "LangGraph", "Groq", "Multi-agent orchestration", "Tool use", "RAG", "TensorFlow", "scikit-learn", "n8n"] },
  { group: "Frontend", items: ["React", "Next.js", "Redux Toolkit", "React Query", "HTML5", "CSS3", "Tailwind CSS", "GSAP", "framer-motion", "Three.js / R3F", "Vite"] },
  { group: "Backend & APIs", items: ["Node.js", "Express", "FastAPI", "REST APIs", "MongoDB", "SQLite", "JWT auth", "WebSockets"] },
  { group: "Web3", items: ["Solidity", "Hardhat", "wagmi / viem", "Avalanche", "Algorand / PyTeal", "Solana", "IPFS", "NFTs"] },
  { group: "Tools & practice", items: ["Git & GitHub", "GitHub Actions", "Playwright", "Vercel", "Render", "Figma-to-code", "Code review", "DSA"] },
];
export const MARQUEE = [
  ["Software Engineering", "AI Agents", "Full-Stack", "Product UI", "Web3", "Motion", "Problem Solving"],
  ["React", "Next.js", "TypeScript", "LangGraph", "FastAPI", "Node.js", "Python", "C++"],
  ["Three.js", "GSAP", "Redux Toolkit", "Solidity", "Solana", "Algorand", "Playwright", "Tailwind"],
];

export const HACKATHONS = [
  { when: "Jul 2026", name: "TxODDS × Solana World Cup Hackathon", where: "Superteam Earn · online", what: "Built MatchPulse, a provably-fair World Cup companion with predictions anchored on Solana." },
  { when: "Oct 2025", name: "Avalanche National Hackathon", where: "Draper House, Hyderabad", what: "Selected to design, build and pitch TicketVerse to a panel of industry judges." },
  { when: "Sep 2025", name: "Rise In National Hackathon", where: "T-Hub, Bengaluru", what: "Architected a privacy-first decentralized identity system for multi-authority verifiable credentials." },
  { when: "Ongoing", name: "Competitive programming", where: "LeetCode · Codeforces", what: "500+ algorithmic problems solved in C++." },
];

export const EDUCATION = [
  { when: "2023 — 2027", school: "Indian Institute of Technology Hyderabad", what: "B.Tech, Biotechnology & Bioinformatics", score: "CGPA 8.00" },
  { when: "2022", school: "Mothers' International Academy", what: "Class XII, CBSE", score: "94.0%" },
  { when: "2020", school: "Carmel School", what: "Class X, ICSE", score: "98.4%" },
];

export const BEYOND = [
  { title: "Marketing Manager", org: "E-Cell, IIT Hyderabad", note: "Directed publicity for E-Summit and E-Merge, growing digital engagement." },
  { title: "Sports Secretary", org: "Dept. of Biotechnology, IITH", note: "Led logistics for the flagship Sports Day with 300+ participants." },
  { title: "Alumni Outreach Manager", org: "IIT Hyderabad", note: "Scaled alumni networks and ran Alumni Day 2025." },
  { title: "Event Manager & Club Coordinator", org: "Vedic Science Club, IITH", note: "Owned major campus events and cultural-tech programmes for 100+ students." },
  { title: "Athlete", org: "Cricket · Chess · Athletics", note: "District-level cricket and chess, college cricket team (NSO), three podium finishes." },
];

export const NAV = [
  ["work", "Work"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["journey", "Journey"],
  ["lab", "Lab"],
  ["about", "About"],
  ["contact", "Contact"],
];
