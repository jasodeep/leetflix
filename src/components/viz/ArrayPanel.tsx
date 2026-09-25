"use client";

import { motion } from "motion/react";

import type { ArrayPanel as ArrayPanelData } from "@/lib/viz/types";
import { cn } from "@/lib/utils";

import { PanelFrame, PointerTag } from "./PanelFrame";
import { cellTone, pointerColor } from "./tones";

const CELL = 44;
const GAP = 6;

export function ArrayPanel({ panel }: { panel: ArrayPanelData }) {
  const { values, pointers = [], tones = {}, window, showIndices = true } = panel;
  const pointersByIndex = new Map<number, typeof pointers>();
  for (const p of pointers)
    pointersByIndex.set(p.index, [...(pointersByIndex.get(p.index) ?? []), p]);
  const hasPointers = pointers.length > 0;

  if (values.length === 0) {
    return (
      <PanelFrame label={panel.label}>
        <div className="border-border text-fg-subtle rounded-md border border-dashed px-3 py-2 font-mono text-xs">
          [ ] empty
        </div>
      </PanelFrame>
    );
  }

  return (
    <PanelFrame label={panel.label}>
      {/* Horizontal padding gives wide pointer labels room to overhang the first/last cell. */}
      <div className="-mx-6 scrollbar-none overflow-x-auto px-6 pb-1">
        <div className="relative inline-block" style={{ paddingBottom: hasPointers ? 30 : 0 }}>
          <div className="flex" style={{ gap: GAP }}>
            {values.map((val, i) => (
              <div key={i} className="flex flex-col items-center" style={{ width: CELL }}>
                <motion.div
                  layout
                  initial={false}
                  animate={{ scale: tones[i] === "active" ? 1.06 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={cn(
                    "flex items-center justify-center rounded-md border font-mono text-sm tabular-nums transition-colors duration-200",
                    cellTone[tones[i] ?? "default"],
                  )}
                  style={{ width: CELL, height: CELL }}
                >
                  {/* Keyed on the value so a mutation pops instead of silently swapping. */}
                  <motion.span
                    key={String(val)}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 28 }}
                    className="truncate px-1"
                  >
                    {String(val)}
                  </motion.span>
                </motion.div>
                {showIndices && (
                  <span className="text-fg-subtle mt-1 font-mono text-[10px]">{i}</span>
                )}
              </div>
            ))}
          </div>

          {window && window[1] >= window[0] && (
            <motion.div
              layout
              initial={false}
              className="border-viz-blue/60 pointer-events-none absolute rounded-b-md border-x border-b"
              style={{
                left: window[0] * (CELL + GAP),
                width: (window[1] - window[0] + 1) * (CELL + GAP) - GAP,
                top: CELL + 2,
                height: showIndices ? 18 : 8,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              aria-hidden
            />
          )}

          {hasPointers &&
            [...pointersByIndex.entries()].map(([index, ps]) => (
              <motion.div
                key={ps.map((p) => p.label).join("|")}
                layout
                initial={false}
                animate={{ left: index * (CELL + GAP) }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute flex justify-center gap-2"
                style={{ width: CELL, top: CELL + (showIndices ? 22 : 6) }}
              >
                {ps.map((p) => (
                  <PointerTag
                    key={p.label}
                    label={p.label}
                    color={pointerColor[p.color ?? "red"]}
                  />
                ))}
              </motion.div>
            ))}
        </div>
      </div>
    </PanelFrame>
  );
}
