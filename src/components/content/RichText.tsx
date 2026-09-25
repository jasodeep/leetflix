import { Info, Lightbulb, TriangleAlert } from "lucide-react";

import { CodeBlock } from "@/components/code/CodeBlock";
import { Viz } from "@/components/viz/Viz";
import type { Block } from "@/lib/types";
import { assertNever, cn } from "@/lib/utils";

import { InlineMarkdown } from "./InlineMarkdown";

const calloutStyles = {
  info: { icon: Info, ring: "border-viz-blue/30 bg-viz-blue/8", accent: "text-viz-blue" },
  tip: { icon: Lightbulb, ring: "border-viz-green/30 bg-viz-green/8", accent: "text-viz-green" },
  warn: {
    icon: TriangleAlert,
    ring: "border-viz-amber/30 bg-viz-amber/8",
    accent: "text-viz-amber",
  },
} as const;

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-fg-muted leading-7">
          <InlineMarkdown text={block.text} />
        </p>
      );
    case "h3":
      return <h3 className="text-fg mt-8 text-base font-semibold first:mt-0">{block.text}</h3>;
    case "ul":
      return (
        <ul className="text-fg-muted marker:text-fg-subtle space-y-1.5 pl-5 leading-7">
          {block.items.map((item, i) => (
            <li key={i} className="list-disc">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="text-fg-muted marker:text-fg-subtle space-y-1.5 pl-5 leading-7 marker:font-mono">
          {block.items.map((item, i) => (
            <li key={i} className="list-decimal">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ol>
      );
    case "code":
      return <CodeBlock source={block.code} lang={block.lang} />;
    case "callout": {
      const s = calloutStyles[block.tone];
      const Icon = s.icon;
      return (
        <aside className={cn("rounded-card flex gap-3 border p-4 text-sm leading-6", s.ring)}>
          <Icon className={cn("mt-0.5 size-4 shrink-0", s.accent)} aria-hidden />
          <div className="text-fg-muted">
            {block.title && <p className={cn("mb-0.5 font-medium", s.accent)}>{block.title}</p>}
            <InlineMarkdown text={block.text} />
          </div>
        </aside>
      );
    }
    case "viz":
      return (
        <figure className="rounded-card border-border bg-surface border p-4 sm:p-5">
          <Viz state={block.state} />
          {block.caption && (
            <figcaption className="border-border text-fg-muted mt-4 border-t pt-3 text-sm leading-6">
              <InlineMarkdown text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    default:
      return assertNever(block);
  }
}

export function RichText({ blocks, className }: { blocks: Block[]; className?: string }) {
  return (
    <div className={cn("prose-code space-y-4", className)}>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}
