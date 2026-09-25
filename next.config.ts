import type { NextConfig } from "next";

/**
 * Leetflix is a pure front-end: every route is prerendered at build time and
 * the `out/` directory can be served from any static host (GitHub Pages,
 * Cloudflare Pages, S3, nginx, ...).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
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
