/**
 * Public build-time env. Next inlines `NEXT_PUBLIC_*` into the static export;
 * there is no runtime server to read secrets from.
 */

const trimSlash = (value: string): string => value.replace(/\/+$/, "");

const DEFAULT_SITE_URL = "https://jasodeep.github.io/leetflix";

export const publicEnv = {
  siteUrl: trimSlash(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL),
  basePath: trimSlash(process.env.NEXT_PUBLIC_BASE_PATH ?? ""),
} as const;
