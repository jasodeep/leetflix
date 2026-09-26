"use client";

import { Play } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import type { Approach } from "@/lib/types";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 480, damping: 38 } as const;

export function SolutionTabs({
  approaches,
  activeId,
  onChange,
  panels,
}: {
  approaches: Pick<Approach, "id" | "title" | "traceable">[];
  activeId: string;
  onChange: (id: string) => void;
  panels: Record<string, ReactNode>;
}) {
  const active = approaches.find((a) => a.id === activeId) ?? approaches[0]!;

  return (
    <div className="space-y-6">
      {approaches.length > 1 && (
        <div
          role="tablist"
          aria-label="Solutions"
          className="border-border bg-surface-2/80 flex flex-wrap gap-1 rounded-lg border p-1"
        >
          {approaches.map((a) => {
            const on = a.id === active.id;
            return (
              <button
                key={a.id}
                role="tab"
                type="button"
                aria-selected={on}
                onClick={() => onChange(a.id)}
                className={cn(
                  "relative rounded-md px-3.5 py-2 text-sm transition-colors",
                  on ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="solution-pill"
                    className="bg-fg/10 ring-border-strong absolute inset-0 rounded-md ring-1"
                    transition={spring}
                    aria-hidden
                  />
                )}
                <span className="relative">{a.title}</span>
              </button>
            );
          })}
        </div>
      )}

      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {panels[active.id]}
        {active.traceable && (
          <a
            href="#walkthrough"
            className="text-brand hover:text-brand-hover mt-6 inline-flex items-center gap-2 text-sm font-medium"
          >
            <Play className="size-3.5 fill-current" aria-hidden />
            Watch this run
          </a>
        )}
      </motion.div>
    </div>
  );
}
