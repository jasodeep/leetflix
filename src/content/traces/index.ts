import { catalog } from "@/content/catalog";
import { familyOf, familyTraces } from "@/content/families";
import type { TraceModule } from "@/lib/viz/types";

type Loader = () => Promise<{ default: TraceModule }>;

/**
 * Trace modules are loaded on demand so the browse pages never pay for
 * animation code. Keys are problem slugs.
 */
export const traceLoaders: Record<string, Loader> = {
  "two-sum": () => import("./two-sum"),
  "valid-parentheses": () => import("./valid-parentheses"),
  "best-time-to-buy-and-sell-stock": () => import("./best-time-to-buy-and-sell-stock"),
  "maximum-subarray": () => import("./maximum-subarray"),
  "binary-search": () => import("./binary-search"),
  "reverse-linked-list": () => import("./reverse-linked-list"),
  "climbing-stairs": () => import("./climbing-stairs"),
  "container-with-most-water": () => import("./container-with-most-water"),
  "number-of-islands": () => import("./number-of-islands"),
  "longest-substring-without-repeating-characters": () =>
    import("./longest-substring-without-repeating-characters"),
  "trapping-rain-water": () => import("./trapping-rain-water"),
};

export async function loadTraces(slug: string): Promise<TraceModule> {
  const loader = traceLoaders[slug];
  if (loader) return (await loader()).default;
  const row = catalog.find((c) => c.slug === slug);
  if (!row) throw new Error(`No trace module registered for "${slug}"`);
  return familyTraces(familyOf(row.topics));
}
