import type { Block, CatalogEntry, Problem } from "@/lib/types";
import { topicLabel } from "@/lib/types";

import type { Solver } from "./types";

const insightsFor = (entry: CatalogEntry, solver: Solver): Block[] => [
  { type: "h3", text: "This page solves this problem" },
  {
    type: "p",
    text: `**${entry.id}. ${entry.title}** — the Python, Go, and animation below run the algorithm for *this* slug, not a cousin pattern. Tagged ${entry.topics.map((t) => `\`${topicLabel(t)}\``).join(", ")}.`,
  },
  {
    type: "callout",
    tone: "info",
    title: "Official prompt lives on LeetCode",
    text: "We do not reprint LeetCode's statement, examples, or constraints. Open *Solve on LeetCode* for the exact I/O, then scrub the player here until the move is boring.",
  },
  { type: "h3", text: solver.approach.title },
  {
    type: "p",
    text: solver.approach.summary,
  },
];

export const materialize = (entry: CatalogEntry, solver: Solver): Problem => ({
  ...entry,
  blurb: `${entry.difficulty} · ${solver.label}. Real solution for this problem — same player as the hand-authored deep-dives.`,
  statement: [
    {
      type: "p",
      text: `LeetCode **${entry.id}. ${entry.title}**. The copyrighted prompt is on LeetCode. This page is a working ${solver.label} for *this* problem: editable input, Python, Go, and a step-by-step animation.`,
    },
  ],
  examples: solver.examples,
  constraints: [
    "Player inputs are capped so the animation stays readable.",
    "Match LeetCode's own constraints when you submit there.",
  ],
  insights: insightsFor(entry, solver),
  approaches: [solver.approach],
  inputs: solver.inputs,
});
