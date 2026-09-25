import { go, py } from "@/content/problems/_helpers";
import { arrayPanel, ptr, tones, v, varsPanel } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";

import type { Solver } from "../types";

const isAlnum = (ch: string) => /[a-z0-9]/i.test(ch);

export const validPalindrome: Solver = {
  id: "valid-palindrome",
  slugs: ["valid-palindrome"],
  label: "two-pointer palindrome",
  inputs: [{ name: "s", label: "s", type: "string", default: "A man, a plan, a canal: Panama" }],
  examples: [
    { input: { s: "A man, a plan, a canal: Panama" }, output: "true" },
    { input: { s: "race a car" }, output: "false" },
  ],
  approach: {
    id: "valid-palindrome",
    title: "Skip junk, compare ends",
    kind: "optimal",
    summary:
      "Walk inward. Ignore anything that is not alphanumeric. Compare lowercased letters. A mismatch is a no; pointers crossing is a yes.",
    intuition: [
      {
        type: "p",
        text: "The string is a palindrome iff the filtered character stream reads the same forwards and backwards. Two pointers do that in one pass, no extra copy.",
      },
    ],
    steps: [
      "`lo`, `hi` at the ends.",
      "Skip non-alphanumeric characters.",
      "Compare lowercased; mismatch → false. Else step in. Done when `lo >= hi`.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def isPalindrome(self, s: str) -> bool:
                  lo, hi = 0, len(s) - 1
                  while lo < hi:
                      if not s[lo].isalnum():
                          lo += 1
                          continue
                      if not s[hi].isalnum():
                          hi -= 1
                          continue
                      if s[lo].lower() != s[hi].lower():
                          return False
                      lo += 1
                      hi -= 1
                  return True
        `,
        markers: {
          init: "lo, hi = 0, len(s) - 1",
          loop: "while lo < hi",
          skipL: "if not s[lo].isalnum()",
          skipR: "if not s[hi].isalnum()",
          bad: "return False",
          done: "return True",
        },
      },
      go: {
        source: go`
          func isPalindrome(s string) bool {
              lo, hi := 0, len(s)-1
              for lo < hi {
                  if !alnum(s[lo]) {
                      lo++
                      continue
                  }
                  if !alnum(s[hi]) {
                      hi--
                      continue
                  }
                  if lower(s[lo]) != lower(s[hi]) {
                      return false
                  }
                  lo++
                  hi--
              }
              return true
          }
        `,
        markers: {
          init: "lo, hi := 0, len(s)-1",
          loop: "for lo < hi",
          skipL: "if !alnum(s[lo])",
          skipR: "if !alnum(s[hi])",
          bad: "return false",
          done: "return true",
        },
      },
    },
  },
  traces: {
    "valid-palindrome": (input) => {
      const s = input.s as string;
      const rec = new Recorder();
      let lo = 0;
      let hi = s.length - 1;
      rec.record("init", "Ignore punctuation and case. Compare the ends.", [
        arrayPanel("s", "s", [...s], { pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")] }),
      ]);
      while (lo < hi) {
        rec.record("loop", `Compare \`${s[lo]}\` and \`${s[hi]}\`.`, [
          arrayPanel("s", "s", [...s], {
            pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")],
            tones: tones([lo, "active"], [hi, "active"]),
          }),
        ]);
        if (!isAlnum(s[lo]!)) {
          rec.record("skipL", `Skip \`${s[lo]}\`.`, [
            arrayPanel("s", "s", [...s], { tones: tones([lo, "dim"]) }),
          ]);
          lo += 1;
          continue;
        }
        if (!isAlnum(s[hi]!)) {
          rec.record("skipR", `Skip \`${s[hi]}\`.`, [
            arrayPanel("s", "s", [...s], { tones: tones([hi, "dim"]) }),
          ]);
          hi -= 1;
          continue;
        }
        if (s[lo]!.toLowerCase() !== s[hi]!.toLowerCase()) {
          return rec.done("bad", "Mismatch — return `false`.", [
            arrayPanel("s", "s", [...s], { tones: tones([lo, "danger"], [hi, "danger"]) }),
            varsPanel("vars", "", [v("answer", false, { tone: "danger" })]),
          ]);
        }
        lo += 1;
        hi -= 1;
      }
      return rec.done("done", "Pointers met — return `true`.", [
        varsPanel("vars", "", [v("answer", true, { tone: "result" })]),
      ]);
    },
  },
};

export const palindromeNumber: Solver = {
  id: "palindrome-number",
  slugs: ["palindrome-number"],
  label: "reverse the digits",
  inputs: [{ name: "x", label: "x", type: "int", default: "121" }],
  examples: [
    { input: { x: "121" }, output: "true" },
    { input: { x: "-121" }, output: "false" },
    { input: { x: "10" }, output: "false" },
  ],
  approach: {
    id: "palindrome-number",
    title: "Reverse and compare",
    kind: "optimal",
    summary:
      "Negatives are not palindromes (the minus sign). Reverse the digits of a non-negative `x` and compare.",
    intuition: [
      {
        type: "p",
        text: "Reversing 121 yields 121. Reversing 10 yields 01 → 1. No string conversion required.",
      },
    ],
    steps: [
      "If `x < 0`, return false.",
      "Build `rev` by popping digits off `x` into `rev * 10 + digit`.",
      "Compare `rev` to the original.",
    ],
    complexity: { time: "O(log x)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def isPalindrome(self, x: int) -> bool:
                  if x < 0:
                      return False
                  orig, rev = x, 0
                  while x:
                      rev = rev * 10 + x % 10
                      x //= 10
                  return rev == orig
        `,
        markers: {
          neg: "if x < 0",
          init: "orig, rev = x, 0",
          loop: "while x:",
          step: "rev = rev * 10 + x % 10",
          done: "return rev == orig",
        },
      },
      go: {
        source: go`
          func isPalindrome(x int) bool {
              if x < 0 {
                  return false
              }
              orig, rev := x, 0
              for x > 0 {
                  rev = rev*10 + x%10
                  x /= 10
              }
              return rev == orig
          }
        `,
        markers: {
          neg: "if x < 0",
          init: "orig, rev := x, 0",
          loop: "for x > 0",
          step: "rev = rev*10 + x%10",
          done: "return rev == orig",
        },
      },
    },
  },
  traces: {
    "palindrome-number": (input) => {
      let x = input.x as number;
      const rec = new Recorder();
      if (x < 0) {
        rec.record("neg", "Negatives are not palindromes.", [varsPanel("vars", "", [v("x", x)])]);
        return rec.done("neg", "Return `false`.", [
          varsPanel("vars", "", [v("answer", false, { tone: "danger" })]),
        ]);
      }
      const orig = x;
      let rev = 0;
      rec.record("init", `Reverse the digits of ${orig}.`, [
        varsPanel("vars", "", [v("orig", orig), v("rev", 0)]),
      ]);
      while (x) {
        rec.record("loop", `Remaining ${x}.`, [varsPanel("vars", "", [v("x", x), v("rev", rev)])]);
        rev = rev * 10 + (x % 10);
        x = Math.trunc(x / 10);
        rec.record("step", `rev is now ${rev}.`, [
          varsPanel("vars", "", [v("rev", rev, { changed: true })]),
        ]);
      }
      const ok = rev === orig;
      return rec.done(
        "done",
        ok
          ? `\`${rev} == ${orig}\` — return \`true\`.`
          : `\`${rev} != ${orig}\` — return \`false\`.`,
        [varsPanel("vars", "", [v("answer", ok, { tone: ok ? "result" : "danger" })])],
      );
    },
  },
};

export const romanToInteger: Solver = {
  id: "roman-to-integer",
  slugs: ["roman-to-integer"],
  label: "roman scan",
  inputs: [{ name: "s", label: "s", type: "string", default: "MCMXCIV" }],
  examples: [
    { input: { s: "III" }, output: "3" },
    { input: { s: "LVIII" }, output: "58" },
    { input: { s: "MCMXCIV" }, output: "1994" },
  ],
  approach: {
    id: "roman-to-integer",
    title: "Add, unless a smaller digit precedes a larger one",
    kind: "optimal",
    summary:
      "Scan left to right. If `cur < next`, subtract `cur` (the IV / IX / XL … rule). Otherwise add it.",
    intuition: [
      {
        type: "p",
        text: "Standard Roman is additive. The six subtractive pairs are exactly “a smaller value sitting before a larger one.”",
      },
    ],
    steps: [
      "Map each letter to its value.",
      "For each digit, add it, or subtract it when the next one is larger.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def romanToInt(self, s: str) -> int:
                  val = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
                  total = 0
                  for i, ch in enumerate(s):
                      cur = val[ch]
                      nxt = val[s[i + 1]] if i + 1 < len(s) else 0
                      total += -cur if cur < nxt else cur
                  return total
        `,
        markers: {
          init: "total = 0",
          loop: "for i, ch in enumerate(s)",
          step: "total += -cur if cur < nxt else cur",
          done: "return total",
        },
      },
      go: {
        source: go`
          func romanToInt(s string) int {
              val := map[byte]int{'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
              total := 0
              for i := 0; i < len(s); i++ {
                  cur := val[s[i]]
                  nxt := 0
                  if i+1 < len(s) {
                      nxt = val[s[i+1]]
                  }
                  if cur < nxt {
                      total -= cur
                  } else {
                      total += cur
                  }
              }
              return total
          }
        `,
        markers: {
          init: "total := 0",
          loop: "for i := 0; i < len(s); i++",
          step: "total += cur",
          done: "return total",
        },
      },
    },
  },
  traces: {
    "roman-to-integer": (input) => {
      const s = input.s as string;
      const rec = new Recorder();
      const val: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let total = 0;
      rec.record("init", "Add each value; subtract when a smaller digit precedes a larger one.", [
        arrayPanel("s", "s", [...s]),
        varsPanel("vars", "", [v("total", 0)]),
      ]);
      for (let i = 0; i < s.length; i++) {
        const cur = val[s[i]!] ?? 0;
        const nxt = i + 1 < s.length ? (val[s[i + 1]!] ?? 0) : 0;
        rec.record("loop", `\`${s[i]}\` = ${cur}.`, [
          arrayPanel("s", "s", [...s], {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
        ]);
        total += cur < nxt ? -cur : cur;
        rec.record("step", `total is ${total}.`, [
          varsPanel("vars", "", [v("total", total, { changed: true })]),
        ]);
      }
      return rec.done("done", `Return \`${total}\`.`, [
        varsPanel("vars", "", [v("answer", total, { tone: "result" })]),
      ]);
    },
  },
};

export const longestCommonPrefix: Solver = {
  id: "longest-common-prefix",
  slugs: ["longest-common-prefix"],
  label: "shrink the prefix",
  inputs: [
    {
      name: "strs",
      label: "strs (space-separated)",
      type: "string",
      default: "flower flow flight",
    },
  ],
  examples: [
    { input: { strs: "flower flow flight" }, output: "fl" },
    { input: { strs: "dog racecar car" }, output: "" },
  ],
  approach: {
    id: "longest-common-prefix",
    title: "Start with the first word, shrink",
    kind: "optimal",
    summary:
      "Assume the first string is the prefix. For every later word, cut the prefix down until it is a prefix of that word.",
    intuition: [
      { type: "p", text: "The answer can only get shorter. The moment it becomes empty, stop." },
    ],
    steps: [
      "Seed `pref` with `strs[0]`.",
      "While the current word does not start with `pref`, drop the last character of `pref`.",
      "Return `pref`.",
    ],
    complexity: { time: "O(n k)", space: "O(k)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def longestCommonPrefix(self, strs: list[str]) -> str:
                  if not strs:
                      return ""
                  pref = strs[0]
                  for w in strs[1:]:
                      while not w.startswith(pref):
                          pref = pref[:-1]
                          if not pref:
                              return ""
                  return pref
        `,
        markers: {
          empty: "if not strs:",
          gone: "if not pref:",
          init: "pref = strs[0]",
          loop: "for w in strs[1:]",
          shrink: "pref = pref[:-1]",
          done: "return pref",
        },
      },
      go: {
        source: go`
          func longestCommonPrefix(strs []string) string {
              if len(strs) == 0 {
                  return ""
              }
              pref := strs[0]
              for _, w := range strs[1:] {
                  for !hasPrefix(w, pref) {
                      pref = pref[:len(pref)-1]
                      if pref == "" {
                          return ""
                      }
                  }
              }
              return pref
          }
        `,
        markers: {
          empty: "if len(strs) == 0",
          gone: 'if pref == ""',
          init: "pref := strs[0]",
          loop: "for _, w := range strs[1:]",
          shrink: "pref = pref[:len(pref)-1]",
          done: "return pref",
        },
      },
    },
  },
  traces: {
    "longest-common-prefix": (input) => {
      const strs = String(input.strs).trim().split(/\s+/).filter(Boolean);
      const rec = new Recorder();
      if (strs.length === 0) {
        return rec.done("empty", 'No words — return `""`.', [
          varsPanel("vars", "", [v("answer", '""')]),
        ]);
      }
      let pref = strs[0]!;
      rec.record("init", `Start with \`${pref}\`.`, [
        arrayPanel("strs", "strs", strs),
        varsPanel("vars", "", [v("pref", pref)]),
      ]);
      for (let i = 1; i < strs.length; i++) {
        const w = strs[i]!;
        rec.record("loop", `Does \`${w}\` start with \`${pref}\`?`, [
          arrayPanel("strs", "strs", strs, { pointers: [ptr(i, "i", "red")] }),
        ]);
        while (!w.startsWith(pref)) {
          pref = pref.slice(0, -1);
          rec.record("shrink", `Shrink to \`${pref || "∅"}\`.`, [
            varsPanel("vars", "", [v("pref", pref || "∅", { changed: true })]),
          ]);
          if (!pref) {
            return rec.done("gone", 'Prefix emptied — return `""`.', [
              varsPanel("vars", "", [v("answer", '""', { tone: "result" })]),
            ]);
          }
        }
      }
      return rec.done("done", `Return \`${pref}\`.`, [
        varsPanel("vars", "", [v("answer", pref, { tone: "result" })]),
      ]);
    },
  },
};

export const reverseString: Solver = {
  id: "reverse-string",
  slugs: ["reverse-string"],
  label: "in-place reverse",
  inputs: [{ name: "s", label: "s", type: "string", default: "hello" }],
  examples: [
    { input: { s: "hello" }, output: "olleh" },
    { input: { s: "Hannah" }, output: "hannaH" },
  ],
  approach: {
    id: "reverse-string",
    title: "Swap the ends",
    kind: "optimal",
    summary: "Two pointers, swap, step in, until they meet.",
    intuition: [
      {
        type: "p",
        text: "The classic in-place reverse. Each swap puts two characters into their final seats.",
      },
    ],
    steps: ["`lo = 0`, `hi = n−1`.", "Swap, then `lo++`, `hi--`, while `lo < hi`."],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def reverseString(self, s: list[str]) -> list[str]:
                  lo, hi = 0, len(s) - 1
                  while lo < hi:
                      s[lo], s[hi] = s[hi], s[lo]
                      lo += 1
                      hi -= 1
                  return s
        `,
        markers: {
          init: "lo, hi = 0, len(s) - 1",
          loop: "while lo < hi",
          swap: "s[lo], s[hi] = s[hi], s[lo]",
          done: "return s",
        },
      },
      go: {
        source: go`
          func reverseString(s []byte) []byte {
              lo, hi := 0, len(s)-1
              for lo < hi {
                  s[lo], s[hi] = s[hi], s[lo]
                  lo++
                  hi--
              }
              return s
          }
        `,
        markers: {
          init: "lo, hi := 0, len(s)-1",
          loop: "for lo < hi",
          swap: "s[lo], s[hi] = s[hi], s[lo]",
          done: "return s",
        },
      },
    },
  },
  traces: {
    "reverse-string": (input) => {
      const s = [...(input.s as string)];
      const rec = new Recorder();
      let lo = 0;
      let hi = s.length - 1;
      rec.record("init", "Swap inward until the pointers meet.", [
        arrayPanel("s", "s", s, { pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")] }),
      ]);
      while (lo < hi) {
        rec.record("loop", `Swap \`${s[lo]}\` and \`${s[hi]}\`.`, [
          arrayPanel("s", "s", s, {
            pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")],
            tones: tones([lo, "active"], [hi, "active"]),
          }),
        ]);
        const tmp = s[lo]!;
        s[lo] = s[hi]!;
        s[hi] = tmp;
        rec.record("swap", "Swapped.", [
          arrayPanel("s", "s", s, { tones: tones([lo, "result"], [hi, "result"]) }),
        ]);
        lo += 1;
        hi -= 1;
      }
      const out = s.join("");
      return rec.done("done", `Return \`${out}\`.`, [
        arrayPanel("s", "s", s),
        varsPanel("vars", "", [v("answer", out, { tone: "result" })]),
      ]);
    },
  },
};

export const lengthOfLastWord: Solver = {
  id: "length-of-last-word",
  slugs: ["length-of-last-word"],
  label: "scan from the right",
  inputs: [{ name: "s", label: "s", type: "string", default: "Hello World" }],
  examples: [
    { input: { s: "Hello World" }, output: "5" },
    { input: { s: "   fly me   to   the moon  " }, output: "4" },
  ],
  approach: {
    id: "length-of-last-word",
    title: "Skip trailing spaces, then count",
    kind: "optimal",
    summary:
      "Walk from the right. Ignore trailing spaces, then count until the next space or the start.",
    intuition: [
      {
        type: "p",
        text: "The last word is the last run of non-space characters. Starting from the end means you never look at the earlier words.",
      },
    ],
    steps: ["Skip trailing spaces.", "Count the next run of letters.", "Return the count."],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def lengthOfLastWord(self, s: str) -> int:
                  i = len(s) - 1
                  while i >= 0 and s[i] == " ":
                      i -= 1
                  n = 0
                  while i >= 0 and s[i] != " ":
                      n += 1
                      i -= 1
                  return n
        `,
        markers: {
          skip: 'while i >= 0 and s[i] == " "',
          init: "n = 0",
          count: "n += 1",
          done: "return n",
        },
      },
      go: {
        source: go`
          func lengthOfLastWord(s string) int {
              i := len(s) - 1
              for i >= 0 && s[i] == ' ' {
                  i--
              }
              n := 0
              for i >= 0 && s[i] != ' ' {
                  n++
                  i--
              }
              return n
          }
        `,
        markers: {
          skip: "for i >= 0 && s[i] == ' '",
          init: "n := 0",
          count: "n++",
          done: "return n",
        },
      },
    },
  },
  traces: {
    "length-of-last-word": (input) => {
      const s = input.s as string;
      const rec = new Recorder();
      let i = s.length - 1;
      rec.record("skip", "Skip trailing spaces.", [
        arrayPanel("s", "s", [...s], { pointers: [ptr(Math.max(i, 0), "i", "red")] }),
      ]);
      while (i >= 0 && s[i] === " ") i -= 1;
      let n = 0;
      rec.record("init", "Count the last word.", [
        arrayPanel("s", "s", [...s], { pointers: i >= 0 ? [ptr(i, "i", "red")] : [] }),
        varsPanel("vars", "", [v("n", 0)]),
      ]);
      while (i >= 0 && s[i] !== " ") {
        n += 1;
        rec.record("count", `\`${s[i]}\` — n = ${n}.`, [
          arrayPanel("s", "s", [...s], {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "result"]),
          }),
          varsPanel("vars", "", [v("n", n, { changed: true })]),
        ]);
        i -= 1;
      }
      return rec.done("done", `Return \`${n}\`.`, [
        varsPanel("vars", "", [v("answer", n, { tone: "result" })]),
      ]);
    },
  },
};

export const addBinary: Solver = {
  id: "add-binary",
  slugs: ["add-binary"],
  label: "binary add with carry",
  inputs: [
    { name: "a", label: "a", type: "string", default: "1010" },
    { name: "b", label: "b", type: "string", default: "1011" },
  ],
  examples: [
    { input: { a: "11", b: "1" }, output: "100" },
    { input: { a: "1010", b: "1011" }, output: "10101" },
  ],
  approach: {
    id: "add-binary",
    title: "Add from the right, keep a carry",
    kind: "optimal",
    summary:
      "Same as Add Two Numbers, but the digits are bits. `sum % 2` is the written bit; `sum // 2` is the carry.",
    intuition: [
      { type: "p", text: "Walk both strings from the end. A leftover carry becomes a leading 1." },
    ],
    steps: [
      "i, j at the last characters, carry = 0.",
      "While either string or the carry remains, write `sum % 2` and keep `sum // 2`.",
      "Reverse the collected bits.",
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def addBinary(self, a: str, b: str) -> str:
                  i, j, carry = len(a) - 1, len(b) - 1, 0
                  out: list[str] = []
                  while i >= 0 or j >= 0 or carry:
                      total = carry
                      if i >= 0:
                          total += int(a[i])
                          i -= 1
                      if j >= 0:
                          total += int(b[j])
                          j -= 1
                      out.append(str(total % 2))
                      carry = total // 2
                  return "".join(reversed(out))
        `,
        markers: {
          init: "i, j, carry = len(a) - 1, len(b) - 1, 0",
          loop: "while i >= 0 or j >= 0 or carry",
          emit: "out.append(str(total % 2))",
          done: 'return "".join(reversed(out))',
        },
      },
      go: {
        source: go`
          func addBinary(a string, b string) string {
              i, j, carry := len(a)-1, len(b)-1, 0
              out := []byte{}
              for i >= 0 || j >= 0 || carry > 0 {
                  total := carry
                  if i >= 0 {
                      total += int(a[i] - '0')
                      i--
                  }
                  if j >= 0 {
                      total += int(b[j] - '0')
                      j--
                  }
                  out = append(out, byte('0'+total%2))
                  carry = total / 2
              }
              for l, r := 0, len(out)-1; l < r; l, r = l+1, r-1 {
                  out[l], out[r] = out[r], out[l]
              }
              return string(out)
          }
        `,
        markers: {
          init: "i, j, carry := len(a)-1, len(b)-1, 0",
          loop: "for i >= 0 || j >= 0 || carry > 0",
          emit: "out = append(out, byte('0'+total%2))",
          done: "return string(out)",
        },
      },
    },
  },
  traces: {
    "add-binary": (input) => {
      const a = input.a as string;
      const b = input.b as string;
      const rec = new Recorder();
      let i = a.length - 1;
      let j = b.length - 1;
      let carry = 0;
      const bits: string[] = [];
      rec.record("init", "Add bits from the right. Carry starts at 0.", [
        arrayPanel("a", "a", [...a]),
        arrayPanel("b", "b", [...b]),
        varsPanel("vars", "", [v("carry", 0)]),
      ]);
      while (i >= 0 || j >= 0 || carry) {
        rec.record("loop", `Column i=${i}, j=${j}.`, [
          arrayPanel("a", "a", [...a], { pointers: i >= 0 ? [ptr(i, "i", "red")] : [] }),
          arrayPanel("b", "b", [...b], { pointers: j >= 0 ? [ptr(j, "j", "blue")] : [] }),
        ]);
        let total = carry;
        if (i >= 0) {
          total += Number(a[i]);
          i -= 1;
        }
        if (j >= 0) {
          total += Number(b[j]);
          j -= 1;
        }
        bits.push(String(total % 2));
        carry = Math.floor(total / 2);
        rec.record("emit", `Write bit ${bits[bits.length - 1]}, carry ${carry}.`, [
          arrayPanel("bits", "bits (LSD first)", bits, {
            tones: tones([bits.length - 1, "result"]),
          }),
        ]);
      }
      const out = bits.slice().reverse().join("");
      return rec.done("done", `Return \`${out}\`.`, [
        varsPanel("vars", "", [v("answer", out, { tone: "result" })]),
      ]);
    },
  },
};
