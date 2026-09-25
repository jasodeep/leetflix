import { barsPanel, ptr, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { BarsPanel, CellTone, TraceModule } from "@/lib/viz/types";

const traces: TraceModule = {
  "two-pointers": (input) => {
    const height = input.height as number[];
    const rec = new Recorder();
    const n = height.length;

    if (n === 0)
      return rec.done("end", "No bars, no water. Return `0`.", [
        barsPanel("height", "elevation map", height),
      ]);
    if (height.some((h) => h < 0)) {
      return rec.fail("init", "Heights must be non-negative.", [
        barsPanel("height", "elevation map", height),
      ]);
    }

    let l = 0;
    let r = n - 1;
    let leftMax = 0;
    let rightMax = 0;
    let water = 0;
    const settled: number[] = Array(n).fill(0);
    let leftMaxIdx = -1;
    let rightMaxIdx = -1;

    const view = (
      opts: { side?: "l" | "r"; changed?: "lmax" | "rmax" | "water"; final?: boolean } = {},
    ) => {
      const tones: Record<number, CellTone> = {};
      for (let k = 0; k < n; k++) if (k < l || k > r) tones[k] = "visited";
      if (!opts.final) {
        tones[l] = opts.side === "l" ? "active" : "default";
        tones[r] = opts.side === "r" ? "active" : "default";
        if (leftMaxIdx >= 0) tones[leftMaxIdx] = "match";
        if (rightMaxIdx >= 0) tones[rightMaxIdx] = "match";
      }
      const guides: NonNullable<BarsPanel["guides"]> = [];
      if (leftMaxIdx >= 0 && !opts.final)
        guides.push({
          height: leftMax,
          from: leftMaxIdx,
          to: l,
          label: `leftMax ${leftMax}`,
          color: "blue",
        });
      if (rightMaxIdx >= 0 && !opts.final)
        guides.push({
          height: rightMax,
          from: r,
          to: rightMaxIdx,
          label: `rightMax ${rightMax}`,
          color: "green",
        });
      return [
        barsPanel("height", "elevation map", height, {
          pointers: opts.final ? [] : [ptr(l, "l", "blue"), ptr(r, "r", "green")],
          tones,
          water: settled,
          guides,
        }),
        varsPanel("vars", "", [
          v("l", l),
          v("r", r),
          v("leftMax", leftMax, { changed: opts.changed === "lmax" }),
          v("rightMax", rightMax, { changed: opts.changed === "rmax" }),
          v("water", water, { changed: opts.changed === "water", tone: "result" }),
        ]),
      ];
    };

    rec.record(
      "init",
      "Pointers at both ends; no maxima seen yet; `water = 0`. We'll settle one column per step, always the one under the shorter wall.",
      view(),
    );

    while (l < r) {
      rec.record("loop", `\`l = ${l} < r = ${r}\`.`, view());
      if (height[l] < height[r]) {
        rec.record(
          "cmp",
          `\`height[l] = ${height[l]} < height[r] = ${height[r]}\`. A wall at least ${height[r]} tall exists on the right, so the level at column ${l} depends on \`leftMax\` alone.`,
          view({ side: "l" }),
        );
        if (height[l] > leftMax) {
          leftMax = height[l];
          leftMaxIdx = l;
        }
        rec.record(
          "lmax",
          `\`leftMax = max(leftMax, ${height[l]}) = ${leftMax}\`.`,
          view({ side: "l", changed: "lmax" }),
        );
        const add = leftMax - height[l];
        settled[l] = add;
        water += add;
        rec.record(
          "ladd",
          add > 0
            ? `Column ${l} holds \`${leftMax} − ${height[l]} = ${add}\` unit(s). \`water = ${water}\`.`
            : `Column ${l} is itself the running max — it holds nothing.`,
          view({ side: "l", changed: "water" }),
        );
        l++;
        rec.record("lmove", `Column ${l - 1} is settled for good. \`l = ${l}\`.`, view());
      } else {
        rec.record(
          "cmp",
          `\`height[l] = ${height[l]} ≥ height[r] = ${height[r]}\`. A wall at least ${height[l]} tall exists on the left, so the level at column ${r} depends on \`rightMax\` alone.`,
          view({ side: "r" }),
        );
        if (height[r] > rightMax) {
          rightMax = height[r];
          rightMaxIdx = r;
        }
        rec.record(
          "rmax",
          `\`rightMax = max(rightMax, ${height[r]}) = ${rightMax}\`.`,
          view({ side: "r", changed: "rmax" }),
        );
        const add = rightMax - height[r];
        settled[r] = add;
        water += add;
        rec.record(
          "radd",
          add > 0
            ? `Column ${r} holds \`${rightMax} − ${height[r]} = ${add}\` unit(s). \`water = ${water}\`.`
            : `Column ${r} is itself the running max — it holds nothing.`,
          view({ side: "r", changed: "water" }),
        );
        r--;
        rec.record("rmove", `Column ${r + 1} is settled for good. \`r = ${r}\`.`, view());
      }
    }

    return rec.done(
      "end",
      `Pointers met at column ${l} — it's the global peak and holds nothing. Return \`${water}\`.`,
      view({ final: true }),
    );
  },
};

export default traces;
