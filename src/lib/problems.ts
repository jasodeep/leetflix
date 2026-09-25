import { catalog } from "@/content/catalog";
import { materialize } from "@/content/families";
import { problems } from "@/content/problems";
import type { CatalogItem, Problem } from "@/lib/types";

/**
 * Read-side query layer over the static content.
 *
 * Importing this module pulls in every authored problem, so it belongs in
 * server components and tests only. Client components should receive
 * `CatalogItem[]` as props and import constants from `@/lib/types`.
 */

const problemBySlug = new Map(problems.map((p) => [p.slug, p]));
const catalogBySlug = new Map(catalog.map((c) => [c.slug, c]));

export type { CatalogItem };

export const catalogItems: readonly CatalogItem[] = catalog.map((entry) => ({
  ...entry,
  available: true,
}));

export const getProblem = (slug: string): Problem | undefined => {
  const authored = problemBySlug.get(slug);
  if (authored) return authored;
  const entry = catalogBySlug.get(slug);
  return entry ? materialize(entry) : undefined;
};

export const getAllProblems = (): readonly Problem[] => problems;

export const getCatalogItem = (slug: string): CatalogItem | undefined =>
  catalogItems.find((c) => c.slug === slug);
