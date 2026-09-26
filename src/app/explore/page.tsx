import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { catalogStats, itemsForHub, jsonLdBreadcrumb, jsonLdItemList, SEO_HUBS } from "@/lib/seo";
import { absUrl, site } from "@/lib/site";

const title = "Explore LeetCode by difficulty, type, and method";
const description =
  "Browse every LeetCode problem by difficulty, type, or method for coding interview prep, then open animated Python and Go walkthroughs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absUrl("/explore") },
  openGraph: { title: `${title} · ${site.name}`, description, url: absUrl("/explore") },
};

export default function ExploreIndexPage() {
  const stats = catalogStats();
  const groups = [
    { heading: "Difficulty", hubs: SEO_HUBS.filter((h) => h.kind === "difficulty") },
    { heading: "Type", hubs: SEO_HUBS.filter((h) => h.kind === "type") },
    { heading: "Method", hubs: SEO_HUBS.filter((h) => h.kind === "method") },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: "Problems", path: "/" },
          { name: "Explore", path: "/explore" },
        ])}
      />
      <JsonLd
        data={jsonLdItemList(
          "Leetflix topic hubs",
          absUrl("/explore"),
          SEO_HUBS.map((h) => ({ name: h.title, path: `/explore/${h.slug}` })),
        )}
      />

      <header className="max-w-2xl">
        <p className="text-brand font-mono text-[11px] tracking-[0.22em] uppercase">Explore</p>
        <h1 className="text-fg mt-3 text-3xl font-semibold tracking-tight text-balance">
          Study LeetCode the way interviews ask it.
        </h1>
        <p className="text-fg-muted mt-4 leading-7">
          {stats.total.toLocaleString()} problems for coding-interview and DSA practice. Pick a
          difficulty, a data structure, or a method — each hub is a crawlable list, and deep-dives
          open as animated walkthroughs.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.heading} className="mt-12" aria-labelledby={`hub-${group.heading}`}>
          <h2 id={`hub-${group.heading}`} className="text-fg text-lg font-semibold tracking-tight">
            {group.heading}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.hubs.map((hub) => {
              const items = itemsForHub(hub);
              return (
                <li key={hub.slug}>
                  <Link
                    href={`/explore/${hub.slug}`}
                    className="border-border bg-surface/70 hover:border-brand/40 block rounded-xl border px-4 py-3 transition-colors"
                  >
                    <p className="text-fg font-medium">{hub.label}</p>
                    <p className="text-fg-subtle mt-1 font-mono text-xs">
                      {items.length.toLocaleString()} problems
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
