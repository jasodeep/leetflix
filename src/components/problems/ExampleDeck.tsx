"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { InlineMarkdown } from "@/components/content/InlineMarkdown";
import { Viz } from "@/components/viz/Viz";
import type { Example } from "@/lib/types";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 480, damping: 38 } as const;

/** Tabbed examples: one I/O card at a time, with the viz fading in underneath. */
export function ExampleDeck({ examples }: { examples: Example[] }) {
  const [i, setI] = useState(0);
  const ex = examples[i]!;

  return (
    <div className="space-y-4">
      {examples.length > 1 && (
        <div
          role="tablist"
          aria-label="Examples"
          className="border-border bg-surface-2/80 inline-flex flex-wrap gap-1 rounded-lg border p-1"
        >
          {examples.map((_, idx) => {
            const on = idx === i;
            return (
              <button
                key={idx}
                role="tab"
                type="button"
                aria-selected={on}
                onClick={() => setI(idx)}
                className={cn(
                  "relative rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
                  on ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="example-pill"
                    className="bg-surface-3 absolute inset-0 rounded-md"
                    transition={spring}
                    aria-hidden
                  />
                )}
                <span className="relative">Example {idx + 1}</span>
              </button>
            );
          })}
        </div>
      )}

      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-card border-border bg-surface/80 overflow-hidden border"
      >
        <div className="grid items-stretch gap-0 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="p-5">
            <h3 className="text-fg-subtle mb-3 font-mono text-[11px] tracking-wider uppercase">
              Input
            </h3>
            <dl className="space-y-1.5 font-mono text-sm">
              {Object.entries(ex.input).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="text-fg-muted shrink-0">{k} =</dt>
                  <dd className="text-fg break-all">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div
            className="text-brand font-display hidden items-center justify-center px-1 text-3xl sm:flex"
            aria-hidden
          >
            →
          </div>
          <div className="border-border border-t p-5 sm:border-t-0 sm:border-l">
            <h3 className="text-fg-subtle mb-3 font-mono text-[11px] tracking-wider uppercase">
              Output
            </h3>
            <p className="text-viz-green font-mono text-lg tracking-tight">{ex.output}</p>
          </div>
        </div>
        {(ex.viz || ex.explanation) && (
          <div className="border-border bg-bg/40 space-y-4 border-t p-5">
            {ex.viz && <Viz state={ex.viz} />}
            {ex.explanation && (
              <p className="prose-code text-fg-muted text-sm leading-6">
                <InlineMarkdown text={ex.explanation} />
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
