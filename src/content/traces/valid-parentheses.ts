import { arrayPanel, ptr, stackPanel, varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { CellTone, StackPanel, TraceModule } from "@/lib/viz/types";

const PAIRS: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

const traces: TraceModule = {
  stack: (input) => {
    const s = input.s as string;
    const chars = [...s];
    const rec = new Recorder();
    const stack: string[] = [];

    const view = (i: number, tone: CellTone, topTone: StackPanel["topTone"] = "default") => [
      arrayPanel("s", "s", chars, {
        pointers: i < chars.length ? [ptr(i, "ch", "red")] : [],
        tones: {
          ...Object.fromEntries(chars.map((_, k) => [k, k < i ? "visited" : "default"])),
          ...(i < chars.length ? { [i]: tone } : {}),
        },
      }),
      stackPanel("stack", "stack (open brackets)", stack, topTone),
      varsPanel("vars", "", [v("pairs", `{ ")": "(", "]": "[", "}": "{" }`)]),
    ];

    rec.record(
      "init",
      "Start with an empty stack. It will hold every bracket that is open and not yet closed.",
      view(0, "default"),
    );

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const isClosing = ch in PAIRS;

      if (isClosing) {
        const open = PAIRS[ch];
        rec.record(
          "closing",
          `\`${ch}\` is a **closing** bracket. It may only close a \`${open}\`.`,
          view(i, "active"),
        );
        if (stack.length === 0) {
          rec.record(
            "mismatch",
            "But the stack is empty — there is nothing to close.",
            view(i, "danger", "danger"),
          );
          return rec.done("reject", "Return `false`.", view(i, "danger", "danger"));
        }
        const top = stack[stack.length - 1];
        if (top !== open) {
          rec.record(
            "mismatch",
            `The innermost open bracket is \`${top}\`, not \`${open}\`. Wrong type or wrong order.`,
            view(i, "danger", "danger"),
          );
          return rec.done("reject", "Return `false`.", view(i, "danger", "danger"));
        }
        rec.record("mismatch", `Top of stack is \`${top}\` — a match.`, view(i, "match", "pop"));
        stack.pop();
        rec.record(
          "pop",
          `Pop \`${top}\`. We're now one nesting level shallower.`,
          view(i, "match", "default"),
        );
      } else {
        rec.record("closing", `\`${ch}\` is an **opening** bracket.`, view(i, "active"));
        stack.push(ch);
        rec.record(
          "push",
          `Push \`${ch}\`. It's now the innermost open bracket.`,
          view(i, "visited", "push"),
        );
      }
    }

    const ok = stack.length === 0;
    if (ok) {
      return rec.done(
        "end",
        "All characters consumed and the stack is empty — every bracket was closed in order. Return `true`.",
        view(chars.length, "default"),
      );
    }
    return rec.done(
      "end",
      `All characters consumed but ${stack.length} bracket(s) were never closed. Return \`false\`.`,
      view(chars.length, "default", "danger"),
    );
  },
};

export default traces;
