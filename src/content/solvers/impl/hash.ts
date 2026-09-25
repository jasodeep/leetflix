import { go, py } from "@/content/problems/_helpers";
import { arrayPanel, mapPanel, ptr, tones, v, varsPanel } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";

import type { Solver } from "../types";

export const containsDuplicate: Solver = {
  id: "contains-duplicate",
  slugs: ["contains-duplicate"],
  label: "hash-set seen",
  inputs: [{ name: "nums", label: "nums", type: "int[]", default: "[1, 2, 3, 1]" }],
  examples: [
    { input: { nums: "[1, 2, 3, 1]" }, output: "true" },
    { input: { nums: "[1, 2, 3, 4]" }, output: "false" },
  ],
  approach: {
    id: "contains-duplicate",
    title: "One-pass hash set",
    kind: "optimal",
    summary: "Remember every value. A hit means a duplicate.",
    intuition: [
      {
        type: "p",
        text: "A set answers “have I seen this?” in expected O(1). Insert after the lookup so a value never pairs with itself.",
      },
    ],
    steps: [
      "Empty set `seen`.",
      "For each `x`, if `x` is in `seen` return true; otherwise insert it.",
      "If the walk finishes, return false.",
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def containsDuplicate(self, nums: list[int]) -> bool:
                  seen: set[int] = set()
                  for x in nums:
                      if x in seen:
                          return True
                      seen.add(x)
                  return False
        `,
        markers: {
          init: "seen: set[int] = set()",
          loop: "for x in nums",
          check: "if x in seen",
          hit: "return True",
          store: "seen.add(x)",
          miss: "return False",
        },
      },
      go: {
        source: go`
          func containsDuplicate(nums []int) bool {
              seen := map[int]bool{}
              for _, x := range nums {
                  if seen[x] {
                      return true
                  }
                  seen[x] = true
              }
              return false
          }
        `,
        markers: {
          init: "seen := map[int]bool{}",
          loop: "for _, x := range nums",
          check: "if seen[x]",
          hit: "return true",
          store: "seen[x] = true",
          miss: "return false",
        },
      },
    },
  },
  traces: {
    "contains-duplicate": (input) => {
      const nums = input.nums as number[];
      const rec = new Recorder();
      const seen = new Set<number>();
      rec.record("init", "Empty set. We remember every value we pass.", [
        arrayPanel("nums", "nums", nums),
        mapPanel("seen", "seen", new Map(), { emptyText: "{ }" }),
      ]);
      for (let i = 0; i < nums.length; i++) {
        const x = nums[i]!;
        rec.record("loop", `Look at \`nums[${i}] = ${x}\`.`, [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
          mapPanel("seen", "seen", new Map([...seen].map((k) => [k, true]))),
        ]);
        rec.record("check", seen.has(x) ? `\`${x}\` is already in the set.` : `\`${x}\` is new.`, [
          arrayPanel("nums", "nums", nums, { pointers: [ptr(i, "i", "red")] }),
          mapPanel("seen", "seen", new Map([...seen].map((k) => [k, true])), { highlightKey: x }),
        ]);
        if (seen.has(x)) {
          return rec.done("hit", "Duplicate found — return `true`.", [
            arrayPanel("nums", "nums", nums, { tones: tones([i, "result"]) }),
            varsPanel("vars", "", [v("answer", true, { tone: "result" })]),
          ]);
        }
        seen.add(x);
        rec.record("store", `Remember \`${x}\`.`, [
          mapPanel("seen", "seen", new Map([...seen].map((k) => [k, true])), { newKey: x }),
        ]);
      }
      return rec.done("miss", "Walk finished — return `false`.", [
        varsPanel("vars", "", [v("answer", false, { tone: "result" })]),
      ]);
    },
  },
};

export const validAnagram: Solver = {
  id: "valid-anagram",
  slugs: ["valid-anagram"],
  label: "count characters",
  inputs: [
    { name: "s", label: "s", type: "string", default: "anagram" },
    { name: "t", label: "t", type: "string", default: "nagaram" },
  ],
  examples: [
    { input: { s: "anagram", t: "nagaram" }, output: "true" },
    { input: { s: "rat", t: "car" }, output: "false" },
  ],
  approach: {
    id: "valid-anagram",
    title: "Frequency map",
    kind: "optimal",
    summary:
      "Count letters in `s`, subtract letters in `t`. A leftover or a missing letter means not an anagram.",
    intuition: [
      {
        type: "p",
        text: "Two strings are anagrams iff they have the same multiset of characters. One map is enough: +1 for `s`, −1 for `t`.",
      },
    ],
    steps: [
      "If lengths differ, return false.",
      "Increment counts for `s`, decrement for `t`.",
      "Every count must land on zero.",
    ],
    complexity: { time: "O(n)", space: "O(σ)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def isAnagram(self, s: str, t: str) -> bool:
                  if len(s) != len(t):
                      return False
                  count: dict[str, int] = {}
                  for ch in s:
                      count[ch] = count.get(ch, 0) + 1
                  for ch in t:
                      count[ch] = count.get(ch, 0) - 1
                      if count[ch] < 0:
                          return False
                  return True
        `,
        markers: {
          len: "if len(s) != len(t)",
          init: "count: dict[str, int] = {}",
          add: "count[ch] = count.get(ch, 0) + 1",
          sub: "count[ch] = count.get(ch, 0) - 1",
          bad: "if count[ch] < 0",
          done: "return True",
        },
      },
      go: {
        source: go`
          func isAnagram(s string, t string) bool {
              if len(s) != len(t) {
                  return false
              }
              count := map[byte]int{}
              for i := 0; i < len(s); i++ {
                  count[s[i]]++
              }
              for i := 0; i < len(t); i++ {
                  count[t[i]]--
                  if count[t[i]] < 0 {
                      return false
                  }
              }
              return true
          }
        `,
        markers: {
          len: "if len(s) != len(t)",
          init: "count := map[byte]int{}",
          add: "count[s[i]]++",
          sub: "count[t[i]]--",
          bad: "if count[t[i]] < 0",
          done: "return true",
        },
      },
    },
  },
  traces: {
    "valid-anagram": (input) => {
      const s = input.s as string;
      const t = input.t as string;
      const rec = new Recorder();
      if (s.length !== t.length) {
        rec.record("len", "Lengths differ — cannot be anagrams.", [
          varsPanel("vars", "", [v("|s|", s.length), v("|t|", t.length)]),
        ]);
        return rec.done("len", "Return `false`.", [
          varsPanel("vars", "", [v("answer", false, { tone: "danger" })]),
        ]);
      }
      const count = new Map<string, number>();
      rec.record("init", "Count letters in `s`, then spend them on `t`.", [
        arrayPanel("s", "s", [...s]),
        arrayPanel("t", "t", [...t]),
        mapPanel("count", "count", count, { emptyText: "{ }" }),
      ]);
      for (let i = 0; i < s.length; i++) {
        const ch = s[i]!;
        count.set(ch, (count.get(ch) ?? 0) + 1);
        rec.record("add", `+1 for \`${ch}\`.`, [
          arrayPanel("s", "s", [...s], { pointers: [ptr(i, "i", "red")] }),
          mapPanel("count", "count", count, { newKey: ch }),
        ]);
      }
      for (let i = 0; i < t.length; i++) {
        const ch = t[i]!;
        count.set(ch, (count.get(ch) ?? 0) - 1);
        rec.record("sub", `−1 for \`${ch}\`.`, [
          arrayPanel("t", "t", [...t], { pointers: [ptr(i, "i", "blue")] }),
          mapPanel("count", "count", count, { highlightKey: ch }),
        ]);
        if ((count.get(ch) ?? 0) < 0) {
          return rec.done("bad", `\`${ch}\` was never in \`s\` — return \`false\`.`, [
            varsPanel("vars", "", [v("answer", false, { tone: "danger" })]),
          ]);
        }
      }
      return rec.done("done", "All counts spent — return `true`.", [
        varsPanel("vars", "", [v("answer", true, { tone: "result" })]),
      ]);
    },
  },
};

export const groupAnagrams: Solver = {
  id: "group-anagrams",
  slugs: ["group-anagrams"],
  label: "group by sorted key",
  inputs: [
    {
      name: "strs",
      label: "strs (space-separated)",
      type: "string",
      default: "eat tea tan ate nat bat",
    },
  ],
  examples: [
    {
      input: { strs: "eat tea tan ate nat bat" },
      output: "[[eat, tea, ate], [tan, nat], [bat]]",
    },
  ],
  approach: {
    id: "group-anagrams",
    title: "Sort each word as the map key",
    kind: "optimal",
    summary: "Anagrams share a sorted signature. Bucket words by `sorted(word)`.",
    intuition: [
      {
        type: "p",
        text: "`eat`, `tea`, `ate` all sort to `aet`. One hash map from signature → list is the whole algorithm.",
      },
    ],
    steps: [
      "For each word, sort its letters to get a key.",
      "Append the word to that key's bucket.",
      "Return the buckets.",
    ],
    complexity: { time: "O(n k log k)", space: "O(n k)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def groupAnagrams(self, words: list[str]) -> list[list[str]]:
                  groups: dict[str, list[str]] = {}
                  for w in words:
                      key = "".join(sorted(w))
                      groups.setdefault(key, []).append(w)
                  return list(groups.values())
        `,
        markers: {
          init: "groups: dict[str, list[str]] = {}",
          loop: "for w in words",
          key: 'key = "".join(sorted(w))',
          put: "groups.setdefault(key, []).append(w)",
          done: "return list(groups.values())",
        },
      },
      go: {
        source: go`
          func groupAnagrams(words []string) [][]string {
              groups := map[string][]string{}
              for _, w := range words {
                  b := []byte(w)
                  sort.Slice(b, func(i, j int) bool { return b[i] < b[j] })
                  key := string(b)
                  groups[key] = append(groups[key], w)
              }
              out := [][]string{}
              for _, g := range groups {
                  out = append(out, g)
              }
              return out
          }
        `,
        markers: {
          init: "groups := map[string][]string{}",
          loop: "for _, w := range words",
          key: "key := string(b)",
          put: "groups[key] = append(groups[key], w)",
          done: "return out",
        },
      },
    },
  },
  traces: {
    "group-anagrams": (input) => {
      const words = String(input.strs).trim().split(/\s+/).filter(Boolean);
      const rec = new Recorder();
      const groups = new Map<string, string[]>();
      rec.record("init", "Bucket words by the sorted signature.", [
        arrayPanel("words", "words", words),
        mapPanel("groups", "groups", new Map(), { emptyText: "{ }" }),
      ]);
      for (let i = 0; i < words.length; i++) {
        const w = words[i]!;
        rec.record("loop", `Word \`${w}\`.`, [
          arrayPanel("words", "words", words, {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
        ]);
        const key = [...w].sort().join("");
        rec.record("key", `Signature \`${key}\`.`, [varsPanel("vars", "", [v("key", key)])]);
        const bucket = groups.get(key) ?? [];
        bucket.push(w);
        groups.set(key, bucket);
        rec.record("put", `Append to \`${key}\`.`, [
          mapPanel("groups", "groups", new Map([...groups].map(([k, vs]) => [k, vs.join(",")])), {
            newKey: key,
          }),
        ]);
      }
      const out = [...groups.values()];
      const shown = `[${out.map((g) => `[${g.join(", ")}]`).join(", ")}]`;
      return rec.done("done", `Return \`${shown}\`.`, [
        varsPanel("vars", "", [v("answer", shown, { tone: "result" })]),
      ]);
    },
  },
};

export const singleNumber: Solver = {
  id: "single-number",
  slugs: ["single-number"],
  label: "XOR fold",
  inputs: [{ name: "nums", label: "nums", type: "int[]", default: "[4, 1, 2, 1, 2]" }],
  examples: [
    { input: { nums: "[4, 1, 2, 1, 2]" }, output: "4" },
    { input: { nums: "[2, 2, 1]" }, output: "1" },
  ],
  approach: {
    id: "single-number",
    title: "XOR everything",
    kind: "optimal",
    summary: "`x ^ x = 0` and `x ^ 0 = x`, so pairs cancel and the lonely value remains.",
    intuition: [
      {
        type: "p",
        text: "XOR is associative and commutative. Every duplicate pair vanishes; the unique number is what is left.",
      },
    ],
    steps: ["Start `acc = 0`.", "XOR each value into `acc`.", "Return `acc`."],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def singleNumber(self, nums: list[int]) -> int:
                  acc = 0
                  for x in nums:
                      acc ^= x
                  return acc
        `,
        markers: {
          init: "acc = 0",
          loop: "for x in nums",
          xor: "acc ^= x",
          done: "return acc",
        },
      },
      go: {
        source: go`
          func singleNumber(nums []int) int {
              acc := 0
              for _, x := range nums {
                  acc ^= x
              }
              return acc
          }
        `,
        markers: {
          init: "acc := 0",
          loop: "for _, x := range nums",
          xor: "acc ^= x",
          done: "return acc",
        },
      },
    },
  },
  traces: {
    "single-number": (input) => {
      const nums = input.nums as number[];
      const rec = new Recorder();
      let acc = 0;
      rec.record("init", "`acc` starts at 0. Pairs will cancel.", [
        arrayPanel("nums", "nums", nums),
        varsPanel("vars", "", [v("acc", 0)]),
      ]);
      for (let i = 0; i < nums.length; i++) {
        const x = nums[i]!;
        rec.record("loop", `\`x = ${x}\`.`, [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
        ]);
        acc ^= x;
        rec.record("xor", `\`acc\` is now ${acc}.`, [
          varsPanel("vars", "", [v("acc", acc, { changed: true })]),
        ]);
      }
      return rec.done("done", `Return \`${acc}\`.`, [
        varsPanel("vars", "", [v("answer", acc, { tone: "result" })]),
      ]);
    },
  },
};

export const happyNumber: Solver = {
  id: "happy-number",
  slugs: ["happy-number"],
  label: "happy-number cycle",
  inputs: [{ name: "n", label: "n", type: "int", default: "19" }],
  examples: [
    { input: { n: "19" }, output: "true" },
    { input: { n: "2" }, output: "false" },
  ],
  approach: {
    id: "happy-number",
    title: "Sum of squared digits, detect a cycle",
    kind: "optimal",
    summary:
      "Replace `n` with the sum of the squares of its digits. If you hit 1, it is happy. If you see a number twice, you are in a loop — not happy.",
    intuition: [
      {
        type: "p",
        text: "The map of n → digit-square-sum is finite, so you either reach 1 or a cycle (the famous 4-loop).",
      },
    ],
    steps: [
      "While `n ≠ 1` and `n` is new, record it and replace it with the digit-square sum.",
      "Return whether you landed on 1.",
    ],
    complexity: { time: "O(log n)", space: "O(log n)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def isHappy(self, n: int) -> bool:
                  seen: set[int] = set()
                  while n != 1 and n not in seen:
                      seen.add(n)
                      n = sum(int(d) ** 2 for d in str(n))
                  return n == 1
        `,
        markers: {
          init: "seen: set[int] = set()",
          loop: "while n != 1 and n not in seen",
          store: "seen.add(n)",
          step: "n = sum(int(d) ** 2 for d in str(n))",
          done: "return n == 1",
        },
      },
      go: {
        source: go`
          func isHappy(n int) bool {
              seen := map[int]bool{}
              for n != 1 && !seen[n] {
                  seen[n] = true
                  sum := 0
                  for x := n; x > 0; x /= 10 {
                      d := x % 10
                      sum += d * d
                  }
                  n = sum
              }
              return n == 1
          }
        `,
        markers: {
          init: "seen := map[int]bool{}",
          loop: "for n != 1 && !seen[n]",
          store: "seen[n] = true",
          step: "n = sum",
          done: "return n == 1",
        },
      },
    },
  },
  traces: {
    "happy-number": (input) => {
      const rec = new Recorder();
      let n = input.n as number;
      const seen = new Set<number>();
      rec.record("init", "Square-sum the digits until 1 or a repeat.", [
        varsPanel("vars", "", [v("n", n)]),
        mapPanel("seen", "seen", new Map(), { emptyText: "{ }" }),
      ]);
      while (n !== 1 && !seen.has(n)) {
        rec.record("loop", `n = ${n}.`, [varsPanel("vars", "", [v("n", n)])]);
        seen.add(n);
        rec.record("store", `Remember ${n}.`, [
          mapPanel("seen", "seen", new Map([...seen].map((k) => [k, true])), { newKey: n }),
        ]);
        const next = String(n)
          .split("")
          .reduce((s, d) => s + Number(d) ** 2, 0);
        rec.record("step", `Digit-square sum is ${next}.`, [
          varsPanel("vars", "", [v("n", next, { changed: true })]),
        ]);
        n = next;
      }
      const ok = n === 1;
      return rec.done("done", ok ? "Hit 1 — return `true`." : "Cycle — return `false`.", [
        varsPanel("vars", "", [v("answer", ok, { tone: ok ? "result" : "danger" })]),
      ]);
    },
  },
};

export const firstUniqueCharacter: Solver = {
  id: "first-unique-character-in-a-string",
  slugs: ["first-unique-character-in-a-string"],
  label: "first unique char",
  inputs: [{ name: "s", label: "s", type: "string", default: "leetcode" }],
  examples: [
    { input: { s: "leetcode" }, output: "0" },
    { input: { s: "loveleetcode" }, output: "2" },
    { input: { s: "aabb" }, output: "-1" },
  ],
  approach: {
    id: "first-unique-character-in-a-string",
    title: "Count, then scan",
    kind: "optimal",
    summary: "Count every letter, then return the first index whose count is 1 — or −1.",
    intuition: [
      {
        type: "p",
        text: "Two linear passes: the first builds frequencies, the second asks “is this the first singleton?”",
      },
    ],
    steps: ["Count characters.", "Return the first index with count 1.", "If none, −1."],
    complexity: { time: "O(n)", space: "O(σ)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def firstUniqChar(self, s: str) -> int:
                  count: dict[str, int] = {}
                  for ch in s:
                      count[ch] = count.get(ch, 0) + 1
                  for i, ch in enumerate(s):
                      if count[ch] == 1:
                          return i
                  return -1
        `,
        markers: {
          init: "count: dict[str, int] = {}",
          count: "count[ch] = count.get(ch, 0) + 1",
          scan: "for i, ch in enumerate(s)",
          hit: "return i",
          miss: "return -1",
        },
      },
      go: {
        source: go`
          func firstUniqChar(s string) int {
              count := map[byte]int{}
              for _, ch := range []byte(s) {
                  count[ch]++
              }
              for i := 0; i < len(s); i++ {
                  if count[s[i]] == 1 {
                      return i
                  }
              }
              return -1
          }
        `,
        markers: {
          init: "count := map[byte]int{}",
          count: "count[ch]++",
          scan: "for i := 0; i < len(s); i++ {",
          hit: "return i",
          miss: "return -1",
        },
      },
    },
  },
  traces: {
    "first-unique-character-in-a-string": (input) => {
      const s = input.s as string;
      const rec = new Recorder();
      const count = new Map<string, number>();
      rec.record("init", "Count first, then walk for the first singleton.", [
        arrayPanel("s", "s", [...s]),
        mapPanel("count", "count", count, { emptyText: "{ }" }),
      ]);
      for (let i = 0; i < s.length; i++) {
        const ch = s[i]!;
        count.set(ch, (count.get(ch) ?? 0) + 1);
        rec.record("count", `Count \`${ch}\` → ${count.get(ch)}.`, [
          arrayPanel("s", "s", [...s], { pointers: [ptr(i, "i", "red")] }),
          mapPanel("count", "count", count, { newKey: ch }),
        ]);
      }
      for (let i = 0; i < s.length; i++) {
        const ch = s[i]!;
        rec.record("scan", `Index ${i} is \`${ch}\`, count ${count.get(ch)}.`, [
          arrayPanel("s", "s", [...s], {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
        ]);
        if (count.get(ch) === 1) {
          return rec.done("hit", `First unique at index \`${i}\`.`, [
            arrayPanel("s", "s", [...s], { tones: tones([i, "result"]) }),
            varsPanel("vars", "", [v("answer", i, { tone: "result" })]),
          ]);
        }
      }
      return rec.done("miss", "No unique character — return `-1`.", [
        varsPanel("vars", "", [v("answer", -1, { tone: "danger" })]),
      ]);
    },
  },
};
