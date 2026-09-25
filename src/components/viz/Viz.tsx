"use client";

import type { Panel, VizState } from "@/lib/viz/types";
import { assertNever, cn } from "@/lib/utils";

import { ArrayPanel } from "./ArrayPanel";
import { BarsPanel } from "./BarsPanel";
import { GridPanel } from "./GridPanel";
import { LinkedListPanel } from "./LinkedListPanel";
import { MapPanel } from "./MapPanel";
import { StackPanel } from "./StackPanel";
import { VarsPanel } from "./VarsPanel";

function PanelView({ panel }: { panel: Panel }) {
  switch (panel.kind) {
    case "array":
      return <ArrayPanel panel={panel} />;
    case "bars":
      return <BarsPanel panel={panel} />;
    case "map":
      return <MapPanel panel={panel} />;
    case "stack":
      return <StackPanel panel={panel} />;
    case "vars":
      return <VarsPanel panel={panel} />;
    case "linked-list":
      return <LinkedListPanel panel={panel} />;
    case "grid":
      return <GridPanel panel={panel} />;
    default:
      return assertNever(panel);
  }
}

/**
 * Lays out a VizState. Wide panels (arrays, bars, lists, grids) take a full
 * row; compact ones (map, stack, vars) flow side by side.
 */
export function Viz({ state, className }: { state: VizState; className?: string }) {
  const isWide = (p: Panel) =>
    p.kind === "array" || p.kind === "bars" || p.kind === "linked-list" || p.kind === "grid";
  const wide = state.filter(isWide);
  const compact = state.filter((p) => !isWide(p));
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {wide.map((p) => (
        <PanelView key={p.id} panel={p} />
      ))}
      {compact.length > 0 && (
        <div className="flex flex-wrap gap-x-10 gap-y-5">
          {compact.map((p) => (
            <PanelView key={p.id} panel={p} />
          ))}
        </div>
      )}
    </div>
  );
}
