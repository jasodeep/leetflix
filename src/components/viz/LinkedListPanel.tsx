"use client";

import { motion } from "motion/react";

import type { LinkedListPanel as LinkedListPanelData } from "@/lib/viz/types";

import { PanelFrame } from "./PanelFrame";
import { pointerColor } from "./tones";

const NODE_W = 48;
const NODE_H = 36;
const GAP = 44;
const REF_H = 34;
const NIL_H = 30;

const nodeStroke = {
  default: "var(--color-border-strong)",
  active: "var(--color-viz-red)",
  match: "var(--color-viz-green)",
  visited: "var(--color-viz-blue)",
  dim: "var(--color-border)",
  result: "var(--color-viz-green)",
  danger: "var(--color-viz-red)",
  window: "var(--color-viz-blue)",
} as const;

const edgeStroke = {
  default: "var(--color-fg-muted)",
  changed: "var(--color-viz-green)",
  dim: "var(--color-border)",
} as const;

/**
 * Nodes keep fixed x positions (memory doesn't move); only edges and refs
 * animate. Forward edges run along the top, backward edges arc underneath,
 * and nil edges drop to a ∅ marker — so a reversal reads as arrows flipping.
 */
export function LinkedListPanel({ panel }: { panel: LinkedListPanelData }) {
  const index = new Map(panel.nodes.map((n, i) => [n.id, i]));
  const x = (i: number) => i * (NODE_W + GAP);
  const cx = (i: number) => x(i) + NODE_W / 2;
  const top = REF_H;
  const mid = top + NODE_H / 2;
  const bottom = top + NODE_H;
  const width = Math.max(1, panel.nodes.length) * (NODE_W + GAP) - GAP + 24;
  const height = REF_H + NODE_H + NIL_H + 26;

  const edgePath = (
    fromId: string,
    toId: string | null,
  ): { d: string; end: [number, number] } | null => {
    const fi = index.get(fromId);
    if (fi === undefined) return null;
    if (toId === null) {
      const sx = cx(fi);
      return {
        d: `M ${sx} ${bottom} L ${sx} ${bottom + NIL_H - 8}`,
        end: [sx, bottom + NIL_H - 8],
      };
    }
    const ti = index.get(toId);
    if (ti === undefined) return null;
    if (ti === fi + 1) {
      return { d: `M ${x(fi) + NODE_W} ${mid} L ${x(ti) - 6} ${mid}`, end: [x(ti) - 6, mid] };
    }
    if (ti > fi) {
      const sx = cx(fi);
      const ex = cx(ti);
      return {
        d: `M ${sx} ${top} Q ${(sx + ex) / 2} ${top - 40} ${ex} ${top - 6}`,
        end: [ex, top - 6],
      };
    }
    // Backward: arc under the nodes.
    const sx = x(fi) + 8;
    const ex = x(ti) + NODE_W - 8;
    const depth = 22 + Math.min(3, fi - ti - 1) * 8;
    return {
      d: `M ${sx} ${bottom} Q ${(sx + ex) / 2} ${bottom + depth} ${ex} ${bottom + 4}`,
      end: [ex, bottom + 4],
    };
  };

  return (
    <PanelFrame label={panel.label}>
      <div className="scrollbar-none overflow-x-auto pb-1">
        <svg
          width={width}
          height={height}
          className="block overflow-visible"
          role="img"
          aria-label={panel.label}
        >
          <defs>
            {Object.entries(edgeStroke).map(([tone, color]) => (
              <marker
                key={tone}
                id={`ll-arrow-${panel.id}-${tone}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
              </marker>
            ))}
          </defs>

          {panel.edges.map((e) => {
            const p = edgePath(e.from, e.to);
            if (!p) return null;
            const tone = e.tone ?? "default";
            return (
              <g key={e.from}>
                <motion.path
                  initial={false}
                  animate={{ d: p.d, stroke: edgeStroke[tone] }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  fill="none"
                  strokeWidth={1.75}
                  markerEnd={`url(#ll-arrow-${panel.id}-${tone})`}
                />
                {e.to === null && (
                  <motion.text
                    initial={false}
                    animate={{ x: p.end[0], y: p.end[1] + 16 }}
                    textAnchor="middle"
                    className="fill-fg-subtle font-mono text-[11px]"
                  >
                    ∅
                  </motion.text>
                )}
              </g>
            );
          })}

          {panel.nodes.map((n, i) => (
            <g key={n.id}>
              <motion.rect
                initial={false}
                animate={{
                  stroke: nodeStroke[n.tone ?? "default"],
                  fill: n.tone === "active" ? "rgba(244,63,94,0.15)" : "var(--color-surface-3)",
                }}
                x={x(i)}
                y={top}
                width={NODE_W}
                height={NODE_H}
                rx={6}
                strokeWidth={1.5}
              />
              <text x={cx(i)} y={mid + 4} textAnchor="middle" className="fill-fg font-mono text-sm">
                {n.value}
              </text>
            </g>
          ))}

          {(panel.refs ?? []).map((r, k) => {
            const i = r.nodeId === null ? null : index.get(r.nodeId);
            const color = pointerColor[r.color ?? "red"];
            if (i === undefined) return null;
            if (i === null) {
              return (
                <text
                  key={r.name}
                  x={width - 12}
                  y={12 + k * 12}
                  textAnchor="end"
                  fill={color}
                  className="font-mono text-[10px]"
                >
                  {r.name} = ∅
                </text>
              );
            }
            // Stack multiple refs on the same node vertically.
            const sameNode = (panel.refs ?? []).filter((o) => o.nodeId === r.nodeId);
            const slot = sameNode.findIndex((o) => o.name === r.name);
            return (
              <motion.g
                key={r.name}
                initial={false}
                animate={{ x: cx(i) }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ color }}
              >
                <text
                  x={0}
                  y={top - 8 - slot * 12}
                  textAnchor="middle"
                  fill="currentColor"
                  className="font-mono text-[10px] font-medium"
                >
                  {r.name}
                  {slot === 0 ? " ▼" : ""}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </PanelFrame>
  );
}
