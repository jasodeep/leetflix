import { catalog } from "@/content/catalog";
import { materialize, solverOf } from "@/content/solvers";
import { getAuthoredProblem } from "@/lib/problems";
import type { Problem } from "@/lib/types";

const catalogBySlug = new Map(catalog.map((c) => [c.slug, c]));

/** Authored deep-dive, or a real per-slug solver. Family-pattern stand-ins are gone. */
export const getProblem = (slug: string): Problem | undefined => {
  const authored = getAuthoredProblem(slug);
  if (authored) return authored;
  const entry = catalogBySlug.get(slug);
  const solver = solverOf(slug);
  if (!entry || !solver) return undefined;
  return materialize(entry, solver);
};
