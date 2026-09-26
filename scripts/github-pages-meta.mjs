#!/usr/bin/env node
/**
 * Public origin + Next.js `basePath` for a GitHub Pages deploy.
 *
 * Resolution order:
 *   1. Explicit overrides (`SITE_URL` / `BASE_PATH` repo variables) — custom domains.
 *   2. User/org site: repo is `<owner>.github.io` → https://<owner>.github.io
 *   3. Project site: https://<owner>.github.io/<repo> with basePath `/<repo>`
 *
 * The Pages workflow prints these as `name=value` lines for $GITHUB_OUTPUT.
 * Tests import `resolvePagesMeta` so the rules cannot silently drift.
 */
import { pathToFileURL } from "node:url";

const trimSlash = (s) => s.replace(/\/+$/, "");

/**
 * @typedef {{ owner: string, repo: string, siteUrl?: string, basePath?: string }} PagesInput
 * @typedef {{ url: string, basePath: string, kind: "custom" | "user" | "project" }} PagesMeta
 */

/** @param {PagesInput} input @returns {PagesMeta} */
export function resolvePagesMeta({ owner, repo, siteUrl = "", basePath = "" }) {
  if (!owner || !repo) {
    throw new Error("owner and repo are required to resolve GitHub Pages URLs");
  }

  const overrideUrl = trimSlash(siteUrl.trim());
  if (overrideUrl) {
    if (!/^https?:\/\//i.test(overrideUrl)) {
      throw new Error(`SITE_URL must be an absolute http(s) URL, got "${siteUrl}"`);
    }
    return {
      url: overrideUrl,
      basePath: trimSlash(basePath.trim()),
      kind: "custom",
    };
  }

  if (repo === `${owner}.github.io`) {
    return { url: `https://${owner}.github.io`, basePath: "", kind: "user" };
  }

  return {
    url: `https://${owner}.github.io/${repo}`,
    basePath: `/${repo}`,
    kind: "project",
  };
}

const run = () => {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "/").split("/");
  const meta = resolvePagesMeta({
    owner,
    repo,
    siteUrl: process.env.SITE_URL ?? "",
    basePath: process.env.BASE_PATH ?? "",
  });
  process.stdout.write(`url=${meta.url}\nbase_path=${meta.basePath}\nkind=${meta.kind}\n`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
