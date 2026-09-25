import {
  arrayPanel,
  gridPanel,
  mapPanel,
  ptr,
  stackPanel,
  tones,
  v,
  varsPanel,
} from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import { gridKey, type TraceModule } from "@/lib/viz/types";

import type { FamilyId } from "./pick";

const hashing: TraceModule = {
  hashing: (input) => {
    const nums = input.nums as number[];
    const rec = new Recorder();
    const seen = new Set<number>();
    rec.record("init", "Empty set. We will remember every value we pass.", [
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
        varsPanel("vars", "", [v("x", x)]),
      ]);
      if (seen.has(x)) {
        rec.record("check", `\`${x}\` is already in the set.`, [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(i, "i", "red")],
            tones: tones([i, "result"]),
          }),
          mapPanel("seen", "seen", new Map([...seen].map((k) => [k, true])), { highlightKey: x }),
        ]);
        return rec.done("hit", "Duplicate found — return `true`.", [
          arrayPanel("nums", "nums", nums, { tones: tones([i, "result"]) }),
          varsPanel("vars", "", [v("answer", true, { tone: "result" })]),
        ]);
      }
      rec.record("check", `\`${x}\` is new.`, [
        arrayPanel("nums", "nums", nums, { pointers: [ptr(i, "i", "red")] }),
        mapPanel("seen", "seen", new Map([...seen].map((k) => [k, true]))),
      ]);
      seen.add(x);
      rec.record("store", `Remember \`${x}\`.`, [
        arrayPanel("nums", "nums", nums, {
          pointers: [ptr(i, "i", "red")],
          tones: tones([i, "visited"]),
        }),
        mapPanel("seen", "seen", new Map([...seen].map((k) => [k, true])), { newKey: x }),
      ]);
    }
    return rec.done("miss", "Walk finished with no repeat — return `false`.", [
      arrayPanel("nums", "nums", nums),
      varsPanel("vars", "", [v("answer", false, { tone: "result" })]),
    ]);
  },
};

const pointers: TraceModule = {
  pointers: (input) => {
    const nums = input.nums as number[];
    const target = input.target as number;
    const rec = new Recorder();
    let lo = 0;
    let hi = nums.length - 1;
    rec.record("init", "Start at both ends of the sorted array.", [
      arrayPanel("nums", "nums", nums, { pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")] }),
      varsPanel("vars", "", [v("target", target)]),
    ]);
    while (lo < hi) {
      const s = nums[lo]! + nums[hi]!;
      rec.record("loop", `Range \`[${lo}, ${hi}]\`.`, [
        arrayPanel("nums", "nums", nums, {
          pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")],
          tones: tones([lo, "active"], [hi, "active"]),
        }),
      ]);
      rec.record("sum", `\`${nums[lo]} + ${nums[hi]} = ${s}\`.`, [
        arrayPanel("nums", "nums", nums, {
          pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")],
        }),
        varsPanel("vars", "", [v("target", target), v("s", s)]),
      ]);
      if (s === target) {
        return rec.done("hit", `Return \`[${lo}, ${hi}]\`.`, [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(lo, "lo", "green"), ptr(hi, "hi", "green")],
            tones: tones([lo, "result"], [hi, "result"]),
          }),
          varsPanel("vars", "", [v("answer", `[${lo}, ${hi}]`, { tone: "result" })]),
        ]);
      }
      if (s < target) {
        rec.record("grow", "Sum too small — advance `lo`.", [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")],
          }),
        ]);
        lo += 1;
      } else {
        rec.record("shrink", "Sum too big — retreat `hi`.", [
          arrayPanel("nums", "nums", nums, {
            pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")],
          }),
        ]);
        hi -= 1;
      }
    }
    return rec.done("miss", "No pair — return `[]`.", [
      arrayPanel("nums", "nums", nums),
      varsPanel("vars", "", [v("answer", "[]", { tone: "result" })]),
    ]);
  },
};

const window: TraceModule = {
  window: (input) => {
    const s = input.s as string;
    const rec = new Recorder();
    const last = new Map<string, number>();
    let left = 0;
    let best = 0;
    rec.record("init", "Empty window. `last` will remember the latest index of each character.", [
      arrayPanel("s", "s", [...s]),
      mapPanel("last", "last", last, { emptyText: "{ }" }),
    ]);
    for (let right = 0; right < s.length; right++) {
      const ch = s[right]!;
      rec.record("loop", `Expand to \`right = ${right}\` (\`${ch}\`).`, [
        arrayPanel("s", "s", [...s], {
          window: [left, right],
          pointers: [ptr(left, "L", "blue"), ptr(right, "R", "red")],
        }),
        mapPanel("last", "last", last),
      ]);
      const prev = last.get(ch);
      if (prev !== undefined && prev >= left) {
        rec.record(
          "shrink",
          `\`${ch}\` is already in the window at ${prev}. Jump \`left\` to ${prev + 1}.`,
          [
            arrayPanel("s", "s", [...s], {
              window: [left, right],
              pointers: [ptr(left, "L", "blue"), ptr(right, "R", "red")],
              tones: tones([prev, "danger"], [right, "active"]),
            }),
          ],
        );
        left = prev + 1;
      }
      last.set(ch, right);
      rec.record("store", `Remember \`${ch} → ${right}\`.`, [
        arrayPanel("s", "s", [...s], { window: [left, right] }),
        mapPanel("last", "last", last, { newKey: ch }),
      ]);
      const n = right - left + 1;
      if (n > best) best = n;
      rec.record("best", `Window length ${n}. Best is ${best}.`, [
        arrayPanel("s", "s", [...s], {
          window: [left, right],
          pointers: [ptr(left, "L", "blue"), ptr(right, "R", "red")],
        }),
        varsPanel("vars", "", [v("best", best, { tone: "result" })]),
      ]);
    }
    return rec.done("done", `Longest unique window has length \`${best}\`.`, [
      arrayPanel("s", "s", [...s]),
      varsPanel("vars", "", [v("answer", best, { tone: "result" })]),
    ]);
  },
};

const stack: TraceModule = {
  stack: (input) => {
    const s = input.s as string;
    const rec = new Recorder();
    const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
    const st: string[] = [];
    rec.record("init", "Empty stack. Openers go on; closers must match the top.", [
      arrayPanel("s", "s", [...s]),
      stackPanel("stack", "stack", st),
    ]);
    for (let i = 0; i < s.length; i++) {
      const ch = s[i]!;
      rec.record("loop", `Read \`${ch}\`.`, [
        arrayPanel("s", "s", [...s], {
          pointers: [ptr(i, "i", "red")],
          tones: tones([i, "active"]),
        }),
        stackPanel("stack", "stack", st),
      ]);
      if (ch in pairs) {
        rec.record("close", `\`${ch}\` is a closer.`, [
          arrayPanel("s", "s", [...s], { pointers: [ptr(i, "i", "red")] }),
          stackPanel("stack", "stack", st, "pop"),
        ]);
        if (st.length === 0 || st[st.length - 1] !== pairs[ch]) {
          return rec.done("bad", "Mismatch — return `false`.", [
            arrayPanel("s", "s", [...s], { tones: tones([i, "danger"]) }),
            stackPanel("stack", "stack", st, "danger"),
            varsPanel("vars", "", [v("answer", false, { tone: "danger" })]),
          ]);
        }
        st.pop();
        rec.record("pop", "Top matched. Pop.", [
          arrayPanel("s", "s", [...s], { pointers: [ptr(i, "i", "green")] }),
          stackPanel("stack", "stack", st, "pop"),
        ]);
      } else {
        st.push(ch);
        rec.record("push", `Push opener \`${ch}\`.`, [
          arrayPanel("s", "s", [...s], { pointers: [ptr(i, "i", "red")] }),
          stackPanel("stack", "stack", st, "push"),
        ]);
      }
    }
    const ok = st.length === 0;
    return rec.done(
      "done",
      ok ? "Stack empty — return `true`." : "Leftover openers — return `false`.",
      [
        arrayPanel("s", "s", [...s]),
        stackPanel("stack", "stack", st),
        varsPanel("vars", "", [v("answer", ok, { tone: ok ? "result" : "danger" })]),
      ],
    );
  },
};

const bsearch: TraceModule = {
  bsearch: (input) => {
    const nums = input.nums as number[];
    const target = input.target as number;
    const rec = new Recorder();
    let lo = 0;
    let hi = nums.length - 1;
    rec.record("init", `Search for \`${target}\` in a sorted array.`, [
      arrayPanel("nums", "nums", nums, { pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")] }),
      varsPanel("vars", "", [v("target", target)]),
    ]);
    while (lo <= hi) {
      rec.record("loop", `Range \`[${lo}, ${hi}]\`.`, [
        arrayPanel("nums", "nums", nums, {
          pointers: [ptr(lo, "lo", "red"), ptr(hi, "hi", "blue")],
        }),
      ]);
      const mid = Math.floor((lo + hi) / 2);
      rec.record("mid", `\`mid = ${mid}\`, value \`${nums[mid]}\`.`, [
        arrayPanel("nums", "nums", nums, {
          pointers: [ptr(lo, "lo", "red"), ptr(mid, "mid", "green"), ptr(hi, "hi", "blue")],
          tones: tones([mid, "active"]),
        }),
      ]);
      if (nums[mid] === target) {
        return rec.done("hit", `Found at index \`${mid}\`.`, [
          arrayPanel("nums", "nums", nums, {
            tones: tones([mid, "result"]),
            pointers: [ptr(mid, "mid", "green")],
          }),
          varsPanel("vars", "", [v("answer", mid, { tone: "result" })]),
        ]);
      }
      if (nums[mid]! < target) {
        rec.record("right", "Too small — throw away the left half.", [
          arrayPanel("nums", "nums", nums, { tones: tones([mid, "dim"]) }),
        ]);
        lo = mid + 1;
      } else {
        rec.record("left", "Too big — throw away the right half.", [
          arrayPanel("nums", "nums", nums, { tones: tones([mid, "dim"]) }),
        ]);
        hi = mid - 1;
      }
    }
    return rec.done("miss", "Range collapsed — return `-1`.", [
      arrayPanel("nums", "nums", nums),
      varsPanel("vars", "", [v("answer", -1, { tone: "danger" })]),
    ]);
  },
};

const dp: TraceModule = {
  dp: (input) => {
    const n = input.n as number;
    const rec = new Recorder();
    let a = 1;
    let b = 1;
    const ways = [1, 1];
    rec.record("init", "`ways(0) = ways(1) = 1`.", [
      arrayPanel("dp", "ways", ways, { tones: tones([0, "visited"], [1, "visited"]) }),
      varsPanel("vars", "", [v("a", a), v("b", b), v("n", n)]),
    ]);
    for (let i = 2; i <= n; i++) {
      rec.record("loop", `Compute ways to reach step ${i}.`, [
        arrayPanel("dp", "ways", [...ways, "?"], { pointers: [ptr(i, "i", "red")] }),
      ]);
      const next = a + b;
      a = b;
      b = next;
      ways.push(b);
      rec.record("step", `\`ways(${i}) = ${a} + previous = ${b}\`.`, [
        arrayPanel("dp", "ways", ways, {
          tones: tones([i, "result"]),
          pointers: [ptr(i, "i", "green")],
        }),
        varsPanel("vars", "", [v("a", a), v("b", b)]),
      ]);
    }
    return rec.done("done", `Return \`${b}\`.`, [
      arrayPanel("dp", "ways", ways, { tones: tones([n, "result"]) }),
      varsPanel("vars", "", [v("answer", b, { tone: "result" })]),
    ]);
  },
};

const walk: TraceModule = {
  walk: (input) => {
    const grid = input.grid as string[];
    const rec = new Recorder();
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const g = grid.map((r) => [...r]);
    let islands = 0;
    rec.record("init", "Scan the grid. Each unvisited `1` starts a BFS flood.", [
      gridPanel("g", "grid", g),
      varsPanel("vars", "", [v("islands", 0)]),
    ]);
    const flood = (sr: number, sc: number) => {
      rec.record("flood", `Flood from \`${sr},${sc}\`.`, [
        gridPanel("g", "grid", g, {
          cursor: { r: sr, c: sc },
          tones: { [gridKey(sr, sc)]: "active" },
        }),
      ]);
      const q: Array<[number, number]> = [[sr, sc]];
      g[sr]![sc] = "0";
      while (q.length) {
        const [r, c] = q.shift()!;
        for (const [dr, dc] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr]![nc] === "1") {
            g[nr]![nc] = "0";
            q.push([nr, nc]);
          }
        }
      }
    };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        rec.record("scan", `Cell \`${r},${c}\` is \`${g[r]![c]}\`.`, [
          gridPanel("g", "grid", g, { cursor: { r, c } }),
        ]);
        if (g[r]![c] === "1") {
          islands += 1;
          rec.record("bump", `New island #${islands}.`, [
            gridPanel("g", "grid", g, { cursor: { r, c }, tones: { [gridKey(r, c)]: "active" } }),
            varsPanel("vars", "", [v("islands", islands, { tone: "result" })]),
          ]);
          flood(r, c);
        }
      }
    }
    return rec.done("done", `Counted \`${islands}\` island(s).`, [
      gridPanel("g", "grid", g),
      varsPanel("vars", "", [v("answer", islands, { tone: "result" })]),
    ]);
  },
};

const list: TraceModule = {
  list: (input) => {
    const head = input.head as number[];
    const rec = new Recorder();
    let prev: number[] = [];
    let cur = head;
    rec.record("init", "Treat the array as a singly-linked list and reverse it in place.", [
      arrayPanel("cur", "cur", cur),
      arrayPanel("prev", "prev", prev),
    ]);
    while (cur.length) {
      rec.record("loop", `Head of \`cur\` is \`${cur[0]}\`.`, [
        arrayPanel("cur", "cur", cur, {
          pointers: [ptr(0, "cur", "red")],
          tones: tones([0, "active"]),
        }),
        arrayPanel("prev", "prev", prev),
      ]);
      const nxt = cur.slice(1);
      rec.record("save", "Save the rest of the list.", [
        arrayPanel("cur", "cur", cur),
        arrayPanel("nxt", "nxt", nxt),
      ]);
      prev = [cur[0]!, ...prev];
      rec.record("flip", `Move \`${cur[0]}\` onto \`prev\`.`, [
        arrayPanel("prev", "prev", prev, { tones: tones([0, "result"]) }),
        arrayPanel("nxt", "nxt", nxt),
      ]);
      cur = nxt;
      rec.record("step", "Advance `cur`.", [
        arrayPanel("cur", "cur", cur),
        arrayPanel("prev", "prev", prev),
      ]);
    }
    return rec.done("done", `New head is \`${JSON.stringify(prev)}\`.`, [
      arrayPanel("prev", "prev", prev, {
        tones: Object.fromEntries(prev.map((_, i) => [i, "result" as const])),
      }),
      varsPanel("vars", "", [v("answer", JSON.stringify(prev), { tone: "result" })]),
    ]);
  },
};

const scan: TraceModule = {
  scan: (input) => {
    const nums = input.nums as number[];
    const rec = new Recorder();
    if (nums.length === 0) {
      return rec.done("done", "Empty — nothing to scan.", [
        varsPanel("vars", "", [v("answer", "—")]),
      ]);
    }
    let best = nums[0]!;
    rec.record("init", `Seed \`best\` with \`${best}\`.`, [
      arrayPanel("nums", "nums", nums, {
        pointers: [ptr(0, "i", "red")],
        tones: tones([0, "result"]),
      }),
      varsPanel("vars", "", [v("best", best)]),
    ]);
    for (let i = 1; i < nums.length; i++) {
      const x = nums[i]!;
      rec.record("loop", `Look at \`${x}\`.`, [
        arrayPanel("nums", "nums", nums, {
          pointers: [ptr(i, "i", "red")],
          tones: tones([i, "active"]),
        }),
        varsPanel("vars", "", [v("best", best), v("x", x)]),
      ]);
      rec.record("check", `Is \`${x} > ${best}\`?`, [
        arrayPanel("nums", "nums", nums, { pointers: [ptr(i, "i", "red")] }),
      ]);
      if (x > best) {
        best = x;
        rec.record("upd", `New best \`${best}\`.`, [
          arrayPanel("nums", "nums", nums, { tones: tones([i, "result"]) }),
          varsPanel("vars", "", [v("best", best, { tone: "result" })]),
        ]);
      }
    }
    return rec.done("done", `Return \`${best}\`.`, [
      arrayPanel("nums", "nums", nums),
      varsPanel("vars", "", [v("answer", best, { tone: "result" })]),
    ]);
  },
};

const MODULES: Record<FamilyId, TraceModule> = {
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

export const familyTraces = (id: FamilyId): TraceModule => MODULES[id];
