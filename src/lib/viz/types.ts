/**
 * Visualisation primitives.
 *
 * A trace produces a sequence of `Step`s; each step is a snapshot made of
 * `Panel`s. Panels are plain data so they can be diffed and animated with
 * layout animations, embedded statically in problem statements, and unit
 * tested without a DOM.
 */

export type PointerColor = "red" | "blue" | "green" | "amber" | "violet" | "cyan";

export interface Pointer {
  index: number;
  label: string;
  color?: PointerColor;
}

export type CellTone =
  "default" | "active" | "match" | "visited" | "dim" | "result" | "danger" | "window";

export interface ArrayPanel {
  kind: "array";
  id: string;
  label: string;
  values: Array<number | string>;
  pointers?: Pointer[];
  tones?: Record<number, CellTone>;
  /** Inclusive window [lo, hi] drawn as a bracket under the cells. */
  window?: [number, number];
  /** Show 0-based indices under cells. Defaults to true. */
  showIndices?: boolean;
}

export interface BarsPanel {
  kind: "bars";
  id: string;
  label: string;
  values: number[];
  pointers?: Pointer[];
  tones?: Record<number, CellTone>;
  /** Filled region between two indices up to `height` (e.g. a container). */
  fill?: { from: number; to: number; height: number; label?: string };
  /** Per-column water stacked on top of each bar (e.g. trapped rain water). */
  water?: number[];
  /** Horizontal guide lines, e.g. running maxima. */
  guides?: Array<{ height: number; from: number; to: number; label: string; color?: PointerColor }>;
}

export interface MapEntry {
  key: string;
  value: string;
  tone?: "default" | "new" | "hit";
}

export interface MapPanel {
  kind: "map";
  id: string;
  label: string;
  entries: MapEntry[];
  /** Rendered when `entries` is empty. */
  emptyText?: string;
}

export interface StackPanel {
  kind: "stack";
  id: string;
  label: string;
  items: string[];
  /** Visual hint for what just happened to the top of the stack. */
  topTone?: "default" | "push" | "pop" | "danger";
  emptyText?: string;
}

export interface Variable {
  name: string;
  value: string;
  changed?: boolean;
  tone?: "default" | "result" | "danger";
}

export interface VarsPanel {
  kind: "vars";
  id: string;
  label: string;
  vars: Variable[];
}

export interface ListNode {
  id: string;
  value: string;
  tone?: CellTone;
}

export interface ListEdge {
  from: string;
  /** `null` draws an arrow to a "nil" terminal. */
  to: string | null;
  tone?: "default" | "changed" | "dim";
}

export interface NamedRef {
  name: string;
  /** `null` means the reference is nil. */
  nodeId: string | null;
  color?: PointerColor;
}

export interface LinkedListPanel {
  kind: "linked-list";
  id: string;
  label: string;
  /** Nodes keep a stable order so that flipping edges animates in place. */
  nodes: ListNode[];
  edges: ListEdge[];
  refs?: NamedRef[];
}

export type GridCellTone = "default" | "land" | "water" | "visited" | "active" | "frontier";

export interface GridPanel {
  kind: "grid";
  id: string;
  label: string;
  cells: string[][];
  tones?: Record<string, GridCellTone>; // key: `${r},${c}`
  cursor?: { r: number; c: number };
}

export type Panel =
  ArrayPanel | BarsPanel | MapPanel | StackPanel | VarsPanel | LinkedListPanel | GridPanel;

export type VizState = Panel[];

export type StepStatus = "running" | "done" | "fail";

export interface Step {
  /** Marker name; resolved against each language's `SolutionCode.markers`. */
  marker: string;
  /** Short explanation of what this step does and why. Supports inline markdown. */
  note: string;
  panels: VizState;
  status?: StepStatus;
}

export type TraceInput = Record<string, unknown>;
export type Trace = (input: TraceInput) => Step[];

/** A trace module exports one trace per traceable approach id. */
export type TraceModule = Record<string, Trace>;

export const gridKey = (r: number, c: number): string => `${r},${c}`;
