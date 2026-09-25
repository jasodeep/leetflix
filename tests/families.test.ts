import { describe, expect, it } from "vitest";

import { catalog } from "@/content/catalog";
import { FAMILY_IDS, familyOf, familyTraces, materialize } from "@/content/families";
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
