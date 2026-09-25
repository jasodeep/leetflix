import { isMethod, type Topic } from "@/lib/types";

export const FAMILY_IDS = [
  "window",
  "pointers",
  "list",
  "bsearch",
  "stack",
  "walk",
  "dp",
  "hashing",
  "scan",
] as const;

export type FamilyId = (typeof FAMILY_IDS)[number];

const METHOD_FAMILY: Partial<Record<Topic, FamilyId>> = {
  "Sliding Window": "window",
  "Two Pointers": "pointers",
  "Linked List": "list",
  "Binary Search": "bsearch",
  Stack: "stack",
  "Monotonic Stack": "stack",
  BFS: "walk",
  DFS: "walk",
  Graph: "walk",
  Tree: "walk",
  "Binary Search Tree": "walk",
  Trie: "walk",
  "Shortest Path": "walk",
  "Topological Sort": "walk",
  "Dynamic Programming": "dp",
  Recursion: "dp",
  Backtracking: "dp",
  "Hash Table": "hashing",
};

/** Prefer the most specific method tag; fall back to a linear scan. */
export const familyOf = (topics: readonly Topic[]): FamilyId => {
  for (const t of topics) {
    const fam = METHOD_FAMILY[t];
    if (fam) return fam;
  }
  for (const t of topics) {
    if (isMethod(t)) return "scan";
  }
  return "scan";
};

export const FAMILY_LABEL: Record<FamilyId, string> = {
  window: "sliding window",
  pointers: "two pointers",
  list: "linked-list walk",
  bsearch: "binary search",
  stack: "stack",
  walk: "graph / tree walk",
  dp: "dynamic programming",
  hashing: "hashing",
  scan: "linear scan",
};
