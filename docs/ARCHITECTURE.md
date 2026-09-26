# Architecture

Leetflix is a **static** Next.js App Router site. `next build` writes `out/`. GitHub Actions publishes that folder to the `release` branch for GitHub Pages. There is no server runtime, no database, and no authenticated API.

```
src/app          routes, metadata, sitemap, robots
src/components   UI — layout, catalogue table, player, viz
src/content      catalogue dump, authored problems, solvers, traces
src/lib          read APIs, query, highlight, typed errors
scripts          catalogue sync and Pages URL resolution
```

## Request path

Every URL is an HTML file. `trailingSlash: true` emits `problems/two-sum/index.html` so a plain file server can serve `/problems/two-sum/`. `NEXT_PUBLIC_BASE_PATH` is set on project Pages (`/leetflix`); it is empty on a custom domain.

## Catalogue

`scripts/sync-leetcode.mjs` writes `src/content/leetcode.json` (id, slug, title, difficulty, topics, premium). Official statements stay on LeetCode.

`parseCatalog` validates that dump at import time. A corrupt file fails the build.

`getProblem(slug)` in `src/lib/catalog.ts` resolves content in this order:

1. Hand-authored deep-dive
2. Exact solver for that slug
3. Family template from tags (free problems only)

The home table uses `catalogItems` — metadata plus `available: !premium`. Filters live in the URL (`src/lib/catalog-query.ts`) so a view is shareable and unit-testable.

## Animation

A **trace** is a list of `{ marker, note, panels }`. Markers are unique substrings in the Python/Go source, resolved to line numbers by `resolveMarkers`. The player steps those frames. Input parsing is capped so a walkthrough cannot explode the step count.

## CI

`ci.yml` is the quality gate (lint, types, tests, format, build). `pages.yml` runs the same gate, then publishes `out/` to `release` as an orphan commit. Enable Pages on `release` / (root).
