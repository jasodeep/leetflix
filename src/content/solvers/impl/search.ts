import { go, py } from "@/content/problems/_helpers";
import { arrayPanel, ptr, tones, v, varsPanel } from "@/lib/viz/builders";
import { fmt, Recorder } from "@/lib/viz/recorder";

import type { Solver } from "../types";

export const searchInsertPosition: Solver = {
  id: "search-insert-position",
  slugs: ["search-insert-position"],
  label: "binary-search insert index",
  inputs: [
    { name: "nums", label: "nums (sorted)", type: "int[]", default: "[1, 3, 5, 6]" },
    { name: "target", label: "target", type: "int", default: "5" },
  ],
  examples: [
    { input: { nums: "[1, 3, 5, 6]", target: "5" }, output: "2" },
    { input: { nums: "[1, 3, 5, 6]", target: "2" }, output: "1" },
    { input: { nums: "[1, 3, 5, 6]", target: "7" }, output: "4" },
  ],
  approach: {
    id: "search-insert-position",
    title: "Binary search for the lower bound",
    kind: "optimal",
    summary:
      "Find the first index where `nums[i] >= target`. That is the found index, or where `target` would be inserted.",
    intuition: [
      {
        type: "p",
        text: "Same halving as binary search. When the range collapses, `lo` is the insertion point — including `n` when the target is larger than every value.",
      },
    ],
    steps: [
      "While `lo < hi`, probe `mid`.",
      "If `nums[mid] < target`, search the right half; else search the left (keeping `mid`).",
      "Return `lo`.",
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def searchInsert(self, nums: list[int], target: int) -> int:
                  lo, hi = 0, len(nums)
                  while lo < hi:
                      mid = (lo + hi) // 2
                      if nums[mid] < target:
                          lo = mid + 1
                      else:
                          hi = mid
                  return lo
        `,
        markers: {
          init: "lo, hi = 0, len(nums)",
          loop: "while lo < hi",
          mid: "mid = (lo + hi) // 2",
          right: "lo = mid + 1",
          left: "hi = mid",
          done: "return lo",
        },
      },
      go: {
        source: go`
          func searchInsert(nums []int, target int) int {
              lo, hi := 0, len(nums)
              for lo < hi {
                  mid := (lo + hi) / 2
                  if nums[mid] < target {
                      lo = mid + 1
                  } else {
                      hi = mid
                  }
              }
              return lo
          }
        `,
        markers: {
          init: "lo, hi := 0, len(nums)",
          loop: "for lo < hi",
          mid: "mid := (lo + hi) / 2",
          right: "lo = mid + 1",
          left: "hi = mid",
          done: "return lo",
        },
      },
    },
  },
  traces: {
    "search-insert-position": (input) => {
      const nums = input.nums as number[];
      const target = input.target as number;
      const rec = new Recorder();
      let lo = 0;
      let hi = nums.length;
      rec.record("init", `Lower-bound search for ${target}.`, [
        arrayPanel("nums", "nums", nums, { pointers: [ptr(0, "lo", "red")] }),
        varsPanel("vars", "", [v("target", target), v("lo", lo), v("hi", hi)]),
      ]);
      while (lo < hi) {
        rec.record("loop", `Range [${lo}, ${hi}).`, [
          arrayPanel("nums", "nums", nums, {
            pointers: [
              ptr(lo, "lo", "red"),
              ...(hi > 0 && hi <= nums.length
                ? [ptr(Math.min(hi, nums.length - 1), "hi", "blue")]
                : []),
            ],
          }),
        ]);
        const mid = Math.floor((lo + hi) / 2);
        rec.record("mid", `mid = ${mid}, value ${nums[mid]}.`, [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(mid, "mid", "green")],
            tones: tones([mid, "active"]),
          }),
        ]);
        if (nums[mid]! < target) {
          rec.record("right", "Too small — discard the left half.", [
            arrayPanel("nums", "nums", nums, { tones: tones([mid, "dim"]) }),
          ]);
          lo = mid + 1;
        } else {
          rec.record("left", "Keep mid; discard the right half.", [
            arrayPanel("nums", "nums", nums, { tones: tones([mid, "active"]) }),
          ]);
          hi = mid;
        }
      }
      return rec.done("done", `Insert / found index \`${lo}\`.`, [
        arrayPanel("nums", "nums", nums, {
          pointers: lo < nums.length ? [ptr(lo, "lo", "green")] : [],
        }),
        varsPanel("vars", "", [v("answer", lo, { tone: "result" })]),
      ]);
    },
  },
};

export const twoSumSorted: Solver = {
  id: "two-sum-ii-input-array-is-sorted",
  slugs: ["two-sum-ii-input-array-is-sorted"],
  label: "two-pointer two-sum (1-indexed)",
  inputs: [
    { name: "numbers", label: "numbers (sorted)", type: "int[]", default: "[2, 7, 11, 15]" },
    { name: "target", label: "target", type: "int", default: "9" },
  ],
  examples: [
    { input: { numbers: "[2, 7, 11, 15]", target: "9" }, output: "[1, 2]" },
    { input: { numbers: "[2, 3, 4]", target: "6" }, output: "[1, 3]" },
  ],
  approach: {
    id: "two-sum-ii-input-array-is-sorted",
    title: "Inward walk on a sorted array",
    kind: "optimal",
    summary:
      "The array is sorted. A too-small sum means advance `lo`; a too-big sum means retreat `hi`. Return 1-based indices.",
    intuition: [
      {
        type: "p",
        text: "Each comparison throws away an index forever, so the walk is linear. The problem asks for 1-based indices — add one at the end.",
      },
    ],
    steps: [
      "`lo = 0`, `hi = n−1`.",
      "Equal → return `[lo+1, hi+1]`. Too small → `lo++`. Too big → `hi--`.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def twoSum(self, numbers: list[int], target: int) -> list[int]:
                  lo, hi = 0, len(numbers) - 1
                  while lo < hi:
                      s = numbers[lo] + numbers[hi]
                      if s == target:
                          return [lo + 1, hi + 1]
                      if s < target:
                          lo += 1
                      else:
                          hi -= 1
                  return []
        `,
        markers: {
          init: "lo, hi = 0, len(numbers) - 1",
          loop: "while lo < hi",
          sum: "s = numbers[lo] + numbers[hi]",
          hit: "return [lo + 1, hi + 1]",
          grow: "lo += 1",
          shrink: "hi -= 1",
          miss: "return []",
        },
      },
      go: {
        source: go`
          func twoSum(numbers []int, target int) []int {
              lo, hi := 0, len(numbers)-1
              for lo < hi {
                  s := numbers[lo] + numbers[hi]
                  if s == target {
                      return []int{lo + 1, hi + 1}
                  }
                  if s < target {
                      lo++
                  } else {
                      hi--
                  }
              }
              return nil
          }
        `,
        markers: {
          init: "lo, hi := 0, len(numbers)-1",
          loop: "for lo < hi",
          sum: "s := numbers[lo] + numbers[hi]",
          hit: "return []int{lo + 1, hi + 1}",
          grow: "lo++",
          shrink: "hi--",
          miss: "return nil",
        },
      },
    },
  },
  traces: {
    "two-sum-ii-input-array-is-sorted": (input) => {
      const numbers = input.numbers as number[];
      const target = input.target as number;
      const rec = new Recorder();
      let lo = 0;
      let hi = numbers.length - 1;
      rec.record("init", "Sorted, so the pair is found by walking inward. Answers are 1-based.", [
        arrayPanel("numbers", "numbers", numbers, {
          pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")],
        }),
        varsPanel("vars", "", [v("target", target)]),
      ]);
      while (lo < hi) {
        rec.record("loop", `Range [${lo}, ${hi}].`, [
          arrayPanel("numbers", "numbers", numbers, {
            pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")],
            tones: tones([lo, "active"], [hi, "active"]),
          }),
        ]);
        const s = numbers[lo]! + numbers[hi]!;
        rec.record("sum", `${numbers[lo]} + ${numbers[hi]} = ${s}.`, [
          varsPanel("vars", "", [v("target", target), v("s", s)]),
        ]);
        if (s === target) {
          const ans = [lo + 1, hi + 1];
          return rec.done("hit", `Return \`${fmt(ans)}\`.`, [
            arrayPanel("numbers", "numbers", numbers, {
              tones: tones([lo, "result"], [hi, "result"]),
            }),
            varsPanel("vars", "", [v("answer", fmt(ans), { tone: "result" })]),
          ]);
        }
        if (s < target) {
          rec.record("grow", "Sum too small — advance `lo`.", [
            arrayPanel("numbers", "numbers", numbers, { pointers: [ptr(lo, "lo", "red")] }),
          ]);
          lo += 1;
        } else {
          rec.record("shrink", "Sum too big — retreat `hi`.", [
            arrayPanel("numbers", "numbers", numbers, { pointers: [ptr(hi, "hi", "blue")] }),
          ]);
          hi -= 1;
        }
      }
      return rec.done("miss", "No pair — return `[]`.", [
        varsPanel("vars", "", [v("answer", "[]", { tone: "danger" })]),
      ]);
    },
  },
};
