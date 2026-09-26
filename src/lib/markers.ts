import { MarkerError } from "@/lib/errors";
import type { SolutionCode } from "@/lib/types";

export type ResolvedMarkers = Record<string, number>;

/**
 * Turns `{ marker: "unique substring" }` into `{ marker: lineNumber }` (1-based).
 *
 * Anchoring on substrings instead of hard-coded line numbers keeps solutions
 * editable: reformatting or adding a comment cannot silently desynchronise the
 * animation from the code. Ambiguity or a miss is a content bug and throws.
 */
export function resolveMarkers(code: SolutionCode, context = "solution"): ResolvedMarkers {
  const lines = code.source.split("\n");
  const resolved: ResolvedMarkers = {};

  for (const [name, needle] of Object.entries(code.markers)) {
    const hits: number[] = [];
    lines.forEach((line, i) => {
      if (line.includes(needle)) hits.push(i + 1);
    });
    if (hits.length === 0) {
      throw new MarkerError(`[${context}] marker "${name}" not found: ${JSON.stringify(needle)}`);
    }
    if (hits.length > 1) {
      throw new MarkerError(
        `[${context}] marker "${name}" is ambiguous (lines ${hits.join(", ")}): ${JSON.stringify(needle)}`,
      );
    }
    const line = hits[0];
    if (line === undefined) {
      throw new MarkerError(`[${context}] marker "${name}" resolved without a line`);
    }
    resolved[name] = line;
  }

  return resolved;
}
