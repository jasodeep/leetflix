import type { Problem } from "@/lib/types";
import { barsPanel, ptr, tones, varsPanel, v } from "@/lib/viz/builders";

import { go, py } from "./_helpers";

export const bestTimeToBuyAndSellStock: Problem = {
  id: 121,
  slug: "best-time-to-buy-and-sell-stock",
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  topics: ["Array", "Dynamic Programming"],
  blurb: "Buy low, sell high — but only in that order. A one-pass running minimum solves it.",

  statement: [
    {
      type: "p",
      text: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.",
    },
    {
      type: "p",
      text: "You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.",
    },
    {
      type: "p",
      text: "Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    },
  ],

  examples: [
    {
      input: { prices: "[7, 1, 5, 3, 6, 4]" },
      output: "5",
      explanation:
        "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 − 1 = 5. Buying at 7 and selling at 1 is not allowed because you must buy before you sell.",
      viz: [
        barsPanel("prices", "prices", [7, 1, 5, 3, 6, 4], {
          pointers: [ptr(1, "buy", "green"), ptr(4, "sell", "red")],
          tones: tones([1, "match"], [4, "result"]),
        }),
      ],
    },
    {
      input: { prices: "[7, 6, 4, 3, 1]" },
      output: "0",
      explanation: "Prices only fall. No transaction is done and the max profit is 0.",
      viz: [barsPanel("prices", "prices", [7, 6, 4, 3, 1])],
    },
  ],

  constraints: ["`1 <= prices.length <= 10^5`", "`0 <= prices[i] <= 10^4`"],

  insights: [
    { type: "h3", text: "Decoding the statement" },
    {
      type: "p",
      text: "Find indices `i < j` maximising `prices[j] − prices[i]`. The `i < j` constraint is the whole problem: without it you'd just take `max − min`. With it, the buy must happen *before* the sell — time flows one way.",
    },
    { type: "h3", text: "The key observation" },
    {
      type: "p",
      text: "Suppose you're standing on day `j` and have decided to sell today. Which day should you have bought on? Obviously the **cheapest day so far** — any other earlier day gives less profit. So for every candidate sell day the best buy day is fully determined: it's the running minimum of everything to the left.",
    },
    {
      type: "viz",
      caption:
        "Standing on day 4 (price 6): the cheapest earlier day is day 1 (price 1). Profit if we sell now = 5.",
      state: [
        barsPanel("prices", "prices", [7, 1, 5, 3, 6, 4], {
          pointers: [ptr(1, "min so far", "green"), ptr(4, "today", "red")],
          tones: tones([0, "dim"], [1, "match"], [2, "dim"], [3, "dim"], [4, "active"], [5, "dim"]),
        }),
        varsPanel("vars", "", [
          v("min_price", 1),
          v("profit today", "6 − 1 = 5", { tone: "result" }),
        ]),
      ],
    },
    {
      type: "p",
      text: "That turns a two-variable search (`i` and `j`) into a one-variable sweep over `j`, carrying two numbers: the minimum price seen so far and the best profit seen so far.",
    },
    { type: "h3", text: "Why this counts as dynamic programming" },
    {
      type: "p",
      text: "LeetCode tags it DP because `best[j] = max(best[j−1], prices[j] − min[j−1])` — each day's answer depends only on the previous day's summary. We just never materialise the arrays; two scalars carry the state. It's also a special case of Kadane's algorithm (Maximum Subarray) applied to the day-over-day price differences.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Common bug",
      text: "Initialising `best` to `prices[1] − prices[0]` or to `-∞` lets a negative profit escape. The problem says return 0 if no profit is possible, so `best` starts at 0.",
    },
  ],

  approaches: [
    {
      id: "brute-force",
      title: "Brute force — every buy/sell pair",
      kind: "brute-force",
      summary: "Try every i < j and keep the best difference.",
      intuition: [
        {
          type: "p",
          text: "Enumerate every pair of days with the buy strictly before the sell. It's O(n²) and times out at n = 10⁵, but it clarifies exactly what we're maximising.",
        },
      ],
      steps: [
        "For each buy day `i`…",
        "…for each later sell day `j`, track `max(best, prices[j] − prices[i])`.",
      ],
      complexity: { time: "O(n²)", space: "O(1)" },
      traceable: false,
      code: {
        python: {
          source: py`
            class Solution:
                def maxProfit(self, prices: list[int]) -> int:
                    best = 0
                    n = len(prices)
                    for i in range(n):
                        for j in range(i + 1, n):
                            best = max(best, prices[j] - prices[i])
                    return best
          `,
          markers: {},
        },
        go: {
          source: go`
            func maxProfit(prices []int) int {
                best := 0
                for i := 0; i < len(prices); i++ {
                    for j := i + 1; j < len(prices); j++ {
                        if profit := prices[j] - prices[i]; profit > best {
                            best = profit
                        }
                    }
                }
                return best
            }
          `,
          markers: {},
        },
      },
    },
    {
      id: "one-pass",
      title: "One pass with a running minimum",
      kind: "optimal",
      summary:
        "Sweep left to right; each day either lowers the minimum or tries to improve the best profit.",
      intuition: [
        {
          type: "p",
          text: "Carry `min_price` (cheapest day so far) and `best` (largest profit so far). On each day, if the price is a new low, it's a better place to buy — remember it. Otherwise, see what selling today at the recorded minimum would earn and keep the max.",
        },
        {
          type: "p",
          text: "A day can't be both a new minimum *and* a profitable sell (selling at the minimum yields ≤ 0), which is why the two branches are an `if / elif`.",
        },
      ],
      steps: [
        "`min_price = +∞`, `best = 0`.",
        "For each price `p`: if `p < min_price`, set `min_price = p`.",
        "Else if `p − min_price > best`, set `best = p − min_price`.",
        "Return `best`.",
      ],
      complexity: { time: "O(n)", space: "O(1)" },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def maxProfit(self, prices: list[int]) -> int:
                    min_price = float("inf")
                    best = 0
                    for p in prices:
                        if p < min_price:
                            min_price = p
                        elif p - min_price > best:
                            best = p - min_price
                    return best
          `,
          markers: {
            init: 'min_price = float("inf")',
            loop: "for p in prices",
            newmin: "if p < min_price",
            setmin: "min_price = p",
            profit: "elif p - min_price > best",
            setbest: "best = p - min_price",
            end: "return best",
          },
        },
        go: {
          source: go`
            func maxProfit(prices []int) int {
                minPrice := math.MaxInt
                best := 0
                for _, p := range prices {
                    if p < minPrice {
                        minPrice = p
                    } else if p-minPrice > best {
                        best = p - minPrice
                    }
                }
                return best
            }
          `,
          markers: {
            init: "minPrice := math.MaxInt",
            loop: "for _, p := range prices",
            newmin: "if p < minPrice",
            setmin: "minPrice = p",
            profit: "else if p-minPrice > best",
            setbest: "best = p - minPrice",
            end: "return best",
          },
        },
      },
    },
  ],

  inputs: [
    {
      name: "prices",
      label: "prices",
      type: "int[]",
      default: "[7, 1, 5, 3, 6, 4]",
      hint: "Non-negative prices work best for the bar chart.",
    },
  ],

  related: ["maximum-subarray"],
};
