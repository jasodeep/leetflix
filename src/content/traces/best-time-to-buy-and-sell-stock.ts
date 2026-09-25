import { barsPanel, ptr, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { CellTone, Pointer, TraceModule } from "@/lib/viz/types";

const traces: TraceModule = {
  "one-pass": (input) => {
    const prices = input.prices as number[];
    const rec = new Recorder();

    let minPrice = Number.POSITIVE_INFINITY;
    let minIdx = -1;
    let best = 0;
    let bestPair: [number, number] | null = null;

    const view = (day: number, opts: { dayTone?: CellTone; changed?: "min" | "best" } = {}) => {
      const pointers: Pointer[] = [];
      if (minIdx >= 0) pointers.push(ptr(minIdx, "min", "green"));
      if (day < prices.length) pointers.push(ptr(day, "today", "red"));
      const tones: Record<number, CellTone> = {};
      for (let k = 0; k < day; k++) tones[k] = "dim";
      if (minIdx >= 0) tones[minIdx] = "match";
      if (bestPair) tones[bestPair[1]] = "result";
      if (day < prices.length) tones[day] = opts.dayTone ?? "active";
      return [
        barsPanel("prices", "prices", prices, { pointers, tones }),
        varsPanel("vars", "", [
          v("min_price", minPrice === Number.POSITIVE_INFINITY ? "+∞" : minPrice, {
            changed: opts.changed === "min",
          }),
          v("best", best, {
            changed: opts.changed === "best",
            tone: best > 0 ? "result" : "default",
          }),
        ]),
      ];
    };

    rec.record(
      "init",
      "Nothing seen yet: the cheapest price is +∞ and the best profit is 0 (doing nothing is always allowed).",
      view(0),
    );

    for (let day = 0; day < prices.length; day++) {
      const p = prices[day];
      rec.record("loop", `Day ${day}: price is \`${p}\`.`, view(day));

      if (p < minPrice) {
        rec.record(
          "newmin",
          `\`${p} < ${minPrice === Number.POSITIVE_INFINITY ? "+∞" : minPrice}\` — a new low. This is now the best day to have bought on.`,
          view(day, { dayTone: "match" }),
        );
        minPrice = p;
        minIdx = day;
        rec.record(
          "setmin",
          `\`min_price = ${p}\`.`,
          view(day, { dayTone: "match", changed: "min" }),
        );
      } else {
        const profit = p - minPrice;
        if (profit > best) {
          rec.record(
            "profit",
            `Selling today at the recorded minimum earns \`${p} − ${minPrice} = ${profit}\`, beating \`${best}\`.`,
            view(day, { dayTone: "result" }),
          );
          best = profit;
          bestPair = [minIdx, day];
          rec.record(
            "setbest",
            `\`best = ${best}\`.`,
            view(day, { dayTone: "result", changed: "best" }),
          );
        } else {
          rec.record(
            "profit",
            `Selling today earns \`${p} − ${minPrice} = ${profit}\`, no better than \`${best}\`. Nothing changes.`,
            view(day),
          );
        }
      }
    }

    return rec.done(
      "end",
      bestPair
        ? `Return \`${best}\`: buy on day ${bestPair[0]} at ${prices[bestPair[0]]}, sell on day ${bestPair[1]} at ${prices[bestPair[1]]}.`
        : "Prices never rose after a low. Return `0`.",
      view(prices.length),
    );
  },
};

export default traces;
