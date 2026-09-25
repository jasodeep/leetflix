/** Serialisable subset of shiki's ThemedToken, safe to pass to client components. */
export interface Token {
  content: string;
  color?: string;
  /** Bitmask matching shiki: 1 = italic, 2 = bold, 4 = underline. */
  fontStyle?: number;
}

export type TokenLine = Token[];

export interface HighlightedCode {
  lines: TokenLine[];
  /** Theme background, so the block can match the highlighter exactly. */
  bg: string;
  fg: string;
}
