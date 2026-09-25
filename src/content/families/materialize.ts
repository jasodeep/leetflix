import type { Block, CatalogEntry, Example, Problem } from "@/lib/types";
import { methodsOf, topicLabel, typesOf } from "@/lib/types";

import { FAMILY_APPROACH, FAMILY_INPUTS } from "./solutions";
import { FAMILY_LABEL, familyOf, type FamilyId } from "./pick";

const FAMILY_EXAMPLES: Record<FamilyId, Example[]> = {
  hashing: [
    {
      input: { nums: "[1, 2, 3, 1]" },
      output: "true",
      explanation: "Pattern demo: `1` appears twice, so the hash set fires on the second visit.",
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
    { type: "h3", text: "How Leetflix treats this problem" },
    {
      type: "p",
      text: `**${entry.title}** is tagged ${entry.topics.map((t) => `\`${topicLabel(t)}\``).join(", ")}. We do not reprint LeetCode's prompt (that text is theirs). This page teaches the **${FAMILY_LABEL[fam]}** pattern those tags point at, with the same player, Python, and Go as the hand-authored deep-dives.`,
    },
    {
      type: "callout",
      tone: "info",
      title: "Open the official statement",
      text: "Use *Solve on LeetCode* for constraints, examples and the exact I/O. Then come back here and scrub the animation until the pattern is boring.",
    },
    { type: "h3", text: `The ${FAMILY_LABEL[fam]} move` },
    {
      type: "p",
      text: method
        ? `The method that usually unlocks this one is **${topicLabel(method)}**${kind ? `, on a ${topicLabel(kind).toLowerCase()}` : ""}. The interactive walkthrough below is a canonical instance of that move — same loop, same markers, same panels — so you can watch the invariant hold step by step.`
        : "Watch the linear scan: one pass, a handful of variables, and a running answer. Most 'easy' array problems are this shape in disguise.",
    },
  ];
};

export const materialize = (entry: CatalogEntry): Problem => {
  const fam = familyOf(entry.topics);
  const approach = FAMILY_APPROACH[fam];
  return {
    ...entry,
    blurb: `${entry.difficulty} · ${FAMILY_LABEL[fam]} pattern. Official prompt on LeetCode; animation, Python and Go here.`,
    statement: [
      {
        type: "p",
        text: `LeetCode **${entry.id}. ${entry.title}**. The copyrighted problem statement lives on LeetCode — this page is the ${FAMILY_LABEL[fam]} pattern the catalogue tags it with.`,
      },
      {
        type: "p",
        text: "Edit the input, press Run, and step through the same player used for Two Sum, Rain Water and the other hand-authored deep-dives.",
      },
    ],
    examples: FAMILY_EXAMPLES[fam],
    constraints: [
      "Inputs in the player are capped so the animation stays readable.",
      "Match LeetCode's own constraints when you submit there.",
    ],
    insights: insightsFor(entry, fam),
    approaches: [approach],
    inputs: FAMILY_INPUTS[fam],
  };
};
