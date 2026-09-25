"use client";

import { motion } from "motion/react";

import type { HighlightedCode, Token } from "@/lib/code/tokens";
import { cn } from "@/lib/utils";

interface TokenCodeProps {
  code: HighlightedCode;
  /** 1-based line to emphasise (the animation cursor). */
  activeLine?: number;
  showLineNumbers?: boolean;
  className?: string;
}

const styleFor = (t: Token): React.CSSProperties => ({
  color: t.color,
  fontStyle: t.fontStyle && t.fontStyle & 1 ? "italic" : undefined,
  fontWeight: t.fontStyle && t.fontStyle & 2 ? 600 : undefined,
  textDecoration: t.fontStyle && t.fontStyle & 4 ? "underline" : undefined,
});

/**
 * Renders pre-tokenised code. The active-line highlight is one shared
 * element that slides between lines, so the cursor reads as movement rather
 * than a blink. Pure presentation otherwise; safe to render from server trees.
 */
export function TokenCode({ code, activeLine, showLineNumbers = true, className }: TokenCodeProps) {
  const gutter = String(code.lines.length).length;
  return (
    <pre
      className={cn("scrollbar-thin overflow-x-auto py-3 text-[13px] leading-6", className)}
      style={{ background: code.bg, color: code.fg }}
    >
      <code className="block min-w-max">
        {code.lines.map((line, i) => {
          const n = i + 1;
          const active = n === activeLine;
          return (
            <span
              key={n}
              data-line={n}
              data-active={active || undefined}
              className="relative flex px-4"
            >
              {active && (
                <motion.span
                  layoutId="code-cursor"
                  className="bg-brand/12 border-brand pointer-events-none absolute inset-0 border-l-2"
                  transition={{ type: "spring", stiffness: 700, damping: 45 }}
                  aria-hidden
                />
              )}
              {showLineNumbers && (
                <span
                  aria-hidden
                  className={cn(
                    "relative mr-4 inline-block w-[var(--gutter)] shrink-0 text-right transition-colors select-none",
                    active ? "text-fg" : "text-fg-subtle",
                  )}
                  style={{ "--gutter": `${gutter}ch` } as React.CSSProperties}
                >
                  {n}
                </span>
              )}
              <span className="relative whitespace-pre">
                {line.length === 0
                  ? " "
                  : line.map((t, j) => (
                      <span key={j} style={styleFor(t)}>
                        {t.content}
                      </span>
                    ))}
              </span>
            </span>
          );
        })}
      </code>
    </pre>
  );
}
