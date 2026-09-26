<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## This repo

Static Next.js export (`output: "export"`, `trailingSlash: true`). Catalogue chrome stays as it is: Problems-only nav, table home, three-act problem page. Do not reprint official LeetCode statements.

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [CONTRIBUTING.md](CONTRIBUTING.md) before changing structure. `getProblem` lives in `src/lib/catalog.ts`. Public env is `src/lib/env.ts`. Run `npm run check` before you finish.

