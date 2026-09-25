import type { Problem } from "@/lib/types";
import { arrayPanel, ptr, rangeTones, tones, varsPanel, v } from "@/lib/viz/builders";

import { go, py } from "./_helpers";

export const binarySearch: Problem = {
  id: 704,
  slug: "binary-search",
  title: "Binary Search",
  difficulty: "Easy",
  topics: ["Array", "Binary Search"],
  blurb:
    "Famous for being simple to describe and easy to get subtly wrong. Get the invariant right and the code writes itself.",

  statement: [
    {
      type: "p",
      text: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
    },
    { type: "p", text: "You must write an algorithm with `O(log n)` runtime complexity." },
  ],

  examples: [
    {
      input: { nums: "[-1, 0, 3, 5, 9, 12]", target: "9" },
      output: "4",
      explanation: "9 exists in `nums` and its index is 4.",
      viz: [
        arrayPanel("nums", "nums", [-1, 0, 3, 5, 9, 12], {
          tones: tones([4, "result"]),
          pointers: [ptr(4, "found", "green")],
        }),
      ],
    },
    {
      input: { nums: "[-1, 0, 3, 5, 9, 12]", target: "2" },
      output: "-1",
      explanation: "2 does not exist in `nums` so return −1.",
    },
  ],

  constraints: [
    "`1 <= nums.length <= 10^4`",
    "`-10^4 < nums[i], target < 10^4`",
    "All the integers in `nums` are **unique**.",
    "`nums` is sorted in ascending order.",
  ],

  insights: [
    { type: "h3", text: "Why sorted matters" },
    {
      type: "p",
      text: "In an unsorted array, looking at one element tells you nothing about the others — you must check all `n`. In a **sorted** array, a single comparison tells you about *half* the array: if `nums[mid] < target`, every element at or left of `mid` is also `< target` and can be discarded. Each probe halves the candidates, so ~`log₂ n` probes suffice. For n = 10⁴ that's 14 comparisons instead of 10,000.",
    },
    {
      type: "viz",
      caption: "target = 9. nums[2] = 3 < 9, so indices 0..2 are eliminated in one comparison.",
      state: [
        arrayPanel("nums", "nums", [-1, 0, 3, 5, 9, 12], {
          pointers: [ptr(0, "lo", "blue"), ptr(2, "mid", "red"), ptr(5, "hi", "blue")],
          tones: { ...rangeTones(0, 2, "dim"), 2: "active" },
        }),
        varsPanel("vars", "", [
          v("target", 9),
          v("nums[mid]", 3),
          v("verdict", "3 < 9 → search right", { tone: "result" }),
        ]),
      ],
    },
    { type: "h3", text: "The invariant that prevents off-by-ones" },
    {
      type: "p",
      text: "Pick one rule and never break it: **if `target` is in the array, it is inside the closed interval `[lo, hi]`.** Every line follows from it:",
    },
    {
      type: "ul",
      items: [
        "Start with `lo = 0, hi = n − 1` — the whole array (closed on both ends).",
        "Loop while `lo <= hi` — a one-element interval `[k, k]` is still a valid candidate.",
        "After `nums[mid] < target`, `mid` itself is ruled out, so `lo = mid + 1` (not `mid`).",
        "After `nums[mid] > target`, likewise `hi = mid − 1`.",
        "If the loop exits, the interval is empty and the invariant says `target` can't exist → `-1`.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Overflow trivia",
      text: "`mid = (lo + hi) / 2` can overflow 32-bit ints in C/Java/Go when `lo + hi > 2³¹ − 1`. `lo + (hi − lo) / 2` is mathematically identical and safe. Python ints don't overflow, but writing it this way anyway signals you know the history.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Beyond exact match",
      text: "The same skeleton finds *boundaries*: first element ≥ target (`bisect_left`), last element ≤ target, first `true` in a monotone predicate. Those variants (LeetCode 35, 875, 153…) are where binary search interviews actually get hard.",
    },
  ],

  approaches: [
    {
      id: "iterative",
      title: "Iterative, closed interval [lo, hi]",
      kind: "optimal",
      summary:
        "Halve the candidate interval on every comparison until it's empty or the target is found.",
      intuition: [
        {
          type: "p",
          text: "Maintain `[lo, hi]` as the set of indices that could still hold `target`. Probe the middle: equal → done; smaller → discard the left half including `mid`; larger → discard the right half including `mid`.",
        },
      ],
      steps: [
        "`lo = 0`, `hi = n − 1`.",
        "While `lo <= hi`: `mid = lo + (hi − lo) // 2`.",
        "If `nums[mid] == target` return `mid`.",
        "If `nums[mid] < target`: `lo = mid + 1`; else `hi = mid − 1`.",
        "Return `-1`.",
      ],
      complexity: { time: "O(log n)", space: "O(1)" },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def search(self, nums: list[int], target: int) -> int:
                    lo, hi = 0, len(nums) - 1  # invariant: target ∈ nums[lo..hi] if present
                    while lo <= hi:
                        mid = lo + (hi - lo) // 2
                        if nums[mid] == target:
                            return mid
                        if nums[mid] < target:
                            lo = mid + 1  # mid is too small; discard it and everything left
                        else:
                            hi = mid - 1  # mid is too big; discard it and everything right
                    return -1
          `,
          markers: {
            init: "lo, hi = 0, len(nums) - 1",
            loop: "while lo <= hi",
            mid: "mid = lo + (hi - lo) // 2",
            check: "if nums[mid] == target",
            found: "return mid",
            less: "if nums[mid] < target",
            right: "lo = mid + 1",
            left: "hi = mid - 1",
            none: "return -1",
          },
        },
        go: {
          source: go`
            func search(nums []int, target int) int {
                lo, hi := 0, len(nums)-1 // invariant: target ∈ nums[lo..hi] if present
                for lo <= hi {
                    mid := lo + (hi-lo)/2
                    if nums[mid] == target {
                        return mid
                    }
                    if nums[mid] < target {
                        lo = mid + 1 // mid is too small; discard it and everything left
                    } else {
                        hi = mid - 1 // mid is too big; discard it and everything right
                    }
                }
                return -1
            }
          `,
          markers: {
            init: "lo, hi := 0, len(nums)-1",
            loop: "for lo <= hi",
            mid: "mid := lo + (hi-lo)/2",
            check: "if nums[mid] == target",
            found: "return mid",
            less: "if nums[mid] < target",
            right: "lo = mid + 1",
            left: "hi = mid - 1",
            none: "return -1",
          },
        },
      },
    },
  ],

  inputs: [
    {
      name: "nums",
      label: "nums (sorted)",
      type: "int[]",
      default: "[-1, 0, 3, 5, 9, 12, 15, 21, 30]",
      hint: "Must be in ascending order.",
    },
    { name: "target", label: "target", type: "int", default: "9" },
  ],

  related: ["two-sum"],
};
