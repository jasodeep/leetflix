import type { MetadataRoute } from "next";

import { getAllProblems } from "@/lib/problems";
import { absUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...getAllProblems().map((p) => ({
      url: absUrl(`/problems/${p.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
