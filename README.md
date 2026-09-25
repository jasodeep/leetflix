<div align="center">

<img src="docs/brand/logo.png" alt="LEETFLIX" width="520" />

`WATCH.CODE.REPEAT_`

**algorithms, streamed.** a Netflix-parody LeetCode catalogue — Python + Go,
step-debug animations, zero backend.

<br/>

[![▶ watch now](https://img.shields.io/badge/▶_WATCH_NOW-jasodeep.github.io%2Fleetflix-e50914?style=for-the-badge&labelColor=0a0a0b)](https://jasodeep.github.io/leetflix/)
[![source](https://img.shields.io/badge/git-jasodeep%2Fleetflix-111113?style=for-the-badge&labelColor=0a0a0b&logo=github)](https://github.com/jasodeep/leetflix)

<br/>

[![ci](https://img.shields.io/github/actions/workflow/status/jasodeep/leetflix/ci.yml?style=flat-square&label=ci&labelColor=111113)](https://github.com/jasodeep/leetflix/actions/workflows/ci.yml)
[![pages](https://img.shields.io/github/actions/workflow/status/jasodeep/leetflix/pages.yml?style=flat-square&label=pages&labelColor=111113)](https://github.com/jasodeep/leetflix/actions/workflows/pages.yml)
[![next](https://img.shields.io/badge/next-16_static_export-black?style=flat-square&labelColor=111113)](https://nextjs.org/)
[![ts](https://img.shields.io/badge/typescript-strict-3178C6?style=flat-square&labelColor=111113)](https://www.typescriptlang.org/)
[![node](https://img.shields.io/badge/node-%3E%3D20.19-22c55e?style=flat-square&labelColor=111113)](#local-setup)

```
┌─────────┬──────────┬──────────┬──────────┐
│ CATALOG │ 150 eps  │ 11 live  │ py + go  │
└─────────┴──────────┴──────────┴──────────┘
```

</div>

---

## `>_ now_playing`

the player is the point. a trace records every meaningful op — arrays, maps,
stacks, lists, grids, water columns — then you **scrub it like a film**. the
red line is the instruction pointer.

<p align="center">
  <a href="https://jasodeep.github.io/leetflix/problems/two-sum/">
    <img src="docs/media/two-sum.gif" alt="Two Sum — hash map walkthrough" width="860" />
  </a>
  <br/>
  <sup><code>001 · TWO SUM</code> &nbsp; one-pass hash map &nbsp;·&nbsp; <code>O(n)</code> &nbsp;·&nbsp; python ⇄ go</sup>
</p>

<p align="center">
  <a href="https://jasodeep.github.io/leetflix/problems/trapping-rain-water/">
    <img src="docs/media/rain.gif" alt="Trapping Rain Water — two pointers" width="420" />
  </a>
  &nbsp;
  <a href="https://jasodeep.github.io/leetflix/problems/valid-parentheses/">
    <img src="docs/media/stack.gif" alt="Valid Parentheses — stack" width="420" />
  </a>
  <br/>
  <sup><code>042 · RAIN</code> two pointers &nbsp;&nbsp;|&nbsp;&nbsp; <code>020 · PARENS</code> stack machine</sup>
</p>

<p align="center">
  <a href="https://jasodeep.github.io/leetflix/problems/number-of-islands/">
    <img src="docs/media/islands.gif" alt="Number of Islands — DFS" width="420" />
  </a>
  &nbsp;
  <a href="https://jasodeep.github.io/leetflix/problems/reverse-linked-list/">
    <img src="docs/media/list.gif" alt="Reverse Linked List — three pointers" width="420" />
  </a>
  <br/>
  <sup><code>200 · ISLANDS</code> sink-by-DFS &nbsp;&nbsp;|&nbsp;&nbsp; <code>206 · LIST</code> prev / curr / next</sup>
</p>

edit the input. hit **run**. `space` plays, `←` `→` steps, `home` / `end` skip.

---

## `>_ ls /`

home is a LeetCode-style table, not a streaming shelf. **▶** means the episode
has a full deep-dive. everything else deep-links to LeetCode until it airs.

<p align="center">
  <a href="https://jasodeep.github.io/leetflix/">
    <img src="docs/media/table.gif" alt="Problem table — search, filters, keyboard cursor" width="860" />
  </a>
</p>

```
GET /?q=water&difficulty=Hard&available=1

#  /     search          j k     move cursor
#  ↵     open episode    esc     blur / clear
#  filters live in the query string — share the URL
```

| tape             | payload                                                                       |
| :--------------- | :---------------------------------------------------------------------------- |
| **the brief**    | statement, constraints, worked examples — same viz the player uses            |
| **the cut**      | brute vs optimal, complexity, intuition, **python** and **go** side by side   |
| **the playback** | pointer-accurate animation; language toggle persists across the whole episode |

---

## `>_ boot --local`

no docker. no `.env`. no api key. node **≥ 20.19** (`.nvmrc` → **24**).

```bash
git clone https://github.com/jasodeep/leetflix.git
cd leetflix
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run check        # lint + tsc + vitest + prettier     (what CI runs)
npm run build        # prerender every route → out/
npm start            # serve the export, pages-style
```

| bin             | tty                             |
| :-------------- | :------------------------------ |
| `npm run dev`   | next 16, hot reload             |
| `npm run check` | the merge gate                  |
| `npm run build` | static site, no node at runtime |
| `npm start`     | `npx serve out`                 |
| `npm test`      | markers, traces, table query    |

mimic production (project pages prefix):

```bash
NEXT_PUBLIC_SITE_URL=https://jasodeep.github.io/leetflix \
NEXT_PUBLIC_BASE_PATH=/leetflix \
npm run build && npm start
```

---

## `>_ uname -a`

```
next@16   react@19   typescript@strict   tailwind@4
shiki     @ build-time only    (client never ships a highlighter)
motion    springs on every panel
vitest    content integrity — a bad marker fails the build
output    export → orphan branch `release` → github pages
```

```
browse ──► /problems/<slug> ──► player
  table        statement            viz snapshot
  150 rows     py / go              instruction pointer
               insights             space / ← → / scrub
```

<details>
<summary><code>man leetflix</code> — traces, markers, how to air a new episode</summary>

<br/>

```
src/
  app/                  /  and  /problems/[slug]     all prerendered
  components/player/    AlgorithmPlayer → viz + transport + cursor
  components/viz/       array · bars · map · stack · list · grid · vars
  content/catalog.ts    150 rows
  content/problems/     authored episodes
  content/traces/       lazy step recorders
  lib/catalog-query.ts  URL ⇄ filter / sort / page    (no react)
  lib/markers.ts        unique substring → line number
```

a **trace** is a function that runs the algorithm and records
`{ marker, note, panels }` after each op.

- `panels` are data — cloned, testable, animated with layout springs
- `marker` is a unique substring of the source, resolved at build time
- missing or ambiguous marker → build red, tests red

**air an episode**

1. row in `src/content/catalog.ts` if it is not already there
2. `src/content/problems/<slug>.ts` — both languages, `py` / `go` templates
3. trace in `src/content/traces/<slug>.ts` for every `traceable: true` approach
4. register in `problems/index.ts` + `traces/index.ts`
5. `npm test`

routes, ▶ status, the difficulty ring and the sitemap fall out of the registry.

</details>

<details>
<summary><code>make release</code> — pages from the orphan <code>release</code> branch</summary>

<br/>

push `main` → [pages.yml](.github/workflows/pages.yml) → quality gates →
`out/` orphan-committed to `release`.

1. Actions → Workflow permissions → **Read and write**
2. Pages → Deploy from a branch → **`release` / (root)**

live: **https://jasodeep.github.io/leetflix/**

optional vars for a custom domain: `SITE_URL`, `BASE_PATH`, `PAGES_CNAME`.

</details>

---

<div align="center">

<img src="docs/brand/mark.svg" alt="" width="36" />

<br/>

`parody // !netflix && !leetcode`

problem statements © their respective owners

<br/>

[**▶ jasodeep.github.io/leetflix**](https://jasodeep.github.io/leetflix/)

</div>
