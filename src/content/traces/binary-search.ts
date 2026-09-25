import { arrayPanel, ptr, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { CellTone, Pointer, TraceModule } from "@/lib/viz/types";

const traces: TraceModule = {
  iterative: (input) => {
    const nums = input.nums as number[];
    const target = input.target as number;
    const rec = new Recorder();

    for (let i = 1; i < nums.length; i++) {
      if (nums[i] < nums[i - 1]) {
        return rec.fail(
          "init",
          `\`nums\` must be sorted ascending — \`${nums[i - 1]}\` is followed by \`${nums[i]}\`. Binary search's guarantees don't hold on unsorted data.`,
          [arrayPanel("nums", "nums", nums, { tones: { [i - 1]: "danger", [i]: "danger" } })],
        );
      }
    }

    let lo = 0;
    let hi = nums.length - 1;
    let probes = 0;

    const view = (mid: number | null, midTone: CellTone = "active") => {
      const tones: Record<number, CellTone> = {};
      for (let k = 0; k < nums.length; k++) if (k < lo || k > hi) tones[k] = "dim";
      if (mid !== null) tones[mid] = midTone;
      const pointers: Pointer[] = [];
      if (lo <= hi) {
        pointers.push(ptr(lo, "lo", "blue"), ptr(hi, "hi", "blue"));
        if (mid !== null) pointers.push(ptr(mid, "mid", "red"));
      }
      return [
        arrayPanel("nums", "nums", nums, {
          pointers,
          tones,
          window: lo <= hi ? [lo, hi] : undefined,
        }),
        varsPanel("vars", "", [
          v("target", target),
          v("lo", lo),
          v("hi", hi),
          v("candidates", Math.max(0, hi - lo + 1)),
          v("probes", probes),
        ]),
      ];
    };

    rec.record(
      "init",
      `Candidates: every index in \`[0, ${hi}]\`. If \`${target}\` exists, it's in there.`,
      view(null),
    );

    while (lo <= hi) {
      rec.record(
        "loop",
        `\`lo = ${lo} ≤ hi = ${hi}\` — ${hi - lo + 1} candidate(s) remain.`,
        view(null),
      );
      const mid = lo + Math.floor((hi - lo) / 2);
      probes++;
      rec.record(
        "mid",
        `Probe the middle: \`mid = ${mid}\`, \`nums[mid] = ${nums[mid]}\`.`,
        view(mid),
      );

      if (nums[mid] === target) {
        rec.record("check", `\`${nums[mid]} == ${target}\` — found it.`, view(mid, "result"));
        return rec.done(
          "found",
          `Return \`${mid}\` after ${probes} probe(s). Linear scan would have needed up to ${nums.length}.`,
          view(mid, "result"),
        );
      }
      rec.record("check", `\`${nums[mid]} ≠ ${target}\`.`, view(mid));

      if (nums[mid] < target) {
        rec.record(
          "less",
          `\`${nums[mid]} < ${target}\`. Everything at or left of \`mid\` is also too small.`,
          view(mid),
        );
        const discarded = mid - lo + 1;
        lo = mid + 1;
        rec.record(
          "right",
          `\`lo = ${lo}\`. Discarded ${discarded} candidate(s) — the left half is gone.`,
          view(null),
        );
      } else {
        rec.record(
          "less",
          `\`${nums[mid]} > ${target}\`. Everything at or right of \`mid\` is also too big.`,
          view(mid),
        );
        const discarded = hi - mid + 1;
        hi = mid - 1;
        rec.record(
          "left",
          `\`hi = ${hi}\`. Discarded ${discarded} candidate(s) — the right half is gone.`,
          view(null),
        );
      }
    }

    return rec.done(
      "none",
      `\`lo = ${lo} > hi = ${hi}\`: the interval is empty. By the invariant, \`${target}\` is not in the array. Return \`-1\`.`,
      view(null),
    );
  },
};

export default traces;
