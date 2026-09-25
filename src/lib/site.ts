/** Site-wide constants. `NEXT_PUBLIC_SITE_URL` lets the static export be hosted anywhere. */
export const site = {
  name: "Leetflix",
  tagline: "Watch. Code. Repeat.",
  description:
    "A Netflix-style catalogue of LeetCode problems: deep-dive explanations, Python and Go solutions, and interactive step-by-step algorithm animations.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://leetflix.dev").replace(/\/$/, ""),
  github: "https://github.com/jasodeepchatterjee/leetflix",
} as const;

export const leetcodeUrl = (slug: string): string => `https://leetcode.com/problems/${slug}/`;

/** Absolute URL for a site-relative path. Matches `trailingSlash: true`. */
export const absUrl = (path = "/"): string => {
  const normalised = path.replace(/\/+$/, "") || "/";
  if (normalised === "/") return `${site.url}/`;
  return `${site.url}${normalised.startsWith("/") ? normalised : `/${normalised}`}/`;
};
