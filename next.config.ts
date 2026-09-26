import type { NextConfig } from "next";

import { publicEnv } from "./src/lib/env";

/**
 * Leetflix is a pure front-end: every route is prerendered at build time and
 * the `out/` directory can be served from any static host (GitHub Pages,
 * Cloudflare Pages, S3, nginx, ...).
 *
 * `trailingSlash: true` emits `problems/foo/index.html` so GitHub Pages (a
 * plain file server) can serve `/problems/foo/` without a rewrite layer.
 *
 * `basePath` is empty locally and on a custom domain; the Pages workflow sets
 * `NEXT_PUBLIC_BASE_PATH=/<repo>` for project sites (user.github.io/repo).
 */
const basePath = publicEnv.basePath;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // No image optimisation server exists in a static export.
    unoptimized: true,
  },
  typescript: {
    // Type errors must fail the build; never silently ship them.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
