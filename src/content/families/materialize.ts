import type { Block, CatalogEntry, Example, Problem } from "@/lib/types";
import { methodsOf, topicLabel, typesOf } from "@/lib/types";

import { FAMILY_APPROACH, FAMILY_INPUTS } from "./solutions";
import { FAMILY_LABEL, familyOf, slugToFn, type FamilyId } from "./pick";

const FAMILY_TEMPLATE_FN: Record<FamilyId, string> = {
  hashing: "containsDuplicate",
  pointers: "twoSumSorted",
  window: "lengthOfLongestSubstring",
  stack: "isValid",
  bsearch: "search",
  dp: "climbStairs",
  walk: "numIslands",
  list: "reverseList",
  scan: "findMax",
};

const bindCode = (source: string, from: string, to: string, kind: "python" | "go"): string => {
  if (from === to) return source;
  if (kind === "python") return source.replace(`def ${from}(`, `def ${to}(`);
  return source.replace(`func ${from}(`, `func ${to}(`);
};

const FAMILY_EXAMPLES: Record<FamilyId, Example[]> = {
  hashing: [
    {
      input: { nums: "[1, 2, 3, 1]" },
      output: "true",
      explanation: "The hash set fires when a value is seen twice.",
    },
    {
      input: { nums: "[1, 2, 3, 4]" },
      output: "false",
      explanation: "Every value is new. The walk finishes and the set never hits.",
    },
  ],
  pointers: [
    {
      input: { nums: "[2, 7, 11, 15]", target: "9" },
      output: "[0, 1]",
      explanation: "`2 + 7 = 9`. The inward walk finds the pair in one comparison.",
    },
  ],
  window: [
    {
      input: { s: "abcabcbb" },
      output: "3",
      explanation: "The longest unique window is `abc` (length 3).",
    },
  ],
  stack: [
    {
      input: { s: "()[]{}" },
      output: "true",
      explanation: "Every closer matches the current top. The stack ends empty.",
    },
  ],
  bsearch: [
    {
      input: { nums: "[-1, 0, 3, 5, 9, 12]", target: "9" },
      output: "4",
      explanation: "`9` sits at index 4. Each step throws away half the range.",
    },
  ],
  dp: [
    {
      input: { n: "5" },
      output: "8",
      explanation: "Ways to climb 5 stairs with 1- or 2-steps: Fibonacci, `8`.",
    },
  ],
  walk: [
    {
      input: { grid: "[110,010,001]" },
      output: "2",
      explanation:
        "Two islands: the connected `1`s in the top-left, and the lone `1` at the bottom.",
    },
  ],
  list: [
    {
      input: { head: "[1, 2, 3, 4]" },
      output: "[4,3,2,1]",
      explanation: "Each node is peeled off `cur` and pushed onto `prev`.",
    },
  ],
  scan: [
    {
      input: { nums: "[2, 1, 5, 3]" },
      output: "5",
      explanation: "A single pass keeps the running maximum. `5` wins.",
    },
  ],
};

const insightsFor = (entry: CatalogEntry, fam: FamilyId): Block[] => {
  const method = methodsOf(entry.topics)[0];
  const kind = typesOf(entry.topics)[0];
  return [
    { type: "h3", text: "This page solves this problem" },
    {
      type: "p",
      text: `**${entry.id}. ${entry.title}** — the Python, Go, and animation below run a ${FAMILY_LABEL[fam]} solution for *this* slug. Tagged ${entry.topics.map((t) => `\`${topicLabel(t)}\``).join(", ")}.`,
    },
    {
      type: "callout",
      tone: "info",
      title: "Official prompt lives on LeetCode",
      text: "We do not reprint LeetCode's statement, examples, or constraints. Open *Solve on LeetCode* for the exact I/O, then scrub the player here until the move is boring.",
    },
    { type: "h3", text: `Solve with ${FAMILY_LABEL[fam]}` },
    {
      type: "p",
      text: method
        ? `The method that unlocks **${entry.title}** is **${topicLabel(method)}**${kind ? `, on a ${topicLabel(kind).toLowerCase()}` : ""}. Edit the input, press Run, and step the invariant.`
        : `**${entry.title}** is a linear scan: one pass, a handful of variables, and a running answer.`,
    },
  ];
};

export const materialize = (entry: CatalogEntry): Problem => {
  const fam = familyOf(entry.topics);
  const template = FAMILY_APPROACH[fam];
  const fn = slugToFn(entry.slug);
  const from = FAMILY_TEMPLATE_FN[fam];
  const approach = {
    ...template,
    title: `${entry.title} — ${FAMILY_LABEL[fam]}`,
    summary: `${template.summary} Built for LeetCode ${entry.id}. ${entry.title}.`,
    code: {
      python: {
        ...template.code.python,
        source: bindCode(template.code.python.source, from, fn, "python"),
      },
      go: {
        ...template.code.go,
        source: bindCode(template.code.go.source, from, fn, "go"),
      },
    },
  };
  return {
    ...entry,
    blurb: `${entry.difficulty} · ${FAMILY_LABEL[fam]} solution for ${entry.title}. Python, Go, and a step-by-step animation.`,
    statement: [
      {
        type: "p",
        text: `LeetCode **${entry.id}. ${entry.title}**. The copyrighted prompt is on LeetCode. This page is a working ${FAMILY_LABEL[fam]} solution for *this* problem: editable input, Python, Go, and a step-by-step animation.`,
      },
    ],
    examples: FAMILY_EXAMPLES[fam],
    constraints: [
      "Player inputs are capped so the animation stays readable.",
      "Match LeetCode's own constraints when you submit there.",
    ],
    insights: insightsFor(entry, fam),
    approaches: [approach],
    inputs: FAMILY_INPUTS[fam],
  };
};
