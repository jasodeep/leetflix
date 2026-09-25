import type { Problem } from "@/lib/types";
import { barsPanel, ptr, tones, varsPanel, v } from "@/lib/viz/builders";

import { go, py } from "./_helpers";

export const containerWithMostWater: Problem = {
  id: 11,
  slug: "container-with-most-water",
  title: "Container With Most Water",
  difficulty: "Medium",
  topics: ["Array", "Two Pointers", "Greedy"],
  blurb: "Two pointers with a proof. The step that looks like a guess is actually airtight.",

  statement: [
    {
      type: "p",
      text: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.",
    },
    {
      type: "p",
      text: "Find two lines that together with the x-axis form a container, such that the container contains the most water. Return *the maximum amount of water a container can store*.",
    },
    { type: "callout", tone: "info", text: "**Notice** that you may not slant the container." },
  ],

  examples: [
    {
      input: { height: "[1, 8, 6, 2, 5, 4, 8, 3, 7]" },
      output: "49",
      explanation:
        "The lines at index 1 (height 8) and index 8 (height 7) are 7 apart; the water level is capped by the shorter one: 7 × 7 = 49.",
      viz: [
        barsPanel("height", "height", [1, 8, 6, 2, 5, 4, 8, 3, 7], {
          pointers: [ptr(1, "l", "blue"), ptr(8, "r", "blue")],
          tones: tones([1, "result"], [8, "result"]),
          fill: { from: 1, to: 8, height: 7, label: "49" },
        }),
      ],
    },
    { input: { height: "[1, 1]" }, output: "1" },
  ],

  constraints: ["`n == height.length`", "`2 <= n <= 10^5`", "`0 <= height[i] <= 10^4`"],

  insights: [
    { type: "h3", text: "The formula" },
    {
      type: "p",
      text: "Pick walls `l < r`. Water can't rise above the shorter wall, so `area = (r − l) × min(height[l], height[r])`. We want the max over all pairs — `n(n−1)/2` of them, so brute force is O(n²) and too slow for 10⁵.",
    },
    { type: "h3", text: "Start wide, then shrink — but shrink which side?" },
    {
      type: "p",
      text: "Start with the widest possible container (`l = 0`, `r = n−1`). Any other container is narrower, so to beat the current one it must have a **taller minimum wall**. Now the key question: if we move one pointer inward, which one?",
    },
    {
      type: "p",
      text: "Suppose `height[l] < height[r]`. Consider keeping `l` and moving `r` inward to any `r' < r`. The width shrinks, and the water level is `min(height[l], height[r']) ≤ height[l]` — it can't exceed the shorter wall we kept. So **every** container that still uses `l` is no better than the current one. `l` is exhausted; discard it. Symmetrically, when the right wall is shorter (or equal), discard `r`.",
    },
    {
      type: "viz",
      caption:
        "l=0 (height 1) is the shorter wall. No matter where r moves, the level stays ≤ 1 while the width shrinks. Wall 0 is done.",
      state: [
        barsPanel("height", "height", [1, 8, 6, 2, 5, 4, 8, 3, 7], {
          pointers: [ptr(0, "l", "red"), ptr(8, "r", "blue")],
          tones: tones([0, "danger"], [8, "active"]),
          fill: { from: 0, to: 8, height: 1, label: "8" },
        }),
        varsPanel("vars", "", [
          v("area", "8 × min(1, 7) = 8"),
          v("move", "l → 1", { tone: "result" }),
        ]),
      ],
    },
    { type: "h3", text: "Why this is a proof, not a heuristic" },
    {
      type: "p",
      text: "Each step permanently eliminates one wall, and we've shown the eliminated wall cannot participate in any container better than one we've already measured. After `n − 1` steps every pair has been either measured or provably dominated. That's why a greedy two-pointer sweep is exact here.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Ties",
      text: "When `height[l] == height[r]`, moving either is fine — both walls are simultaneously exhausted. Moving both at once is a micro-optimisation; the simple `else` branch is easier to defend on a whiteboard.",
    },
  ],

  approaches: [
    {
      id: "two-pointers",
      title: "Two pointers from the outside in",
      kind: "optimal",
      summary: "Measure the current container, then move the pointer at the shorter wall inward.",
      intuition: [
        {
          type: "p",
          text: "Widest first. At each step compute the area, keep the best, and retire the shorter wall — it can never be part of a better container.",
        },
      ],
      steps: [
        "`l = 0`, `r = n − 1`, `best = 0`.",
        "While `l < r`: `area = (r − l) × min(h[l], h[r])`, `best = max(best, area)`.",
        "If `h[l] < h[r]` then `l += 1`, else `r −= 1`.",
        "Return `best`.",
      ],
      complexity: { time: "O(n)", space: "O(1)" },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def maxArea(self, height: list[int]) -> int:
                    l, r = 0, len(height) - 1
                    best = 0
                    while l < r:
                        area = (r - l) * min(height[l], height[r])
                        best = max(best, area)
                        if height[l] < height[r]:
                            l += 1  # the left wall can never do better; retire it
                        else:
                            r -= 1  # the right wall can never do better; retire it
                    return best
          `,
          markers: {
            init: "l, r = 0, len(height) - 1",
            loop: "while l < r",
            area: "area = (r - l) * min(height[l], height[r])",
            best: "best = max(best, area)",
            cmp: "if height[l] < height[r]",
            movel: "l += 1",
            mover: "r -= 1",
            end: "return best",
          },
        },
        go: {
          source: go`
            func maxArea(height []int) int {
                l, r := 0, len(height)-1
                best := 0
                for l < r {
                    area := (r - l) * min(height[l], height[r])
                    best = max(best, area)
                    if height[l] < height[r] {
                        l++ // the left wall can never do better; retire it
                    } else {
                        r-- // the right wall can never do better; retire it
                    }
                }
                return best
            }
          `,
          markers: {
            init: "l, r := 0, len(height)-1",
            loop: "for l < r",
            area: "area := (r - l) * min(height[l], height[r])",
            best: "best = max(best, area)",
            cmp: "if height[l] < height[r]",
            movel: "l++",
            mover: "r--",
            end: "return best",
          },
        },
      },
    },
  ],

  inputs: [
    {
      name: "height",
      label: "height",
      type: "int[]",
      default: "[1, 8, 6, 2, 5, 4, 8, 3, 7]",
      hint: "Non-negative heights.",
    },
  ],

  related: ["two-sum", "best-time-to-buy-and-sell-stock"],
};
