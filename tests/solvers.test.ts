import { describe, expect, it } from "vitest";

import { catalog } from "@/content/catalog";
import { problems } from "@/content/problems";
import { materialize, SOLVER_SLUGS, SOLVERS, solverOf } from "@/content/solvers";
import { catalogItems } from "@/lib/problems";
import { defaultRawInputs, parseInputs } from "@/lib/inputs";
import { resolveMarkers } from "@/lib/markers";
import { LANGUAGES } from "@/lib/types";
import { MAX_STEPS } from "@/lib/viz/recorder";

describe("solvers", () => {
  it("pick list matches registered slugs, with no authored overlap", () => {
    const registered = SOLVERS.flatMap((s) => [...s.slugs]).sort();
    expect(registered).toEqual([...SOLVER_SLUGS].sort());
    expect(new Set(registered).size).toBe(registered.length);
    const authored = new Set(problems.map((p) => p.slug));
    for (const slug of registered) {
      expect(authored.has(slug), `${slug} is already a hand-authored deep-dive`).toBe(false);
      expect(
        catalog.some((c) => c.slug === slug),
        `${slug} missing from catalogue`,
      ).toBe(true);
    }
  });

  it("every free catalogue row is playable; locked rows are not", () => {
    expect(catalogItems.length).toBe(catalog.length);
    for (const row of catalogItems) {
      expect(row.available, row.slug).toBe(!row.premium);
    }
    expect(catalogItems.filter((c) => c.available).length).toBeGreaterThan(3000);
    expect(catalogItems.filter((c) => c.premium).length).toBeGreaterThan(0);
  });

  it("each solver materializes and has matching Python/Go markers", () => {
    for (const solver of SOLVERS) {
      const row = catalog.find((c) => c.slug === solver.slugs[0])!;
      const p = materialize(row, solver);
      expect(p.approaches[0]!.id).toBe(solver.approach.id);
      expect(p.approaches[0]!.traceable).toBe(true);
      const py = Object.keys(solver.approach.code.python.markers).sort();
      const go = Object.keys(solver.approach.code.go.markers).sort();
      expect(go, solver.id).toEqual(py);
      for (const lang of LANGUAGES) {
        expect(() =>
          resolveMarkers(solver.approach.code[lang], `solver/${solver.id}/${lang}`),
        ).not.toThrow();
      }
    }
  });

  it("traces run on default inputs, finish done, and hit example outputs", () => {
    for (const solver of SOLVERS) {
      const input = parseInputs(solver.inputs, defaultRawInputs(solver.inputs));
      const fn = solver.traces[solver.approach.id];
      expect(fn, solver.id).toBeTypeOf("function");
      const steps = fn(input);
      expect(steps.length, solver.id).toBeGreaterThan(1);
      expect(steps.length, solver.id).toBeLessThanOrEqual(MAX_STEPS);
      expect(steps[steps.length - 1]!.status, solver.id).toBe("done");
      for (const s of steps) {
        expect(
          solver.approach.code.python.markers[s.marker],
          `${solver.id} ${s.marker}`,
        ).toBeDefined();
        expect(s.panels.length).toBeGreaterThan(0);
      }
      for (const ex of solver.examples) {
        const exSteps = fn(parseInputs(solver.inputs, ex.input));
        const last = exSteps[exSteps.length - 1]!;
        expect(last.status, `${solver.id} ${JSON.stringify(ex.input)}`).toBe("done");
        expect(last.note, `${solver.id} → ${ex.output}`).toContain(ex.output);
      }
    }
  });

  it("solverOf returns the bundle for every registered slug", () => {
    for (const slug of SOLVER_SLUGS) {
      expect(solverOf(slug)?.slugs).toContain(slug);
    }
    expect(solverOf("add-two-numbers")?.id).toBe("add-two-numbers");
    expect(solverOf("two-sum")).toBeUndefined();
  });
});
