import { describe, expect, it } from "vitest";

import { catalogItems } from "@/lib/catalog";
import {
  catalogStats,
  FEATURED_SLUGS,
  HOME_FAQ,
  hubOf,
  itemsForHub,
  problemDescription,
  problemTitle,
  SEO_HUBS,
  topicSlug,
} from "@/lib/seo";
import { absUrl, site } from "@/lib/site";

describe("site identity", () => {
  it("uses a unique title and a description under 160 characters", () => {
    expect(site.titleDefault.length).toBeGreaterThan(20);
    expect(site.description.length).toBeGreaterThan(50);
    expect(site.description.length).toBeLessThanOrEqual(160);
    expect(site.github).toMatch(/github\.com\/jasodeep\/leetflix$/);
  });

  it("positions around LeetCode, interviews, and problem solving — not streaming brands", () => {
    const blob = [
      site.titleDefault,
      site.description,
      site.tagline,
      ...site.keywords,
      ...HOME_FAQ.map((x) => `${x.q} ${x.a}`),
    ]
      .join(" ")
      .toLowerCase();
    expect(blob).not.toMatch(/netflix|parody|stream|binge|episode/);
    expect(blob).toMatch(/leetcode/);
    expect(blob).toMatch(/interview/);
    expect(blob).toMatch(/problem solving|algorithm/);
  });
});

describe("absUrl", () => {
  it("adds trailing slashes on pages and preserves file URLs", () => {
    expect(absUrl("/")).toMatch(/\/$/);
    expect(absUrl("/explore")).toMatch(/\/explore\/$/);
    expect(absUrl("/problems/two-sum")).toMatch(/\/problems\/two-sum\/$/);
    expect(absUrl("/sitemap.xml")).toMatch(/\/sitemap\.xml$/);
    expect(absUrl("/logo.png")).toMatch(/\/logo\.png$/);
  });
});

describe("SEO hubs", () => {
  it("has unique slugs across difficulty, type, and method", () => {
    const slugs = SEO_HUBS.map((h) => h.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(hubOf("easy")?.kind).toBe("difficulty");
    expect(hubOf("array")?.kind).toBe("type");
    expect(hubOf("dynamic-programming")?.kind).toBe("method");
  });

  it("keeps hub copy in snippet range", () => {
    for (const hub of SEO_HUBS) {
      expect(hub.description.length).toBeGreaterThan(40);
      expect(hub.description.length).toBeLessThanOrEqual(170);
      expect(itemsForHub(hub).length).toBeGreaterThan(0);
    }
  });

  it("slugifies topic names stably", () => {
    expect(topicSlug("Two Pointers")).toBe("two-pointers");
    expect(topicSlug("Binary Search Tree")).toBe("binary-search-tree");
    expect(topicSlug("Easy")).toBe("easy");
  });
});

describe("problem snippets", () => {
  it("leads with the animated solution and stays short", () => {
    const title = problemTitle(1, "Two Sum");
    const description = problemDescription({
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      blurb: "Find two numbers that add to the target.",
      topics: ["Array", "Hash Table"],
    });
    expect(title).toContain("animated solution");
    expect(description.toLowerCase()).toContain("visually");
    expect(description.length).toBeLessThanOrEqual(160);
  });
});

describe("catalogue claims stay honest", () => {
  it("animates every free problem and skips locked Premium rows", () => {
    const stats = catalogStats();
    expect(stats.total).toBe(catalogItems.length);
    expect(stats.total).toBeGreaterThan(3000);
    expect(stats.locked).toBeGreaterThan(0);
    expect(stats.animated).toBe(stats.total - stats.locked);
    expect(stats.easy + stats.medium + stats.hard).toBe(stats.total);
  });

  it("features only known slugs", () => {
    for (const slug of FEATURED_SLUGS) {
      expect(catalogItems.some((p) => p.slug === slug)).toBe(true);
    }
  });

  it("answers the three positioning questions in FAQ", () => {
    const blob = HOME_FAQ.map((x) => `${x.q} ${x.a}`)
      .join(" ")
      .toLowerCase();
    expect(blob).toMatch(/every/);
    expect(blob).toMatch(/python/);
    expect(blob).toMatch(/animat/);
    expect(blob).toMatch(/interview/);
  });
});
