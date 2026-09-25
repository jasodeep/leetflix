import { go, py } from "@/content/problems/_helpers";
import { arrayPanel, ptr, tones, v, varsPanel } from "@/lib/viz/builders";
import { fmt, Recorder } from "@/lib/viz/recorder";

import type { Solver } from "../types";

export const addTwoNumbers: Solver = {
  id: "add-two-numbers",
  slugs: ["add-two-numbers"],
  label: "digit-wise add with carry",
  inputs: [
    { name: "l1", label: "l1 (LSD first)", type: "int[]", default: "[2, 4, 3]" },
    { name: "l2", label: "l2 (LSD first)", type: "int[]", default: "[5, 6, 4]" },
  ],
  examples: [
    {
      input: { l1: "[2, 4, 3]", l2: "[5, 6, 4]" },
      output: "[7, 0, 8]",
      explanation: "`342 + 465 = 807`, written least-significant digit first.",
    },
    {
      input: { l1: "[0]", l2: "[0]" },
      output: "[0]",
      explanation: "Zero plus zero.",
    },
  ],
  approach: {
    id: "add-two-numbers",
    title: "Walk both lists, add, propagate carry",
    kind: "optimal",
    summary:
      "Each node is one digit, least-significant first. Add the two digits plus carry, emit `sum % 10`, keep `sum // 10` as the next carry.",
    intuition: [
      {
        type: "p",
        text: "The lists already store the number backwards, so you can add from the heads the way you add on paper from the right. A leftover carry becomes one extra node.",
      },
    ],
    steps: [
      "Start at both heads with `carry = 0`.",
      "While either list or the carry remains: add digits + carry, append `sum % 10`, set `carry = sum // 10`.",
      "Return the built list.",
    ],
    complexity: { time: "O(max(n, m))", space: "O(max(n, m))" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def addTwoNumbers(self, l1: list[int], l2: list[int]) -> list[int]:
                  out: list[int] = []
                  carry = 0
                  i = 0
                  while i < len(l1) or i < len(l2) or carry:
                      a = l1[i] if i < len(l1) else 0
                      b = l2[i] if i < len(l2) else 0
                      total = a + b + carry
                      out.append(total % 10)
                      carry = total // 10
                      i += 1
                  return out
        `,
        markers: {
          init: "carry = 0",
          loop: "while i < len(l1) or i < len(l2) or carry",
          add: "total = a + b + carry",
          emit: "out.append(total % 10)",
          carry: "carry = total // 10",
          done: "return out",
        },
      },
      go: {
        source: go`
          func addTwoNumbers(l1 []int, l2 []int) []int {
              out := []int{}
              carry := 0
              i := 0
              for i < len(l1) || i < len(l2) || carry > 0 {
                  a, b := 0, 0
                  if i < len(l1) {
                      a = l1[i]
                  }
                  if i < len(l2) {
                      b = l2[i]
                  }
                  total := a + b + carry
                  out = append(out, total%10)
                  carry = total / 10
                  i++
              }
              return out
          }
        `,
        markers: {
          init: "carry := 0",
          loop: "for i < len(l1) || i < len(l2) || carry > 0",
          add: "total := a + b + carry",
          emit: "out = append(out, total%10)",
          carry: "carry = total / 10",
          done: "return out",
        },
      },
    },
  },
  traces: {
    "add-two-numbers": (input) => {
      const l1 = input.l1 as number[];
      const l2 = input.l2 as number[];
      const rec = new Recorder();
      const out: number[] = [];
      let carry = 0;
      let i = 0;
      rec.record("init", "Digits are least-significant first. Carry starts at 0.", [
        arrayPanel("l1", "l1", l1),
        arrayPanel("l2", "l2", l2),
        varsPanel("vars", "", [v("carry", 0)]),
      ]);
      while (i < l1.length || i < l2.length || carry) {
        rec.record("loop", `Column ${i}.`, [
          arrayPanel("l1", "l1", l1, {
            pointers: i < l1.length ? [ptr(i, "i", "red")] : [],
            tones: i < l1.length ? tones([i, "active"]) : {},
          }),
          arrayPanel("l2", "l2", l2, {
            pointers: i < l2.length ? [ptr(i, "i", "blue")] : [],
            tones: i < l2.length ? tones([i, "active"]) : {},
          }),
        ]);
        const a = i < l1.length ? l1[i]! : 0;
        const b = i < l2.length ? l2[i]! : 0;
        const total = a + b + carry;
        rec.record("add", `\`${a} + ${b} + carry ${carry} = ${total}\`.`, [
          varsPanel("vars", "", [v("a", a), v("b", b), v("carry", carry), v("total", total)]),
        ]);
        out.push(total % 10);
        rec.record("emit", `Write digit \`${total % 10}\`.`, [
          arrayPanel("out", "out", out, { tones: tones([out.length - 1, "result"]) }),
        ]);
        carry = Math.floor(total / 10);
        rec.record("carry", `Next carry is \`${carry}\`.`, [
          varsPanel("vars", "", [v("carry", carry, { changed: true })]),
        ]);
        i += 1;
      }
      return rec.done("done", `Return \`${fmt(out)}\`.`, [
        arrayPanel("out", "out", out, {
          tones: Object.fromEntries(out.map((_, k) => [k, "result" as const])),
        }),
        varsPanel("vars", "", [v("answer", fmt(out), { tone: "result" })]),
      ]);
    },
  },
};

export const mergeTwoSortedLists: Solver = {
  id: "merge-two-sorted-lists",
  slugs: ["merge-two-sorted-lists"],
  label: "merge two sorted lists",
  inputs: [
    { name: "l1", label: "l1", type: "int[]", default: "[1, 2, 4]" },
    { name: "l2", label: "l2", type: "int[]", default: "[1, 3, 4]" },
  ],
  examples: [
    {
      input: { l1: "[1, 2, 4]", l2: "[1, 3, 4]" },
      output: "[1, 1, 2, 3, 4, 4]",
    },
    {
      input: { l1: "[]", l2: "[0]" },
      output: "[0]",
    },
  ],
  approach: {
    id: "merge-two-sorted-lists",
    title: "Two pointers, always take the smaller head",
    kind: "optimal",
    summary:
      "Both lists are already sorted. At each step emit the smaller current head and advance that list.",
    intuition: [
      {
        type: "p",
        text: "Same merge as in merge-sort. Because each head is the smallest remaining value on its side, the global next value is `min(l1[i], l2[j])`.",
      },
    ],
    steps: [
      "Walk `i` on `l1` and `j` on `l2`.",
      "While both remain, append the smaller value and advance that pointer.",
      "Append whatever is left on the other list.",
    ],
    complexity: { time: "O(n + m)", space: "O(n + m)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def mergeTwoLists(self, l1: list[int], l2: list[int]) -> list[int]:
                  out: list[int] = []
                  i = j = 0
                  while i < len(l1) and j < len(l2):
                      if l1[i] <= l2[j]:
                          out.append(l1[i])
                          i += 1
                      else:
                          out.append(l2[j])
                          j += 1
                  out.extend(l1[i:])
                  out.extend(l2[j:])
                  return out
        `,
        markers: {
          init: "i = j = 0",
          loop: "while i < len(l1) and j < len(l2)",
          take1: "out.append(l1[i])",
          take2: "out.append(l2[j])",
          tail: "out.extend(l1[i:])",
          done: "return out",
        },
      },
      go: {
        source: go`
          func mergeTwoLists(l1 []int, l2 []int) []int {
              out := []int{}
              i, j := 0, 0
              for i < len(l1) && j < len(l2) {
                  if l1[i] <= l2[j] {
                      out = append(out, l1[i])
                      i++
                  } else {
                      out = append(out, l2[j])
                      j++
                  }
              }
              out = append(out, l1[i:]...)
              out = append(out, l2[j:]...)
              return out
          }
        `,
        markers: {
          init: "i, j := 0, 0",
          loop: "for i < len(l1) && j < len(l2)",
          take1: "out = append(out, l1[i])",
          take2: "out = append(out, l2[j])",
          tail: "out = append(out, l1[i:]...)",
          done: "return out",
        },
      },
    },
  },
  traces: {
    "merge-two-sorted-lists": (input) => {
      const l1 = input.l1 as number[];
      const l2 = input.l2 as number[];
      const rec = new Recorder();
      const out: number[] = [];
      let i = 0;
      let j = 0;
      rec.record("init", "Both lists are sorted. Take the smaller head each time.", [
        arrayPanel("l1", "l1", l1),
        arrayPanel("l2", "l2", l2),
      ]);
      while (i < l1.length && j < l2.length) {
        rec.record("loop", `Compare \`${l1[i]}\` and \`${l2[j]}\`.`, [
          arrayPanel("l1", "l1", l1, {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "active"]),
          }),
          arrayPanel("l2", "l2", l2, {
            pointers: [ptr(j, "j", "blue")],
            tones: tones([j, "active"]),
          }),
        ]);
        if (l1[i]! <= l2[j]!) {
          out.push(l1[i]!);
          rec.record("take1", `Take \`${l1[i]}\` from l1.`, [
            arrayPanel("out", "out", out, { tones: tones([out.length - 1, "result"]) }),
          ]);
          i += 1;
        } else {
          out.push(l2[j]!);
          rec.record("take2", `Take \`${l2[j]}\` from l2.`, [
            arrayPanel("out", "out", out, { tones: tones([out.length - 1, "result"]) }),
          ]);
          j += 1;
        }
      }
      rec.record("tail", "Append the leftover tail.", [
        arrayPanel("l1", "l1", l1, { pointers: i < l1.length ? [ptr(i, "i", "red")] : [] }),
        arrayPanel("l2", "l2", l2, { pointers: j < l2.length ? [ptr(j, "j", "blue")] : [] }),
      ]);
      out.push(...l1.slice(i), ...l2.slice(j));
      return rec.done("done", `Return \`${fmt(out)}\`.`, [
        arrayPanel("out", "out", out),
        varsPanel("vars", "", [v("answer", fmt(out), { tone: "result" })]),
      ]);
    },
  },
};

export const linkedListCycle: Solver = {
  id: "linked-list-cycle",
  slugs: ["linked-list-cycle"],
  label: "Floyd cycle detect",
  inputs: [
    { name: "head", label: "head", type: "int[]", default: "[3, 2, 0, -4]" },
    { name: "pos", label: "pos (−1 = none)", type: "int", default: "1" },
  ],
  examples: [
    {
      input: { head: "[3, 2, 0, -4]", pos: "1" },
      output: "true",
      explanation: "The tail links back to index 1, so the walk loops.",
    },
    {
      input: { head: "[1, 2]", pos: "-1" },
      output: "false",
      explanation: "No back edge — the walk ends.",
    },
  ],
  approach: {
    id: "linked-list-cycle",
    title: "Floyd: slow + fast",
    kind: "optimal",
    summary:
      "`pos` is the index the tail links back to (`−1` = acyclic). Slow walks one step, fast walks two. If they meet, there is a cycle.",
    intuition: [
      {
        type: "p",
        text: "On a cycle the fast pointer laps the slow one. On a line it hits the end first. No extra set of visited nodes.",
      },
    ],
    steps: [
      "If `pos < 0` or the list is empty, return false.",
      "Advance slow by 1 and fast by 2 (wrapping the tail to `pos`).",
      "If they land on the same index, return true.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def hasCycle(self, head: list[int], pos: int) -> bool:
                  n = len(head)
                  if n == 0 or pos < 0:
                      return False
                  def nxt(i: int) -> int:
                      return pos if i == n - 1 else i + 1
                  slow = fast = 0
                  while True:
                      slow = nxt(slow)
                      fast = nxt(nxt(fast))
                      if slow == fast:
                          return True
        `,
        markers: {
          empty: "return False",
          init: "slow = fast = 0",
          loop: "while True",
          step: "slow = nxt(slow)",
          hit: "return True",
        },
      },
      go: {
        source: go`
          func hasCycle(head []int, pos int) bool {
              n := len(head)
              if n == 0 || pos < 0 {
                  return false
              }
              nxt := func(i int) int {
                  if i == n-1 {
                      return pos
                  }
                  return i + 1
              }
              slow, fast := 0, 0
              for {
                  slow = nxt(slow)
                  fast = nxt(nxt(fast))
                  if slow == fast {
                      return true
                  }
              }
          }
        `,
        markers: {
          empty: "return false",
          init: "slow, fast := 0, 0",
          loop: "for {",
          step: "slow = nxt(slow)",
          hit: "return true",
        },
      },
    },
  },
  traces: {
    "linked-list-cycle": (input) => {
      const head = input.head as number[];
      const pos = input.pos as number;
      const rec = new Recorder();
      const n = head.length;
      if (n === 0 || pos < 0) {
        rec.record("init", "No back edge — the list is a line.", [
          arrayPanel("head", "head", head),
          varsPanel("vars", "", [v("pos", pos)]),
        ]);
        return rec.done("empty", "Return `false`.", [
          varsPanel("vars", "", [v("answer", false, { tone: "result" })]),
        ]);
      }
      const nxt = (i: number) => (i === n - 1 ? pos : i + 1);
      let slow = 0;
      let fast = 0;
      rec.record("init", `Tail links back to index ${pos}. Slow ×1, fast ×2.`, [
        arrayPanel("head", "head", head, {
          pointers: [ptr(0, "slow", "red"), ptr(0, "fast", "blue")],
        }),
      ]);
      while (true) {
        rec.record("loop", "Advance both pointers.", [
          arrayPanel("head", "head", head, {
            pointers: [ptr(slow, "slow", "red"), ptr(fast, "fast", "blue")],
          }),
        ]);
        slow = nxt(slow);
        fast = nxt(nxt(fast));
        rec.record("step", `slow → ${slow}, fast → ${fast}.`, [
          arrayPanel("head", "head", head, {
            pointers: [ptr(slow, "slow", "red"), ptr(fast, "fast", "blue")],
            tones: tones([slow, "active"], [fast, "active"]),
          }),
        ]);
        if (slow === fast) {
          return rec.done("hit", "Pointers met — return `true`.", [
            arrayPanel("head", "head", head, {
              tones: tones([slow, "result"]),
              pointers: [ptr(slow, "meet", "green")],
            }),
            varsPanel("vars", "", [v("answer", true, { tone: "result" })]),
          ]);
        }
      }
    },
  },
};

export const middleOfTheLinkedList: Solver = {
  id: "middle-of-the-linked-list",
  slugs: ["middle-of-the-linked-list"],
  label: "slow / fast middle",
  inputs: [{ name: "head", label: "head", type: "int[]", default: "[1, 2, 3, 4, 5]" }],
  examples: [
    { input: { head: "[1, 2, 3, 4, 5]" }, output: "[3, 4, 5]" },
    { input: { head: "[1, 2, 3, 4, 5, 6]" }, output: "[4, 5, 6]" },
  ],
  approach: {
    id: "middle-of-the-linked-list",
    title: "Fast reaches the end; slow is at the middle",
    kind: "optimal",
    summary:
      "Slow walks one node, fast walks two. When fast runs out, slow sits on the second middle for even length.",
    intuition: [
      {
        type: "p",
        text: "Fast covers twice the ground, so it finishes in n/2 slow steps — exactly the midpoint.",
      },
    ],
    steps: [
      "Both pointers start at the head.",
      "While fast can take two steps, move slow once and fast twice.",
      "Return the suffix starting at slow.",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    traceable: true,
    code: {
      python: {
        source: py`
          class Solution:
              def middleNode(self, head: list[int]) -> list[int]:
                  slow = fast = 0
                  n = len(head)
                  while fast + 1 < n:
                      slow += 1
                      fast += 2
                  return head[slow:]
        `,
        markers: {
          init: "slow = fast = 0",
          loop: "while fast + 1 < n",
          step: "slow += 1",
          done: "return head[slow:]",
        },
      },
      go: {
        source: go`
          func middleNode(head []int) []int {
              slow, fast := 0, 0
              n := len(head)
              for fast+1 < n {
                  slow++
                  fast += 2
              }
              return head[slow:]
          }
        `,
        markers: {
          init: "slow, fast := 0, 0",
          loop: "for fast+1 < n",
          step: "slow++",
          done: "return head[slow:]",
        },
      },
    },
  },
  traces: {
    "middle-of-the-linked-list": (input) => {
      const head = input.head as number[];
      const rec = new Recorder();
      let slow = 0;
      let fast = 0;
      const n = head.length;
      rec.record("init", "Slow ×1, fast ×2. Fast running out means slow is mid.", [
        arrayPanel("head", "head", head, {
          pointers: [ptr(0, "slow", "red"), ptr(0, "fast", "blue")],
        }),
      ]);
      while (fast + 1 < n) {
        rec.record("loop", `fast=${fast} can still take two steps.`, [
          arrayPanel("head", "head", head, {
            pointers: [ptr(slow, "slow", "red"), ptr(fast, "fast", "blue")],
          }),
        ]);
        slow += 1;
        fast += 2;
        rec.record("step", `slow → ${slow}, fast → ${fast}.`, [
          arrayPanel("head", "head", head, {
            pointers: [ptr(slow, "slow", "red"), ptr(Math.min(fast, n - 1), "fast", "blue")],
            tones: tones([slow, "active"]),
          }),
        ]);
      }
      const out = head.slice(slow);
      return rec.done("done", `Return \`${fmt(out)}\`.`, [
        arrayPanel("head", "head", head, { tones: tones([slow, "result"]) }),
        varsPanel("vars", "", [v("answer", fmt(out), { tone: "result" })]),
      ]);
    },
  },
};
