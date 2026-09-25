"use client";

import { AnimatePresence, motion } from "motion/react";

import type { MapPanel as MapPanelData } from "@/lib/viz/types";
import { cn } from "@/lib/utils";

import { PanelFrame } from "./PanelFrame";

const entryTone = {
  default: "border-border-strong bg-surface-3",
  new: "border-viz-amber bg-viz-amber/15",
  hit: "border-viz-green bg-viz-green/15",
} as const;

export function MapPanel({ panel }: { panel: MapPanelData }) {
  return (
    <PanelFrame label={panel.label}>
      <div className="flex min-h-11 flex-wrap items-start gap-1.5">
        <AnimatePresence initial={false}>
          {panel.entries.length === 0 ? (
            <motion.span
              key="__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-border text-fg-subtle rounded-md border border-dashed px-2.5 py-2 font-mono text-xs"
            >
              {panel.emptyText ?? "empty"}
            </motion.span>
          ) : (
            panel.entries.map((e) => (
              <motion.span
                key={e.key}
                layout
                initial={{ opacity: 0, scale: 0.8, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                  "inline-flex items-center overflow-hidden rounded-md border font-mono text-xs transition-colors duration-200",
                  entryTone[e.tone ?? "default"],
                )}
              >
                <span className="text-fg px-2 py-1.5">{e.key}</span>
                <span className="bg-bg/40 text-fg-muted border-l border-inherit px-2 py-1.5">
                  → {e.value}
                </span>
              </motion.span>
            ))
          )}
        </AnimatePresence>
      </div>
    </PanelFrame>
  );
}
