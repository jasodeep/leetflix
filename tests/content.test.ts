import { describe, expect, it } from "vitest";

import { catalog } from "@/content/catalog";
import { problems } from "@/content/problems";
import { loadTraces, traceLoaders } from "@/content/traces";
import { parseInputs, defaultRawInputs } from "@/lib/inputs";
import { resolveMarkers } from "@/lib/markers";
import { isMethod, isProblemType, LANGUAGES } from "@/lib/types";
import { MAX_STEPS } from "@/lib/viz/recorder";

describe("catalog", () => {
  it("has unique ids and slugs", () => {
    const ids = new Set(catalog.map((c) => c.id));
    const slugs = new Set(catalog.map((c) => c.slug));
    expect(ids.size).toBe(catalog.length);
    expect(slugs.size).toBe(catalog.length);
  });

  it("uses LeetCode-style slugs", () => {
    for (const c of catalog) expect(c.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(catalog.find((c) => c.id === 50)?.slug).toBe("powx-n");
    expect(catalog.find((c) => c.id === 3)?.slug).toBe(
      "longest-substring-without-repeating-characters",
    );
  });

  it("tags every problem with at least one topic", () => {
    for (const c of catalog) expect(c.topics.length).toBeGreaterThan(0);
  });

  it("classifies every tag as a type or a method", () => {
    for (const c of catalog) {
      for (const t of c.topics) {
        expect(isProblemType(t) || isMethod(t), `${c.slug} tag ${t}`).toBe(true);
      }
    }
  });
});

describe("authored problems", () => {
  it("each has a matching catalog row", () => {
    for (const p of problems) {
      const row = catalog.find((c) => c.slug === p.slug);
      expect(row, `catalog row for ${p.slug}`).toBeDefined();
      expect(row!.id).toBe(p.id);
      expect(row!.title).toBe(p.title);
      expect(row!.difficulty).toBe(p.difficulty);
    }
  });

  it("has unique slugs and non-empty content", () => {
    expect(new Set(problems.map((p) => p.slug)).size).toBe(problems.length);
    for (const p of problems) {
      expect(p.statement.length).toBeGreaterThan(0);
      expect(p.examples.length).toBeGreaterThan(0);
      expect(p.constraints.length).toBeGreaterThan(0);
      expect(p.insights.length).toBeGreaterThan(0);
      expect(p.approaches.length).toBeGreaterThan(0);
      expect(p.inputs.length).toBeGreaterThan(0);
      expect(
        p.approaches.some((a) => a.kind === "optimal"),
        `${p.slug} needs an optimal approach`,
      ).toBe(true);
    }
  });

  it("every approach ships Python and Go with resolvable markers", () => {
    for (const p of problems) {
      const ids = new Set(p.approaches.map((a) => a.id));
      expect(ids.size).toBe(p.approaches.length);
      for (const a of p.approaches) {
        for (const lang of LANGUAGES) {
          const code = a.code[lang];
          expect(code.source.trim().length, `${p.slug}/${a.id}/${lang} source`).toBeGreaterThan(0);
          expect(() => resolveMarkers(code, `${p.slug}/${a.id}/${lang}`)).not.toThrow();
        }
        const pyMarkers = Object.keys(a.code.python.markers).sort();
        const goMarkers = Object.keys(a.code.go.markers).sort();
        expect(goMarkers, `${p.slug}/${a.id} marker sets differ`).toEqual(pyMarkers);
        if (a.traceable)
          expect(pyMarkers.length, `${p.slug}/${a.id} traceable but no markers`).toBeGreaterThan(0);
      }
    }
  });

  it("Go sources are gofmt-style (tabs, no 4-space indents)", () => {
    for (const p of problems) {
      for (const a of p.approaches) {
        for (const line of a.code.go.source.split("\n")) {
          expect(line.startsWith("    "), `${p.slug}/${a.id}: "${line}"`).toBe(false);
        }
      }
    }
  });

  it("default inputs parse", () => {
    for (const p of problems) {
      expect(() => parseInputs(p.inputs, defaultRawInputs(p.inputs))).not.toThrow();
    }
  });

  it("example inputs parse with the declared input schema", () => {
    for (const p of problems) {
      for (const ex of p.examples) {
        expect(Object.keys(ex.input).sort(), `${p.slug} example keys`).toEqual(
          p.inputs.map((f) => f.name).sort(),
        );
        expect(
          () => parseInputs(p.inputs, ex.input),
          `${p.slug} example ${JSON.stringify(ex.input)}`,
        ).not.toThrow();
      }
    }
  });

  it("related slugs point at authored problems", () => {
    const slugs = new Set(problems.map((p) => p.slug));
    for (const p of problems)
      for (const r of p.related ?? []) expect(slugs.has(r), `${p.slug} → ${r}`).toBe(true);
  });
});

describe("traces", () => {
  it("every traceable approach has a trace, and vice versa", async () => {
    for (const p of problems) {
      const traceable = p.approaches
        .filter((a) => a.traceable)
        .map((a) => a.id)
        .sort();
      if (traceable.length === 0) {
        expect(
          traceLoaders[p.slug],
          `${p.slug} has no traceable approaches but registers a loader`,
        ).toBeUndefined();
        continue;
      }
      expect(traceLoaders[p.slug], `${p.slug} missing trace loader`).toBeDefined();
      const mod = await loadTraces(p.slug);
      expect(Object.keys(mod).sort()).toEqual(traceable);
    }
  });

  it("runs on default inputs and only uses declared markers", async () => {
    for (const p of problems) {
      if (!traceLoaders[p.slug]) continue;
      const mod = await loadTraces(p.slug);
      const input = parseInputs(p.inputs, defaultRawInputs(p.inputs));
      for (const a of p.approaches.filter((x) => x.traceable)) {
        const steps = mod[a.id](input);
        expect(steps.length, `${p.slug}/${a.id} steps`).toBeGreaterThan(1);
        expect(steps.length).toBeLessThanOrEqual(MAX_STEPS);
        const last = steps[steps.length - 1];
        expect(last.status, `${p.slug}/${a.id} final status`).toBe("done");
        for (const s of steps) {
          for (const lang of LANGUAGES) {
            expect(
              a.code[lang].markers[s.marker],
              `${p.slug}/${a.id}/${lang} marker "${s.marker}"`,
            ).toBeDefined();
          }
          expect(s.note.trim().length).toBeGreaterThan(0);
          expect(s.panels.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("reproduces the documented example outputs", async () => {
    for (const p of problems) {
      if (!traceLoaders[p.slug]) continue;
      const mod = await loadTraces(p.slug);
      const optimal = p.approaches.find((a) => a.kind === "optimal" && a.traceable);
      if (!optimal) continue;
      for (const ex of p.examples) {
        const steps = mod[optimal.id](parseInputs(p.inputs, ex.input));
        const last = steps[steps.length - 1];
        expect(last.status, `${p.slug} ${JSON.stringify(ex.input)}`).toBe("done");
        expect(last.note, `${p.slug} ${JSON.stringify(ex.input)} → ${ex.output}`).toContain(
          ex.output,
        );
      }
    }
  });

  it("panels are snapshots, not live references", async () => {
    const mod = await loadTraces("two-sum");
    const steps = mod["hash-map"]({ nums: [2, 7, 11, 15], target: 9 });
    const first = steps[0].panels.find((x) => x.kind === "map");
    const last = steps[steps.length - 1].panels.find((x) => x.kind === "map");
    expect(first?.kind === "map" && first.entries.length).toBe(0);
    expect(last?.kind === "map" && last.entries.length).toBeGreaterThan(0);
  });
});
