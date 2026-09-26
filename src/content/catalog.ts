import type { CatalogEntry } from "@/lib/types";

import raw from "./leetcode.json";
import { parseCatalog } from "./parse-catalog";

/**
 * Full LeetCode index, synced by `scripts/sync-leetcode.mjs`.
 * Official statements stay on LeetCode — we only store metadata.
 */
export const catalog: CatalogEntry[] = parseCatalog(raw);
