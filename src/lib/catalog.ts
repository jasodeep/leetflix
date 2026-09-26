import { catalog } from "@/content/catalog";
import { materialize as materializeFamily } from "@/content/families";
import { problems } from "@/content/problems";
import { materialize, solverOf } from "@/content/solvers";
import type { CatalogItem, Problem } from "@/lib/types";

/**
 * Read API over the static catalogue.
 *
 * Importing this module pulls authored problems, solvers, and family
 * templates — use it from problem pages and tests. The home table only
 * needs `catalogItems`, which is cheap once the JSON is in memory.
 */

const problemBySlug = new Map(problems.map((problem) => [problem.slug, problem]));
const entryBySlug = new Map(catalog.map((entry) => [entry.slug, entry]));

export type { CatalogItem };

export const catalogItems: readonly CatalogItem[] = catalog.map((entry) => ({
  ...entry,
  available: !entry.premium,
}));

const itemBySlug = new Map(catalogItems.map((item) => [item.slug, item]));

export const getAuthoredProblem = (slug: string): Problem | undefined => problemBySlug.get(slug);

export const getAllProblems = (): readonly Problem[] => problems;

export const getCatalogItem = (slug: string): CatalogItem | undefined => itemBySlug.get(slug);

/** Authored deep-dive, exact solver, or a tag-picked family so every free slug plays. */
export const getProblem = (slug: string): Problem | undefined => {
  const authored = getAuthoredProblem(slug);
  if (authored) return authored;
  const entry = entryBySlug.get(slug);
  if (!entry) return undefined;
  const solver = solverOf(slug);
  if (solver) return materialize(entry, solver);
  // Premium prompts are locked on LeetCode — no generated walkthrough.
  if (entry.premium) return undefined;
  return materializeFamily(entry);
};
