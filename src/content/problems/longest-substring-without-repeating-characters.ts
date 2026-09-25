import type { Problem } from "@/lib/types";
import { arrayPanel, mapPanel, ptr, rangeTones, tones } from "@/lib/viz/builders";

import { go, py } from "./_helpers";

export const longestSubstringWithoutRepeatingCharacters: Problem = {
  id: 3,
  slug: "longest-substring-without-repeating-characters",
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  topics: ["Hash Table", "String", "Sliding Window"],
  blurb:
    "The sliding window pattern in its purest form — and the jump-ahead trick that makes it one pass.",

  statement: [
    {
      type: "p",
      text: "Given a string `s`, find the length of the **longest substring** without duplicate characters.",
    },
  ],

  examples: [
    {
      input: { s: '"abcabcbb"' },
      output: "3",
      explanation: 'The answer is `"abc"`, with the length of 3.',
      viz: [
        arrayPanel("s", "s", [..."abcabcbb"], {
          tones: rangeTones(0, 2, "result"),
          window: [0, 2],
        }),
      ],
    },
    {
      input: { s: '"bbbbb"' },
      output: "1",
      explanation: 'The answer is `"b"`, with the length of 1.',
    },
    {
      input: { s: '"pwwkew"' },
      output: "3",
      explanation:
        'The answer is `"wke"`, with the length of 3. Notice that `"pwke"` is a *subsequence* and not a substring.',
      viz: [
        arrayPanel("s", "s", [..."pwwkew"], { tones: rangeTones(2, 4, "result"), window: [2, 4] }),
      ],
    },
  ],

  constraints: [
    "`0 <= s.length <= 5 * 10^4`",
    "`s` consists of English letters, digits, symbols and spaces.",
  ],

  insights: [
    { type: "h3", text: "Substring, not subsequence" },
    {
      type: "p",
      text: "A substring is **contiguous** — you can't skip characters. That's what makes a window the right tool: the set of candidate answers is exactly the set of intervals `[left, right]`, and we can slide one across the string.",
    },
    { type: "h3", text: "Why a window can move in one direction only" },
    {
      type: "p",
      text: "Suppose `s[left..right]` has no duplicates and we extend to `right + 1`. Either it's still duplicate-free (great, maybe a new best) or the new character already appears inside the window. In the second case the window must shrink from the left until that earlier copy is gone. Crucially, `left` never needs to move backwards: any window starting *before* the current `left` would contain the duplicate we just evicted.",
    },
    {
      type: "viz",
      caption:
        'Window "wke" (indices 2–4). Extending to index 5 brings in a second "w" — the old "w" at index 2 must leave, so left jumps to 3.',
      state: [
        arrayPanel("s", "s", [..."pwwkew"], {
          tones: { ...tones([0, "dim"], [1, "dim"]), ...rangeTones(2, 4, "window"), 5: "danger" },
          pointers: [ptr(2, "left", "blue"), ptr(5, "right", "red")],
          window: [2, 4],
        }),
        mapPanel(
          "last",
          "last index of each char",
          { p: 0, w: 2, k: 3, e: 4 },
          { highlightKey: "w" },
        ),
      ],
    },
    { type: "h3", text: "Jumping instead of stepping" },
    {
      type: "p",
      text: "The straightforward version shrinks `left` one step at a time while maintaining a set of characters in the window. It works, and it's O(n) because each index enters and leaves the window once. But if we store *where* each character was last seen, we can move `left` directly to `last[ch] + 1` in a single assignment.",
    },
    {
      type: "p",
      text: "One subtlety: `last[ch]` may be **stale** — a position we already slid past. Only jump when `last[ch] >= left`. Forgetting that check makes `left` move backwards and produces windows with duplicates.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Pattern recognition",
      text: "“Longest/shortest contiguous run satisfying a property that only gets *worse* as you add elements” is the sliding-window signature. Minimum Window Substring (76), Longest Repeating Character Replacement (424) and Permutation in String (567) are the same skeleton with a different bookkeeping structure.",
    },
  ],

  approaches: [
    {
      id: "brute-force",
      title: "Brute force — check every substring",
      kind: "brute-force",
      summary: "For every start, extend right until a repeat appears.",
      intuition: [
        {
          type: "p",
          text: "For each starting index, grow a set of seen characters until you hit one already in the set. O(n²) with an O(1) set — acceptable for tiny inputs, not for 5·10⁴.",
        },
      ],
      steps: ["For each `i`: clear the set; for `j ≥ i` add `s[j]` until a repeat; update best."],
      complexity: { time: "O(n²)", space: "O(min(n, alphabet))" },
      traceable: false,
      code: {
        python: {
          source: py`
            class Solution:
                def lengthOfLongestSubstring(self, s: str) -> int:
                    best = 0
                    for i in range(len(s)):
                        seen: set[str] = set()
                        for j in range(i, len(s)):
                            if s[j] in seen:
                                break
                            seen.add(s[j])
                        best = max(best, len(seen))
                    return best
          `,
          markers: {},
        },
        go: {
          source: go`
            func lengthOfLongestSubstring(s string) int {
                best := 0
                for i := 0; i < len(s); i++ {
                    seen := make(map[byte]bool)
                    for j := i; j < len(s); j++ {
                        if seen[s[j]] {
                            break
                        }
                        seen[s[j]] = true
                    }
                    best = max(best, len(seen))
                }
                return best
            }
          `,
          markers: {},
        },
      },
    },
    {
      id: "sliding-window",
      title: "Sliding window with last-seen index",
      kind: "optimal",
      summary:
        "Grow right one step at a time; on a repeat, jump left past the previous occurrence.",
      intuition: [
        {
          type: "p",
          text: "Maintain `last[ch]` = most recent index of each character. When `s[right]` was last seen inside the current window, move `left` to just after that position. Then record the new index and measure the window.",
        },
      ],
      steps: [
        "`last = {}`, `left = 0`, `best = 0`.",
        "For each `right`: if `s[right]` in `last` **and** `last[s[right]] >= left`, set `left = last[s[right]] + 1`.",
        "`last[s[right]] = right`; `best = max(best, right − left + 1)`.",
        "Return `best`.",
      ],
      complexity: {
        time: "O(n)",
        space: "O(min(n, alphabet))",
        notes:
          "Each character is processed once; the map holds at most one entry per distinct character.",
      },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def lengthOfLongestSubstring(self, s: str) -> int:
                    last: dict[str, int] = {}  # char -> most recent index
                    left = 0                   # window is s[left..right]
                    best = 0
                    for right, ch in enumerate(s):
                        if ch in last and last[ch] >= left:
                            left = last[ch] + 1  # jump past the previous occurrence
                        last[ch] = right
                        best = max(best, right - left + 1)
                    return best
          `,
          markers: {
            init: "last: dict[str, int] = {}",
            loop: "for right, ch in enumerate(s)",
            dup: "if ch in last and last[ch] >= left",
            shrink: "left = last[ch] + 1",
            store: "last[ch] = right",
            best: "best = max(best, right - left + 1)",
            end: "return best",
          },
        },
        go: {
          source: go`
            func lengthOfLongestSubstring(s string) int {
                last := make(map[byte]int) // char -> most recent index
                left, best := 0, 0         // window is s[left..right]
                for right := 0; right < len(s); right++ {
                    ch := s[right]
                    if i, seen := last[ch]; seen && i >= left {
                        left = i + 1 // jump past the previous occurrence
                    }
                    last[ch] = right
                    best = max(best, right-left+1)
                }
                return best
            }
          `,
          markers: {
            init: "last := make(map[byte]int)",
            loop: "for right := 0; right < len(s); right++",
            dup: "if i, seen := last[ch]; seen && i >= left",
            shrink: "left = i + 1",
            store: "last[ch] = right",
            best: "best = max(best, right-left+1)",
            end: "return best",
          },
        },
      },
    },
  ],

  inputs: [{ name: "s", label: "s", type: "string", default: "abcabcbb" }],

  related: ["two-sum", "container-with-most-water"],
};
