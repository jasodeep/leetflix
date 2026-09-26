import type { MetadataRoute } from "next";

import { absUrl, site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Faceted `?q=` / `?page=` / `?type=` URLs are the same catalogue.
        // Canonical on `/` plus these disallows keep the index clean.
        disallow: ["/*?*"],
      },
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: site.url,
  };
}
