"use client";

import { AnimatePresence, motion } from "motion/react";

import type { StackPanel as StackPanelData } from "@/lib/viz/types";
import { cn } from "@/lib/utils";

import { PanelFrame } from "./PanelFrame";

const topTone = {
  default: "border-viz-blue/70 bg-viz-blue/12",
  push: "border-viz-amber bg-viz-amber/15",
  pop: "border-viz-green bg-viz-green/15",
  danger: "border-viz-red bg-viz-red/20",
} as const;

/** Top of the stack renders at the top; items animate in from above and out upward. */
export function StackPanel({ panel }: { panel: StackPanelData }) {
  const items = panel.items.map((v, i) => ({ v, i }));
  return (
    <PanelFrame label={panel.label}>
      <div className="border-border-strong flex min-h-11 w-max min-w-28 flex-col-reverse gap-1 rounded-md border-x border-b px-1.5 pt-1 pb-1.5">
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <motion.span
              key="__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-fg-subtle px-2 py-1.5 text-center font-mono text-xs"
            >
              {panel.emptyText ?? "empty"}
            </motion.span>
          ) : (
            items.map(({ v, i }) => {
              const isTop = i === items.length - 1;
              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: -16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded border px-2.5 py-1.5 font-mono text-sm",
                    isTop
                      ? topTone[panel.topTone ?? "default"]
                      : "border-border-strong bg-surface-3",
                  )}
                >
                  <span className="text-fg">{v}</span>
                  {isTop && (
                    <span className="text-fg-subtle text-[10px] tracking-wider uppercase">top</span>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </PanelFrame>
  );
}
