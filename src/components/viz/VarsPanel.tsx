"use client";

import { motion } from "motion/react";

import type { VarsPanel as VarsPanelData } from "@/lib/viz/types";
import { cn } from "@/lib/utils";

import { PanelFrame } from "./PanelFrame";

const valueTone = {
  default: "text-fg",
  result: "text-viz-green",
  danger: "text-viz-red",
} as const;

export function VarsPanel({ panel }: { panel: VarsPanelData }) {
  return (
    <PanelFrame label={panel.label || undefined}>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-xs">
        {panel.vars.map((vr) => (
          <div key={vr.name} className="contents">
            <dt className="text-fg-muted">{vr.name}</dt>
            <motion.dd
              key={`${vr.name}:${vr.value}`}
              initial={vr.changed ? { backgroundColor: "rgba(251,191,36,0.35)" } : false}
              animate={{ backgroundColor: "rgba(251,191,36,0)" }}
              transition={{ duration: 0.9 }}
              className={cn(
                "-mx-1 rounded px-1 tabular-nums",
                valueTone[vr.tone ?? "default"],
                vr.changed && "font-semibold",
              )}
            >
              {vr.value}
            </motion.dd>
          </div>
        ))}
      </dl>
    </PanelFrame>
  );
}
