import type { Problem } from "@/lib/types";
import { barsPanel, ptr, tones, varsPanel, v } from "@/lib/viz/builders";

import { go, py } from "./_helpers";

const H = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
const W = [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0];

export const trappingRainWater: Problem = {
  id: 42,
  slug: "trapping-rain-water",
  title: "Trapping Rain Water",
  difficulty: "Hard",
  topics: ["Array", "Two Pointers", "Monotonic Stack"],
  blurb:
    "Three valid solutions, one beautiful invariant. The Hard that's really about seeing the right local rule.",

  statement: [
    {
      type: "p",
      text: "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    },
  ],

  examples: [
    {
      input: { height: "[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]" },
      output: "6",
      explanation: "6 units of rain water (shaded) are trapped between the bars.",
      viz: [barsPanel("height", "elevation map", H, { water: W })],
    },
    {
      input: { height: "[4, 2, 0, 3, 2, 5]" },
      output: "9",
      viz: [
        barsPanel("height", "elevation map", [4, 2, 0, 3, 2, 5], { water: [0, 2, 4, 1, 2, 0] }),
      ],
    },
  ],

  constraints: ["`n == height.length`", "`1 <= n <= 2 * 10^4`", "`0 <= height[i] <= 10^5`"],

  insights: [
    { type: "h3", text: "Think per column, not per puddle" },
    {
      type: "p",
      text: "Puddles are awkward to reason about — they span variable widths and nest. Columns are easy. Ask: *how deep is the water standing on top of column `i`?* Water there is held in by the tallest bar somewhere to its **left** and the tallest bar somewhere to its **right**; it rises to the lower of the two. So `water[i] = min(maxLeft[i], maxRight[i]) − height[i]`, clamped at 0. The answer is the sum over all columns.",
    },
    {
      type: "viz",
      caption:
        "Column 5 (height 0): tallest bar to the left is 2, to the right is 3. Water rises to min(2, 3) = 2, so 2 units stand here.",
      state: [
        barsPanel("height", "elevation map", H, {
          water: W,
          pointers: [
            ptr(3, "maxLeft = 2", "blue"),
            ptr(5, "i", "red"),
            ptr(7, "maxRight = 3", "green"),
          ],
          tones: tones([3, "match"], [5, "active"], [7, "match"]),
          guides: [
            { height: 2, from: 3, to: 5, label: "2", color: "blue" },
            { height: 3, from: 5, to: 7, label: "3", color: "green" },
          ],
        }),
        varsPanel("vars", "", [v("water[5]", "min(2, 3) − 0 = 2", { tone: "result" })]),
      ],
    },
    { type: "h3", text: "Solution 1 — precompute both maxima" },
    {
      type: "p",
      text: "Two passes fill `maxLeft[]` and `maxRight[]`; a third pass sums the formula. O(n) time, O(n) space. Perfectly acceptable, and the clearest to explain — lead with this in an interview, then improve it.",
    },
    { type: "h3", text: "Solution 2 — two pointers, O(1) space" },
    {
      type: "p",
      text: "Here's the trick. Keep `l` and `r` at the ends with running `leftMax` and `rightMax`. If `height[l] < height[r]`, then some bar on the right (at least `height[r]`) is taller than everything we've seen on the left, so the water level at `l` is decided by `leftMax` alone — we don't need to know the *true* right maximum. Settle column `l` and move on. Symmetric on the other side.",
    },
    {
      type: "p",
      text: "The invariant that makes it rigorous: whenever we process the left side, `leftMax ≤ rightMax` holds (and vice versa), so `min(leftMax, rightMax)` is exactly the side we know. Each step finalises one column; after `n − 1` steps we're done.",
    },
    { type: "h3", text: "Solution 3 — monotonic stack" },
    {
      type: "p",
      text: "Sweep left to right with a stack of indices whose heights are decreasing. When a bar taller than the stack top arrives, it closes a basin: pop the top (the basin floor), and the water above it is bounded by the new bar and the new stack top. This fills puddles *horizontally, layer by layer* — a different decomposition of the same total. It's the go-to when the question becomes “for each bar, find the next taller bar” (LeetCode 739, 84).",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Which one to present",
      text: "Prefix/suffix maxima first (correctness), then two pointers (space). Mention the stack exists. Being able to justify *why* the two-pointer shortcut is safe is what interviewers are listening for.",
    },
  ],

  approaches: [
    {
      id: "prefix-suffix",
      title: "Prefix and suffix maxima",
      kind: "alternative",
      summary:
        "Precompute the tallest bar to the left and right of every column; sum min(both) − height.",
      intuition: [
        {
          type: "p",
          text: "Materialise the per-column formula directly. Two auxiliary arrays make every lookup O(1).",
        },
      ],
      steps: [
        "`maxLeft[i] = max(height[0..i])`, `maxRight[i] = max(height[i..n−1])`.",
        "Sum `min(maxLeft[i], maxRight[i]) − height[i]` over all `i`.",
      ],
      complexity: { time: "O(n)", space: "O(n)" },
      traceable: false,
      code: {
        python: {
          source: py`
            class Solution:
                def trap(self, height: list[int]) -> int:
                    n = len(height)
                    if n == 0:
                        return 0
                    max_left = [0] * n
                    max_right = [0] * n
                    max_left[0] = height[0]
                    for i in range(1, n):
                        max_left[i] = max(max_left[i - 1], height[i])
                    max_right[-1] = height[-1]
                    for i in range(n - 2, -1, -1):
                        max_right[i] = max(max_right[i + 1], height[i])
                    return sum(min(max_left[i], max_right[i]) - height[i] for i in range(n))
          `,
          markers: {},
        },
        go: {
          source: go`
            func trap(height []int) int {
                n := len(height)
                if n == 0 {
                    return 0
                }
                maxLeft := make([]int, n)
                maxRight := make([]int, n)
                maxLeft[0] = height[0]
                for i := 1; i < n; i++ {
                    maxLeft[i] = max(maxLeft[i-1], height[i])
                }
                maxRight[n-1] = height[n-1]
                for i := n - 2; i >= 0; i-- {
                    maxRight[i] = max(maxRight[i+1], height[i])
                }
                water := 0
                for i := 0; i < n; i++ {
                    water += min(maxLeft[i], maxRight[i]) - height[i]
                }
                return water
            }
          `,
          markers: {},
        },
      },
    },
    {
      id: "two-pointers",
      title: "Two pointers, O(1) space",
      kind: "optimal",
      summary:
        "Always settle the column under the shorter wall — its water level is already fully determined.",
      intuition: [
        {
          type: "p",
          text: "Whichever side is currently shorter has a taller bar waiting on the other side, so its water level equals its own running maximum. Add that column's water, advance that pointer, repeat.",
        },
      ],
      steps: [
        "`l = 0`, `r = n − 1`, `leftMax = rightMax = 0`, `water = 0`.",
        "While `l < r`: if `height[l] < height[r]`: `leftMax = max(leftMax, height[l])`, `water += leftMax − height[l]`, `l += 1`.",
        "Else: `rightMax = max(rightMax, height[r])`, `water += rightMax − height[r]`, `r −= 1`.",
        "Return `water`.",
      ],
      complexity: { time: "O(n)", space: "O(1)" },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def trap(self, height: list[int]) -> int:
                    l, r = 0, len(height) - 1
                    left_max = right_max = 0
                    water = 0
                    while l < r:
                        if height[l] < height[r]:
                            # a taller wall exists on the right, so left_max decides the level here
                            left_max = max(left_max, height[l])
                            water += left_max - height[l]
                            l += 1
                        else:
                            right_max = max(right_max, height[r])
                            water += right_max - height[r]
                            r -= 1
                    return water
          `,
          markers: {
            init: "l, r = 0, len(height) - 1",
            loop: "while l < r",
            cmp: "if height[l] < height[r]",
            lmax: "left_max = max(left_max, height[l])",
            ladd: "water += left_max - height[l]",
            lmove: "l += 1",
            rmax: "right_max = max(right_max, height[r])",
            radd: "water += right_max - height[r]",
            rmove: "r -= 1",
            end: "return water",
          },
        },
        go: {
          source: go`
            func trap(height []int) int {
                l, r := 0, len(height)-1
                leftMax, rightMax := 0, 0
                water := 0
                for l < r {
                    if height[l] < height[r] {
                        // a taller wall exists on the right, so leftMax decides the level here
                        leftMax = max(leftMax, height[l])
                        water += leftMax - height[l]
                        l++
                    } else {
                        rightMax = max(rightMax, height[r])
                        water += rightMax - height[r]
                        r--
                    }
                }
                return water
            }
          `,
          markers: {
            init: "l, r := 0, len(height)-1",
            loop: "for l < r",
            cmp: "if height[l] < height[r]",
            lmax: "leftMax = max(leftMax, height[l])",
            ladd: "water += leftMax - height[l]",
            lmove: "l++",
            rmax: "rightMax = max(rightMax, height[r])",
            radd: "water += rightMax - height[r]",
            rmove: "r--",
            end: "return water",
          },
        },
      },
    },
    {
      id: "monotonic-stack",
      title: "Monotonic stack",
      kind: "alternative",
      summary:
        "Fill basins horizontally: each taller bar closes the basins to its left, layer by layer.",
      intuition: [
        {
          type: "p",
          text: "Keep indices with strictly decreasing heights on a stack. A new bar taller than the top pops it; the popped index is a basin floor bounded by the new bar (right) and the new top (left). Its water is `width × (min(walls) − floor)`.",
        },
      ],
      steps: [
        "For each `i`: while stack non-empty and `height[i] > height[top]`: pop `floor`; if stack empty break; `width = i − top − 1`; `level = min(height[i], height[top]) − height[floor]`; add `width × level`.",
        "Push `i`.",
      ],
      complexity: {
        time: "O(n)",
        space: "O(n)",
        notes: "Each index is pushed and popped at most once.",
      },
      traceable: false,
      code: {
        python: {
          source: py`
            class Solution:
                def trap(self, height: list[int]) -> int:
                    stack: list[int] = []  # indices, heights strictly decreasing
                    water = 0
                    for i, h in enumerate(height):
                        while stack and h > height[stack[-1]]:
                            floor = stack.pop()
                            if not stack:
                                break  # no left wall; nothing can be held
                            left = stack[-1]
                            width = i - left - 1
                            level = min(h, height[left]) - height[floor]
                            water += width * level
                        stack.append(i)
                    return water
          `,
          markers: {},
        },
        go: {
          source: go`
            func trap(height []int) int {
                stack := make([]int, 0, len(height)) // indices, heights strictly decreasing
                water := 0
                for i, h := range height {
                    for len(stack) > 0 && h > height[stack[len(stack)-1]] {
                        floor := stack[len(stack)-1]
                        stack = stack[:len(stack)-1]
                        if len(stack) == 0 {
                            break // no left wall; nothing can be held
                        }
                        left := stack[len(stack)-1]
                        width := i - left - 1
                        level := min(h, height[left]) - height[floor]
                        water += width * level
                    }
                    stack = append(stack, i)
                }
                return water
            }
          `,
          markers: {},
        },
      },
    },
  ],

  inputs: [
    {
      name: "height",
      label: "height",
      type: "int[]",
      default: "[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
      hint: "Non-negative heights.",
    },
  ],

  related: ["container-with-most-water"],
};
