import type { Problem } from "@/lib/types";
import type { LinkedListPanel } from "@/lib/viz/types";

import { go, py } from "./_helpers";

const list = (
  id: string,
  label: string,
  values: number[],
  opts: Partial<Pick<LinkedListPanel, "edges" | "refs">> = {},
): LinkedListPanel => ({
  kind: "linked-list",
  id,
  label,
  nodes: values.map((val, i) => ({ id: `n${i}`, value: String(val) })),
  edges:
    opts.edges ??
    values.map((_, i) => ({ from: `n${i}`, to: i + 1 < values.length ? `n${i + 1}` : null })),
  refs: opts.refs,
});

export const reverseLinkedList: Problem = {
  id: 206,
  slug: "reverse-linked-list",
  title: "Reverse Linked List",
  difficulty: "Easy",
  topics: ["Linked List", "Recursion"],
  blurb: "Three pointers, one loop, zero allocations. The pointer-juggling rite of passage.",

  statement: [
    {
      type: "p",
      text: "Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.",
    },
  ],

  examples: [
    {
      input: { head: "[1, 2, 3, 4, 5]" },
      output: "[5, 4, 3, 2, 1]",
      viz: [
        list("before", "input", [1, 2, 3, 4, 5], {
          refs: [{ name: "head", nodeId: "n0", color: "red" }],
        }),
        list("after", "output", [1, 2, 3, 4, 5], {
          edges: [
            { from: "n0", to: null, tone: "changed" },
            { from: "n1", to: "n0", tone: "changed" },
            { from: "n2", to: "n1", tone: "changed" },
            { from: "n3", to: "n2", tone: "changed" },
            { from: "n4", to: "n3", tone: "changed" },
          ],
          refs: [{ name: "head", nodeId: "n4", color: "red" }],
        }),
      ],
    },
    { input: { head: "[1, 2]" }, output: "[2, 1]" },
    { input: { head: "[]" }, output: "[]" },
  ],

  constraints: [
    "The number of nodes in the list is in the range `[0, 5000]`.",
    "`-5000 <= Node.val <= 5000`",
  ],

  followUp:
    "A linked list can be reversed either iteratively or recursively. Could you implement both?",

  insights: [
    { type: "h3", text: "What “reverse” means for pointers" },
    {
      type: "p",
      text: "Nothing moves in memory. The nodes stay exactly where they are; we only change what each node's `next` field points to. Node 1 currently points at node 2 — afterwards node 2 must point at node 1, and node 1 (the new tail) must point at nothing. Every arrow flips direction.",
    },
    { type: "h3", text: "The trap: flipping an arrow loses the rest of the list" },
    {
      type: "p",
      text: "A singly linked list is a one-way street. The moment you do `curr.next = prev`, you've overwritten the *only* reference to the remainder of the list. So before flipping you must stash `curr.next` in a temporary — that's the `nxt` variable, and forgetting it is *the* classic bug here.",
    },
    {
      type: "viz",
      caption:
        "Mid-way: 1 and 2 are already reversed; `nxt` holds on to 4 so we don't lose it when 3's arrow flips.",
      state: [
        list("mid", "state", [1, 2, 3, 4, 5], {
          edges: [
            { from: "n0", to: null, tone: "changed" },
            { from: "n1", to: "n0", tone: "changed" },
            { from: "n2", to: "n3" },
            { from: "n3", to: "n4" },
            { from: "n4", to: null },
          ],
          refs: [
            { name: "prev", nodeId: "n1", color: "green" },
            { name: "curr", nodeId: "n2", color: "red" },
            { name: "nxt", nodeId: "n3", color: "blue" },
          ],
        }),
      ],
    },
    { type: "h3", text: "Three pointers, one invariant" },
    {
      type: "p",
      text: "At the top of every iteration: everything **before** `curr` is already reversed and `prev` is the head of that reversed part; everything **from** `curr` onward is untouched. Each iteration moves the boundary one node to the right. When `curr` runs off the end, `prev` is the head of the fully reversed list.",
    },
    { type: "h3", text: "The recursive view" },
    {
      type: "p",
      text: "Trust the recursion: `reverseList(head.next)` hands you back the reversed *rest* of the list, whose tail is `head.next`. Attach `head` after that tail (`head.next.next = head`) and make `head` the new tail (`head.next = None`). It's elegant, but it uses O(n) stack — for 5000 nodes that's fine; for a million it isn't.",
    },
  ],

  approaches: [
    {
      id: "iterative",
      title: "Iterative — three pointers",
      kind: "optimal",
      summary: "Walk the list once, flipping each arrow to point backwards. O(1) extra space.",
      intuition: [
        {
          type: "p",
          text: "Keep `prev` (head of the reversed part), `curr` (node being processed) and `nxt` (a lifeline to the unprocessed part). Save, flip, advance, repeat.",
        },
      ],
      steps: [
        "`prev = None`, `curr = head`.",
        "While `curr`: save `nxt = curr.next`.",
        "Flip: `curr.next = prev`.",
        "Advance: `prev = curr`, `curr = nxt`.",
        "Return `prev`.",
      ],
      complexity: { time: "O(n)", space: "O(1)" },
      traceable: true,
      code: {
        python: {
          source: py`
            class Solution:
                def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
                    prev = None
                    curr = head
                    while curr:
                        nxt = curr.next   # lifeline to the rest of the list
                        curr.next = prev  # flip the arrow
                        prev = curr       # advance both pointers
                        curr = nxt
                    return prev
          `,
          markers: {
            init: "prev = None",
            loop: "while curr",
            save: "nxt = curr.next",
            flip: "curr.next = prev",
            advance_prev: "prev = curr",
            advance_curr: "curr = nxt",
            end: "return prev",
          },
        },
        go: {
          source: go`
            func reverseList(head *ListNode) *ListNode {
                var prev *ListNode
                curr := head
                for curr != nil {
                    next := curr.Next // lifeline to the rest of the list
                    curr.Next = prev  // flip the arrow
                    prev = curr       // advance both pointers
                    curr = next
                }
                return prev
            }
          `,
          markers: {
            init: "var prev *ListNode",
            loop: "for curr != nil",
            save: "next := curr.Next",
            flip: "curr.Next = prev",
            advance_prev: "prev = curr",
            advance_curr: "curr = next",
            end: "return prev",
          },
        },
      },
    },
    {
      id: "recursive",
      title: "Recursive",
      kind: "alternative",
      summary: "Reverse the tail, then hook the head onto the end of it.",
      intuition: [
        {
          type: "p",
          text: "Assume the recursive call correctly reverses `head.next…`. After it returns, the old second node is the tail of the reversed part, so point it at `head`, then terminate `head`.",
        },
      ],
      steps: [
        "Base case: empty or single node → return it.",
        "`new_head = reverse(head.next)`.",
        "`head.next.next = head`; `head.next = None`.",
        "Return `new_head`.",
      ],
      complexity: { time: "O(n)", space: "O(n)", notes: "Call-stack depth equals list length." },
      traceable: false,
      code: {
        python: {
          source: py`
            class Solution:
                def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
                    if head is None or head.next is None:
                        return head
                    new_head = self.reverseList(head.next)  # reversed rest; head.next is its tail
                    head.next.next = head                   # hook head after that tail
                    head.next = None                        # head is the new tail
                    return new_head
          `,
          markers: {},
        },
        go: {
          source: go`
            func reverseList(head *ListNode) *ListNode {
                if head == nil || head.Next == nil {
                    return head
                }
                newHead := reverseList(head.Next) // reversed rest; head.Next is its tail
                head.Next.Next = head             // hook head after that tail
                head.Next = nil                   // head is the new tail
                return newHead
            }
          `,
          markers: {},
        },
      },
    },
  ],

  inputs: [{ name: "head", label: "head (as array)", type: "int[]", default: "[1, 2, 3, 4, 5]" }],
};
