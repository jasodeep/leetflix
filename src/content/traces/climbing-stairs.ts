import { arrayPanel, ptr, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { CellTone, TraceModule } from "@/lib/viz/types";

const MAX_N = 20;

const traces: TraceModule = {
  tabulation: (input) => {
    const n = input.n as number;
    const rec = new Recorder();

    if (n < 1 || n > MAX_N) {
      return rec.fail(
        "base",
        `Use \`1 ≤ n ≤ ${MAX_N}\` so the table fits on screen (the algorithm itself handles up to 45).`,
        [varsPanel("vars", "", [v("n", n, { tone: "danger" })])],
      );
    }

    const dp: Array<number | string> = Array.from({ length: n + 1 }, () => "·");
    const view = (i: number | null, opts: { result?: boolean } = {}) => {
      const tones: Record<number, CellTone> = {};
      for (let k = 0; k <= n; k++) if (dp[k] !== "·") tones[k] = "visited";
      if (i !== null) {
        tones[i] = opts.result ? "result" : "active";
        if (i - 1 >= 0) tones[i - 1] = "match";
        if (i - 2 >= 0) tones[i - 2] = "match";
      }
      return [
        arrayPanel("dp", "dp[i] = ways to reach step i", dp, {
          tones,
          pointers:
            i !== null
              ? [
                  ptr(i, "i", "red"),
                  ...(i - 1 >= 1 ? [ptr(i - 1, "i−1", "blue")] : []),
                  ...(i - 2 >= 1 ? [ptr(i - 2, "i−2", "blue")] : []),
                ]
              : [],
        }),
        varsPanel("vars", "", [v("n", n)]),
      ];
    };

    rec.record("base", `Is \`n = ${n} ≤ 2\`? ${n <= 2 ? "Yes." : "No — we need the table."}`, [
      varsPanel("vars", "", [v("n", n)]),
    ]);
    if (n <= 2) {
      return rec.done(
        "base_ret",
        `With ${n} step(s) there ${n === 1 ? "is exactly 1 way" : "are exactly 2 ways (1+1 or 2)"}. Return \`${n}\`.`,
        [varsPanel("vars", "", [v("n", n), v("answer", n, { tone: "result" })])],
      );
    }

    rec.record(
      "init",
      `Allocate \`dp[0..${n}]\`. Index 0 is unused padding so that \`dp[i]\` literally means “ways to reach step i”.`,
      view(null),
    );
    dp[1] = 1;
    dp[2] = 2;
    rec.record(
      "seed",
      "Base cases: one way to reach step 1, two ways to reach step 2.",
      view(null),
    );

    for (let i = 3; i <= n; i++) {
      rec.record("loop", `Compute step ${i}. Its two dependencies are already filled.`, view(i));
      const a = dp[i - 1] as number;
      const b = dp[i - 2] as number;
      dp[i] = a + b;
      rec.record(
        "fill",
        `\`dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${a} + ${b} = ${a + b}\`.`,
        view(i, { result: true }),
      );
    }

    return rec.done(
      "end",
      `Return \`dp[${n}] = ${dp[n]}\`. Each entry was computed exactly once — that's the whole point of DP.`,
      view(n, { result: true }),
    );
  },
};

export default traces;
