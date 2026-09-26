import { describe, expect, it } from "vitest";

import { InputParseError, LIMITS, parseField, parseInputs } from "@/lib/inputs";
import { resolveMarkers } from "@/lib/markers";
import { absUrl, site } from "@/lib/site";
import { slugify } from "@/lib/utils";
import { Recorder, StepLimitError, MAX_STEPS } from "@/lib/viz/recorder";

describe("absUrl", () => {
  it("emits trailing slashes so GitHub Pages directory indexes resolve", () => {
    const origin = site.url;
    expect(absUrl("/")).toBe(`${origin}/`);
    expect(absUrl("/problems/two-sum")).toBe(`${origin}/problems/two-sum/`);
    expect(absUrl("/problems/two-sum/")).toBe(`${origin}/problems/two-sum/`);
    expect(absUrl("/sitemap.xml")).toBe(`${origin}/sitemap.xml`);
  });
});

describe("slugify", () => {
  it("matches LeetCode conventions", () => {
    expect(slugify("Two Sum")).toBe("two-sum");
    expect(slugify("Two Sum II - Input Array Is Sorted")).toBe("two-sum-ii-input-array-is-sorted");
    expect(slugify("3Sum")).toBe("3sum");
    expect(slugify("Kth Largest Element in a Stream")).toBe("kth-largest-element-in-a-stream");
  });
});

describe("resolveMarkers", () => {
  const source = "a = 1\nfor x in xs:\n    a += x\nreturn a";

  it("resolves unique substrings to 1-based lines", () => {
    expect(resolveMarkers({ source, markers: { loop: "for x in xs", end: "return a" } })).toEqual({
      loop: 2,
      end: 4,
    });
  });

  it("throws on missing markers", () => {
    expect(() => resolveMarkers({ source, markers: { nope: "while" } })).toThrow(/not found/);
  });

  it("throws on ambiguous markers", () => {
    expect(() => resolveMarkers({ source, markers: { amb: "a" } })).toThrow(/ambiguous/);
  });
});

describe("input parsing", () => {
  const int = { name: "n", label: "n", type: "int" as const, default: "0" };
  const arr = { name: "nums", label: "nums", type: "int[]" as const, default: "[]" };
  const str = { name: "s", label: "s", type: "string" as const, default: "" };
  const grid = { name: "grid", label: "grid", type: "string[]" as const, default: "[]" };

  it("parses ints", () => {
    expect(parseField(int, " 42 ")).toBe(42);
    expect(parseField(int, "-7")).toBe(-7);
    expect(() => parseField(int, "4.2")).toThrow(InputParseError);
    expect(() => parseField(int, "abc")).toThrow(InputParseError);
    expect(() => parseField(int, String(LIMITS.intAbs + 1))).toThrow(/within/);
  });

  it("parses int arrays with or without brackets", () => {
    expect(parseField(arr, "[1, 2, 3]")).toEqual([1, 2, 3]);
    expect(parseField(arr, "1,2,3")).toEqual([1, 2, 3]);
    expect(parseField(arr, "[]")).toEqual([]);
    expect(parseField(arr, "")).toEqual([]);
    expect(() => parseField(arr, "[1, x]")).toThrow(InputParseError);
    expect(() =>
      parseField(
        arr,
        Array(LIMITS.arrayLength + 1)
          .fill(1)
          .join(","),
      ),
    ).toThrow(/at most/);
  });

  it("parses strings, stripping optional quotes", () => {
    expect(parseField(str, '"abc"')).toBe("abc");
    expect(parseField(str, "'abc'")).toBe("abc");
    expect(parseField(str, "abc")).toBe("abc");
    expect(parseField(str, '""')).toBe("");
    expect(() => parseField(str, "x".repeat(LIMITS.stringLength + 1))).toThrow(/at most/);
  });

  it("parses rectangular string grids", () => {
    expect(parseField(grid, '["110", "011"]')).toEqual(["110", "011"]);
    expect(() => parseField(grid, '["110", "01"]')).toThrow(/same length/);
  });

  it("falls back to defaults for missing fields", () => {
    expect(parseInputs([int, arr], {})).toEqual({ n: 0, nums: [] });
  });

  it("reports the offending field", () => {
    try {
      parseInputs([int], { n: "oops" });
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(InputParseError);
      expect((e as InputParseError).field).toBe("n");
    }
  });
});

describe("Recorder", () => {
  it("deep-clones panels", () => {
    const rec = new Recorder();
    const values = [1, 2];
    rec.record("m", "n", [{ kind: "array", id: "a", label: "a", values }]);
    values.push(3);
    const steps = rec.finish();
    expect(steps[0].panels[0].kind === "array" && steps[0].panels[0].values).toEqual([1, 2]);
  });

  it("enforces the step ceiling", () => {
    const rec = new Recorder();
    for (let i = 0; i < MAX_STEPS; i++) rec.record("m", "n", []);
    expect(() => rec.record("m", "n", [])).toThrow(StepLimitError);
  });
});
