import { describe, expect, it } from "vitest";

import {
  applyQuery,
  DEFAULT_QUERY,
  difficultyStats,
  hasActiveFilter,
  matchesSearch,
  methodStats,
  PAGE_SIZE,
  paginate,
  readQuery,
  typeStats,
  writeQuery,
  type Query,
} from "@/lib/catalog-query";
import type { CatalogItem } from "@/lib/types";

const item = (over: Partial<CatalogItem>): CatalogItem => ({
  id: 1,
  slug: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  topics: ["Array", "Hash Table"],
  available: false,
  ...over,
});

const items: CatalogItem[] = [
  item({ id: 1, slug: "two-sum", title: "Two Sum", available: true }),
  item({
    id: 11,
    slug: "container",
    title: "Container With Most Water",
    difficulty: "Medium",
    topics: ["Array", "Two Pointers"],
  }),
  item({
    id: 42,
    slug: "trap",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topics: ["Array", "Two Pointers", "Stack"],
    available: true,
  }),
  item({ id: 121, slug: "stock", title: "Best Time to Buy and Sell Stock", topics: ["Array"] }),
];

describe("readQuery / writeQuery", () => {
  it("round-trips every field and omits defaults", () => {
    const q: Query = {
      q: "water",
      difficulty: "Hard",
      type: "Array",
      method: "Two Pointers",
      available: true,
      sort: "title",
      dir: "desc",
      page: 3,
    };
    const params = writeQuery(q);
    expect(readQuery(params)).toEqual(q);
    expect(writeQuery(DEFAULT_QUERY).toString()).toBe("");
  });

  it("maps a legacy topic= param onto type or method", () => {
    expect(readQuery(new URLSearchParams("topic=Array"))).toMatchObject({
      type: "Array",
      method: null,
    });
    expect(readQuery(new URLSearchParams("topic=Two+Pointers"))).toMatchObject({
      type: null,
      method: "Two Pointers",
    });
  });

  it("ignores unknown or malformed values", () => {
    const p = new URLSearchParams(
      "difficulty=Insane&type=Nope&method=Nope&sort=random&dir=sideways&page=-4",
    );
    expect(readQuery(p)).toEqual(DEFAULT_QUERY);
  });

  it("reports whether any filter is active", () => {
    expect(hasActiveFilter(DEFAULT_QUERY)).toBe(false);
    expect(hasActiveFilter({ ...DEFAULT_QUERY, sort: "title", page: 2 })).toBe(false);
    expect(hasActiveFilter({ ...DEFAULT_QUERY, method: "Greedy" })).toBe(true);
  });
});

describe("matchesSearch", () => {
  it("treats digits as a number prefix and text as a substring", () => {
    expect(matchesSearch(items[3], "12")).toBe(true);
    expect(matchesSearch(items[0], "12")).toBe(false);
    expect(matchesSearch(items[2], "RAIN")).toBe(true);
    expect(matchesSearch(items[1], "two pointers")).toBe(true);
    expect(matchesSearch(items[0], "  ")).toBe(true);
  });
});

describe("applyQuery", () => {
  it("filters by difficulty, type, method and availability together", () => {
    const out = applyQuery(items, {
      ...DEFAULT_QUERY,
      type: "Array",
      method: "Two Pointers",
      available: true,
    });
    expect(out.map((i) => i.id)).toEqual([42]);
  });

  it("sorts by each key in both directions", () => {
    const by = (sort: Query["sort"], dir: Query["dir"]) =>
      applyQuery(items, { ...DEFAULT_QUERY, sort, dir }).map((i) => i.id);
    expect(by("id", "asc")).toEqual([1, 11, 42, 121]);
    expect(by("id", "desc")).toEqual([121, 42, 11, 1]);
    expect(by("title", "asc")).toEqual([121, 11, 42, 1]);
    expect(by("difficulty", "asc")).toEqual([1, 121, 11, 42]);
    expect(by("difficulty", "desc")).toEqual([42, 11, 121, 1]);
  });
});

describe("paginate", () => {
  it("clamps out-of-range pages and reports the visible range", () => {
    const many = Array.from({ length: PAGE_SIZE * 2 + 5 }, (_, i) => i);
    expect(paginate(many, 0)).toMatchObject({ page: 1, from: 1, to: PAGE_SIZE, pageCount: 3 });
    expect(paginate(many, 99)).toMatchObject({ page: 3, from: PAGE_SIZE * 2 + 1, to: many.length });
    expect(paginate([], 1)).toMatchObject({ page: 1, pageCount: 1, from: 0, to: 0, total: 0 });
  });
});

describe("stats", () => {
  it("counts totals and animated per difficulty in fixed order", () => {
    expect(difficultyStats(items)).toEqual([
      { difficulty: "Easy", total: 2, available: 1 },
      { difficulty: "Medium", total: 1, available: 0 },
      { difficulty: "Hard", total: 1, available: 1 },
    ]);
  });

  it("splits tags into type vs method rails", () => {
    expect(typeStats(items).map((t) => `${t.topic}:${t.count}`)).toEqual(["Array:4", "Stack:1"]);
    expect(methodStats(items).map((t) => `${t.topic}:${t.count}`)).toEqual([
      "Two Pointers:2",
      "Hash Table:1",
    ]);
  });
});
