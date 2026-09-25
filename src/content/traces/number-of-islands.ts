import { gridPanel, stackPanel, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import { gridKey, type GridCellTone, type TraceModule } from "@/lib/viz/types";

const traces: TraceModule = {
  dfs: (input) => {
    const rowsIn = input.grid as string[];
    const rec = new Recorder();

    if (rowsIn.length === 0 || rowsIn[0].length === 0) {
      return rec.fail("init", "The grid must have at least one cell.", [
        varsPanel("vars", "", [v("grid", "[]", { tone: "danger" })]),
      ]);
    }
    for (const row of rowsIn) {
      if (!/^[01]+$/.test(row)) {
        return rec.fail("init", `Rows may only contain \`0\` and \`1\` — got \`${row}\`.`, [
          varsPanel("vars", "", [v("row", row, { tone: "danger" })]),
        ]);
      }
    }

    const grid = rowsIn.map((r) => [...r]);
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;
    const sunk = new Set<string>();
    const callStack: string[] = [];

    const view = (
      opts: {
        cursor?: { r: number; c: number };
        active?: string;
        frontier?: string[];
        changed?: boolean;
      } = {},
    ) => {
      const tones: Record<string, GridCellTone> = {};
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const k = gridKey(r, c);
          tones[k] = sunk.has(k) ? "visited" : grid[r][c] === "1" ? "land" : "water";
        }
      }
      for (const k of opts.frontier ?? []) tones[k] = "frontier";
      if (opts.active) tones[opts.active] = "active";
      return [
        gridPanel("grid", "grid", grid, { tones, cursor: opts.cursor }),
        stackPanel("stack", "sink() call stack", callStack),
        varsPanel("vars", "", [v("count", count, { changed: opts.changed, tone: "result" })]),
      ];
    };

    rec.record(
      "init",
      `${rows}×${cols} grid, \`count = 0\`. We'll scan in reading order and sink each island the moment we first touch it.`,
      view(),
    );

    const sink = (r: number, c: number): void => {
      const k = gridKey(r, c);
      callStack.push(`sink(${r}, ${c})`);
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== "1") {
        callStack.pop();
        return;
      }
      grid[r][c] = "0";
      sunk.add(k);
      const neighbours = [
        [r + 1, c],
        [r - 1, c],
        [r, c + 1],
        [r, c - 1],
      ].filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === "1");
      rec.record(
        "sink",
        `Sink (${r}, ${c}). ${neighbours.length === 0 ? "No unvisited land neighbours — unwind." : `${neighbours.length} land neighbour(s) to explore: ${neighbours.map(([a, b]) => `(${a}, ${b})`).join(", ")}.`}`,
        view({ active: k, frontier: neighbours.map(([a, b]) => gridKey(a, b)) }),
      );
      sink(r + 1, c);
      sink(r - 1, c);
      sink(r, c + 1);
      sink(r, c - 1);
      callStack.pop();
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const k = gridKey(r, c);
        if (grid[r][c] === "1") {
          rec.record(
            "found",
            `Scan hits land at (${r}, ${c}) that hasn't been sunk — this must be a **new** island.`,
            view({ cursor: { r, c }, active: k }),
          );
          count++;
          rec.record(
            "inc",
            `\`count = ${count}\`.`,
            view({ cursor: { r, c }, active: k, changed: true }),
          );
          sink(r, c);
          rec.record(
            "call",
            `Island ${count} fully sunk. The scan can't count any part of it again.`,
            view({ cursor: { r, c } }),
          );
        } else {
          rec.record(
            "scan",
            `(${r}, ${c}) is ${sunk.has(k) ? "already sunk" : "water"}. Skip.`,
            view({ cursor: { r, c } }),
          );
        }
      }
    }

    return rec.done("end", `Scan complete. Return \`${count}\`.`, view({ changed: true }));
  },
};

export default traces;
