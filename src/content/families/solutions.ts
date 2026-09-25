import type { Approach, InputField } from "@/lib/types";

import { go, py } from "../problems/_helpers";

import type { FamilyId } from "./pick";

const hashing: Approach = {
  id: "hashing",
  title: "One-pass hash set",
  kind: "optimal",
  summary: "Remember every value you have already seen. A hit means the pattern fired.",
  intuition: [
    {
      type: "p",
      text: "A hash set answers *“have I seen this before?”* in expected O(1). Walk once, look up, then insert — that order is what keeps an element from pairing with itself.",
    },
  ],
  steps: [
    "Create an empty set `seen`.",
    "For each value `x`, if `x` is already in `seen`, return true.",
    "Otherwise insert `x` and continue.",
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
};

const pointers: Approach = {
  id: "pointers",
  title: "Two pointers from the ends",
  kind: "optimal",
  summary: "On a sorted array the pair that sums to `target` is found by walking inward.",
  intuition: [
    {
      type: "p",
      text: "If the current sum is too small, the only way to grow it is to advance `lo`. If it is too big, retreat `hi`. Each step discards an index forever, so the walk is linear.",
    },
  ],
  steps: [
    "Set `lo = 0`, `hi = n−1`.",
    "While `lo < hi`, compare `nums[lo] + nums[hi]` to `target`.",
    "Equal → return the indices. Too small → `lo++`. Too big → `hi--`.",
  ],
  complexity: { time: "O(n)", space: "O(1)", notes: "Assumes the array is sorted." },
  traceable: true,
  code: {
    python: {
      source: py`
        class Solution:
            def twoSumSorted(self, nums: list[int], target: int) -> list[int]:
                lo, hi = 0, len(nums) - 1
                while lo < hi:
                    s = nums[lo] + nums[hi]
                    if s == target:
                        return [lo, hi]
                    if s < target:
                        lo += 1
                    else:
                        hi -= 1
                return []
      `,
      markers: {
        init: "lo, hi = 0, len(nums) - 1",
        loop: "while lo < hi",
        sum: "s = nums[lo] + nums[hi]",
        hit: "return [lo, hi]",
        grow: "lo += 1",
        shrink: "hi -= 1",
        miss: "return []",
      },
    },
    go: {
      source: go`
        func twoSumSorted(nums []int, target int) []int {
            lo, hi := 0, len(nums)-1
            for lo < hi {
                s := nums[lo] + nums[hi]
                if s == target {
                    return []int{lo, hi}
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
        init: "lo, hi := 0, len(nums)-1",
        loop: "for lo < hi",
        sum: "s := nums[lo] + nums[hi]",
        hit: "return []int{lo, hi}",
        grow: "lo++",
        shrink: "hi--",
        miss: "return nil",
      },
    },
  },
};

const window: Approach = {
  id: "window",
  title: "Sliding window",
  kind: "optimal",
  summary: "Grow `right`, shrink `left` the moment the window breaks its invariant.",
  intuition: [
    {
      type: "p",
      text: "The window `[left, right]` is the longest suffix ending at `right` that still obeys the rule (here: all unique). Last-seen indices tell you exactly how far to jump `left`.",
    },
  ],
  steps: [
    "Walk `right` across the string.",
    "If `s[right]` was already inside the window, jump `left` past its last index.",
    "Record the last-seen index and update the best length.",
  ],
  complexity: { time: "O(n)", space: "O(σ)" },
  traceable: true,
  code: {
    python: {
      source: py`
        class Solution:
            def lengthOfLongestSubstring(self, s: str) -> int:
                last: dict[str, int] = {}
                left = 0
                best = 0
                for right, ch in enumerate(s):
                    if ch in last and last[ch] >= left:
                        left = last[ch] + 1
                    last[ch] = right
                    best = max(best, right - left + 1)
                return best
      `,
      markers: {
        init: "last: dict[str, int] = {}",
        loop: "for right, ch in enumerate(s)",
        shrink: "left = last[ch] + 1",
        store: "last[ch] = right",
        best: "best = max(best, right - left + 1)",
        done: "return best",
      },
    },
    go: {
      source: go`
        func lengthOfLongestSubstring(s string) int {
            last := map[byte]int{}
            left, best := 0, 0
            for right := 0; right < len(s); right++ {
                ch := s[right]
                if i, ok := last[ch]; ok && i >= left {
                    left = i + 1
                }
                last[ch] = right
                if n := right - left + 1; n > best {
                    best = n
                }
            }
            return best
        }
      `,
      markers: {
        init: "last := map[byte]int{}",
        loop: "for right := 0; right < len(s); right++",
        shrink: "left = i + 1",
        store: "last[ch] = right",
        best: "best = n",
        done: "return best",
      },
    },
  },
};

const stack: Approach = {
  id: "stack",
  title: "Stack of openers",
  kind: "optimal",
  summary: "Push openers; a closer is legal only if it matches the current top.",
  intuition: [
    {
      type: "p",
      text: "The stack is the nest of brackets that are still open. A mismatch or a leftover opener at the end is an immediate no.",
    },
  ],
  steps: [
    "On an opener, push.",
    "On a closer, the top must be its partner — otherwise reject.",
    "Return true only if the stack is empty at the end.",
  ],
  complexity: { time: "O(n)", space: "O(n)" },
  traceable: true,
  code: {
    python: {
      source: py`
        class Solution:
            def isValid(self, s: str) -> bool:
                pairs = {")": "(", "]": "[", "}": "{"}
                stack: list[str] = []
                for ch in s:
                    if ch in pairs:
                        if not stack or stack[-1] != pairs[ch]:
                            return False
                        stack.pop()
                    else:
                        stack.append(ch)
                return not stack
      `,
      markers: {
        init: "stack: list[str] = []",
        loop: "for ch in s",
        close: "if ch in pairs",
        bad: "return False",
        pop: "stack.pop()",
        push: "stack.append(ch)",
        done: "return not stack",
      },
    },
    go: {
      source: go`
        func isValid(s string) bool {
            pairs := map[rune]rune{')': '(', ']': '[', '}': '{'}
            stack := []rune{}
            for _, ch := range s {
                if open, ok := pairs[ch]; ok {
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
        init: "stack := []rune{}",
        loop: "for _, ch := range s",
        close: "if open, ok := pairs[ch]; ok",
        bad: "return false",
        pop: "stack = stack[:len(stack)-1]",
        push: "stack = append(stack, ch)",
        done: "return len(stack) == 0",
      },
    },
  },
};

const bsearch: Approach = {
  id: "bsearch",
  title: "Binary search",
  kind: "optimal",
  summary: "Halve the sorted range until the target is found or the range collapses.",
  intuition: [
    {
      type: "p",
      text: "Because the slice is sorted, comparing `nums[mid]` to `target` tells you which half can be thrown away. That is the whole algorithm.",
    },
  ],
  steps: [
    "While `lo <= hi`, pick `mid`.",
    "Equal → return `mid`. Too small → search right. Too big → search left.",
    "Empty range → not found (`-1`).",
  ],
  complexity: { time: "O(log n)", space: "O(1)" },
  traceable: true,
  code: {
    python: {
      source: py`
        class Solution:
            def search(self, nums: list[int], target: int) -> int:
                lo, hi = 0, len(nums) - 1
                while lo <= hi:
                    mid = (lo + hi) // 2
                    if nums[mid] == target:
                        return mid
                    if nums[mid] < target:
                        lo = mid + 1
                    else:
                        hi = mid - 1
                return -1
      `,
      markers: {
        init: "lo, hi = 0, len(nums) - 1",
        loop: "while lo <= hi",
        mid: "mid = (lo + hi) // 2",
        hit: "return mid",
        right: "lo = mid + 1",
        left: "hi = mid - 1",
        miss: "return -1",
      },
    },
    go: {
      source: go`
        func search(nums []int, target int) int {
            lo, hi := 0, len(nums)-1
            for lo <= hi {
                mid := (lo + hi) / 2
                if nums[mid] == target {
                    return mid
                }
                if nums[mid] < target {
                    lo = mid + 1
                } else {
                    hi = mid - 1
                }
            }
            return -1
        }
      `,
      markers: {
        init: "lo, hi := 0, len(nums)-1",
        loop: "for lo <= hi",
        mid: "mid := (lo + hi) / 2",
        hit: "return mid",
        right: "lo = mid + 1",
        left: "hi = mid - 1",
        miss: "return -1",
      },
    },
  },
};

const dp: Approach = {
  id: "dp",
  title: "Bottom-up DP",
  kind: "optimal",
  summary: "Each answer is a combination of smaller answers already in the table.",
  intuition: [
    {
      type: "p",
      text: "The classic recurrence `dp[i] = dp[i−1] + dp[i−2]` (ways to climb `i` stairs) is the shape of a huge family of 1-D DP problems. Fill left to right; two rolling variables are enough.",
    },
  ],
  steps: [
    "Base: `a, b = 1, 1` (ways to reach step 0 and 1).",
    "For `i` from 2 to `n`, `a, b = b, a+b`.",
    "Return `b`.",
  ],
  complexity: { time: "O(n)", space: "O(1)" },
  traceable: true,
  code: {
    python: {
      source: py`
        class Solution:
            def climbStairs(self, n: int) -> int:
                a, b = 1, 1
                for _ in range(2, n + 1):
                    a, b = b, a + b
                return b
      `,
      markers: {
        init: "a, b = 1, 1",
        loop: "for _ in range(2, n + 1)",
        step: "a, b = b, a + b",
        done: "return b",
      },
    },
    go: {
      source: go`
        func climbStairs(n int) int {
            a, b := 1, 1
            for i := 2; i <= n; i++ {
                a, b = b, a+b
            }
            return b
        }
      `,
      markers: {
        init: "a, b := 1, 1",
        loop: "for i := 2; i <= n; i++",
        step: "a, b = b, a+b",
        done: "return b",
      },
    },
  },
};

const walk: Approach = {
  id: "walk",
  title: "BFS flood fill",
  kind: "optimal",
  summary: "Each unvisited land cell starts an island; BFS paints the whole component.",
  intuition: [
    {
      type: "p",
      text: "A grid / graph walk is the same idea on trees, mazes and adjacency lists: mark what you touch so you never count it twice, and expand to neighbours.",
    },
  ],
  steps: [
    "Scan every cell.",
    "On an unvisited `'1'`, increment the count and BFS-paint the island to `'0'`.",
  ],
  complexity: { time: "O(mn)", space: "O(mn)" },
  traceable: true,
  code: {
    python: {
      source: py`
        class Solution:
            def numIslands(self, grid: list[str]) -> int:
                if not grid:
                    return 0
                rows, cols = len(grid), len(grid[0])
                g = [list(row) for row in grid]
                islands = 0

                def flood(sr: int, sc: int) -> None:
                    q = [(sr, sc)]
                    g[sr][sc] = "0"
                    while q:
                        r, c = q.pop(0)
                        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                            nr, nc = r + dr, c + dc
                            if 0 <= nr < rows and 0 <= nc < cols and g[nr][nc] == "1":
                                g[nr][nc] = "0"
                                q.append((nr, nc))

                for r in range(rows):
                    for c in range(cols):
                        if g[r][c] == "1":
                            islands += 1
                            flood(r, c)
                return islands
      `,
      markers: {
        init: "islands = 0",
        scan: 'if g[r][c] == "1"',
        bump: "islands += 1",
        flood: "def flood(sr: int, sc: int) -> None",
        done: "return islands",
      },
    },
    go: {
      source: go`
        func numIslands(grid []string) int {
            if len(grid) == 0 {
                return 0
            }
            rows, cols := len(grid), len(grid[0])
            g := make([][]byte, rows)
            for i, row := range grid {
                g[i] = []byte(row)
            }
            islands := 0
            dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
            flood := func(sr, sc int) {
                q := [][2]int{{sr, sc}}
                g[sr][sc] = '0'
                for len(q) > 0 {
                    r, c := q[0][0], q[0][1]
                    q = q[1:]
                    for _, d := range dirs {
                        nr, nc := r+d[0], c+d[1]
                        if nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] == '1' {
                            g[nr][nc] = '0'
                            q = append(q, [2]int{nr, nc})
                        }
                    }
                }
            }
            for r := 0; r < rows; r++ {
                for c := 0; c < cols; c++ {
                    if g[r][c] == '1' {
                        islands++
                        flood(r, c)
                    }
                }
            }
            return islands
        }
      `,
      markers: {
        init: "islands := 0",
        scan: "if g[r][c] == '1'",
        bump: "islands++",
        flood: "flood := func(sr, sc int)",
        done: "return islands",
      },
    },
  },
};

const list: Approach = {
  id: "list",
  title: "Reverse the list in place",
  kind: "optimal",
  summary: "Three pointers: `prev`, `cur`, `next`. Flip one edge per step.",
  intuition: [
    {
      type: "p",
      text: "You only ever need the next node saved before you rewire `cur.next = prev`. Walk until `cur` is nil; `prev` is the new head.",
    },
  ],
  steps: [
    "`prev = null`, `cur = head`.",
    "Save `next`, flip the edge, slide `prev` and `cur` forward.",
    "Return `prev`.",
  ],
  complexity: { time: "O(n)", space: "O(1)" },
  traceable: true,
  code: {
    python: {
      source: py`
        class Solution:
            def reverseList(self, head: list[int]) -> list[int]:
                prev: list[int] = []
                cur = head
                while cur:
                    nxt = cur[1:]
                    prev = [cur[0], *prev]
                    cur = nxt
                return prev
      `,
      markers: {
        init: "prev: list[int] = []",
        loop: "while cur",
        save: "nxt = cur[1:]",
        flip: "prev = [cur[0], *prev]",
        step: "cur = nxt",
        done: "return prev",
      },
    },
    go: {
      source: go`
        func reverseList(head []int) []int {
            prev := []int{}
            cur := head
            for len(cur) > 0 {
                nxt := cur[1:]
                prev = append([]int{cur[0]}, prev...)
                cur = nxt
            }
            return prev
        }
      `,
      markers: {
        init: "prev := []int{}",
        loop: "for len(cur) > 0",
        save: "nxt := cur[1:]",
        flip: "prev = append([]int{cur[0]}, prev...)",
        step: "cur = nxt",
        done: "return prev",
      },
    },
  },
};

const scan: Approach = {
  id: "scan",
  title: "Single pass",
  kind: "optimal",
  summary: "Keep a running answer while you walk the array once.",
  intuition: [
    {
      type: "p",
      text: "A surprising number of interview problems collapse to *“look at each element, update one or two variables.”* Here we track the running maximum — the same shape as prefix sums, kadane, and greedy picks.",
    },
  ],
  steps: [
    "Seed `best` with the first element.",
    "For each later `x`, set `best = max(best, x)`.",
    "Return `best`.",
  ],
  complexity: { time: "O(n)", space: "O(1)" },
  traceable: true,
  code: {
    python: {
      source: py`
        class Solution:
            def findMax(self, nums: list[int]) -> int:
                best = nums[0]
                for x in nums[1:]:
                    if x > best:
                        best = x
                return best
      `,
      markers: {
        init: "best = nums[0]",
        loop: "for x in nums[1:]",
        check: "if x > best",
        upd: "best = x",
        done: "return best",
      },
    },
    go: {
      source: go`
        func findMax(nums []int) int {
            best := nums[0]
            for _, x := range nums[1:] {
                if x > best {
                    best = x
                }
            }
            return best
        }
      `,
      markers: {
        init: "best := nums[0]",
        loop: "for _, x := range nums[1:]",
        check: "if x > best",
        upd: "best = x",
        done: "return best",
      },
    },
  },
};

export const FAMILY_APPROACH: Record<FamilyId, Approach> = {
  hashing,
  pointers,
  window,
  stack,
  bsearch,
  dp,
  walk,
  list,
  scan,
};

export const FAMILY_INPUTS: Record<FamilyId, InputField[]> = {
  hashing: [{ name: "nums", label: "nums", type: "int[]", default: "[1, 2, 3, 1]" }],
  pointers: [
    { name: "nums", label: "nums (sorted)", type: "int[]", default: "[2, 7, 11, 15]" },
    { name: "target", label: "target", type: "int", default: "9" },
  ],
  window: [{ name: "s", label: "s", type: "string", default: "abcabcbb" }],
  stack: [{ name: "s", label: "s", type: "string", default: "()[]{}" }],
  bsearch: [
    { name: "nums", label: "nums (sorted)", type: "int[]", default: "[-1, 0, 3, 5, 9, 12]" },
    { name: "target", label: "target", type: "int", default: "9" },
  ],
  dp: [{ name: "n", label: "n", type: "int", default: "5" }],
  walk: [{ name: "grid", label: "grid", type: "string[]", default: "[110,010,001]" }],
  list: [{ name: "head", label: "head", type: "int[]", default: "[1, 2, 3, 4]" }],
  scan: [{ name: "nums", label: "nums", type: "int[]", default: "[2, 1, 5, 3]" }],
};
