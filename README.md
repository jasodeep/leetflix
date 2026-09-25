# Leetflix

> Watch. Code. Repeat.

A Netflix-parody take on LeetCode. The front page is a LeetCode-style problem table (search, difficulty, topic, sort, paging — all in the URL, all keyboard-driven). Every deep-dive has a detailed, visual breakdown of the problem, multiple approaches with **Python and Go** solutions side by side, and an **interactive step-by-step animation** you can scrub through like a video — with the executing source line highlighted in sync.

Pure front-end. `next build` emits a fully static site in `out/` that runs on any static host.

## Stack

- **Next.js 16** (App Router, `output: "export"`), **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4** with a small token set (`src/app/globals.css`)
- **shiki** for build-time syntax highlighting (tokens are serialised, so the client never ships a highlighter)
- **motion** for layout/spring animations in the visualisation panels
- **Vitest** for content-integrity and library tests

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # lint + typecheck + tests + prettier
npm run build        # static export → out/
```

Requires Node ≥ 20.19 (see `.nvmrc`).

## How it's put together

```
src/
  app/                    routes (all prerendered): / (problem table), /problems/[slug], sitemap, robots
  components/
    brand/                LEETFLIX wordmark (SVG textPath on an arc, no image asset)
    code/                 TokenCode (shiki tokens + sliding line cursor), SolutionCode, CodeBlock
    content/              RichText + InlineMarkdown for the structured content model
    layout/               Header (nav underline, scroll progress), Footer
    player/               AlgorithmPlayer → InputEditor + PlayerStage (viz, narration, transport)
    problems/             ProblemTable (+Row), DifficultyRing, TableOfContents, ApproachSection, cards
    ui/                   Badge primitives, Reveal (fade-up on scroll)
    viz/                  one component per Panel kind + the Viz layout dispatcher
  content/
    catalog.ts            every catalogued problem (id, title, difficulty, topics)
    problems/<slug>.ts    full deep-dives: statement, examples, insights, approaches, inputs
    traces/<slug>.ts      step recorders for each animated approach (lazy-loaded)
  lib/
    types.ts              Problem / Approach / Block content model
    viz/                  Panel & Step types, Recorder, panel builders
    markers.ts            substring → line-number anchors that sync animation and code
    inputs.ts             parsing + limits for user-editable inputs
    code/highlight.ts     server-only shiki singleton
    catalog-query.ts      pure URL ⇄ filter/sort/page logic behind the problem table
    problems.ts           read-side queries (catalogue, lookups)
tests/                    vitest
```

### The problem table

`/` is the whole catalogue, LeetCode-style: status (▶ animated / lock / coming soon), number, title, difficulty, topics, and which solutions exist. Search (`/`), difficulty, topic rail, "animated only", sortable columns and 50-per-page paging are all encoded in the query string via `replaceState`, so any view is a shareable URL on a static host. `j`/`k` move a row cursor, `Enter` opens, `Esc` clears. The logic lives in `lib/catalog-query.ts` and is unit-tested independently of React.

### The animation model

An approach is animated by a **trace**: a plain function that runs the algorithm and records a `Step` after each meaningful operation. A step is `{ marker, note, panels }`:

- `panels` is a snapshot of visual state (arrays with pointers/tones, hash maps, stacks, variables, linked lists, bar charts, grids). Panels are data, so they're deep-cloned, diffable, unit-testable, and animated with layout transitions.
- `marker` names a line in the solution. Markers are declared per language as a **unique substring** of the source (`markers: { loop: "for i, x in enumerate(nums)" }`) and resolved to line numbers at build time. Reformatting code can't silently desynchronise the animation — a missing or ambiguous marker fails the build and the tests.
- `note` is the narration for that step (supports `code`, **bold**, _italic_).

The player parses user input against the problem's declared `inputs` schema (with size limits so the UI stays legible), runs the trace, and lets you play/scrub. The active step's marker drives the highlighted line in whichever language is selected.

### Adding a problem

1. Add a row to `src/content/catalog.ts` if it isn't there.
2. Create `src/content/problems/<slug>.ts` exporting a `Problem`. Write both `python` and `go` for every approach; use the `py`/`go` tagged templates for clean indentation.
3. For each `traceable: true` approach, add a trace in `src/content/traces/<slug>.ts` and register the loader in `src/content/traces/index.ts`.
4. Register the problem in `src/content/problems/index.ts`.
5. `npm test` — the content suite checks markers resolve in both languages, every step's marker exists, default and example inputs parse, and that the optimal trace reproduces every documented example output.

Routes, the table's ▶ status, the difficulty ring and the sitemap derive from the registry; nothing else needs touching.

## Deploying

`npm run build` writes `out/`. Set `NEXT_PUBLIC_SITE_URL` at build time so canonical URLs, Open Graph and the sitemap point at the right origin:

```bash
NEXT_PUBLIC_SITE_URL=https://leetflix.example.com npm run build
```

Serve `out/` from GitHub Pages, Cloudflare Pages, Netlify, S3 + CloudFront, nginx — anything that serves files.

## Status

150 problems catalogued (NeetCode 150 ⊇ Blind 75). 11 have complete deep-dives with animations; the rest link to LeetCode until their episode airs.

Parody project. Not affiliated with Netflix or LeetCode. Problem statements are © their respective owners.
