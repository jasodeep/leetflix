import type { Problem } from "@/lib/types";
import { arrayPanel, ptr, stackPanel, tones } from "@/lib/viz/builders";

import { go, py } from "./_helpers";

export const validParentheses: Problem = {
  id: 20,
  slug: "valid-parentheses",
  title: "Valid Parentheses",
  difficulty: "Easy",
  topics: ["String", "Stack"],
  blurb: "The canonical stack problem. If you can explain LIFO with this, you understand stacks.",

  statement: [
    {
      type: "p",
      text: "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.",
    },
    { type: "p", text: "An input string is valid if:" },
    {
      type: "ol",
      items: [
        "Open brackets must be closed by the same type of brackets.",
        "Open brackets must be closed in the correct order.",
        "Every close bracket has a corresponding open bracket of the same type.",
      ],
    },
  ],

  examples: [
    { input: { s: '"()"' }, output: "true" },
    { input: { s: '"()[]{}"' }, output: "true" },
    {
      input: { s: '"(]"' },
      output: "false",
      explanation: "`]` arrives while `(` is still open — wrong type.",
      viz: [
        arrayPanel("s", "s", ["(", "]"], { tones: tones([0, "active"], [1, "danger"]) }),
        stackPanel("stack", "stack", ["("], "danger"),
      ],
    },
    {
      input: { s: '"([)]"' },
      output: "false",
      explanation:
        "Every bracket has a partner, but `)` closes before the more recent `[` is closed — wrong order.",
      viz: [
        arrayPanel("s", "s", ["(", "[", ")", "]"], {
          tones: tones([0, "visited"], [1, "active"], [2, "danger"]),
          pointers: [ptr(2, "ch", "red")],
        }),
        stackPanel("stack", "stack", ["(", "["], "danger"),
      ],
    },
    { input: { s: '"{[]}"' }, output: "true" },
  ],

  constraints: ["`1 <= s.length <= 10^4`", "`s` consists of parentheses only `()[]{}`."],

  insights: [
    { type: "h3", text: "Why counting is not enough" },
    {
      type: "p",
      text: "A tempting first idea: count opens and closes per type and check they match. `([)]` defeats it — every count balances, yet it's invalid. Rule 2 (*correct order*) means a close bracket must match the **most recently opened, not-yet-closed** bracket. That phrase — *most recent, not yet closed* — is the definition of a stack's top.",
    },
    { type: "h3", text: "The mental model" },
    {
      type: "p",
      text: "Think of opening brackets as opening nested boxes. You can only close the box you're currently inside. Reading left to right, each opener pushes you one level deeper; each closer must match the innermost box and pops you out one level. Finish inside no box and the string is valid.",
    },
    {
      type: "viz",
      caption:
        "`{[]}` mid-way: we've opened `{` then `[`. The next character must be `]`, because `[` is the innermost open box.",
      state: [
        arrayPanel("s", "s", ["{", "[", "]", "}"], {
          tones: tones([0, "visited"], [1, "visited"], [2, "active"]),
          pointers: [ptr(2, "next", "blue")],
        }),
        stackPanel("stack", "stack", ["{", "["]),
      ],
    },
    { type: "h3", text: "Three ways to fail" },
    {
      type: "ul",
      items: [
        "**Wrong type**: a closer arrives whose partner isn't the top of the stack — `(]`.",
        "**Nothing to close**: a closer arrives while the stack is empty — `)(`.",
        "**Left open**: we run out of characters with the stack non-empty — `((`.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Early exit",
      text: "If `len(s)` is odd you can return `false` immediately — a valid string has an even number of brackets. It's a nice micro-optimisation to mention, not one to lead with.",
    },
  ],

  approaches: [
    {
      id: "stack",
      title: "Stack of open brackets",
      kind: "optimal",
      summary: "Push openers; on a closer, the top of the stack must be its matching opener.",
      intuition: [
        {
          type: "p",
          text: "Keep a stack of the brackets that are currently open. A closing bracket is only legal if the stack's top is its partner — pop it. Anything else is an immediate `false`. At the end, the stack must be empty.",
        },
        {
          type: "p",
          text: "A small `pairs` map (`close → open`) keeps the code free of a six-way `if/elif` chain and doubles as the *“is this a closing bracket?”* test.",
        },
      ],
      steps: [
        "Build `pairs = { ')': '(', ']': '[', '}': '{' }` and an empty stack.",
        "For each character: if it's a closer, the stack must be non-empty and its top must equal `pairs[ch]` — otherwise return `false`. Pop.",
        "If it's an opener, push it.",
        "Return `true` iff the stack is empty at the end.",
      ],
      complexity: {
        time: "O(n)",
        space: "O(n)",
        notes: "Worst case (all openers) the stack holds every character.",
      },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def isValid(self, s: str) -> bool:
                    pairs = {")": "(", "]": "[", "}": "{"}
                    stack: list[str] = []
                    for ch in s:
                        if ch in pairs:  # closing bracket
                            if not stack or stack[-1] != pairs[ch]:
                                return False
                            stack.pop()
                        else:  # opening bracket
                            stack.append(ch)
                    return not stack
          `,
          markers: {
            init: "stack: list[str] = []",
            loop: "for ch in s",
            closing: "if ch in pairs",
            mismatch: "if not stack or stack[-1] != pairs[ch]",
            reject: "return False",
            pop: "stack.pop()",
            push: "stack.append(ch)",
            end: "return not stack",
          },
        },
        go: {
          source: go`
            func isValid(s string) bool {
                pairs := map[rune]rune{')': '(', ']': '[', '}': '{'}
                stack := make([]rune, 0, len(s))
                for _, ch := range s {
                    if open, isClosing := pairs[ch]; isClosing {
                        if len(stack) == 0 || stack[len(stack)-1] != open {
                            return false
                        }
                        stack = stack[:len(stack)-1]
                    } else {
                        stack = append(stack, ch)
                    }
                }
                return len(stack) == 0
            }
          `,
          markers: {
            init: "stack := make([]rune",
            loop: "for _, ch := range s",
            closing: "if open, isClosing := pairs[ch]; isClosing",
            mismatch: "if len(stack) == 0 || stack[len(stack)-1] != open",
            reject: "return false",
            pop: "stack = stack[:len(stack)-1]",
            push: "stack = append(stack, ch)",
            end: "return len(stack) == 0",
          },
        },
      },
    },
  ],

  inputs: [
    {
      name: "s",
      label: "s",
      type: "string",
      default: "{[()]}()",
      hint: "Only ( ) [ ] { } are meaningful; anything else is treated as an opener.",
    },
  ],

  related: ["two-sum"],
};
