import type { Problem } from "@/lib/types";
import { arrayPanel, ptr, rangeTones, tones, varsPanel, v } from "@/lib/viz/builders";

import { go, py } from "./_helpers";

export const maximumSubarray: Problem = {
  id: 53,
  slug: "maximum-subarray",
  title: "Maximum Subarray",
  difficulty: "Medium",
  topics: ["Array", "Divide and Conquer", "Dynamic Programming"],
  blurb: "Kadane's algorithm: the whole DP fits in one line and one very good question.",

  statement: [
    {
      type: "p",
      text: "Given an integer array `nums`, find the subarray with the largest sum, and return *its sum*.",
    },
    {
      type: "callout",
      tone: "info",
      text: "A **subarray** is a contiguous, non-empty sequence of elements within an array.",
    },
  ],

  examples: [
    {
      input: { nums: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]" },
      output: "6",
      explanation: "The subarray `[4, -1, 2, 1]` has the largest sum 6.",
      viz: [
        arrayPanel("nums", "nums", [-2, 1, -3, 4, -1, 2, 1, -5, 4], {
          tones: rangeTones(3, 6, "result"),
          window: [3, 6],
        }),
      ],
    },
    {
      input: { nums: "[1]" },
      output: "1",
      explanation: "The subarray `[1]` has the largest sum 1.",
    },
    {
      input: { nums: "[5, 4, -1, 7, 8]" },
      output: "23",
      explanation: "The subarray `[5, 4, -1, 7, 8]` has the largest sum 23 — the whole array.",
    },
  ],

  constraints: ["`1 <= nums.length <= 10^5`", "`-10^4 <= nums[i] <= 10^4`"],

  followUp:
    "If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.",

  insights: [
    { type: "h3", text: "What are we choosing?" },
    {
      type: "p",
      text: "A subarray is defined by two indices `(start, end)`. There are `n(n+1)/2` of them, so brute force is O(n²) even with prefix sums. We need a way to avoid considering most of them.",
    },
    { type: "h3", text: "The one question that matters" },
    {
      type: "p",
      text: "Walk left to right and, at each index `i`, ask: *“what is the best subarray that **ends exactly here**?”* Call it `cur`. There are only two ways to build it: either extend the best subarray ending at `i−1` by one element (`cur + nums[i]`), or throw everything away and start fresh at `i` (`nums[i]`). Take the larger.",
    },
    {
      type: "viz",
      caption:
        "At index 3 the best run ending at 2 sums to −4. Extending it gives 4 + (−4) = 0; starting fresh gives 4. Start fresh.",
      state: [
        arrayPanel("nums", "nums", [-2, 1, -3, 4, -1, 2, 1, -5, 4], {
          pointers: [ptr(3, "i", "red")],
          tones: tones([0, "dim"], [1, "dim"], [2, "dim"], [3, "active"]),
        }),
        varsPanel("vars", "", [
          v("cur before", -4),
          v("extend: cur + x", "−4 + 4 = 0"),
          v("restart: x", 4, { tone: "result" }),
        ]),
      ],
    },
    {
      type: "p",
      text: "Why is dropping the prefix safe? Because if the best run so far has a **negative** sum, carrying it forward can only hurt whatever comes next. A negative prefix is dead weight — cut it.",
    },
    { type: "h3", text: "From local to global" },
    {
      type: "p",
      text: "Every subarray ends *somewhere*. So the global maximum is simply the largest `cur` we ever saw. That's the second variable, `best`. Two scalars, one pass — that's Kadane's algorithm, and it's a textbook one-dimensional DP where `cur` is `dp[i]` with the array compressed away.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "All-negative arrays",
      text: "Initialising `best = 0` returns the wrong answer for `[-3, -1, -2]` (should be −1). Start both `cur` and `best` at `nums[0]` — the subarray must be non-empty.",
    },
  ],

  approaches: [
    {
      id: "kadane",
      title: "Kadane's algorithm",
      kind: "optimal",
      summary: "cur = best subarray ending here; best = max over all cur.",
      intuition: [
        {
          type: "p",
          text: "At each element, either extend the current run or restart from this element, whichever is larger. Track the maximum `cur` ever seen.",
        },
      ],
      steps: [
        "`cur = best = nums[0]`.",
        "For each subsequent `x`: `cur = max(x, cur + x)`.",
        "`best = max(best, cur)`.",
        "Return `best`.",
      ],
      complexity: { time: "O(n)", space: "O(1)" },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def maxSubArray(self, nums: list[int]) -> int:
                    best = cur = nums[0]
                    for x in nums[1:]:
                        cur = max(x, cur + x)   # extend the run, or restart here
                        best = max(best, cur)
                    return best
          `,
          markers: {
            init: "best = cur = nums[0]",
            loop: "for x in nums[1:]",
            extend: "cur = max(x, cur + x)",
            best: "best = max(best, cur)",
            end: "return best",
          },
        },
        go: {
          source: go`
            func maxSubArray(nums []int) int {
                best, cur := nums[0], nums[0]
                for _, x := range nums[1:] {
                    cur = max(x, cur+x) // extend the run, or restart here
                    best = max(best, cur)
                }
                return best
            }
          `,
          markers: {
            init: "best, cur := nums[0], nums[0]",
            loop: "for _, x := range nums[1:]",
            extend: "cur = max(x, cur+x)",
            best: "best = max(best, cur)",
            end: "return best",
          },
        },
      },
    },
    {
      id: "divide-and-conquer",
      title: "Divide and conquer",
      kind: "alternative",
      summary: "Best subarray is entirely left, entirely right, or crosses the midpoint.",
      intuition: [
        {
          type: "p",
          text: "Split the array in half. The answer either lives fully in the left half, fully in the right half, or straddles the midpoint. The first two are recursive calls; the third is the best suffix of the left half plus the best prefix of the right half, each found with a linear scan.",
        },
        {
          type: "p",
          text: "It's asymptotically worse than Kadane — O(n log n) — but it's the pattern behind segment trees, where the same *(left, right, cross)* decomposition answers range queries in O(log n).",
        },
      ],
      steps: [
        "Base case: one element → return it.",
        "Recurse on `[lo, mid]` and `[mid+1, hi]`.",
        "Compute the max suffix sum ending at `mid` and the max prefix sum starting at `mid+1`.",
        "Return `max(left, right, suffix + prefix)`.",
      ],
      complexity: {
        time: "O(n log n)",
        space: "O(log n)",
        notes: "Recursion depth is log n; each level does O(n) work in the cross scans.",
      },
      traceable: false,
      code: {
        python: {
          source: py`
            class Solution:
                def maxSubArray(self, nums: list[int]) -> int:
                    def solve(lo: int, hi: int) -> int:  # inclusive range
                        if lo == hi:
                            return nums[lo]
                        mid = (lo + hi) // 2
                        left = solve(lo, mid)
                        right = solve(mid + 1, hi)

                        # best sum ending at mid, and best sum starting at mid + 1
                        suffix, total = float("-inf"), 0
                        for i in range(mid, lo - 1, -1):
                            total += nums[i]
                            suffix = max(suffix, total)
                        prefix, total = float("-inf"), 0
                        for i in range(mid + 1, hi + 1):
                            total += nums[i]
                            prefix = max(prefix, total)

                        return max(left, right, suffix + prefix)

                    return solve(0, len(nums) - 1)
          `,
          markers: {},
        },
        go: {
          source: go`
            func maxSubArray(nums []int) int {
                return solve(nums, 0, len(nums)-1)
            }

            func solve(nums []int, lo, hi int) int { // inclusive range
                if lo == hi {
                    return nums[lo]
                }
                mid := lo + (hi-lo)/2
                left := solve(nums, lo, mid)
                right := solve(nums, mid+1, hi)

                // best sum ending at mid, and best sum starting at mid + 1
                suffix, total := math.MinInt, 0
                for i := mid; i >= lo; i-- {
                    total += nums[i]
                    suffix = max(suffix, total)
                }
                prefix, total := math.MinInt, 0
                for i := mid + 1; i <= hi; i++ {
                    total += nums[i]
                    prefix = max(prefix, total)
                }

                return max(left, right, suffix+prefix)
            }
          `,
          markers: {},
        },
      },
    },
  ],

  inputs: [
    { name: "nums", label: "nums", type: "int[]", default: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]" },
  ],

  related: ["best-time-to-buy-and-sell-stock", "climbing-stairs"],
};
