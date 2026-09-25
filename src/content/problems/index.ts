import type { Problem } from "@/lib/types";

import { bestTimeToBuyAndSellStock } from "./best-time-to-buy-and-sell-stock";
import { binarySearch } from "./binary-search";
import { climbingStairs } from "./climbing-stairs";
import { containerWithMostWater } from "./container-with-most-water";
import { longestSubstringWithoutRepeatingCharacters } from "./longest-substring-without-repeating-characters";
import { maximumSubarray } from "./maximum-subarray";
import { numberOfIslands } from "./number-of-islands";
import { reverseLinkedList } from "./reverse-linked-list";
import { trappingRainWater } from "./trapping-rain-water";
import { twoSum } from "./two-sum";
import { validParentheses } from "./valid-parentheses";

/**
 * Every problem with a full Leetflix deep-dive. Adding a problem here (plus a
 * matching entry in `content/traces/index.ts` if it animates) is all that's
 * needed for it to appear on the site — routes, sitemap and cards derive from it.
 */
export const problems: readonly Problem[] = [
  twoSum,
  validParentheses,
  bestTimeToBuyAndSellStock,
  maximumSubarray,
  binarySearch,
  reverseLinkedList,
  climbingStairs,
  containerWithMostWater,
  numberOfIslands,
  longestSubstringWithoutRepeatingCharacters,
  trappingRainWater,
];
