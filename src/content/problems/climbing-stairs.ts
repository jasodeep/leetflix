import type { Problem } from "@/lib/types";
import { arrayPanel, ptr, tones, varsPanel, v } from "@/lib/viz/builders";

import { go, py } from "./_helpers";

export const climbingStairs: Problem = {
  id: 70,
  slug: "climbing-stairs",
  title: "Climbing Stairs",
  difficulty: "Easy",
  topics: ["Math", "Dynamic Programming", "Recursion"],
  blurb: "Fibonacci in a trench coat. The gentlest possible introduction to dynamic programming.",

  statement: [
    { type: "p", text: "You are climbing a staircase. It takes `n` steps to reach the top." },
    {
      type: "p",
      text: "Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    },
  ],

  examples: [
    {
      input: { n: "2" },
      output: "2",
      explanation: "There are two ways to climb to the top: `1 + 1` and `2`.",
    },
    {
      input: { n: "3" },
      output: "3",
      explanation: "Three ways: `1 + 1 + 1`, `1 + 2`, and `2 + 1`.",
      viz: [
        arrayPanel("ways", "ways to reach step i", [1, 1, 2, 3], {
          tones: tones([3, "result"]),
          pointers: [ptr(3, "n", "red")],
        }),
      ],
    },
  ],

  constraints: ["`1 <= n <= 45`"],

  insights: [
    { type: "h3", text: "Think about the last move" },
    {
      type: "p",
      text: "Every way of reaching step `n` ends with either a 1-step (from `n−1`) or a 2-step (from `n−2`). Those two groups are disjoint and together cover everything. So: `ways(n) = ways(n−1) + ways(n−2)`. That's the whole problem — the rest is bookkeeping.",
    },
    {
      type: "viz",
      caption:
        "ways(5): every path arrives via step 4 (5 ways to get there) or via step 3 (3 ways). 5 + 3 = 8.",
      state: [
        arrayPanel("ways", "ways to reach step i", [1, 1, 2, 3, 5, "?"], {
          tones: tones([3, "match"], [4, "match"], [5, "active"]),
          pointers: [ptr(3, "i−2", "blue"), ptr(4, "i−1", "blue"), ptr(5, "i", "red")],
        }),
        varsPanel("vars", "", [v("ways(5)", "ways(4) + ways(3) = 5 + 3 = 8", { tone: "result" })]),
      ],
    },
    { type: "h3", text: "Why naïve recursion explodes" },
    {
      type: "p",
      text: "Translating the recurrence straight into a recursive function recomputes the same sub-answers over and over: `ways(5)` calls `ways(4)` and `ways(3)`; `ways(4)` calls `ways(3)` *again*. The call tree has ~`1.6ⁿ` nodes. For n = 45 that's over a billion calls.",
    },
    {
      type: "p",
      text: "Dynamic programming is just the observation that there are only `n` distinct sub-problems. Compute each once — either by caching results in the recursion (**memoisation**, top-down) or by filling a table from the base cases upward (**tabulation**, bottom-up).",
    },
    { type: "h3", text: "Squeezing the space" },
    {
      type: "p",
      text: "`dp[i]` only ever reads `dp[i−1]` and `dp[i−2]`. Everything older is never touched again, so two variables suffice: the classic rolling-window trick that turns O(n) space into O(1).",
    },
    {
      type: "callout",
      tone: "info",
      title: "Yes, it's Fibonacci",
      text: "`ways(n) = F(n+1)`. There's even a closed form (Binet's formula) and an O(log n) matrix-power method, but for n ≤ 45 the linear loop is the right answer in an interview — mention the others for bonus points.",
    },
  ],

  approaches: [
    {
      id: "memo",
      title: "Top-down recursion with memoisation",
      kind: "alternative",
      summary: "The recurrence as written, plus a cache so each sub-problem is solved once.",
      intuition: [
        {
          type: "p",
          text: "Write the recurrence directly, then add a dictionary (or `@cache`) keyed by `n`. The first call for each `n` does real work; every later call is an O(1) lookup.",
        },
      ],
      steps: [
        "Base: `ways(1) = 1`, `ways(2) = 2`.",
        "Else `ways(n) = ways(n−1) + ways(n−2)`, cached.",
      ],
      complexity: { time: "O(n)", space: "O(n)", notes: "Cache plus recursion depth." },
      traceable: false,
      code: {
        python: {
          source: py`
            from functools import cache

            class Solution:
                def climbStairs(self, n: int) -> int:
                    @cache
                    def ways(i: int) -> int:
                        if i <= 2:
                            return i
                        return ways(i - 1) + ways(i - 2)
                    return ways(n)
          `,
          markers: {},
        },
        go: {
          source: go`
            func climbStairs(n int) int {
                memo := make(map[int]int, n)
                var ways func(i int) int
                ways = func(i int) int {
                    if i <= 2 {
                        return i
                    }
                    if cached, ok := memo[i]; ok {
                        return cached
                    }
                    memo[i] = ways(i-1) + ways(i-2)
                    return memo[i]
                }
                return ways(n)
            }
          `,
          markers: {},
        },
      },
    },
    {
      id: "tabulation",
      title: "Bottom-up table",
      kind: "optimal",
      summary: "Fill dp[1..n] left to right; dp[i] = dp[i−1] + dp[i−2].",
      intuition: [
        {
          type: "p",
          text: "Start from the base cases and build upward. By the time we compute `dp[i]`, both of its dependencies are already in the table — no recursion, no cache misses, no stack.",
        },
      ],
      steps: [
        "If `n ≤ 2` return `n`.",
        "`dp[1] = 1`, `dp[2] = 2`.",
        "For `i` in `3..n`: `dp[i] = dp[i−1] + dp[i−2]`.",
        "Return `dp[n]`.",
      ],
      complexity: { time: "O(n)", space: "O(n)" },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def climbStairs(self, n: int) -> int:
                    if n <= 2:
                        return n
                    dp = [0] * (n + 1)   # dp[i] = ways to reach step i
                    dp[1], dp[2] = 1, 2
                    for i in range(3, n + 1):
                        dp[i] = dp[i - 1] + dp[i - 2]
                    return dp[n]
          `,
          markers: {
            base: "if n <= 2",
            base_ret: "return n",
            init: "dp = [0] * (n + 1)",
            seed: "dp[1], dp[2] = 1, 2",
            loop: "for i in range(3, n + 1)",
            fill: "dp[i] = dp[i - 1] + dp[i - 2]",
            end: "return dp[n]",
          },
        },
        go: {
          source: go`
            func climbStairs(n int) int {
                if n <= 2 {
                    return n
                }
                dp := make([]int, n+1) // dp[i] = ways to reach step i
                dp[1], dp[2] = 1, 2
                for i := 3; i <= n; i++ {
                    dp[i] = dp[i-1] + dp[i-2]
                }
                return dp[n]
            }
          `,
          markers: {
            base: "if n <= 2",
            base_ret: "return n",
            init: "dp := make([]int, n+1)",
            seed: "dp[1], dp[2] = 1, 2",
            loop: "for i := 3; i <= n; i++",
            fill: "dp[i] = dp[i-1] + dp[i-2]",
            end: "return dp[n]",
          },
        },
      },
    },
    {
      id: "constant-space",
      title: "Two rolling variables",
      kind: "alternative",
      summary: "Same recurrence, but only the last two values are kept.",
      intuition: [
        {
          type: "p",
          text: "Replace the table with `a = dp[i−2]`, `b = dp[i−1]`. Each iteration slides the window forward. This is how you'd actually ship it.",
        },
      ],
      steps: [
        "`a, b = 1, 2`.",
        "Repeat `n − 2` times: `a, b = b, a + b`.",
        "Return `b` (or `n` when `n ≤ 2`).",
      ],
      complexity: { time: "O(n)", space: "O(1)" },
      traceable: false,
      code: {
        python: {
          source: py`
            class Solution:
                def climbStairs(self, n: int) -> int:
                    if n <= 2:
                        return n
                    a, b = 1, 2  # ways(i - 2), ways(i - 1)
                    for _ in range(3, n + 1):
                        a, b = b, a + b
                    return b
          `,
          markers: {},
        },
        go: {
          source: go`
            func climbStairs(n int) int {
                if n <= 2 {
                    return n
                }
                a, b := 1, 2 // ways(i - 2), ways(i - 1)
                for i := 3; i <= n; i++ {
                    a, b = b, a+b
                }
                return b
            }
          `,
          markers: {},
        },
      },
    },
  ],

  inputs: [
    { name: "n", label: "n", type: "int", default: "6", hint: "1 ≤ n ≤ 20 for the animation." },
  ],

  related: ["maximum-subarray"],
};
