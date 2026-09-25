import {
  DIFFICULTIES,
  difficultyRank,
  isMethod,
  isProblemType,
  isTopic,
  type CatalogItem,
  type Difficulty,
  type Topic,
} from "@/lib/types";
import { clamp } from "@/lib/utils";

/**
 * Pure query layer for the problem table: URL ⇄ filters, filtering, sorting
 * and paging. No React, so the whole UX contract is unit-testable.
 */

export const SORT_KEYS = ["id", "title", "difficulty"] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export type SortDir = "asc" | "desc";

export const PAGE_SIZE = 50;

export interface Query {
  q: string;
  difficulty: Difficulty | null;
  type: Topic | null;
  method: Topic | null;
  available: boolean;
  sort: SortKey;
  dir: SortDir;
  page: number;
}

export const DEFAULT_QUERY: Query = {
  q: "",
  difficulty: null,
  type: null,
  method: null,
  available: false,
  sort: "id",
  dir: "asc",
  page: 1,
};

/**
 * `topic` is accepted as a legacy alias: a type tag becomes `type`, a method
 * tag becomes `method`. New URLs write the split keys.
 */
export const readQuery = (p: URLSearchParams): Query => {
  const d = p.get("difficulty");
  const rawType = p.get("type");
  const rawMethod = p.get("method");
  const legacy = p.get("topic");
  const type =
    rawType && isTopic(rawType) && isProblemType(rawType)
      ? rawType
      : legacy && isTopic(legacy) && isProblemType(legacy)
        ? legacy
        : null;
  const method =
    rawMethod && isTopic(rawMethod) && isMethod(rawMethod)
      ? rawMethod
      : legacy && isTopic(legacy) && isMethod(legacy)
        ? legacy
        : null;
  const s = p.get("sort");
  const page = Number.parseInt(p.get("page") ?? "1", 10);
  return {
    q: p.get("q") ?? "",
    difficulty: DIFFICULTIES.includes(d as Difficulty) ? (d as Difficulty) : null,
    type,
    method,
    available: p.get("available") === "1",
    sort: SORT_KEYS.includes(s as SortKey) ? (s as SortKey) : "id",
    dir: p.get("dir") === "desc" ? "desc" : "asc",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
};

/** Only non-default keys are written so shared URLs stay short. */
export const writeQuery = (f: Query): URLSearchParams => {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.difficulty) p.set("difficulty", f.difficulty);
  if (f.type) p.set("type", f.type);
  if (f.method) p.set("method", f.method);
  if (f.available) p.set("available", "1");
  if (f.sort !== "id") p.set("sort", f.sort);
  if (f.dir !== "asc") p.set("dir", f.dir);
  if (f.page > 1) p.set("page", String(f.page));
  return p;
};

export const hasActiveFilter = (f: Query): boolean =>
  Boolean(f.q || f.difficulty || f.type || f.method || f.available);

/** Numeric needles match the problem number as a prefix; everything else is a substring search. */
export const matchesSearch = (item: CatalogItem, q: string): boolean => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  if (/^\d+$/.test(needle)) return String(item.id).startsWith(needle);
  return (
    item.title.toLowerCase().includes(needle) ||
    item.slug.includes(needle) ||
    item.topics.some((t) => t.toLowerCase().includes(needle))
  );
};

const comparators: Record<SortKey, (a: CatalogItem, b: CatalogItem) => number> = {
  id: (a, b) => a.id - b.id,
  title: (a, b) => a.title.localeCompare(b.title),
  difficulty: (a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty] || a.id - b.id,
};

export const applyQuery = (items: readonly CatalogItem[], f: Query): CatalogItem[] => {
  const cmp = comparators[f.sort];
  const sign = f.dir === "asc" ? 1 : -1;
  return items
    .filter((i) => matchesSearch(i, f.q))
    .filter((i) => !f.difficulty || i.difficulty === f.difficulty)
    .filter((i) => !f.type || i.topics.includes(f.type))
    .filter((i) => !f.method || i.topics.includes(f.method))
    .filter((i) => !f.available || i.available)
    .sort((a, b) => sign * cmp(a, b));
};

export interface Page<T> {
  items: T[];
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
}

export const paginate = <T>(items: readonly T[], page: number, size = PAGE_SIZE): Page<T> => {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = clamp(page, 1, pageCount);
  const start = (current - 1) * size;
  const slice = items.slice(start, start + size);
  return {
    items: slice,
    page: current,
    pageCount,
    from: items.length === 0 ? 0 : start + 1,
    to: start + slice.length,
    total: items.length,
  };
};

export interface DifficultyStat {
  difficulty: Difficulty;
  total: number;
  available: number;
}

export const difficultyStats = (items: readonly CatalogItem[]): DifficultyStat[] =>
  DIFFICULTIES.map((difficulty) => {
    const ofKind = items.filter((i) => i.difficulty === difficulty);
    return {
      difficulty,
      total: ofKind.length,
      available: ofKind.filter((i) => i.available).length,
    };
  });

export interface TopicStat {
  topic: Topic;
  count: number;
}

const countTopics = (items: readonly CatalogItem[], pred: (t: Topic) => boolean): TopicStat[] => {
  const counts = new Map<Topic, number>();
  for (const item of items) {
    for (const t of item.topics) {
      if (!pred(t)) continue;
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([topic, count]) => ({ topic, count }));
};

export const typeStats = (items: readonly CatalogItem[]): TopicStat[] =>
  countTopics(items, isProblemType);

export const methodStats = (items: readonly CatalogItem[]): TopicStat[] =>
  countTopics(items, isMethod);
