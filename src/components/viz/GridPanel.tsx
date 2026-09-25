"use client";

import { motion } from "motion/react";

import { gridKey, type GridPanel as GridPanelData } from "@/lib/viz/types";
import { cn } from "@/lib/utils";

import { PanelFrame } from "./PanelFrame";
import { gridTone } from "./tones";

const CELL = 30;
const GAP = 3;

export function GridPanel({ panel }: { panel: GridPanelData }) {
  const { cells, tones = {}, cursor } = panel;
  const cols = cells[0]?.length ?? 0;
  return (
    <PanelFrame label={panel.label}>
      <div className="scrollbar-none overflow-x-auto pb-1">
        <div
          className="relative inline-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, ${CELL}px)`, gap: GAP }}
        >
          {cells.map((row, r) =>
            row.map((ch, c) => {
              const tone = tones[gridKey(r, c)] ?? "default";
              return (
                <motion.div
                  key={gridKey(r, c)}
                  initial={false}
                  animate={{ scale: tone === "active" ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={cn(
                    "flex items-center justify-center rounded border font-mono text-xs transition-colors duration-200",
                    gridTone[tone],
                  )}
                  style={{ width: CELL, height: CELL }}
                  title={`(${r}, ${c})`}
                >
                  {ch}
                </motion.div>
              );
            }),
          )}
          {cursor && (
            <motion.div
              aria-hidden
              initial={false}
              animate={{ left: cursor.c * (CELL + GAP) - 2, top: cursor.r * (CELL + GAP) - 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="border-fg pointer-events-none absolute rounded-md border-2"
              style={{ width: CELL + 4, height: CELL + 4 }}
            />
          )}
        </div>
      </div>
    </PanelFrame>
  );
}
