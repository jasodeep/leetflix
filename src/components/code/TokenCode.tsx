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
 * Renders pre-tokenised code. Works in both server and client trees because
 * it's pure presentation; the player just re-renders it with a new activeLine.
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
              className={cn(
                "relative flex border-l-2 border-transparent px-4 transition-colors duration-150",
                active && "border-brand bg-brand/12",
              )}
            >
              {showLineNumbers && (
                <span
                  aria-hidden
                  className={cn(
                    "mr-4 inline-block w-[var(--gutter)] shrink-0 text-right select-none",
                    active ? "text-fg" : "text-fg-subtle",
                  )}
                  style={{ "--gutter": `${gutter}ch` } as React.CSSProperties}
                >
                  {n}
                </span>
              )}
              <span className="whitespace-pre">
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
