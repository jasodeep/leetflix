import type { InputField, InputFieldType } from "@/lib/types";
import type { TraceInput } from "@/lib/viz/types";

export class InputParseError extends Error {
  constructor(
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "InputParseError";
  }
}

/** Upper bounds keep animations legible and step counts bounded. */
export const LIMITS = {
  arrayLength: 24,
  stringLength: 40,
  gridRows: 8,
  gridCols: 12,
  intAbs: 10_000,
} as const;

const parseInt10 = (raw: string, field: string): number => {
  const trimmed = raw.trim();
  if (!/^-?\d+$/.test(trimmed)) {
    throw new InputParseError(field, `"${trimmed}" is not an integer`);
  }
  const n = Number(trimmed);
  if (Math.abs(n) > LIMITS.intAbs) {
    throw new InputParseError(field, `keep values within ±${LIMITS.intAbs}`);
  }
  return n;
};

const stripBrackets = (raw: string): string => {
  const t = raw.trim();
  return t.startsWith("[") && t.endsWith("]") ? t.slice(1, -1) : t;
};

const parseIntArray = (raw: string, field: string): number[] => {
  const inner = stripBrackets(raw);
  if (inner.trim() === "") return [];
  const parts = inner.split(",");
  if (parts.length > LIMITS.arrayLength) {
    throw new InputParseError(field, `use at most ${LIMITS.arrayLength} elements`);
  }
  return parts.map((p) => parseInt10(p, field));
};

const parseString = (raw: string, field: string): string => {
  let s = raw.trim();
  if (
    s.length >= 2 &&
    ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))
  ) {
    s = s.slice(1, -1);
  }
  if (s.length > LIMITS.stringLength) {
    throw new InputParseError(field, `use at most ${LIMITS.stringLength} characters`);
  }
  return s;
};

const parseStringArray = (raw: string, field: string): string[] => {
  const inner = stripBrackets(raw);
  if (inner.trim() === "") return [];
  const rows = inner.split(",").map((p) => parseString(p, field));
  if (rows.length > LIMITS.gridRows) {
    throw new InputParseError(field, `use at most ${LIMITS.gridRows} rows`);
  }
  const width = rows[0].length;
  for (const row of rows) {
    if (row.length !== width) {
      throw new InputParseError(field, "all rows must have the same length");
    }
    if (row.length > LIMITS.gridCols) {
      throw new InputParseError(field, `use at most ${LIMITS.gridCols} columns`);
    }
  }
  return rows;
};

const parsers: Record<InputFieldType, (raw: string, field: string) => unknown> = {
  int: parseInt10,
  "int[]": parseIntArray,
  string: parseString,
  "string[]": parseStringArray,
};

export function parseField(field: InputField, raw: string): unknown {
  return parsers[field.type](raw, field.name);
}

export function parseInputs(fields: InputField[], raw: Record<string, string>): TraceInput {
  const out: TraceInput = {};
  for (const field of fields) {
    out[field.name] = parseField(field, raw[field.name] ?? field.default);
  }
  return out;
}

export const defaultRawInputs = (fields: InputField[]): Record<string, string> =>
  Object.fromEntries(fields.map((f) => [f.name, f.default]));
