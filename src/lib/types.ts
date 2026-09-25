import type { VizState } from "@/lib/viz/types";

export type Difficulty = "Easy" | "Medium" | "Hard";

export const DIFFICULTIES: readonly Difficulty[] = ["Easy", "Medium", "Hard"];

export const difficultyRank: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };

export const LANGUAGES = ["python", "go"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABEL: Record<Language, string> = {
  python: "Python",
  go: "Go",
};

export type Topic =
  | "Array"
  | "Hash Table"
  | "String"
  | "Two Pointers"
  | "Sliding Window"
  | "Stack"
  | "Monotonic Stack"
  | "Binary Search"
  | "Linked List"
  | "Tree"
  | "Binary Search Tree"
  | "Trie"
  | "Heap"
  | "Backtracking"
  | "Graph"
  | "BFS"
  | "DFS"
  | "Union Find"
  | "Topological Sort"
  | "Shortest Path"
  | "Dynamic Programming"
  | "Greedy"
  | "Intervals"
  | "Matrix"
  | "Math"
  | "Bit Manipulation"
  | "Design"
  | "Recursion"
  | "Divide and Conquer"
  | "Sorting"
  | "Prefix Sum";

/** What the problem is *about* — the input / data shape. */
export const PROBLEM_TYPES = [
  "Array",
  "String",
  "Matrix",
  "Linked List",
  "Stack",
  "Heap",
  "Tree",
  "Binary Search Tree",
  "Trie",
  "Graph",
  "Intervals",
] as const satisfies readonly Topic[];

/** How you solve it — the technique, as on LeetCode. */
export const METHODS = [
  "Hash Table",
  "Two Pointers",
  "Sliding Window",
  "Prefix Sum",
  "Sorting",
  "Binary Search",
  "Monotonic Stack",
  "BFS",
  "DFS",
  "Backtracking",
  "Recursion",
  "Dynamic Programming",
  "Greedy",
  "Union Find",
  "Topological Sort",
  "Shortest Path",
  "Divide and Conquer",
  "Bit Manipulation",
  "Math",
  "Design",
] as const satisfies readonly Topic[];

const TYPE_SET = new Set<Topic>(PROBLEM_TYPES);
const METHOD_SET = new Set<Topic>(METHODS);

export const isProblemType = (t: Topic): boolean => TYPE_SET.has(t);
export const isMethod = (t: Topic): boolean => METHOD_SET.has(t);
export const isTopic = (s: string): s is Topic =>
  TYPE_SET.has(s as Topic) || METHOD_SET.has(s as Topic);

/** Chip labels — LeetCode names, shortened where the rail would wrap. */
export const TOPIC_LABEL: Partial<Record<Topic, string>> = {
  "Hash Table": "Hashing",
  "Dynamic Programming": "DP",
  "Binary Search Tree": "BST",
  "Bit Manipulation": "Bitmask",
  "Divide and Conquer": "D&C",
  "Topological Sort": "Topo sort",
  "Shortest Path": "Shortest path",
  "Monotonic Stack": "Mono stack",
  "Sliding Window": "Window",
  "Two Pointers": "Two pointers",
  "Linked List": "Linked list",
  "Prefix Sum": "Prefix sum",
  "Binary Search": "Binary search",
  "Union Find": "Union-find",
};

export const topicLabel = (t: Topic): string => TOPIC_LABEL[t] ?? t;

export const typesOf = (topics: readonly Topic[]): Topic[] => topics.filter(isProblemType);
export const methodsOf = (topics: readonly Topic[]): Topic[] => topics.filter(isMethod);

/** Compile-time: every Topic is either a type or a method, never neither. */
const _kind = {
  Array: "type",
  String: "type",
  Matrix: "type",
  "Linked List": "type",
  Stack: "type",
  Heap: "type",
  Tree: "type",
  "Binary Search Tree": "type",
  Trie: "type",
  Graph: "type",
  Intervals: "type",
  "Hash Table": "method",
  "Two Pointers": "method",
  "Sliding Window": "method",
  "Prefix Sum": "method",
  Sorting: "method",
  "Binary Search": "method",
  "Monotonic Stack": "method",
  BFS: "method",
  DFS: "method",
  Backtracking: "method",
  Recursion: "method",
  "Dynamic Programming": "method",
  Greedy: "method",
  "Union Find": "method",
  "Topological Sort": "method",
  "Shortest Path": "method",
  "Divide and Conquer": "method",
  "Bit Manipulation": "method",
  Math: "method",
  Design: "method",
} as const satisfies Record<Topic, "type" | "method">;
void _kind;

/** A lightweight row in the browsable catalogue. Every problem has one. */
export interface CatalogEntry {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: Topic[];
  /** LeetCode "premium"-only problem. Still listed for completeness. */
  premium?: boolean;
}

/** A catalogue row enriched with whether a deep-dive exists. Safe to ship to the client. */
export interface CatalogItem extends CatalogEntry {
  available: boolean;
}

/**
 * Minimal structured rich-text. Inline strings support a tiny markdown
 * subset: `code`, **bold**, *italic*. See `components/content/InlineMarkdown`.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: "text" | Language; code: string }
  | { type: "callout"; tone: "info" | "tip" | "warn"; title?: string; text: string }
  | { type: "viz"; state: VizState; caption?: string };

export interface Example {
  input: Record<string, string>;
  output: string;
  explanation?: string;
  /** Static picture of the example, rendered with the same viz primitives as the player. */
  viz?: VizState;
}

export type ApproachKind = "brute-force" | "optimal" | "alternative";

export interface Complexity {
  time: string;
  space: string;
  notes?: string;
}

export interface SolutionCode {
  source: string;
  /**
   * Named anchors into the source, used to synchronise the animation with
   * the code. Each value is a substring that appears on exactly one line.
   * Resolved to line numbers at build time by `resolveMarkers`.
   */
  markers: Record<string, string>;
}

export interface Approach {
  id: string;
  title: string;
  kind: ApproachKind;
  summary: string;
  intuition: Block[];
  /** Ordered, human-readable algorithm steps. */
  steps: string[];
  complexity: Complexity;
  code: Record<Language, SolutionCode>;
  /** True when `content/traces/<slug>.ts` exports a trace for this approach id. */
  traceable: boolean;
}

export type InputFieldType = "int" | "int[]" | "string" | "string[]";

export interface InputField {
  name: string;
  label: string;
  type: InputFieldType;
  default: string;
  hint?: string;
}

export interface Problem extends CatalogEntry {
  /** One line for cards and metadata. */
  blurb: string;
  statement: Block[];
  examples: Example[];
  constraints: string[];
  followUp?: string;
  /** "Understanding the problem" — the detailed breakdown before any code. */
  insights: Block[];
  approaches: Approach[];
  /** Editable inputs for the interactive player. */
  inputs: InputField[];
  related?: string[];
}
