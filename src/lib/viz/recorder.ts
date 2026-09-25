import type { Step, StepStatus, VizState } from "@/lib/viz/types";

/** Hard ceiling so a pathological input can never freeze the UI. */
export const MAX_STEPS = 400;

export class StepLimitError extends Error {
  constructor() {
    super(`Trace exceeded ${MAX_STEPS} steps. Try a smaller input.`);
    this.name = "StepLimitError";
  }
}

/**
 * Collects snapshots while an algorithm runs. Panels are deep-cloned at
 * record time so traces can freely mutate their working state between steps.
 */
export class Recorder {
  private readonly steps: Step[] = [];

  record(marker: string, note: string, panels: VizState, status: StepStatus = "running"): void {
    if (this.steps.length >= MAX_STEPS) throw new StepLimitError();
    this.steps.push({ marker, note, panels: structuredClone(panels), status });
  }

  done(marker: string, note: string, panels: VizState): Step[] {
    this.record(marker, note, panels, "done");
    return this.steps;
  }

  fail(marker: string, note: string, panels: VizState): Step[] {
    this.record(marker, note, panels, "fail");
    return this.steps;
  }

  finish(): Step[] {
    return this.steps;
  }
}

export const fmt = (v: unknown): string => {
  if (Array.isArray(v)) return `[${v.map(fmt).join(", ")}]`;
  if (typeof v === "string") return JSON.stringify(v);
  if (v === null || v === undefined) return "nil";
  return String(v);
};
