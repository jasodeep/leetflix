import type { MetadataRoute } from "next";

import { getAllProblems } from "@/lib/problems";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/problems`, changeFrequency: "weekly", priority: 0.8 },
    ...getAllProblems().map((p) => ({
      url: `${site.url}/problems/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
