import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#e50914",
    lang: site.localeBcp47,
    categories: ["education", "developer"],
    icons: [
      { src: "mark.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
      { src: "logo.png", type: "image/png", sizes: "512x512", purpose: "any" },
    ],
  };
}
