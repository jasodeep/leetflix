import { catalog } from "@/content/catalog";
import { problems } from "@/content/problems";
import { SOLVED_SLUGS } from "@/content/solvers/pick";
import type { CatalogItem, Problem } from "@/lib/types";

/**
 * Read-side query layer over the static content.
 *
 * Importing this module pulls in authored problems only (not solver
 * implementations), so the catalogue page stays light. Use `getProblem`
 * from `@/lib/get-problem` when you need the full page payload.
 */

const problemBySlug = new Map(problems.map((p) => [p.slug, p]));

export type { CatalogItem };

export const catalogItems: readonly CatalogItem[] = catalog.map((entry) => ({
  ...entry,
  available: problemBySlug.has(entry.slug) || SOLVED_SLUGS.has(entry.slug),
}));

export const getAuthoredProblem = (slug: string) => problemBySlug.get(slug);

export const getAllProblems = (): readonly Problem[] => problems;

export const getCatalogItem = (slug: string): CatalogItem | undefined =>
  catalogItems.find((c) => c.slug === slug);
