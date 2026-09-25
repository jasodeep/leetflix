import { arrayPanel, ptr, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { CellTone, TraceModule } from "@/lib/viz/types";

const traces: TraceModule = {
  kadane: (input) => {
    const nums = input.nums as number[];
    const rec = new Recorder();
    if (nums.length === 0) {
      return rec.fail("init", "The problem guarantees a non-empty array.", [
        arrayPanel("nums", "nums", nums),
      ]);
    }

    let cur = nums[0];
    let best = nums[0];
    let runStart = 0;
    let bestRange: [number, number] = [0, 0];

    const view = (
      i: number,
      opts: { changed?: "cur" | "best" | "both"; restart?: boolean } = {},
    ) => {
      const tones: Record<number, CellTone> = {};
      for (let k = runStart; k <= Math.min(i, nums.length - 1); k++) tones[k] = "window";
      for (let k = bestRange[0]; k <= bestRange[1]; k++) tones[k] = "result";
      if (i < nums.length) tones[i] = opts.restart ? "match" : "active";
      return [
        arrayPanel("nums", "nums", nums, {
          pointers: i < nums.length ? [ptr(i, "i", "red")] : [],
          tones,
          window: [runStart, Math.min(i, nums.length - 1)],
        }),
        varsPanel("vars", "", [
          v("cur (best run ending here)", cur, {
            changed: opts.changed === "cur" || opts.changed === "both",
          }),
          v("best", best, {
            changed: opts.changed === "best" || opts.changed === "both",
            tone: "result",
          }),
        ]),
      ];
    };

    rec.record(
      "init",
      `Seed both \`cur\` and \`best\` with \`nums[0] = ${nums[0]}\`. A subarray must be non-empty, so 0 is not a safe starting point.`,
      view(0, { changed: "both" }),
    );

    for (let i = 1; i < nums.length; i++) {
      const x = nums[i];
      rec.record(
        "loop",
        `Index ${i}: \`x = ${x}\`. Best run ending at ${i - 1} sums to \`${cur}\`.`,
        view(i),
      );

      const extended = cur + x;
      const restart = x > extended;
      if (restart) runStart = i;
      cur = Math.max(x, extended);
      rec.record(
        "extend",
        restart
          ? `Extending gives \`${extended}\`, restarting gives \`${x}\`. The old run was dead weight — **restart** at ${i}.`
          : `Extending gives \`${extended}\` ≥ restarting (\`${x}\`). **Extend** the run.`,
        view(i, { changed: "cur", restart }),
      );

      if (cur > best) {
        const prev = best;
        best = cur;
        bestRange = [runStart, i];
        rec.record(
          "best",
          `\`${cur} > ${prev}\` — new global best \`${best}\`.`,
          view(i, { changed: "best" }),
        );
      } else {
        rec.record("best", `\`${cur}\` doesn't beat \`${best}\`. Best unchanged.`, view(i));
      }
    }

    return rec.done(
      "end",
      `Return \`${best}\` — the subarray \`nums[${bestRange[0]}..${bestRange[1]}]\` = [${nums.slice(bestRange[0], bestRange[1] + 1).join(", ")}].`,
      view(nums.length),
    );
  },
};

export default traces;
