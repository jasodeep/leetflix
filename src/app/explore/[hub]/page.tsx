import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/JsonLd";
import {
  FEATURED_SLUGS,
  hubOf,
  itemsForHub,
  jsonLdBreadcrumb,
  jsonLdItemList,
  SEO_HUBS,
  type SeoHub,
} from "@/lib/seo";
import { absUrl, leetcodeUrl, site } from "@/lib/site";
import type { CatalogItem } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return SEO_HUBS.map((hub) => ({ hub: hub.slug }));
}

function resolve(slug: string): SeoHub {
  const hub = hubOf(slug);
  if (!hub) notFound();
  return hub;
}

export async function generateMetadata({ params }: PageProps<"/explore/[hub]">): Promise<Metadata> {
  const { hub: slug } = await params;
  const hub = hubOf(slug);
  if (!hub) return {};
  return {
    title: hub.title,
    description: hub.description,
    keywords: [hub.label, "leetcode", "animated solutions", "python", "golang", ...site.keywords],
    alternates: { canonical: absUrl(`/explore/${hub.slug}`) },
    openGraph: {
      title: `${hub.title} · ${site.name}`,
      description: hub.description,
      url: absUrl(`/explore/${hub.slug}`),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${hub.title} · ${site.name}`,
      description: hub.description,
    },
  };
}

export default async function ExploreHubPage({ params }: PageProps<"/explore/[hub]">) {
  const { hub: slug } = await params;
  const hub = resolve(slug);
  const items = itemsForHub(hub);
  const featured = items.filter((i) => (FEATURED_SLUGS as readonly string[]).includes(i.slug));
  const playable = items.filter((i) => i.available);
  const listForJson = playable.slice(0, 50).map((p) => ({
    name: `${p.id}. ${p.title}`,
    path: `/problems/${p.slug}`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: "Problems", path: "/" },
          { name: "Explore", path: "/explore" },
          { name: hub.label, path: `/explore/${hub.slug}` },
        ])}
      />
      <JsonLd data={jsonLdItemList(hub.title, absUrl(`/explore/${hub.slug}`), listForJson)} />

      <nav className="text-fg-subtle mb-6 font-mono text-xs" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-fg">
              Problems
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/explore" className="hover:text-fg">
              Explore
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-fg-muted" aria-current="page">
            {hub.label}
          </li>
        </ol>
      </nav>

      <header className="max-w-2xl">
        <p className="text-brand font-mono text-[11px] tracking-[0.22em] uppercase">{hub.kind}</p>
        <h1 className="text-fg mt-3 text-3xl font-semibold tracking-tight text-balance">
          {hub.title}
        </h1>
        <p className="text-fg-muted mt-4 leading-7">{hub.description}</p>
        <p className="text-fg-subtle mt-3 font-mono text-xs">
          {items.length.toLocaleString()} problems · {playable.length.toLocaleString()} animated ·{" "}
          {items.length - playable.length} locked
        </p>
      </header>

      {featured.length > 0 && (
        <section className="mt-10" aria-labelledby="hub-animated">
          <h2 id="hub-animated" className="text-fg text-lg font-semibold tracking-tight">
            Start with a walkthrough
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/problems/${item.slug}`}
                  className="border-border bg-surface/70 hover:border-brand/40 block rounded-xl border px-4 py-3 transition-colors"
                >
                  <p className="text-fg-subtle font-mono text-[11px]">
                    {item.id} · {item.difficulty}
                  </p>
                  <p className="text-fg mt-1 font-medium">{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12" aria-labelledby="hub-index">
        <h2 id="hub-index" className="text-fg text-lg font-semibold tracking-tight">
          Full {hub.label} index
        </h2>
        <ol className="border-border divide-border mt-4 divide-y overflow-hidden rounded-xl border text-sm">
          {items.map((item) => (
            <HubRow key={item.slug} item={item} />
          ))}
        </ol>
      </section>
    </div>
  );
}

function HubRow({ item }: { item: CatalogItem }) {
  if (!item.available) {
    return (
      <li className="flex items-baseline gap-3 px-3 py-2">
        <span className="text-fg-subtle w-10 shrink-0 font-mono text-[11px] tabular-nums">
          {item.id}
        </span>
        <a
          href={leetcodeUrl(item.slug)}
          target="_blank"
          rel="noreferrer"
          className="text-fg-muted hover:text-fg min-w-0 flex-1 truncate"
        >
          {item.title}
        </a>
        <span className="text-fg-subtle hidden shrink-0 text-[11px] sm:inline">
          {item.difficulty}
        </span>
        <span className="text-fg-subtle shrink-0 text-[11px]">Locked</span>
      </li>
    );
  }
  return (
    <li className="flex items-baseline gap-3 px-3 py-2">
      <span className="text-fg-subtle w-10 shrink-0 font-mono text-[11px] tabular-nums">
        {item.id}
      </span>
      <Link
        href={`/problems/${item.slug}`}
        className="text-fg hover:text-brand min-w-0 flex-1 truncate font-medium"
      >
        {item.title}
      </Link>
      <span className="text-fg-subtle hidden shrink-0 text-[11px] sm:inline">
        {item.difficulty}
      </span>
      <Link href={`/problems/${item.slug}`} className="text-brand shrink-0 text-[11px] font-medium">
        Watch
      </Link>
    </li>
  );
}
