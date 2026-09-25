import type { CellTone, GridCellTone, PointerColor } from "@/lib/viz/types";

/** Shared colour vocabulary for every panel so the same tone reads the same everywhere. */

export const cellTone: Record<CellTone, string> = {
  default: "border-border-strong bg-surface-3 text-fg",
  active: "border-viz-red bg-viz-red/15 text-fg shadow-[0_0_0_1px_var(--color-viz-red)]",
  match: "border-viz-green bg-viz-green/15 text-fg",
  visited: "border-border bg-surface-2 text-fg-muted",
  dim: "border-border bg-surface text-fg-subtle opacity-60",
  result: "border-viz-green bg-viz-green text-bg font-semibold",
  danger: "border-viz-red bg-viz-red text-bg font-semibold",
  window: "border-viz-blue/70 bg-viz-blue/12 text-fg",
};

export const gridTone: Record<GridCellTone, string> = {
  default: "bg-surface-3 border-border-strong",
  water: "bg-surface border-border text-fg-subtle",
  land: "bg-viz-amber/80 border-viz-amber text-bg",
  visited: "bg-viz-blue/25 border-viz-blue/40 text-fg-muted",
  active: "bg-viz-red border-viz-red text-bg",
  frontier: "bg-viz-green/70 border-viz-green text-bg",
};

export const pointerColor: Record<PointerColor, string> = {
  red: "var(--color-viz-red)",
  blue: "var(--color-viz-blue)",
  green: "var(--color-viz-green)",
  amber: "var(--color-viz-amber)",
  violet: "var(--color-viz-violet)",
  cyan: "var(--color-viz-cyan)",
};

export const barFill: Record<CellTone, string> = {
  default: "var(--color-border-strong)",
  active: "var(--color-viz-red)",
  match: "var(--color-viz-green)",
  visited: "var(--color-border)",
  dim: "var(--color-surface-3)",
  result: "var(--color-viz-green)",
  danger: "var(--color-viz-red)",
  window: "var(--color-viz-blue)",
};
