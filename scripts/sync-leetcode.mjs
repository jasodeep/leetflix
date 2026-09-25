#!/usr/bin/env node
/**
 * Pull the public LeetCode question index (id, slug, title, difficulty,
 * premium, topic tags) and write `src/content/leetcode.json`.
 *
 * Official statements are copyrighted — we only store metadata.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TAG_MAP = {
  Array: "Array",
  String: "String",
  Matrix: "Matrix",
  "Linked List": "Linked List",
  "Doubly-Linked List": "Linked List",
  Stack: "Stack",
  "Monotonic Stack": "Monotonic Stack",
  "Monotonic Queue": "Monotonic Stack",
  "Heap (Priority Queue)": "Heap",
  Tree: "Tree",
  "Binary Tree": "Tree",
  "Binary Search Tree": "Binary Search Tree",
  Trie: "Trie",
  Graph: "Graph",
  "Eulerian Circuit": "Graph",
  "Strongly Connected Component": "Graph",
  "Minimum Spanning Tree": "Graph",
  "Biconnected Component": "Graph",
  Interval: "Intervals",
  Intervals: "Intervals",
  "Line Sweep": "Intervals",
  "Hash Table": "Hash Table",
  "Hash Function": "Hash Table",
  "Ordered Map": "Hash Table",
  Counting: "Hash Table",
  "Rolling Hash": "Hash Table",
  "Two Pointers": "Two Pointers",
  "Sliding Window": "Sliding Window",
  "Prefix Sum": "Prefix Sum",
  Sorting: "Sorting",
  "Bucket Sort": "Sorting",
  "Counting Sort": "Sorting",
  "Radix Sort": "Sorting",
  Quickselect: "Sorting",
  "Merge Sort": "Divide and Conquer",
  "Binary Search": "Binary Search",
  "Depth-First Search": "DFS",
  "Breadth-First Search": "BFS",
  Backtracking: "Backtracking",
  Recursion: "Recursion",
  "Dynamic Programming": "Dynamic Programming",
  Memoization: "Dynamic Programming",
  Greedy: "Greedy",
  "Union Find": "Union Find",
  "Topological Sort": "Topological Sort",
  "Shortest Path": "Shortest Path",
  "Divide and Conquer": "Divide and Conquer",
  "Bit Manipulation": "Bit Manipulation",
  Bitmask: "Bit Manipulation",
  Math: "Math",
  "Number Theory": "Math",
  Geometry: "Math",
  Combinatorics: "Math",
  "Game Theory": "Math",
  "Probability and Statistics": "Math",
  Brainteaser: "Math",
  Design: "Design",
  Concurrency: "Design",
  Interactive: "Design",
  "String Matching": "String",
  "Suffix Array": "String",
  "Segment Tree": "Tree",
  "Binary Indexed Tree": "Tree",
};

const QUERY = `query {
  allQuestions {
    questionFrontendId
    title
    titleSlug
    difficulty
    isPaidOnly
    topicTags { name }
  }
}`;

const res = await fetch("https://leetcode.com/graphql", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "user-agent": "leetflix-sync/1.0",
  },
  body: JSON.stringify({ query: QUERY }),
});
if (!res.ok) throw new Error(`LeetCode GraphQL ${res.status}`);
const body = await res.json();
const questions = body?.data?.allQuestions;
if (!Array.isArray(questions) || questions.length < 1000) {
  throw new Error(`Unexpected GraphQL shape (${questions?.length ?? 0} questions)`);
}

const rows = [];
const seen = new Set();
for (const q of questions) {
  const id = Number.parseInt(q.questionFrontendId, 10);
  const slug = q.titleSlug;
  if (!Number.isFinite(id) || !slug || seen.has(id) || seen.has(slug)) continue;
  seen.add(id);
  seen.add(slug);
  const difficulty = q.difficulty;
  if (difficulty !== "Easy" && difficulty !== "Medium" && difficulty !== "Hard") continue;
  const topics = [];
  const used = new Set();
  for (const tag of q.topicTags ?? []) {
    const mapped = TAG_MAP[tag.name];
    if (!mapped || used.has(mapped)) continue;
    used.add(mapped);
    topics.push(mapped);
  }
  if (topics.length === 0) topics.push("Array");
  rows.push({
    id,
    slug,
    title: q.title,
    difficulty,
    topics,
    ...(q.isPaidOnly ? { premium: true } : {}),
  });
}
rows.sort((a, b) => a.id - b.id);

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/content/leetcode.json");
writeFileSync(out, `${JSON.stringify(rows)}\n`);
console.log(`Wrote ${rows.length} problems → src/content/leetcode.json`);
