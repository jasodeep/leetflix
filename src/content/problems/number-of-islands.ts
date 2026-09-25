import type { Problem } from "@/lib/types";
import { gridPanel, varsPanel, v } from "@/lib/viz/builders";
import { gridKey, type GridCellTone } from "@/lib/viz/types";

import { go, py } from "./_helpers";

const cells = (rows: string[]): string[][] => rows.map((r) => [...r]);

const landWater = (
  rows: string[],
  extra: Record<string, GridCellTone> = {},
): Record<string, GridCellTone> => {
  const out: Record<string, GridCellTone> = {};
  rows.forEach((row, r) =>
    [...row].forEach((ch, c) => (out[gridKey(r, c)] = ch === "1" ? "land" : "water")),
  );
  return { ...out, ...extra };
};

const ex1 = ["11110", "11010", "11000", "00000"];
const ex2 = ["11000", "11000", "00100", "00011"];

export const numberOfIslands: Problem = {
  id: 200,
  slug: "number-of-islands",
  title: "Number of Islands",
  difficulty: "Medium",
  topics: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
  blurb: "Flood fill, the interview edition. Count components in a grid by sinking them as you go.",

  statement: [
    {
      type: "p",
      text: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return *the number of islands*.",
    },
    {
      type: "p",
      text: "An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    },
  ],

  examples: [
    {
      input: { grid: '["11110", "11010", "11000", "00000"]' },
      output: "1",
      explanation: "All the 1s are connected through shared edges — one island.",
      viz: [gridPanel("grid", "grid", cells(ex1), { tones: landWater(ex1) })],
    },
    {
      input: { grid: '["11000", "11000", "00100", "00011"]' },
      output: "3",
      explanation:
        "The 2×2 block, the lone cell at (2,2), and the pair at the bottom right. Diagonal contact doesn't count.",
      viz: [gridPanel("grid", "grid", cells(ex2), { tones: landWater(ex2) })],
    },
  ],

  constraints: [
    "`m == grid.length`",
    "`n == grid[i].length`",
    "`1 <= m, n <= 300`",
    "`grid[i][j]` is `'0'` or `'1'`.",
  ],

  insights: [
    { type: "h3", text: "This is a graph problem wearing a grid costume" },
    {
      type: "p",
      text: "Each land cell is a vertex; two land cells that share an edge (up/down/left/right — **not** diagonals) are connected. An island is a **connected component**. So the question is: how many connected components does this graph have? Counting components is a standard traversal exercise.",
    },
    { type: "h3", text: "Counting components with a traversal" },
    {
      type: "p",
      text: "Scan the grid in reading order. The first time you step on unvisited land, you've discovered a *new* island — increment the count. Then traverse (DFS or BFS) every land cell reachable from it and mark them all visited, so the scan won't count that island again when it passes over the rest of it. Each land cell gets visited exactly once across the whole run.",
    },
    {
      type: "viz",
      caption:
        "Scan reaches (0,0), the first land cell. DFS from there visits the whole top-left blob; the count goes to 1 and the blob will be skipped later.",
      state: [
        gridPanel("grid", "grid", cells(ex2), {
          tones: landWater(ex2, {
            "0,0": "active",
            "0,1": "frontier",
            "1,0": "frontier",
            "1,1": "frontier",
          }),
          cursor: { r: 0, c: 0 },
        }),
        varsPanel("vars", "", [v("count", 1, { tone: "result" })]),
      ],
    },
    { type: "h3", text: "The “sink the island” trick" },
    {
      type: "p",
      text: "Instead of a separate `visited` set, overwrite each visited `'1'` with `'0'` — literally sink the land. It's O(1) extra memory and makes the boundary check and the visited check the same test (`grid[r][c] == '1'`). The cost: it mutates the input. In an interview, say so and offer a `visited` set if the caller needs the grid intact.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Recursion depth",
      text: "A 300×300 grid that is all land makes the recursive DFS 90,000 frames deep — Python's default limit is 1,000. Use iterative DFS with an explicit stack, or BFS with a queue, when the grid can be large. Go's goroutine stacks grow dynamically, so recursion is fine there.",
    },
    {
      type: "callout",
      tone: "info",
      title: "Other tools that fit",
      text: "Union-Find also solves this in near-linear time and shines when the grid changes over time (LeetCode 305, *Number of Islands II*). For a static grid, DFS/BFS is simpler and faster.",
    },
  ],

  approaches: [
    {
      id: "dfs",
      title: "DFS with sinking",
      kind: "optimal",
      summary:
        "Scan every cell; on land, count one island and recursively sink everything connected to it.",
      intuition: [
        {
          type: "p",
          text: "`sink(r, c)` turns a land cell to water and recurses into its four neighbours. Out-of-bounds or water cells return immediately. After the call, that entire island is gone from the grid and can't be counted twice.",
        },
      ],
      steps: [
        "`count = 0`.",
        "For every cell `(r, c)`: if it's `'1'`, `count += 1` and call `sink(r, c)`.",
        "`sink`: return if out of bounds or not land; set to `'0'`; recurse to 4 neighbours.",
        "Return `count`.",
      ],
      complexity: {
        time: "O(m · n)",
        space: "O(m · n)",
        notes:
          "Every cell is visited a constant number of times. Space is recursion depth in the worst case.",
      },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def numIslands(self, grid: list[list[str]]) -> int:
                    rows, cols = len(grid), len(grid[0])
                    count = 0

                    def sink(r: int, c: int) -> None:
                        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
                            return
                        grid[r][c] = "0"  # mark visited by sinking the land
                        sink(r + 1, c)
                        sink(r - 1, c)
                        sink(r, c + 1)
                        sink(r, c - 1)

                    for r in range(rows):
                        for c in range(cols):
                            if grid[r][c] == "1":
                                count += 1   # new, never-seen island
                                sink(r, c)   # remove all of it
                    return count
          `,
          markers: {
            init: "count = 0",
            bounds: "if r < 0 or r >= rows",
            sink: 'grid[r][c] = "0"',
            recurse: "sink(r + 1, c)",
            scan: "for c in range(cols)",
            found: 'if grid[r][c] == "1"',
            inc: "count += 1",
            call: "sink(r, c)   #",
            end: "return count",
          },
        },
        go: {
          source: go`
            func numIslands(grid [][]byte) int {
                rows, cols := len(grid), len(grid[0])
                count := 0

                var sink func(r, c int)
                sink = func(r, c int) {
                    if r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1' {
                        return
                    }
                    grid[r][c] = '0' // mark visited by sinking the land
                    sink(r+1, c)
                    sink(r-1, c)
                    sink(r, c+1)
                    sink(r, c-1)
                }

                for r := 0; r < rows; r++ {
                    for c := 0; c < cols; c++ {
                        if grid[r][c] == '1' {
                            count++    // new, never-seen island
                            sink(r, c) // remove all of it
                        }
                    }
                }
                return count
            }
          `,
          markers: {
            init: "count := 0",
            bounds: "if r < 0 || r >= rows",
            sink: "grid[r][c] = '0'",
            recurse: "sink(r+1, c)",
            scan: "for c := 0; c < cols; c++",
            found: "if grid[r][c] == '1'",
            inc: "count++",
            call: "sink(r, c) //",
            end: "return count",
          },
        },
      },
    },
    {
      id: "bfs",
      title: "BFS with an explicit queue",
      kind: "alternative",
      summary: "Same counting loop, but the flood fill uses a queue — no recursion depth concerns.",
      intuition: [
        {
          type: "p",
          text: "Identical strategy; only the traversal changes. Push the seed cell, then repeatedly pop a cell and push its unvisited land neighbours. Sink cells when they are *enqueued*, not when dequeued, so no cell is queued twice.",
        },
      ],
      steps: [
        "For every land cell found during the scan, `count += 1` and BFS from it.",
        "BFS: sink the seed, enqueue it; pop, and for each in-bounds land neighbour, sink and enqueue.",
      ],
      complexity: {
        time: "O(m · n)",
        space: "O(min(m, n))",
        notes: "Queue holds at most one frontier of the flood.",
      },
      traceable: false,
      code: {
        python: {
          source: py`
            from collections import deque

            class Solution:
                def numIslands(self, grid: list[list[str]]) -> int:
                    rows, cols = len(grid), len(grid[0])
                    count = 0
                    for r in range(rows):
                        for c in range(cols):
                            if grid[r][c] != "1":
                                continue
                            count += 1
                            grid[r][c] = "0"
                            queue = deque([(r, c)])
                            while queue:
                                cr, cc = queue.popleft()
                                for nr, nc in ((cr + 1, cc), (cr - 1, cc), (cr, cc + 1), (cr, cc - 1)):
                                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "1":
                                        grid[nr][nc] = "0"  # sink on enqueue, never queue twice
                                        queue.append((nr, nc))
                    return count
          `,
          markers: {},
        },
        go: {
          source: go`
            func numIslands(grid [][]byte) int {
                rows, cols := len(grid), len(grid[0])
                dirs := [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
                count := 0
                for r := 0; r < rows; r++ {
                    for c := 0; c < cols; c++ {
                        if grid[r][c] != '1' {
                            continue
                        }
                        count++
                        grid[r][c] = '0'
                        queue := [][2]int{{r, c}}
                        for len(queue) > 0 {
                            cur := queue[0]
                            queue = queue[1:]
                            for _, d := range dirs {
                                nr, nc := cur[0]+d[0], cur[1]+d[1]
                                if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1' {
                                    grid[nr][nc] = '0' // sink on enqueue, never queue twice
                                    queue = append(queue, [2]int{nr, nc})
                                }
                            }
                        }
                    }
                }
                return count
            }
          `,
          markers: {},
        },
      },
    },
  ],

  inputs: [
    {
      name: "grid",
      label: "grid (rows of 0/1)",
      type: "string[]",
      default: '["11000", "11000", "00100", "00011"]',
      hint: "Up to 8 rows × 12 columns.",
    },
  ],
};
