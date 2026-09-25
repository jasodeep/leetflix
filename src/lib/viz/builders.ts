import type {
  ArrayPanel,
  BarsPanel,
  CellTone,
  GridPanel,
  MapPanel,
  Pointer,
  StackPanel,
  Variable,
  VarsPanel,
} from "@/lib/viz/types";

/** Small constructors so traces read like the algorithm, not like JSON. */

export const arrayPanel = (
  id: string,
  label: string,
  values: Array<number | string>,
  opts: Partial<Omit<ArrayPanel, "kind" | "id" | "label" | "values">> = {},
): ArrayPanel => ({ kind: "array", id, label, values: [...values], ...opts });

export const barsPanel = (
  id: string,
  label: string,
  values: number[],
  opts: Partial<Omit<BarsPanel, "kind" | "id" | "label" | "values">> = {},
): BarsPanel => ({ kind: "bars", id, label, values: [...values], ...opts });

export const mapPanel = (
  id: string,
  label: string,
  map: ReadonlyMap<unknown, unknown> | Record<string, unknown>,
  opts: { highlightKey?: unknown; newKey?: unknown; emptyText?: string } = {},
): MapPanel => {
  const entries = map instanceof Map ? [...map.entries()] : Object.entries(map);
  return {
    kind: "map",
    id,
    label,
    emptyText: opts.emptyText ?? "empty",
    entries: entries.map(([k, v]) => ({
      key: String(k),
      value: String(v),
      tone: k === opts.newKey ? "new" : k === opts.highlightKey ? "hit" : "default",
    })),
  };
};

export const stackPanel = (
  id: string,
  label: string,
  items: readonly string[],
  topTone: StackPanel["topTone"] = "default",
): StackPanel => ({ kind: "stack", id, label, items: [...items], topTone, emptyText: "empty" });

export const varsPanel = (id: string, label: string, vars: Variable[]): VarsPanel => ({
  kind: "vars",
  id,
  label,
  vars,
});

export const v = (
  name: string,
  value: unknown,
  opts: { changed?: boolean; tone?: Variable["tone"] } = {},
): Variable => ({ name, value: String(value), ...opts });

export const ptr = (index: number, label: string, color?: Pointer["color"]): Pointer => ({
  index,
  label,
  ...(color ? { color } : {}),
});

export const tones = (...pairs: Array<[number, CellTone]>): Record<number, CellTone> =>
  Object.fromEntries(pairs);

export const rangeTones = (from: number, to: number, tone: CellTone): Record<number, CellTone> => {
  const out: Record<number, CellTone> = {};
  for (let i = from; i <= to; i++) out[i] = tone;
  return out;
};

export const gridPanel = (
  id: string,
  label: string,
  cells: string[][],
  opts: Partial<Omit<GridPanel, "kind" | "id" | "label" | "cells">> = {},
): GridPanel => ({ kind: "grid", id, label, cells: cells.map((r) => [...r]), ...opts });
