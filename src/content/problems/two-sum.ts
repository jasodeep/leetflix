import type { Problem } from "@/lib/types";
import { arrayPanel, ptr, tones, varsPanel, v } from "@/lib/viz/builders";

import { go, py } from "./_helpers";

export const twoSum: Problem = {
  id: 1,
  slug: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  topics: ["Array", "Hash Table"],
  blurb: "The problem every interview loop opens with. One pass, one hash map, done.",

  statement: [
    {
      type: "p",
      text: "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`.",
    },
    {
      type: "p",
      text: "You may assume that each input has **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.",
    },
  ],

  examples: [
    {
      input: { nums: "[2, 7, 11, 15]", target: "9" },
      output: "[0, 1]",
      explanation: "Because `nums[0] + nums[1] == 9`, we return `[0, 1]`.",
      viz: [
        arrayPanel("nums", "nums", [2, 7, 11, 15], {
          tones: tones([0, "result"], [1, "result"]),
          pointers: [ptr(0, "i", "green"), ptr(1, "j", "green")],
        }),
      ],
    },
    {
      input: { nums: "[3, 2, 4]", target: "6" },
      output: "[1, 2]",
      explanation:
        "`3 + 3` would also be 6, but that reuses index 0 twice — the rules forbid it. `2 + 4` is the only valid pair.",
      viz: [
        arrayPanel("nums", "nums", [3, 2, 4], {
          tones: tones([0, "dim"], [1, "result"], [2, "result"]),
        }),
      ],
    },
    {
      input: { nums: "[3, 3]", target: "6" },
      output: "[0, 1]",
      explanation: "Duplicate *values* are fine — they live at different *indices*.",
    },
  ],

  constraints: [
    "`2 <= nums.length <= 10^4`",
    "`-10^9 <= nums[i] <= 10^9`",
    "`-10^9 <= target <= 10^9`",
    "Only one valid answer exists.",
  ],

  followUp: "Can you come up with an algorithm that is less than O(n²) time complexity?",

  insights: [
    { type: "h3", text: "What is actually being asked?" },
    {
      type: "p",
      text: "Strip the story away and the question is: *for some element `x`, does `target - x` also exist in the array (at a different position)?* We're returning **positions**, not values — that detail drives the whole design, because whatever structure we use to look things up must remember where each value came from.",
    },
    { type: "h3", text: "The complement reframing" },
    {
      type: "p",
      text: "Naively we'd check every pair `(i, j)` — that's `n(n-1)/2` comparisons. But notice that once we fix `x = nums[i]`, there is only **one** value that could possibly pair with it: `need = target - x`. So the question at each index collapses from *“which of the other n-1 numbers works?”* to *“have I seen exactly `need` before?”*",
    },
    {
      type: "viz",
      caption:
        "Fix x = 11. The only partner that can work is 9 − 11 = −2. There's no −2, so move on.",
      state: [
        arrayPanel("nums", "nums", [2, 7, 11, 15], {
          pointers: [ptr(2, "x", "red")],
          tones: tones([2, "active"]),
        }),
        varsPanel("vars", "", [v("target", 9), v("need = target − x", -2, { tone: "danger" })]),
      ],
    },
    { type: "h3", text: "Why a hash map, and why only one pass" },
    {
      type: "p",
      text: "A hash map answers *“have I seen this value, and where?”* in O(1) expected time. Crucially, we only insert `x` **after** checking for its complement. That single ordering decision buys two guarantees for free: we never pair an element with itself, and every pair is considered exactly once (when its *second* member is reached).",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Interview signal",
      text: "Mentioning *why* insertion happens after the lookup — not just *that* you use a dict — is what separates a memorised answer from an understood one.",
    },
    {
      type: "callout",
      tone: "info",
      title: "Sorted-array variant",
      text: "If the array were sorted (LeetCode 167), two pointers from both ends give O(1) extra space. Sorting an unsorted array first costs O(n log n) and scrambles indices, so for this problem the hash map wins.",
    },
  ],

  approaches: [
    {
      id: "brute-force",
      title: "Brute force — check every pair",
      kind: "brute-force",
      summary:
        "Two nested loops; the inner one starts at i+1 so each unordered pair is tested once.",
      intuition: [
        {
          type: "p",
          text: "The most literal translation of the statement. It's correct, easy to reason about, and a fine place to start in an interview before you optimise — just don't stop here.",
        },
      ],
      steps: [
        "For each index `i` from 0 to n−1…",
        "…for each index `j` from i+1 to n−1, check if `nums[i] + nums[j] == target`.",
        "Return `[i, j]` on the first match.",
      ],
      complexity: {
        time: "O(n²)",
        space: "O(1)",
        notes: "n(n−1)/2 pair checks in the worst case; no extra memory.",
      },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def twoSum(self, nums: list[int], target: int) -> list[int]:
                    n = len(nums)
                    for i in range(n):
                        for j in range(i + 1, n):
                            if nums[i] + nums[j] == target:
                                return [i, j]
                    return []  # unreachable: exactly one solution is guaranteed
          `,
          markers: {
            outer: "for i in range(n)",
            inner: "for j in range(i + 1, n)",
            check: "if nums[i] + nums[j] == target",
            found: "return [i, j]",
            none: "return []",
          },
        },
        go: {
          source: go`
            func twoSum(nums []int, target int) []int {
                n := len(nums)
                for i := 0; i < n; i++ {
                    for j := i + 1; j < n; j++ {
                        if nums[i]+nums[j] == target {
                            return []int{i, j}
                        }
                    }
                }
                return nil // unreachable: exactly one solution is guaranteed
            }
          `,
          markers: {
            outer: "for i := 0; i < n; i++",
            inner: "for j := i + 1; j < n; j++",
            check: "if nums[i]+nums[j] == target",
            found: "return []int{i, j}",
            none: "return nil",
          },
        },
      },
    },
    {
      id: "hash-map",
      title: "One-pass hash map",
      kind: "optimal",
      summary: "Look up the complement before inserting the current value. One pass, O(n).",
      intuition: [
        {
          type: "p",
          text: "Walk the array once. At each element ask the map *“is `target − x` already here?”*. If yes, the stored index plus the current one is the answer. If not, record `x → i` and keep going.",
        },
        {
          type: "p",
          text: "Because we check *before* we insert, the map only ever contains elements strictly to the **left** of the current index, which is exactly the set of legal partners.",
        },
      ],
      steps: [
        "Create an empty map `seen` from value → index.",
        "For each `(i, x)` compute `need = target − x`.",
        "If `need` is in `seen`, return `[seen[need], i]`.",
        "Otherwise store `seen[x] = i` and continue.",
      ],
      complexity: {
        time: "O(n)",
        space: "O(n)",
        notes: "Each element is hashed at most twice (one lookup, one insert).",
      },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def twoSum(self, nums: list[int], target: int) -> list[int]:
                    seen: dict[int, int] = {}  # value -> index
                    for i, x in enumerate(nums):
                        need = target - x
                        if need in seen:
                            return [seen[need], i]
                        seen[x] = i
                    return []  # unreachable: exactly one solution is guaranteed
          `,
          markers: {
            init: "seen: dict[int, int] = {}",
            loop: "for i, x in enumerate(nums)",
            need: "need = target - x",
            check: "if need in seen",
            found: "return [seen[need], i]",
            store: "seen[x] = i",
            none: "return []",
          },
        },
        go: {
          source: go`
            func twoSum(nums []int, target int) []int {
                seen := make(map[int]int, len(nums)) // value -> index
                for i, x := range nums {
                    need := target - x
                    if j, ok := seen[need]; ok {
                        return []int{j, i}
                    }
                    seen[x] = i
                }
                return nil // unreachable: exactly one solution is guaranteed
            }
          `,
          markers: {
            init: "seen := make(map[int]int",
            loop: "for i, x := range nums",
            need: "need := target - x",
            check: "if j, ok := seen[need]; ok",
            found: "return []int{j, i}",
            store: "seen[x] = i",
            none: "return nil",
          },
        },
      },
    },
  ],

  inputs: [
    { name: "nums", label: "nums", type: "int[]", default: "[2, 7, 11, 15]" },
    { name: "target", label: "target", type: "int", default: "9" },
  ],

  related: ["container-with-most-water", "longest-substring-without-repeating-characters"],
};
