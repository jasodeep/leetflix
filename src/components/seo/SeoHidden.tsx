import Link from "next/link";

import { catalogStats, FEATURED_SLUGS, HOME_FAQ, SEO_HUBS } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Crawlable copy and hub links. `sr-only` keeps the last visible UI unchanged.
 */
export function SeoHidden({ includeFaq = false }: { includeFaq?: boolean }) {
  const stats = catalogStats();
  return (
    <div className="sr-only">
      <h1>{site.titleDefault}</h1>
      <p>
        {site.description} The catalogue has {stats.total} LeetCode problems ({stats.easy} Easy,{" "}
        {stats.medium} Medium, {stats.hard} Hard) with {stats.animated} free animated walkthroughs
        in Python and Go. {stats.locked} locked Premium problems stay on LeetCode.
      </p>
      <SeoHubLinks />
      <ul>
        {FEATURED_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/problems/${slug}`}>{slug}</Link>
          </li>
        ))}
      </ul>
      {includeFaq && (
        <dl>
          {HOME_FAQ.map((item) => (
            <div key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/** Hub URLs for crawlers. No heading — safe to drop in the footer on every page. */
export function SeoHubLinks() {
  return (
    <nav className="sr-only" aria-label="Topic indexes">
      <ul>
        <li>
          <Link href="/explore">Explore LeetCode by difficulty, type, and method</Link>
        </li>
        {SEO_HUBS.map((hub) => (
          <li key={hub.slug}>
            <Link href={`/explore/${hub.slug}`}>{hub.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
