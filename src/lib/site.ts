import { publicEnv } from "@/lib/env";

/** Site-wide constants. `NEXT_PUBLIC_SITE_URL` lets the static export be hosted anywhere. */
export const site = {
  name: "Leetflix",
  tagline: "Watch. Code. Repeat.",
  /** Unique, ≤160 chars. Interview / DSA / LeetCode — never a streaming brand. */
  description:
    "Practice LeetCode and coding interviews with the full problem catalogue, explained Python and Go solutions, and step-by-step algorithm animations.",
  titleDefault: "Leetflix — LeetCode solutions, algorithm visualizations, interview prep",
  url: publicEnv.siteUrl,
  github: "https://github.com/jasodeep/leetflix",
  locale: "en_US",
  localeBcp47: "en-US",
  author: "Jasodeep Chatterjee",
  keywords: [
    "leetcode",
    "leetcode solutions",
    "leetcode explained",
    "leetcode python",
    "leetcode golang",
    "coding interview prep",
    "coding interview questions",
    "software engineer interview",
    "technical interview prep",
    "data structures and algorithms",
    "dsa practice",
    "problem solving",
    "algorithm visualization",
    "algorithm animation",
    "interactive algorithm walkthrough",
    "visual dsa",
    "step by step leetcode",
    "dynamic programming",
    "two pointers",
    "hash table",
  ],
} as const;

export const leetcodeUrl = (slug: string): string => `https://leetcode.com/problems/${slug}/`;

const FILE_EXT = /\.[a-z0-9]+$/i;

/** Absolute URL for a site-relative path. Pages get a trailing slash; files do not. */
export const absUrl = (path = "/"): string => {
  const raw = path.startsWith("/") ? path : `/${path}`;
  const normalised = raw.replace(/\/+$/, "") || "/";
  if (normalised === "/") return `${site.url}/`;
  if (FILE_EXT.test(normalised)) return `${site.url}${normalised}`;
  return `${site.url}${normalised}/`;
};
