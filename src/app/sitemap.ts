import type { MetadataRoute } from "next";

import { catalogItems } from "@/lib/catalog";
import { SEO_HUBS, SITE_UPDATED } from "@/lib/seo";
import { absUrl } from "@/lib/site";

export const dynamic = "force-static";

const lastModified = new Date(`${SITE_UPDATED}T00:00:00.000Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absUrl("/explore"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...SEO_HUBS.map((hub) => ({
      url: absUrl(`/explore/${hub.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: hub.kind === "difficulty" ? 0.75 : 0.65,
    })),
    ...catalogItems
      .filter((p) => p.available)
      .map((p) => ({
        url: absUrl(`/problems/${p.slug}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  ];
}
