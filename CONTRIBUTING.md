# Contributing

Thanks for wanting to improve Leetflix. The site is a static Next.js export: there is no API, database, or account system. Most work is either catalogue content or the player that animates it.

## Setup

You need **Node 20.19+** (CI uses the version in `.nvmrc`) and npm 10+.

```bash
git clone https://github.com/jasodeep/leetflix.git
cd leetflix
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` only if you need a non-default public URL. There are no secrets.

## What to run before a PR

```bash
npm run check
```

That is lint, typecheck, unit tests, and Prettier — the same gate as [CI](.github/workflows/ci.yml).

| Command             | What it does            |
| :------------------ | :---------------------- |
| `npm run dev`       | Local site              |
| `npm test`          | Vitest                  |
| `npm run lint`      | ESLint                  |
| `npm run typecheck` | `tsc --noEmit`          |
| `npm run format`    | Prettier write          |
| `npm run build`     | Static export in `out/` |
| `make check`        | Same as `npm run check` |

Optional, on the files you touched:

```bash
npm run precommit
```

## Add a problem

1. Confirm the row exists in `src/content/leetcode.json` (it usually already does).
2. Add `src/content/problems/<slug>.ts` with Python and Go. Use the `py` / `go` helpers in `_helpers.ts`.
3. Add a trace in `src/content/traces/<slug>.ts` for each animated approach.
4. Register both files in their `index.ts`.
5. Run `npm test`.

A **trace** records `{ marker, note, panels }` after each step. Markers are unique substrings in the source — a miss or a duplicate fails the build.

Do not reprint official LeetCode statements, examples, or constraints.

## How the catalogue resolves a slug

`getProblem(slug)` in `src/lib/catalog.ts`:

1. Hand-authored deep-dive (`src/content/problems`)
2. Exact solver (`src/content/solvers`)
3. Family template from the problem's tags (`src/content/families`) — free problems only

Premium rows stay listed and link to LeetCode.

## Pull requests

- One concern per PR. Do not mix a solver with a CSS rewrite.
- Keep the catalogue chrome as it is: Problems-only nav, table home, three-act problem page.
- Do not add credentials, `.env`, or generated `out/` / `.next/`.
- Do not force-push `main`.
- Fill in the PR template. Link an issue when there is one.

## Reporting a security issue

Use [SECURITY.md](SECURITY.md). Do not open a public issue for a vulnerability.
