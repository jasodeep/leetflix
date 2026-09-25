import { barsPanel, ptr, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { CellTone, TraceModule } from "@/lib/viz/types";

const traces: TraceModule = {
  "two-pointers": (input) => {
    const height = input.height as number[];
    const rec = new Recorder();
    const n = height.length;

    if (n < 2) {
      return rec.fail("init", "Need at least two walls to hold water.", [
        barsPanel("height", "height", height),
      ]);
    }
    if (height.some((h) => h < 0)) {
      return rec.fail("init", "Heights must be non-negative.", [
        barsPanel("height", "height", height),
      ]);
    }

    let l = 0;
    let r = n - 1;
    let best = 0;
    let bestPair: [number, number] = [0, n - 1];

    const view = (
      opts: { area?: number; retire?: "l" | "r"; changedBest?: boolean; final?: boolean } = {},
    ) => {
      const tones: Record<number, CellTone> = {};
      for (let k = 0; k < n; k++) if (k < l || k > r) tones[k] = "dim";
      tones[l] = opts.retire === "l" ? "danger" : "active";
      tones[r] = opts.retire === "r" ? "danger" : "active";
      if (opts.final) {
        tones[bestPair[0]] = "result";
        tones[bestPair[1]] = "result";
      }
      const level = Math.min(height[l], height[r]);
      return [
        barsPanel("height", "height", height, {
          pointers: opts.final
            ? [ptr(bestPair[0], "l*", "green"), ptr(bestPair[1], "r*", "green")]
            : [ptr(l, "l", "blue"), ptr(r, "r", "blue")],
          tones,
          fill: opts.final
            ? {
                from: bestPair[0],
                to: bestPair[1],
                height: Math.min(height[bestPair[0]], height[bestPair[1]]),
                label: String(best),
              }
            : {
                from: l,
                to: r,
                height: level,
                label: opts.area !== undefined ? String(opts.area) : undefined,
              },
        }),
        varsPanel("vars", "", [
          v("l", l),
          v("r", r),
          v("width = r − l", r - l),
          v("level = min(h[l], h[r])", `min(${height[l]}, ${height[r]}) = ${level}`),
          v("area", opts.area ?? "—"),
          v("best", best, { changed: opts.changedBest, tone: "result" }),
        ]),
      ];
    };

    rec.record(
      "init",
      `Start with the widest container: walls ${l} and ${r}. Any better container must be narrower, so it needs a taller minimum wall.`,
      view(),
    );

    while (l < r) {
      rec.record("loop", `\`l = ${l} < r = ${r}\` — ${r - l} candidate width(s) remain.`, view());
      const level = Math.min(height[l], height[r]);
      const area = (r - l) * level;
      rec.record(
        "area",
        `Water is capped by the shorter wall: \`area = ${r - l} × ${level} = ${area}\`.`,
        view({ area }),
      );
      if (area > best) {
        best = area;
        bestPair = [l, r];
        rec.record(
          "best",
          `\`${area}\` beats the previous best. \`best = ${best}\`.`,
          view({ area, changedBest: true }),
        );
      } else {
        rec.record("best", `\`${area} ≤ ${best}\`. Best unchanged.`, view({ area }));
      }

      if (height[l] < height[r]) {
        rec.record(
          "cmp",
          `Left wall (${height[l]}) is shorter than right (${height[r]}). Keeping \`l\` can never beat ${area}: the level stays ≤ ${height[l]} while width shrinks.`,
          view({ area, retire: "l" }),
        );
        l++;
        rec.record("movel", `Retire wall ${l - 1}. \`l = ${l}\`.`, view());
      } else {
        rec.record(
          "cmp",
          `Right wall (${height[r]}) is ≤ left (${height[l]}). Keeping \`r\` can never beat ${area}.`,
          view({ area, retire: "r" }),
        );
        r--;
        rec.record("mover", `Retire wall ${r + 1}. \`r = ${r}\`.`, view());
      }
    }

    return rec.done(
      "end",
      `Pointers met. Every pair was measured or provably dominated. Return \`${best}\` (walls ${bestPair[0]} and ${bestPair[1]}).`,
      view({ final: true }),
    );
  },
};

export default traces;
