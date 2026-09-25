import { varsPanel, v } from "@/lib/viz/builders";
import { Recorder } from "@/lib/viz/recorder";
import type { LinkedListPanel, ListEdge, TraceModule } from "@/lib/viz/types";

const traces: TraceModule = {
  iterative: (input) => {
    const values = input.head as number[];
    const rec = new Recorder();
    const n = values.length;

    // Simulate nodes by index; `next[i]` is the index of node i's successor or -1.
    const next: number[] = values.map((_, i) => (i + 1 < n ? i + 1 : -1));
    const flipped = new Set<number>();
    let prev = -1;
    let curr = n > 0 ? 0 : -1;
    let nxt = -1;

    const id = (i: number): string | null => (i >= 0 ? `n${i}` : null);
    const name = (i: number): string => (i >= 0 ? `node(${values[i]})` : "None");

    const view = (
      opts: { showNxt?: boolean; flipping?: number } = {},
    ): [LinkedListPanel, ReturnType<typeof varsPanel>] => {
      const edges: ListEdge[] = values.map((_, i) => ({
        from: `n${i}`,
        to: id(next[i]),
        tone: i === opts.flipping ? "changed" : flipped.has(i) ? "changed" : "default",
      }));
      return [
        {
          kind: "linked-list",
          id: "list",
          label: "list",
          nodes: values.map((val, i) => ({
            id: `n${i}`,
            value: String(val),
            tone: i === curr ? "active" : flipped.has(i) ? "visited" : "default",
          })),
          edges,
          refs: [
            { name: "prev", nodeId: id(prev), color: "green" },
            { name: "curr", nodeId: id(curr), color: "red" },
            ...(opts.showNxt ? [{ name: "nxt", nodeId: id(nxt), color: "blue" as const }] : []),
          ],
        },
        varsPanel("vars", "", [
          v("prev", name(prev)),
          v("curr", name(curr)),
          v("nxt", opts.showNxt ? name(nxt) : "—"),
        ]),
      ];
    };

    if (n === 0) {
      return rec.done(
        "end",
        "Empty list — `prev` is `None`, so we return an empty list `[]`.",
        view(),
      );
    }

    rec.record(
      "init",
      "`prev` starts as `None` (the reversed part is empty); `curr` starts at the head.",
      view(),
    );

    while (curr !== -1) {
      rec.record(
        "loop",
        `\`curr\` is ${name(curr)}. Everything left of it is already reversed.`,
        view(),
      );
      nxt = next[curr];
      rec.record(
        "save",
        `Save \`nxt = ${name(nxt)}\` — after the next line, \`curr.next\` will no longer lead there.`,
        view({ showNxt: true }),
      );
      next[curr] = prev;
      flipped.add(curr);
      rec.record(
        "flip",
        `Flip: ${name(curr)} now points **backwards** to ${name(prev)}.`,
        view({ showNxt: true, flipping: curr }),
      );
      prev = curr;
      rec.record(
        "advance_prev",
        `\`prev\` advances to ${name(prev)} — the reversed part grew by one.`,
        view({ showNxt: true }),
      );
      curr = nxt;
      rec.record(
        "advance_curr",
        `\`curr\` follows the lifeline to ${name(curr)}.`,
        view({ showNxt: true }),
      );
    }

    const order: number[] = [];
    for (let i = prev; i !== -1; i = next[i]) order.push(values[i]);
    return rec.done(
      "end",
      `\`curr\` is \`None\`: every arrow has been flipped. Return \`prev\` → [${order.join(", ")}].`,
      view(),
    );
  },
};

export default traces;
