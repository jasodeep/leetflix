import "server-only";

import { createHighlighter, type Highlighter } from "shiki";

import type { HighlightedCode, TokenLine } from "@/lib/code/tokens";

export const THEME = "vesper";
const LANGS = ["python", "go", "text"] as const;
export type HighlightLang = (typeof LANGS)[number];

let highlighterPromise: Promise<Highlighter> | undefined;

/**
 * Shiki boots a WASM regex engine and loads grammars; that's ~100ms we only
 * want to pay once per build, not once per code block.
 */
const getHighlighter = (): Promise<Highlighter> => {
  highlighterPromise ??= createHighlighter({ themes: [THEME], langs: [...LANGS] });
  return highlighterPromise;
};

const highlightCache = new Map<string, Promise<HighlightedCode>>();

export async function highlight(source: string, lang: HighlightLang): Promise<HighlightedCode> {
  const key = `${lang}:${source}`;
  const cached = highlightCache.get(key);
  if (cached) return cached;
  const pending = highlightUncached(source, lang);
  highlightCache.set(key, pending);
  return pending;
}

const highlightUncached = async (source: string, lang: HighlightLang): Promise<HighlightedCode> => {
  const highlighter = await getHighlighter();
  const result = highlighter.codeToTokens(source, { lang, theme: THEME });

  const lines: TokenLine[] = result.tokens.map((line) =>
    line.map((t) => ({
      content: t.content,
      ...(t.color ? { color: t.color } : {}),
      ...(t.fontStyle ? { fontStyle: t.fontStyle } : {}),
    })),
  );

  return { lines, bg: result.bg ?? "#101010", fg: result.fg ?? "#ffffff" };
};
