import { catalog } from "@/content/catalog";
import { problems } from "@/content/problems";
import type { CatalogItem, Problem, Topic } from "@/lib/types";

/**
 * Read-side query layer over the static content.
 *
 * Importing this module pulls in every authored problem, so it belongs in
 * server components and tests only. Client components should receive
 * `CatalogItem[]` as props and import constants from `@/lib/types`.
 */

const problemBySlug = new Map(problems.map((p) => [p.slug, p]));

export type { CatalogItem };

export const catalogItems: readonly CatalogItem[] = catalog.map((entry) => ({
  ...entry,
  available: problemBySlug.has(entry.slug),
}));

export const getProblem = (slug: string): Problem | undefined => problemBySlug.get(slug);

export const getAllProblems = (): readonly Problem[] => problems;

export const getCatalogItem = (slug: string): CatalogItem | undefined =>
  catalogItems.find((c) => c.slug === slug);

/** All topics that appear in the catalogue, most frequent first. */
export const allTopics = (): Topic[] => {
  const counts = new Map<Topic, number>();
  for (const item of catalogItems)
    for (const t of item.topics) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([t]) => t);
};

export interface Row {
  id: string;
  title: string;
  subtitle?: string;
  items: CatalogItem[];
}

/** Netflix-style rows for the home page. Available problems float to the front of each row. */
export const homeRows = (): Row[] => {
  const byAvailability = (a: CatalogItem, b: CatalogItem) =>
    Number(b.available) - Number(a.available);
  const topicRow = (id: string, title: string, subtitle: string, topics: Topic[]): Row => ({
    id,
    title,
    subtitle,
    items: catalogItems
      .filter((c) => c.topics.some((t) => topics.includes(t)))
      .sort(byAvailability)
      .slice(0, 18),
  });

  return [
    {
      id: "now-streaming",
      title: "Now Streaming",
      subtitle: "Full deep-dives with interactive animations",
      items: catalogItems.filter((c) => c.available),
    },
    topicRow("arrays-hashing", "Arrays & Hashing", "Where every interview loop starts", [
      "Array",
      "Hash Table",
    ]),
    topicRow(
      "two-pointers",
      "Two Pointers & Sliding Window",
      "Linear time, constant space, one proof",
      ["Two Pointers", "Sliding Window"],
    ),
    topicRow("stack", "Stack", "LIFO and the monotonic trick", ["Stack", "Monotonic Stack"]),
    topicRow("binary-search", "Binary Search", "log n, if you get the invariant right", [
      "Binary Search",
    ]),
    topicRow("linked-list", "Linked Lists", "Pointer juggling", ["Linked List"]),
    topicRow("trees-graphs", "Trees & Graphs", "Traverse everything", [
      "Tree",
      "Graph",
      "DFS",
      "BFS",
      "Trie",
    ]),
    topicRow("dp", "Dynamic Programming", "Overlapping subproblems, solved once", [
      "Dynamic Programming",
    ]),
    {
      id: "hard-mode",
      title: "Hard Mode",
      subtitle: "For when Medium stops being fun",
      items: catalogItems.filter((c) => c.difficulty === "Hard").sort(byAvailability),
    },
  ].filter((row) => row.items.length > 0);
};
