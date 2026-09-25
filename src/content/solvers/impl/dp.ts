import { go, py } from "@/content/problems/_helpers";
import { arrayPanel, ptr, tones, v, varsPanel } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";

import type { Solver } from "../types";

export const houseRobber: Solver = {
  id: "house-robber",
  slugs: ["house-robber"],
  label: "rob / skip DP",
  inputs: [{ name: "nums", label: "nums", type: "int[]", default: "[2, 7, 9, 3, 1]" }],
  examples: [
    { input: { nums: "[1, 2, 3, 1]" }, output: "4" },
    { input: { nums: "[2, 7, 9, 3, 1]" }, output: "12" },
  ],
  approach: {
    id: "house-robber",
    title: "Take or skip, two rolling cells",
    kind: "optimal",
    summary:
      "At house `i` you either skip it (`prev`) or take it plus the best from two houses back (`prev2 + nums[i]`). Adjacent houses cannot both be robbed.",
    intuition: [
      {
        type: "p",
        text: "`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`. Two variables replace the array.",
      },
    ],
    steps: [
      "`prev2 = 0`, `prev = 0`.",
      "For each house: `prev2, prev = prev, max(prev, prev2 + x)`.",
      "Return `prev`.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def rob(self, nums: list[int]) -> int:
                  prev2 = prev = 0
                  for x in nums:
                      prev2, prev = prev, max(prev, prev2 + x)
                  return prev
        `,
        markers: {
          init: "prev2 = prev = 0",
          loop: "for x in nums",
          step: "prev2, prev = prev, max(prev, prev2 + x)",
          done: "return prev",
        },
      },
      go: {
        source: go`
          func rob(nums []int) int {
              prev2, prev := 0, 0
              for _, x := range nums {
                  if take := prev2 + x; take > prev {
                      prev2, prev = prev, take
                  } else {
                      prev2 = prev
                  }
              }
              return prev
          }
        `,
        markers: {
          init: "prev2, prev := 0, 0",
          loop: "for _, x := range nums",
          step: "prev2, prev = prev, take",
          done: "return prev",
        },
      },
    },
  },
  traces: {
    "house-robber": (input) => {
      const nums = input.nums as number[];
      const rec = new Recorder();
      let prev2 = 0;
      let prev = 0;
      rec.record(
        "init",
        "Best-so-far with the previous house skipped (`prev2`) or taken (`prev`).",
        [arrayPanel("nums", "nums", nums), varsPanel("vars", "", [v("prev2", 0), v("prev", 0)])],
      );
      for (let i = 0; i < nums.length; i++) {
        const x = nums[i]!;
        rec.record("loop", `House ${i} has ${x}.`, [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
        ]);
        const take = prev2 + x;
        const next = Math.max(prev, take);
        prev2 = prev;
        prev = next;
        rec.record("step", `Take ${take} vs skip ${prev2} → ${prev}.`, [
          varsPanel("vars", "", [v("prev2", prev2), v("prev", prev, { changed: true })]),
        ]);
      }
      return rec.done("done", `Return \`${prev}\`.`, [
        varsPanel("vars", "", [v("answer", prev, { tone: "result" })]),
      ]);
    },
  },
};

export const coinChange: Solver = {
  id: "coin-change",
  slugs: ["coin-change"],
  label: "unbounded knapsack coins",
  inputs: [
    { name: "coins", label: "coins", type: "int[]", default: "[1, 2, 5]" },
    { name: "amount", label: "amount", type: "int", default: "11" },
  ],
  examples: [
    { input: { coins: "[1, 2, 5]", amount: "11" }, output: "3" },
    { input: { coins: "[2]", amount: "3" }, output: "-1" },
  ],
  approach: {
    id: "coin-change",
    title: "Fewest coins for each amount",
    kind: "optimal",
    summary:
      "`dp[x]` is the fewest coins that sum to `x`. Try every coin: `dp[x] = min(dp[x], dp[x - coin] + 1)`.",
    intuition: [
      {
        type: "p",
        text: "This is unbounded knapsack. Amount 11 with {1,2,5} bottoms out at three 5+5+1 coins.",
      },
    ],
    steps: [
      "`dp[0] = 0`, everything else ∞.",
      "For each amount, try each coin that fits.",
      "Return `dp[amount]`, or −1 if it stayed ∞.",
    ],
    complexity: { time: "O(amount · k)", space: "O(amount)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def coinChange(self, coins: list[int], amount: int) -> int:
                  inf = amount + 1
                  dp = [inf] * (amount + 1)
                  dp[0] = 0
                  for x in range(1, amount + 1):
                      for c in coins:
                          if c <= x:
                              dp[x] = min(dp[x], dp[x - c] + 1)
                  return dp[amount] if dp[amount] < inf else -1
        `,
        markers: {
          init: "dp[0] = 0",
          loop: "for x in range(1, amount + 1)",
          relax: "dp[x] = min(dp[x], dp[x - c] + 1)",
          done: "return dp[amount] if dp[amount] < inf else -1",
        },
      },
      go: {
        source: go`
          func coinChange(coins []int, amount int) int {
              inf := amount + 1
              dp := make([]int, amount+1)
              for i := range dp {
                  dp[i] = inf
              }
              dp[0] = 0
              for x := 1; x <= amount; x++ {
                  for _, c := range coins {
                      if c <= x && dp[x-c]+1 < dp[x] {
                          dp[x] = dp[x-c] + 1
                      }
                  }
              }
              if dp[amount] == inf {
                  return -1
              }
              return dp[amount]
          }
        `,
        markers: {
          init: "dp[0] = 0",
          loop: "for x := 1; x <= amount; x++",
          relax: "dp[x] = dp[x-c] + 1",
          done: "return dp[amount]",
        },
      },
    },
  },
  traces: {
    "coin-change": (input) => {
      const coins = input.coins as number[];
      const amount = input.amount as number;
      const rec = new Recorder();
      const inf = amount + 1;
      const dp = Array.from({ length: amount + 1 }, () => inf);
      dp[0] = 0;
      rec.record("init", "`dp[0] = 0`. Everything else starts unreachable.", [
        arrayPanel(
          "dp",
          "dp",
          dp.map((x) => (x >= inf ? "∞" : x)),
        ),
        arrayPanel("coins", "coins", coins),
      ]);
      for (let x = 1; x <= amount; x++) {
        rec.record("loop", `Fill amount ${x}.`, [
          arrayPanel(
            "dp",
            "dp",
            dp.map((v) => (v >= inf ? "∞" : v)),
            { pointers: [ptr(x, "x", "red")] },
          ),
        ]);
        for (const c of coins) {
          if (c <= x) {
            const cand = dp[x - c]! + 1;
            if (cand < dp[x]!) {
              dp[x] = cand;
              rec.record("relax", `Coin ${c}: dp[${x}] = ${cand}.`, [
                arrayPanel(
                  "dp",
                  "dp",
                  dp.map((v) => (v >= inf ? "∞" : v)),
                  { tones: tones([x, "result"]) },
                ),
              ]);
            }
          }
        }
      }
      const ans = dp[amount]! >= inf ? -1 : dp[amount]!;
      return rec.done("done", `Return \`${ans}\`.`, [
        varsPanel("vars", "", [v("answer", ans, { tone: ans === -1 ? "danger" : "result" })]),
      ]);
    },
  },
};

export const fibonacciNumber: Solver = {
  id: "fibonacci-number",
  slugs: ["fibonacci-number"],
  label: "Fibonacci roll",
  inputs: [{ name: "n", label: "n", type: "int", default: "4" }],
  examples: [
    { input: { n: "2" }, output: "1" },
    { input: { n: "3" }, output: "2" },
    { input: { n: "4" }, output: "3" },
  ],
  approach: {
    id: "fibonacci-number",
    title: "Two rolling variables",
    kind: "optimal",
    summary: "`F(0) = 0`, `F(1) = 1`, `F(n) = F(n-1) + F(n-2)`. Roll a pair forward `n` times.",
    intuition: [
      {
        type: "p",
        text: "You only need the last two values. Recursing from the top would recompute the same suffixes.",
      },
    ],
    steps: [
      "If `n < 2`, return `n`.",
      "`a, b = 0, 1`; then `a, b = b, a+b` for `n-1` steps.",
      "Return `b`.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def fib(self, n: int) -> int:
                  if n < 2:
                      return n
                  a, b = 0, 1
                  for _ in range(2, n + 1):
                      a, b = b, a + b
                  return b
        `,
        markers: {
          base: "if n < 2",
          init: "a, b = 0, 1",
          loop: "for _ in range(2, n + 1)",
          step: "a, b = b, a + b",
          done: "return b",
        },
      },
      go: {
        source: go`
          func fib(n int) int {
              if n < 2 {
                  return n
              }
              a, b := 0, 1
              for i := 2; i <= n; i++ {
                  a, b = b, a+b
              }
              return b
          }
        `,
        markers: {
          base: "if n < 2",
          init: "a, b := 0, 1",
          loop: "for i := 2; i <= n; i++",
          step: "a, b = b, a+b",
          done: "return b",
        },
      },
    },
  },
  traces: {
    "fibonacci-number": (input) => {
      const n = input.n as number;
      const rec = new Recorder();
      if (n < 2) {
        rec.record("base", `F(${n}) is the base case.`, [varsPanel("vars", "", [v("n", n)])]);
        return rec.done("base", `Return \`${n}\`.`, [
          varsPanel("vars", "", [v("answer", n, { tone: "result" })]),
        ]);
      }
      let a = 0;
      let b = 1;
      const row = [0, 1];
      rec.record("init", "`F(0) = 0`, `F(1) = 1`.", [
        arrayPanel("F", "F", row),
        varsPanel("vars", "", [v("a", a), v("b", b)]),
      ]);
      for (let i = 2; i <= n; i++) {
        rec.record("loop", `Compute F(${i}).`, [
          arrayPanel("F", "F", [...row, "?"], { pointers: [ptr(i, "i", "red")] }),
        ]);
        const next = a + b;
        a = b;
        b = next;
        row.push(b);
        rec.record("step", `F(${i}) = ${b}.`, [
          arrayPanel("F", "F", row, { tones: tones([i, "result"]) }),
        ]);
      }
      return rec.done("done", `Return \`${b}\`.`, [
        varsPanel("vars", "", [v("answer", b, { tone: "result" })]),
      ]);
    },
  },
};
