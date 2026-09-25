import { arrayPanel, mapPanel, ptr, tones, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { TraceModule } from "@/lib/viz/types";

const traces: TraceModule = {
  "brute-force": (input) => {
    const nums = input.nums as number[];
    const target = input.target as number;
    const rec = new Recorder();
    const n = nums.length;

    const view = (i: number, j: number, sum: number, hit: boolean) => [
      arrayPanel("nums", "nums", nums, {
        pointers: [ptr(i, "i", "red"), ptr(j, "j", "blue")],
        tones: tones([i, hit ? "result" : "active"], [j, hit ? "result" : "active"]),
      }),
      varsPanel("vars", "", [
        v("target", target),
        v(`nums[i] + nums[j]`, `${nums[i]} + ${nums[j]} = ${sum}`, {
          tone: hit ? "result" : sum === target ? "result" : "default",
        }),
      ]),
    ];

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const sum = nums[i] + nums[j];
        if (sum === target) {
          rec.record(
            "check",
            `\`${nums[i]} + ${nums[j]} = ${sum}\` — that's the target.`,
            view(i, j, sum, true),
          );
          return rec.done(
            "found",
            `Return \`[${i}, ${j}]\`. Checked ${pairsChecked(i, j, n)} pair(s).`,
            view(i, j, sum, true),
          );
        }
        rec.record(
          "check",
          `\`${nums[i]} + ${nums[j]} = ${sum}\` ≠ ${target}. Keep going.`,
          view(i, j, sum, false),
        );
      }
    }
    return rec.fail("none", "No pair found — the problem guarantees this can't happen.", [
      arrayPanel("nums", "nums", nums),
      varsPanel("vars", "", [v("target", target)]),
    ]);
  },

  "hash-map": (input) => {
    const nums = input.nums as number[];
    const target = input.target as number;
    const rec = new Recorder();
    const seen = new Map<number, number>();

    const view = (i: number, need: number | null, opts: { hit?: number; newKey?: number } = {}) => [
      arrayPanel("nums", "nums", nums, {
        pointers: [
          ptr(i, "i", "red"),
          ...(opts.hit !== undefined ? [ptr(opts.hit, "seen[need]", "green")] : []),
        ],
        tones: {
          ...Object.fromEntries([...seen.values()].map((idx) => [idx, "visited" as const])),
          [i]: opts.hit !== undefined ? "result" : "active",
          ...(opts.hit !== undefined ? { [opts.hit]: "result" as const } : {}),
        },
      }),
      mapPanel("seen", "seen (value → index)", seen, {
        highlightKey: opts.hit !== undefined ? need : undefined,
        newKey: opts.newKey,
        emptyText: "{ }",
      }),
      varsPanel("vars", "", [
        v("target", target),
        v("x = nums[i]", nums[i]),
        v("need = target − x", need === null ? "—" : need, { changed: need !== null }),
      ]),
    ];

    rec.record(
      "init",
      "Start with an empty map. It will remember every value we've passed and where it lives.",
      [
        arrayPanel("nums", "nums", nums),
        mapPanel("seen", "seen (value → index)", seen, { emptyText: "{ }" }),
        varsPanel("vars", "", [v("target", target)]),
      ],
    );

    for (let i = 0; i < nums.length; i++) {
      const x = nums[i];
      const need = target - x;
      rec.record(
        "need",
        `At index ${i}, \`x = ${x}\`. The only partner that works is \`need = ${target} − ${x} = ${need}\`.`,
        view(i, need),
      );

      if (seen.has(need)) {
        const j = seen.get(need)!;
        rec.record(
          "check",
          `\`${need}\` **is** in the map, at index ${j}.`,
          view(i, need, { hit: j }),
        );
        return rec.done(
          "found",
          `Return \`[${j}, ${i}]\` — \`${nums[j]} + ${x} = ${target}\`.`,
          view(i, need, { hit: j }),
        );
      }

      rec.record("check", `\`${need}\` is not in the map yet.`, view(i, need));
      seen.set(x, i);
      rec.record(
        "store",
        `Remember \`${x} → ${i}\` so a later element can find it.`,
        view(i, need, { newKey: x }),
      );
    }

    return rec.fail("none", "No pair found — the problem guarantees this can't happen.", [
      arrayPanel("nums", "nums", nums),
      mapPanel("seen", "seen (value → index)", seen),
      varsPanel("vars", "", [v("target", target)]),
    ]);
  },
};

const pairsChecked = (i: number, j: number, n: number): number => {
  // pairs completed in rows 0..i-1 plus the ones in row i up to j
  let count = 0;
  for (let r = 0; r < i; r++) count += n - 1 - r;
  return count + (j - i);
};

export default traces;
