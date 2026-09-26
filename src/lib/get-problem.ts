import { catalog } from "@/content/catalog";
import { materialize as materializeFamily } from "@/content/families";
import { materialize, solverOf } from "@/content/solvers";
import { getAuthoredProblem } from "@/lib/problems";
import type { Problem } from "@/lib/types";

const catalogBySlug = new Map(catalog.map((c) => [c.slug, c]));

/** Authored deep-dive, exact solver, or a tag-picked solution so every slug plays. */
export const getProblem = (slug: string): Problem | undefined => {
  const authored = getAuthoredProblem(slug);
  if (authored) return authored;
  const entry = catalogBySlug.get(slug);
  if (!entry) return undefined;
  const solver = solverOf(slug);
  if (solver) return materialize(entry, solver);
  // Premium prompts are locked on LeetCode — no generated walkthrough.
  if (entry.premium) return undefined;
  return materializeFamily(entry);
};
