import { describe, expect, it } from "vitest";

import { catalog } from "@/content/catalog";
import { FAMILY_IDS, familyOf, familyTraces, materialize, slugToFn } from "@/content/families";
import { getProblem } from "@/lib/get-problem";
import { loadTraces } from "@/content/traces";
import { catalogItems } from "@/lib/problems";
import { problems } from "@/content/problems";
import { SOLVED_SLUGS } from "@/content/solvers/pick";
import { FAMILY_APPROACH, FAMILY_INPUTS } from "@/content/families/solutions";
import { defaultRawInputs, parseInputs } from "@/lib/inputs";
import { resolveMarkers } from "@/lib/markers";
import { LANGUAGES } from "@/lib/types";
import { MAX_STEPS } from "@/lib/viz/recorder";

describe("families", () => {
  it("assigns every catalogue row a family", () => {
    for (const row of catalog) {
      expect(FAMILY_IDS, row.slug).toContain(familyOf(row.topics));
    }
  });

  it("solves every free problem and skips locked ones", () => {
    const free = catalog.filter((row) => !row.premium);
    const authored = new Set(problems.map((p) => p.slug));
    expect(free.length).toBe(3276);
    expect(catalogItems.filter((c) => c.available).length).toBe(3276);
    expect(catalog.filter((row) => row.premium).length).toBe(784);

    for (const row of catalog) {
      const problem = getProblem(row.slug);
      if (row.premium) {
        expect(problem, row.slug).toBeUndefined();
        continue;
      }
      expect(problem, row.slug).toBeDefined();
      expect(
        problem!.approaches.some((a) => a.traceable),
        row.slug,
      ).toBe(true);
      if (authored.has(row.slug) || SOLVED_SLUGS.has(row.slug)) continue;
      const fn = slugToFn(row.slug);
      expect(problem!.approaches[0]!.code.python.source, row.slug).toContain(`def ${fn}(`);
      expect(problem!.approaches[0]!.code.go.source, row.slug).toContain(`func ${fn}(`);
    }
  });

  it("family-only slugs still load a trace", async () => {
    const mod = await loadTraces("powx-n");
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });

  it("materializes the same shape as a hand-authored problem", () => {
    const p = materialize(catalog[0]!);
    expect(p.approaches.length).toBe(1);
    expect(p.approaches[0]!.kind).toBe("optimal");
    expect(p.approaches[0]!.traceable).toBe(true);
    expect(p.examples.length).toBeGreaterThan(0);
    expect(p.inputs.length).toBeGreaterThan(0);
  });

  it("each family approach has matching Python/Go markers", () => {
    for (const id of FAMILY_IDS) {
      const a = FAMILY_APPROACH[id];
      const py = Object.keys(a.code.python.markers).sort();
      const go = Object.keys(a.code.go.markers).sort();
      expect(go, id).toEqual(py);
      for (const lang of LANGUAGES) {
        expect(() => resolveMarkers(a.code[lang], `family/${id}/${lang}`)).not.toThrow();
      }
    }
  });

  it("traces run on default inputs and finish done", () => {
    for (const id of FAMILY_IDS) {
      const inputs = FAMILY_INPUTS[id];
      const approach = FAMILY_APPROACH[id];
      const steps = familyTraces(id)[approach.id](parseInputs(inputs, defaultRawInputs(inputs)));
      expect(steps.length, id).toBeGreaterThan(1);
      expect(steps.length).toBeLessThanOrEqual(MAX_STEPS);
      expect(steps[steps.length - 1]!.status, id).toBe("done");
      for (const s of steps) {
        expect(approach.code.python.markers[s.marker], `${id} ${s.marker}`).toBeDefined();
        expect(s.panels.length).toBeGreaterThan(0);
      }
    }
  });
});
