import { arrayPanel, mapPanel, ptr, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { CellTone, TraceModule } from "@/lib/viz/types";

const traces: TraceModule = {
  "sliding-window": (input) => {
    const s = input.s as string;
    const chars = [...s];
    const rec = new Recorder();

    const last = new Map<string, number>();
    let left = 0;
    let best = 0;
    let bestRange: [number, number] | null = null;

    const view = (
      right: number,
      opts: {
        dup?: boolean;
        hitKey?: string;
        newKey?: string;
        changedBest?: boolean;
        final?: boolean;
      } = {},
    ) => {
      const tones: Record<number, CellTone> = {};
      chars.forEach((_, k) => (tones[k] = k < left ? "dim" : "default"));
      const hi = Math.min(right, chars.length - 1);
      for (let k = left; k <= hi; k++) tones[k] = "window";
      if (opts.final && bestRange)
        for (let k = bestRange[0]; k <= bestRange[1]; k++) tones[k] = "result";
      if (right < chars.length) tones[right] = opts.dup ? "danger" : "active";
      const pointers =
        right < chars.length ? [ptr(left, "left", "blue"), ptr(right, "right", "red")] : [];
      return [
        arrayPanel("s", "s", chars, {
          pointers,
          tones,
          window: left <= hi && chars.length > 0 ? [left, hi] : undefined,
        }),
        mapPanel("last", "last (char → most recent index)", last, {
          highlightKey: opts.hitKey,
          newKey: opts.newKey,
          emptyText: "{ }",
        }),
        varsPanel("vars", "", [
          v("left", left),
          v("window length", chars.length === 0 ? 0 : hi - left + 1),
          v("best", best, { changed: opts.changedBest, tone: "result" }),
        ]),
      ];
    };

    rec.record(
      "init",
      "Empty map, `left = 0`, `best = 0`. The window `s[left..right]` will always be duplicate-free.",
      view(0),
    );

    for (let right = 0; right < chars.length; right++) {
      const ch = chars[right];
      rec.record("loop", `Extend the window to include \`s[${right}] = "${ch}"\`.`, view(right));

      const prev = last.get(ch);
      if (prev !== undefined && prev >= left) {
        rec.record(
          "dup",
          `"${ch}" was last seen at index ${prev}, which is **inside** the window (≥ left = ${left}). Duplicate!`,
          view(right, { dup: true, hitKey: ch }),
        );
        left = prev + 1;
        rec.record(
          "shrink",
          `Jump \`left\` to ${left} — one past the old "${ch}". Everything before it is discarded in O(1).`,
          view(right, { hitKey: ch }),
        );
      } else if (prev !== undefined) {
        rec.record(
          "dup",
          `"${ch}" was last seen at index ${prev}, but that's **before** left = ${left} — stale, ignore it.`,
          view(right, { hitKey: ch }),
        );
      } else {
        rec.record("dup", `"${ch}" has never been seen. No conflict.`, view(right));
      }

      last.set(ch, right);
      rec.record("store", `Record \`last["${ch}"] = ${right}\`.`, view(right, { newKey: ch }));

      const len = right - left + 1;
      if (len > best) {
        best = len;
        bestRange = [left, right];
        rec.record(
          "best",
          `Window \`s[${left}..${right}]\` = "${chars.slice(left, right + 1).join("")}" has length ${len} — new best.`,
          view(right, { changedBest: true }),
        );
      } else {
        rec.record("best", `Window length ${len} doesn't beat ${best}.`, view(right));
      }
    }

    return rec.done(
      "end",
      bestRange
        ? `Return \`${best}\` — "${chars.slice(bestRange[0], bestRange[1] + 1).join("")}" at indices ${bestRange[0]}–${bestRange[1]}.`
        : "Empty string. Return `0`.",
      view(chars.length, { final: true }),
    );
  },
};

export default traces;
