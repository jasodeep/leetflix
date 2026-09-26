import { Clock, Database } from "lucide-react";

import { SolutionCode, type HighlightedSolution } from "@/components/code/SolutionCode";
import { InlineMarkdown } from "@/components/content/InlineMarkdown";
import { RichText } from "@/components/content/RichText";
import type { Approach, ApproachKind, Language } from "@/lib/types";
import { cn } from "@/lib/utils";

const kindLabel: Record<ApproachKind, { label: string; className: string }> = {
  "brute-force": { label: "Brute force", className: "border-fg-subtle/40 text-fg-muted" },
  optimal: { label: "Optimal", className: "border-viz-green/50 text-viz-green" },
  alternative: { label: "Alternative", className: "border-viz-blue/50 text-viz-blue" },
};

export function ApproachSection({
  approach,
  index,
  code,
  compact,
}: {
  approach: Approach;
  index: number;
  code: Record<Language, HighlightedSolution>;
  /** Hide the "Approach N" kicker when a parent tab already names it. */
  compact?: boolean;
}) {
  const kind = kindLabel[approach.kind];

  return (
    <article id={`approach-${approach.id}`} className="scroll-mt-32 space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {!compact && (
            <span className="text-fg-subtle font-mono text-xs">Approach {index + 1}</span>
          )}
          <span
            className={cn(
              "rounded-sm border px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase",
              kind.className,
            )}
          >
            {kind.label}
          </span>
          {approach.traceable && (
            <span className="border-brand/50 text-brand rounded-sm border px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
              ▶ Animated
            </span>
          )}
        </div>
        {!compact && (
          <h3 className="text-fg text-xl font-semibold tracking-tight">{approach.title}</h3>
        )}
        <p className="prose-code text-fg-muted">
          <InlineMarkdown text={approach.summary} />
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="space-y-6">
          <RichText blocks={approach.intuition} />

          <div>
            <h4 className="text-fg-subtle mb-2 font-mono text-[11px] tracking-wider uppercase">
              Algorithm
            </h4>
            <ol className="prose-code text-fg-muted marker:text-fg-subtle space-y-1.5 pl-5 text-sm leading-6 marker:font-mono">
              {approach.steps.map((s, i) => (
                <li key={i} className="list-decimal">
                  <InlineMarkdown text={s} />
                </li>
              ))}
            </ol>
          </div>

          <dl className="grid grid-cols-2 gap-3">
            <div className="border-border bg-surface rounded-md border p-3">
              <dt className="text-fg-subtle flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase">
                <Clock className="size-3" aria-hidden /> Time
              </dt>
              <dd className="text-fg mt-1 font-mono text-lg">{approach.complexity.time}</dd>
            </div>
            <div className="border-border bg-surface rounded-md border p-3">
              <dt className="text-fg-subtle flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase">
                <Database className="size-3" aria-hidden /> Space
              </dt>
              <dd className="text-fg mt-1 font-mono text-lg">{approach.complexity.space}</dd>
            </div>
            {approach.complexity.notes && (
              <p className="text-fg-subtle col-span-2 text-xs leading-5">
                {approach.complexity.notes}
              </p>
            )}
          </dl>
        </div>

        <SolutionCode code={code} />
      </div>
    </article>
  );
}
