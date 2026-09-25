"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import type { HighlightedCode } from "@/lib/code/tokens";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { LANGUAGE_LABEL, type Language } from "@/lib/types";

import { LanguageToggle } from "./LanguageToggle";
import { TokenCode } from "./TokenCode";

export interface HighlightedSolution {
  highlighted: HighlightedCode;
  source: string;
}

/** Static solution block with a Python/Go toggle that follows the site-wide preference. */
export function SolutionCode({
  code,
  title,
}: {
  code: Record<Language, HighlightedSolution>;
  title?: string;
}) {
  const [lang, setLang] = useLanguage();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code[lang].source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <figure className="rounded-card border-border overflow-hidden border">
      <figcaption className="border-border bg-surface-2 flex items-center gap-3 border-b px-3 py-2">
        <span className="text-fg-muted font-mono text-xs">
          {title ?? `Solution.${lang === "python" ? "py" : "go"}`}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle value={lang} onChange={setLang} />
          <button
            type="button"
            onClick={copy}
            className="border-border text-fg-muted hover:border-border-strong hover:text-fg flex size-7 items-center justify-center rounded-md border transition-colors"
            aria-label={`Copy ${LANGUAGE_LABEL[lang]} solution`}
          >
            {copied ? (
              <Check className="text-viz-green size-3.5" aria-hidden />
            ) : (
              <Copy className="size-3.5" aria-hidden />
            )}
          </button>
        </div>
      </figcaption>
      <TokenCode code={code[lang].highlighted} />
    </figure>
  );
}
