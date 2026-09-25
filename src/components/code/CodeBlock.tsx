import { highlight, type HighlightLang } from "@/lib/code/highlight";
import { cn } from "@/lib/utils";

import { TokenCode } from "./TokenCode";

interface CodeBlockProps {
  source: string;
  lang: HighlightLang;
  title?: string;
  className?: string;
}

/** Server component: highlights at build time and renders a static block. */
export async function CodeBlock({ source, lang, title, className }: CodeBlockProps) {
  const code = await highlight(source, lang);
  return (
    <figure className={cn("rounded-card border-border overflow-hidden border", className)}>
      {title && (
        <figcaption className="border-border bg-surface-2 text-fg-muted flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
          <span>{title}</span>
          <span className="uppercase">{lang}</span>
        </figcaption>
      )}
      <TokenCode code={code} showLineNumbers={false} />
    </figure>
  );
}
