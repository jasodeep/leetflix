import { catalog } from "@/content/catalog";
import { problems } from "@/content/problems";
import { topicStats } from "@/lib/catalog-query";
import type { CatalogItem, Problem, Topic } from "@/lib/types";

/**
 * Read-side query layer over the static content.
 *
 * Importing this module pulls in every authored problem, so it belongs in
 * server components and tests only. Client components should receive
 * `CatalogItem[]` as props and import constants from `@/lib/types`.
 */

const problemBySlug = new Map(problems.map((p) => [p.slug, p]));

export type { CatalogItem };

export const catalogItems: readonly CatalogItem[] = catalog.map((entry) => ({
  ...entry,
  available: problemBySlug.has(entry.slug),
}));

export const getProblem = (slug: string): Problem | undefined => problemBySlug.get(slug);

export const getAllProblems = (): readonly Problem[] => problems;

export const getCatalogItem = (slug: string): CatalogItem | undefined =>
  catalogItems.find((c) => c.slug === slug);

/** All topics that appear in the catalogue, most frequent first. */
export const allTopics = (): Topic[] => topicStats(catalogItems).map((s) => s.topic);
