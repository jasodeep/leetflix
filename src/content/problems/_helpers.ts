/**
 * Tagged templates for embedding solution source in TypeScript without
 * fighting indentation. Both strip the common leading indent and surrounding
 * blank lines; `go` additionally converts 4-space indents to tabs (gofmt).
 */
const dedent = (strings: TemplateStringsArray, values: unknown[]): string => {
  const raw = strings.reduce(
    (acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ""),
    "",
  );
  const lines = raw
    .replace(/^\n/, "")
    .replace(/\n[ \t]*$/, "")
    .split("\n");
  const indents = lines.filter((l) => l.trim() !== "").map((l) => l.match(/^[ \t]*/)![0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join("\n");
};

export const py = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  dedent(strings, values);

export const go = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  dedent(strings, values)
    .split("\n")
    .map((line) => line.replace(/^( {4})+/, (m) => "\t".repeat(m.length / 4)))
    .join("\n");
