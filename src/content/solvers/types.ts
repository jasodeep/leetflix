import type { Approach, Example, InputField } from "@/lib/types";
import type { TraceModule } from "@/lib/viz/types";

/** One real algorithm, bound to the LeetCode slugs it actually solves. */
export interface Solver {
  id: string;
  slugs: readonly string[];
  /** Short name for the move, shown in the blurb. */
  label: string;
  approach: Approach;
  inputs: InputField[];
  examples: Example[];
  traces: TraceModule;
}
