import { go, py } from "@/content/problems/_helpers";
import { arrayPanel, ptr, tones, v, varsPanel } from "@/lib/viz/builders";
import { fmt, Recorder } from "@/lib/viz/recorder";

import type { Solver } from "../types";

export const plusOne: Solver = {
  id: "plus-one",
  slugs: ["plus-one"],
  label: "plus one with carry",
  inputs: [{ name: "digits", label: "digits", type: "int[]", default: "[1, 2, 3]" }],
  examples: [
    { input: { digits: "[1, 2, 3]" }, output: "[1, 2, 4]" },
    { input: { digits: "[9, 9]" }, output: "[1, 0, 0]" },
  ],
  approach: {
    id: "plus-one",
    title: "Add one from the right",
    kind: "optimal",
    summary:
      "Walk from the last digit. A 9 becomes 0 and the carry keeps going; anything else increments and we stop. A leftover carry prepends 1.",
    intuition: [
      { type: "p", text: "Same addition-on-paper as Add Two Numbers, but the addend is always 1." },
    ],
    steps: [
      "From the right, if the digit is 9 set it to 0 and continue.",
      "Otherwise increment and return.",
      "If every digit was 9, prepend 1.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def plusOne(self, digits: list[int]) -> list[int]:
                  out = digits[:]
                  for i in range(len(out) - 1, -1, -1):
                      if out[i] < 9:
                          out[i] += 1
                          return out
                      out[i] = 0
                  return [1] + out
        `,
        markers: {
          init: "out = digits[:]",
          loop: "for i in range(len(out) - 1, -1, -1)",
          bump: "out[i] += 1",
          hit: "return out",
          nine: "out[i] = 0",
          extra: "return [1] + out",
        },
      },
      go: {
        source: go`
          func plusOne(digits []int) []int {
              out := append([]int{}, digits...)
              for i := len(out) - 1; i >= 0; i-- {
                  if out[i] < 9 {
                      out[i]++
                      return out
                  }
                  out[i] = 0
              }
              return append([]int{1}, out...)
          }
        `,
        markers: {
          init: "out := append([]int{}, digits...)",
          loop: "for i := len(out) - 1; i >= 0; i--",
          bump: "out[i]++",
          hit: "return out",
          nine: "out[i] = 0",
          extra: "return append([]int{1}, out...)",
        },
      },
    },
  },
  traces: {
    "plus-one": (input) => {
      const digits = input.digits as number[];
      const rec = new Recorder();
      const out = [...digits];
      rec.record("init", "Copy the digits. We add one from the right.", [
        arrayPanel("out", "digits", out),
      ]);
      for (let i = out.length - 1; i >= 0; i--) {
        rec.record("loop", `Look at \`${out[i]}\`.`, [
          arrayPanel("out", "digits", out, {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
        ]);
        if (out[i]! < 9) {
          out[i]! += 1;
          rec.record("bump", `Increment to \`${out[i]}\`.`, [
            arrayPanel("out", "digits", out, { tones: tones([i, "result"]) }),
          ]);
          return rec.done("hit", `Return \`${fmt(out)}\`.`, [
            varsPanel("vars", "", [v("answer", fmt(out), { tone: "result" })]),
          ]);
        }
        out[i] = 0;
        rec.record("nine", "9 + 1 = 10 — write 0, keep the carry.", [
          arrayPanel("out", "digits", out, { tones: tones([i, "dim"]) }),
        ]);
      }
      const extra = [1, ...out];
      return rec.done("extra", `Leftover carry — return \`${fmt(extra)}\`.`, [
        arrayPanel("out", "digits", extra, { tones: tones([0, "result"]) }),
        varsPanel("vars", "", [v("answer", fmt(extra), { tone: "result" })]),
      ]);
    },
  },
};

export const removeDuplicates: Solver = {
  id: "remove-duplicates-from-sorted-array",
  slugs: ["remove-duplicates-from-sorted-array"],
  label: "slow pointer unique prefix",
  inputs: [
    {
      name: "nums",
      label: "nums (sorted)",
      type: "int[]",
      default: "[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]",
    },
  ],
  examples: [
    { input: { nums: "[1, 1, 2]" }, output: "2" },
    { input: { nums: "[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]" }, output: "5" },
  ],
  approach: {
    id: "remove-duplicates-from-sorted-array",
    title: "Write uniques into the prefix",
    kind: "optimal",
    summary:
      "Because the array is sorted, duplicates are adjacent. `w` is the next write slot; a new value gets copied there.",
    intuition: [
      {
        type: "p",
        text: "The first `w` slots become the unique prefix. The rest of the array is junk the caller ignores.",
      },
    ],
    steps: [
      "Start `w = 1` (the first value is already unique).",
      "For each later `x`, if it differs from `nums[w-1]`, write it at `w` and increment `w`.",
      "Return `w`.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def removeDuplicates(self, nums: list[int]) -> int:
                  if not nums:
                      return 0
                  w = 1
                  for i in range(1, len(nums)):
                      if nums[i] != nums[w - 1]:
                          nums[w] = nums[i]
                          w += 1
                  return w
        `,
        markers: {
          empty: "return 0",
          init: "w = 1",
          loop: "for i in range(1, len(nums))",
          write: "nums[w] = nums[i]",
          done: "return w",
        },
      },
      go: {
        source: go`
          func removeDuplicates(nums []int) int {
              if len(nums) == 0 {
                  return 0
              }
              w := 1
              for i := 1; i < len(nums); i++ {
                  if nums[i] != nums[w-1] {
                      nums[w] = nums[i]
                      w++
                  }
              }
              return w
          }
        `,
        markers: {
          empty: "return 0",
          init: "w := 1",
          loop: "for i := 1; i < len(nums); i++",
          write: "nums[w] = nums[i]",
          done: "return w",
        },
      },
    },
  },
  traces: {
    "remove-duplicates-from-sorted-array": (input) => {
      const nums = [...(input.nums as number[])];
      const rec = new Recorder();
      if (nums.length === 0) {
        return rec.done("empty", "Empty — return `0`.", [varsPanel("vars", "", [v("answer", 0)])]);
      }
      let w = 1;
      rec.record("init", "First value is already the unique prefix.", [
        arrayPanel("nums", "nums", nums, { pointers: [ptr(0, "w", "green")] }),
        varsPanel("vars", "", [v("w", w)]),
      ]);
      for (let i = 1; i < nums.length; i++) {
        rec.record("loop", `Read \`${nums[i]}\`.`, [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(i, "i", "red"), ptr(w, "w", "green")],
            tones: tones([i, "active"]),
            window: [0, w - 1],
          }),
        ]);
        if (nums[i] !== nums[w - 1]) {
          nums[w] = nums[i]!;
          rec.record("write", `New unique — write at ${w}.`, [
            arrayPanel("nums", "nums", nums, { tones: tones([w, "result"]) }),
          ]);
          w += 1;
        }
      }
      return rec.done("done", `Unique prefix length \`${w}\`.`, [
        arrayPanel("nums", "nums", nums, { window: [0, w - 1] }),
        varsPanel("vars", "", [v("answer", w, { tone: "result" })]),
      ]);
    },
  },
};

export const moveZeroes: Solver = {
  id: "move-zeroes",
  slugs: ["move-zeroes"],
  label: "compact non-zeroes",
  inputs: [{ name: "nums", label: "nums", type: "int[]", default: "[0, 1, 0, 3, 12]" }],
  examples: [
    { input: { nums: "[0, 1, 0, 3, 12]" }, output: "[1, 3, 12, 0, 0]" },
    { input: { nums: "[0]" }, output: "[0]" },
  ],
  approach: {
    id: "move-zeroes",
    title: "Write non-zeroes, then fill zeros",
    kind: "optimal",
    summary: "`w` is the next free slot. Copy every non-zero forward, then zero out the tail.",
    intuition: [
      {
        type: "p",
        text: "Relative order of non-zeroes is preserved because we copy them in the order we see them.",
      },
    ],
    steps: [
      "Scan left to right; write each non-zero at `w` and increment `w`.",
      "Fill `nums[w:]` with zeros.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def moveZeroes(self, nums: list[int]) -> list[int]:
                  w = 0
                  for x in nums:
                      if x != 0:
                          nums[w] = x
                          w += 1
                  for i in range(w, len(nums)):
                      nums[i] = 0
                  return nums
        `,
        markers: {
          init: "w = 0",
          write: "nums[w] = x",
          fill: "nums[i] = 0",
          done: "return nums",
        },
      },
      go: {
        source: go`
          func moveZeroes(nums []int) []int {
              w := 0
              for _, x := range nums {
                  if x != 0 {
                      nums[w] = x
                      w++
                  }
              }
              for i := w; i < len(nums); i++ {
                  nums[i] = 0
              }
              return nums
          }
        `,
        markers: {
          init: "w := 0",
          write: "nums[w] = x",
          fill: "nums[i] = 0",
          done: "return nums",
        },
      },
    },
  },
  traces: {
    "move-zeroes": (input) => {
      const nums = [...(input.nums as number[])];
      const rec = new Recorder();
      let w = 0;
      rec.record("init", "Write non-zeroes into the prefix, then zero the tail.", [
        arrayPanel("nums", "nums", nums),
        varsPanel("vars", "", [v("w", 0)]),
      ]);
      for (let i = 0; i < nums.length; i++) {
        const x = nums[i]!;
        if (x !== 0) {
          nums[w] = x;
          rec.record("write", `Write \`${x}\` at ${w}.`, [
            arrayPanel("nums", "nums", nums, {
              pointers: [ptr(i, "i", "red"), ptr(w, "w", "green")],
              tones: tones([w, "result"]),
            }),
          ]);
          w += 1;
        }
      }
      for (let i = w; i < nums.length; i++) {
        nums[i] = 0;
        rec.record("fill", `Zero out index ${i}.`, [
          arrayPanel("nums", "nums", nums, { tones: tones([i, "dim"]) }),
        ]);
      }
      return rec.done("done", `Return \`${fmt(nums)}\`.`, [
        arrayPanel("nums", "nums", nums),
        varsPanel("vars", "", [v("answer", fmt(nums), { tone: "result" })]),
      ]);
    },
  },
};

export const productExceptSelf: Solver = {
  id: "product-of-array-except-self",
  slugs: ["product-of-array-except-self"],
  label: "prefix × suffix products",
  inputs: [{ name: "nums", label: "nums", type: "int[]", default: "[1, 2, 3, 4]" }],
  examples: [
    { input: { nums: "[1, 2, 3, 4]" }, output: "[24, 12, 8, 6]" },
    { input: { nums: "[-1, 1, 0, -3, 3]" }, output: "[0, 0, 9, 0, 0]" },
  ],
  approach: {
    id: "product-of-array-except-self",
    title: "Prefix pass, then suffix pass",
    kind: "optimal",
    summary:
      "`out[i]` is (product of everything left of i) × (product of everything right of i). Two linear sweeps, no division.",
    intuition: [
      {
        type: "p",
        text: "A left-to-right pass writes prefix products. A right-to-left pass multiplies in the suffix products.",
      },
    ],
    steps: [
      "Seed `out` with prefix products (`out[0] = 1`).",
      "Walk right-to-left with a running suffix product and multiply into `out`.",
    ],
    complexity: { time: "O(n)", space: "O(1)", notes: "Output array does not count." },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def productExceptSelf(self, nums: list[int]) -> list[int]:
                  n = len(nums)
                  out = [1] * n
                  pref = 1
                  for i in range(n):
                      out[i] = pref
                      pref *= nums[i]
                  suff = 1
                  for i in range(n - 1, -1, -1):
                      out[i] *= suff
                      suff *= nums[i]
                  return out
        `,
        markers: {
          init: "out = [1] * n",
          pref: "out[i] = pref",
          suff: "out[i] *= suff",
          done: "return out",
        },
      },
      go: {
        source: go`
          func productExceptSelf(nums []int) []int {
              n := len(nums)
              out := make([]int, n)
              pref := 1
              for i := 0; i < n; i++ {
                  out[i] = pref
                  pref *= nums[i]
              }
              suff := 1
              for i := n - 1; i >= 0; i-- {
                  out[i] *= suff
                  suff *= nums[i]
              }
              return out
          }
        `,
        markers: {
          init: "out := make([]int, n)",
          pref: "out[i] = pref",
          suff: "out[i] *= suff",
          done: "return out",
        },
      },
    },
  },
  traces: {
    "product-of-array-except-self": (input) => {
      const nums = input.nums as number[];
      const rec = new Recorder();
      const n = nums.length;
      const out = Array.from({ length: n }, () => 1);
      rec.record("init", "`out[i]` starts as 1. First pass writes prefixes.", [
        arrayPanel("nums", "nums", nums),
        arrayPanel("out", "out", out),
      ]);
      let pref = 1;
      for (let i = 0; i < n; i++) {
        out[i] = pref;
        rec.record("pref", `out[${i}] = prefix ${pref}.`, [
          arrayPanel("out", "out", out, {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
        ]);
        pref *= nums[i]!;
      }
      let suff = 1;
      for (let i = n - 1; i >= 0; i--) {
        out[i]! *= suff;
        rec.record("suff", `Multiply suffix ${suff} → out[${i}] = ${out[i]}.`, [
          arrayPanel("out", "out", out, {
            pointers: [ptr(i, "i", "blue")],
            tones: tones([i, "result"]),
          }),
        ]);
        suff *= nums[i]!;
      }
      return rec.done("done", `Return \`${fmt(out)}\`.`, [
        arrayPanel("out", "out", out),
        varsPanel("vars", "", [v("answer", fmt(out), { tone: "result" })]),
      ]);
    },
  },
};

export const majorityElement: Solver = {
  id: "majority-element",
  slugs: ["majority-element"],
  label: "Boyer–Moore vote",
  inputs: [{ name: "nums", label: "nums", type: "int[]", default: "[2, 2, 1, 1, 1, 2, 2]" }],
  examples: [
    { input: { nums: "[3, 2, 3]" }, output: "3" },
    { input: { nums: "[2, 2, 1, 1, 1, 2, 2]" }, output: "2" },
  ],
  approach: {
    id: "majority-element",
    title: "Boyer–Moore majority vote",
    kind: "optimal",
    summary:
      "Keep a candidate and a count. Matching values increment the count; mismatches decrement. When the count hits 0, pick a new candidate. The majority survives.",
    intuition: [
      {
        type: "p",
        text: "Every minority vote cancels one majority vote. Because the majority appears > n/2 times, it cannot be cancelled away.",
      },
    ],
    steps: [
      "Start with no candidate.",
      "For each `x`: if count is 0, `x` becomes the candidate; then ±1 the count.",
      "Return the candidate.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def majorityElement(self, nums: list[int]) -> int:
                  cand = 0
                  count = 0
                  for x in nums:
                      if count == 0:
                          cand = x
                      count += 1 if x == cand else -1
                  return cand
        `,
        markers: {
          init: "count = 0",
          loop: "for x in nums",
          pick: "cand = x",
          done: "return cand",
        },
      },
      go: {
        source: go`
          func majorityElement(nums []int) int {
              cand, count := 0, 0
              for _, x := range nums {
                  if count == 0 {
                      cand = x
                  }
                  if x == cand {
                      count++
                  } else {
                      count--
                  }
              }
              return cand
          }
        `,
        markers: {
          init: "cand, count := 0, 0",
          loop: "for _, x := range nums",
          pick: "cand = x",
          done: "return cand",
        },
      },
    },
  },
  traces: {
    "majority-element": (input) => {
      const nums = input.nums as number[];
      const rec = new Recorder();
      let cand = 0;
      let count = 0;
      rec.record("init", "No candidate yet. Majority will survive the cancellations.", [
        arrayPanel("nums", "nums", nums),
        varsPanel("vars", "", [v("cand", "—"), v("count", 0)]),
      ]);
      for (let i = 0; i < nums.length; i++) {
        const x = nums[i]!;
        rec.record("loop", `See \`${x}\`.`, [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
        ]);
        if (count === 0) {
          cand = x;
          rec.record("pick", `New candidate \`${cand}\`.`, [
            varsPanel("vars", "", [v("cand", cand, { changed: true })]),
          ]);
        }
        count += x === cand ? 1 : -1;
      }
      return rec.done("done", `Return \`${cand}\`.`, [
        varsPanel("vars", "", [v("answer", cand, { tone: "result" })]),
      ]);
    },
  },
};

export const missingNumber: Solver = {
  id: "missing-number",
  slugs: ["missing-number"],
  label: "XOR 0..n against nums",
  inputs: [{ name: "nums", label: "nums", type: "int[]", default: "[3, 0, 1]" }],
  examples: [
    { input: { nums: "[3, 0, 1]" }, output: "2" },
    { input: { nums: "[0, 1]" }, output: "2" },
  ],
  approach: {
    id: "missing-number",
    title: "XOR the range with the array",
    kind: "optimal",
    summary: "XOR every index `0..n` with every value. Pairs cancel; the missing number is left.",
    intuition: [
      {
        type: "p",
        text: "The complete range is `0..n`. The array is that range minus one value. XOR is how you subtract without summing.",
      },
    ],
    steps: ["Start `acc = n`.", "XOR `acc` with each `(i ^ nums[i])`.", "Return `acc`."],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def missingNumber(self, nums: list[int]) -> int:
                  acc = len(nums)
                  for i, x in enumerate(nums):
                      acc ^= i ^ x
                  return acc
        `,
        markers: {
          init: "acc = len(nums)",
          loop: "for i, x in enumerate(nums)",
          xor: "acc ^= i ^ x",
          done: "return acc",
        },
      },
      go: {
        source: go`
          func missingNumber(nums []int) int {
              acc := len(nums)
              for i, x := range nums {
                  acc ^= i ^ x
              }
              return acc
          }
        `,
        markers: {
          init: "acc := len(nums)",
          loop: "for i, x := range nums",
          xor: "acc ^= i ^ x",
          done: "return acc",
        },
      },
    },
  },
  traces: {
    "missing-number": (input) => {
      const nums = input.nums as number[];
      const rec = new Recorder();
      let acc = nums.length;
      rec.record("init", `XOR in the missing end of the range: \`acc = ${acc}\`.`, [
        arrayPanel("nums", "nums", nums),
        varsPanel("vars", "", [v("acc", acc)]),
      ]);
      for (let i = 0; i < nums.length; i++) {
        rec.record("loop", `Pair index ${i} with value ${nums[i]}.`, [
          arrayPanel("nums", "nums", nums, { pointers: [ptr(i, "i", "red")] }),
        ]);
        acc ^= i ^ nums[i]!;
        rec.record("xor", `acc is now ${acc}.`, [
          varsPanel("vars", "", [v("acc", acc, { changed: true })]),
        ]);
      }
      return rec.done("done", `Return \`${acc}\`.`, [
        varsPanel("vars", "", [v("answer", acc, { tone: "result" })]),
      ]);
    },
  },
};

export const mergeSortedArray: Solver = {
  id: "merge-sorted-array",
  slugs: ["merge-sorted-array"],
  label: "merge into nums1 from the back",
  inputs: [
    {
      name: "nums1",
      label: "nums1 (with tail room)",
      type: "int[]",
      default: "[1, 2, 3, 0, 0, 0]",
    },
    { name: "m", label: "m", type: "int", default: "3" },
    { name: "nums2", label: "nums2", type: "int[]", default: "[2, 5, 6]" },
    { name: "n", label: "n", type: "int", default: "3" },
  ],
  examples: [
    {
      input: { nums1: "[1, 2, 3, 0, 0, 0]", m: "3", nums2: "[2, 5, 6]", n: "3" },
      output: "[1, 2, 2, 3, 5, 6]",
    },
    {
      input: { nums1: "[1]", m: "1", nums2: "[]", n: "0" },
      output: "[1]",
    },
  ],
  approach: {
    id: "merge-sorted-array",
    title: "Fill nums1 from the right",
    kind: "optimal",
    summary:
      "The tail of `nums1` is empty. Write the larger of the two remaining heads into the next empty slot, working right-to-left so you never overwrite an unread value.",
    intuition: [
      {
        type: "p",
        text: "Merging left-to-right would clobber unread values in nums1. The empty suffix is free space — use it.",
      },
    ],
    steps: [
      "i = m−1, j = n−1, w = m+n−1.",
      "While both sides remain, write the larger into `nums1[w]` and decrement.",
      "Copy any leftover `nums2` prefix.",
    ],
    complexity: { time: "O(m + n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> list[int]:
                  i, j, w = m - 1, n - 1, m + n - 1
                  while j >= 0:
                      if i >= 0 and nums1[i] > nums2[j]:
                          nums1[w] = nums1[i]
                          i -= 1
                      else:
                          nums1[w] = nums2[j]
                          j -= 1
                      w -= 1
                  return nums1
        `,
        markers: {
          init: "i, j, w = m - 1, n - 1, m + n - 1",
          loop: "while j >= 0",
          from1: "nums1[w] = nums1[i]",
          from2: "nums1[w] = nums2[j]",
          done: "return nums1",
        },
      },
      go: {
        source: go`
          func merge(nums1 []int, m int, nums2 []int, n int) []int {
              i, j, w := m-1, n-1, m+n-1
              for j >= 0 {
                  if i >= 0 && nums1[i] > nums2[j] {
                      nums1[w] = nums1[i]
                      i--
                  } else {
                      nums1[w] = nums2[j]
                      j--
                  }
                  w--
              }
              return nums1
          }
        `,
        markers: {
          init: "i, j, w := m-1, n-1, m+n-1",
          loop: "for j >= 0",
          from1: "nums1[w] = nums1[i]",
          from2: "nums1[w] = nums2[j]",
          done: "return nums1",
        },
      },
    },
  },
  traces: {
    "merge-sorted-array": (input) => {
      const nums1 = [...(input.nums1 as number[])];
      const m = input.m as number;
      const nums2 = input.nums2 as number[];
      const n = input.n as number;
      const rec = new Recorder();
      let i = m - 1;
      let j = n - 1;
      let w = m + n - 1;
      rec.record("init", "Write into the empty tail so unread heads stay safe.", [
        arrayPanel("nums1", "nums1", nums1),
        arrayPanel("nums2", "nums2", nums2),
        varsPanel("vars", "", [v("i", i), v("j", j), v("w", w)]),
      ]);
      while (j >= 0) {
        rec.record("loop", `Fill index ${w}.`, [
          arrayPanel("nums1", "nums1", nums1, { pointers: [ptr(Math.max(w, 0), "w", "green")] }),
          arrayPanel("nums2", "nums2", nums2, { pointers: j >= 0 ? [ptr(j, "j", "blue")] : [] }),
        ]);
        if (i >= 0 && nums1[i]! > nums2[j]!) {
          nums1[w] = nums1[i]!;
          rec.record("from1", `Take \`${nums1[w]}\` from nums1.`, [
            arrayPanel("nums1", "nums1", nums1, { tones: tones([w, "result"]) }),
          ]);
          i -= 1;
        } else {
          nums1[w] = nums2[j]!;
          rec.record("from2", `Take \`${nums1[w]}\` from nums2.`, [
            arrayPanel("nums1", "nums1", nums1, { tones: tones([w, "result"]) }),
          ]);
          j -= 1;
        }
        w -= 1;
      }
      return rec.done("done", `Return \`${fmt(nums1)}\`.`, [
        arrayPanel("nums1", "nums1", nums1),
        varsPanel("vars", "", [v("answer", fmt(nums1), { tone: "result" })]),
      ]);
    },
  },
};
