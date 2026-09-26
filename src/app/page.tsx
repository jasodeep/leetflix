import type { Metadata } from "next";
import { Suspense } from "react";

import { ProblemTable } from "@/components/problems/ProblemTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { SeoHidden } from "@/components/seo/SeoHidden";
import { catalogItems, getCatalogItem } from "@/lib/catalog";
import { FEATURED_SLUGS, jsonLdFaq, jsonLdItemList } from "@/lib/seo";
import { absUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.titleDefault },
  description: site.description,
  alternates: { canonical: absUrl("/") },
  openGraph: {
    title: site.titleDefault,
    description: site.description,
    url: absUrl("/"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.titleDefault,
    description: site.description,
  },
};

export default function HomePage() {
  const featured = FEATURED_SLUGS.map(getCatalogItem).filter(
    (item): item is NonNullable<typeof item> => Boolean(item?.available),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={jsonLdFaq()} />
      <JsonLd
        data={jsonLdItemList(
          "Featured animated LeetCode solutions",
          absUrl("/"),
          featured.map((p) => ({ name: `${p.id}. ${p.title}`, path: `/problems/${p.slug}` })),
        )}
      />
      <SeoHidden includeFaq />
      <Suspense>
        <ProblemTable items={[...catalogItems]} />
      </Suspense>
    </div>
  );
}
