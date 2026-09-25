import type { MetadataRoute } from "next";

import { catalogItems } from "@/lib/problems";
import { absUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...catalogItems
      .filter((p) => p.available)
      .map((p) => ({
        url: absUrl(`/problems/${p.slug}`),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  ];
}
