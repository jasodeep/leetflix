"use client";

import { motion } from "motion/react";

import type { BarsPanel as BarsPanelData } from "@/lib/viz/types";

import { PanelFrame } from "./PanelFrame";
import { barFill, pointerColor } from "./tones";

const BAR_W = 32;
const GAP = 8;
const CHART_H = 150;
const AXIS_H = 18;
const POINTER_H = 30;

/**
 * SVG bar chart. Everything is positioned from data so that motion can
 * interpolate heights, fills and pointers between steps.
 */
export function BarsPanel({ panel }: { panel: BarsPanelData }) {
  const { values, pointers = [], tones = {}, fill, water = [], guides = [] } = panel;
  const n = values.length;
  const maxV = Math.max(
    1,
    ...values,
    ...water.map((w, i) => (values[i] ?? 0) + w),
    fill?.height ?? 0,
    ...guides.map((g) => g.height),
  );
  // Leave headroom for the value label above the tallest bar (or water column).
  const scale = (CHART_H - 18) / maxV;
  const x = (i: number) => i * (BAR_W + GAP);
  const cx = (i: number) => x(i) + BAR_W / 2;
  const y = (v: number) => CHART_H - v * scale;
  const width = Math.max(1, n) * (BAR_W + GAP) - GAP;
  const hasPointers = pointers.length > 0;
  const totalH = CHART_H + AXIS_H + (hasPointers ? POINTER_H : 0);

  return (
    <PanelFrame label={panel.label}>
      <div className="scrollbar-none overflow-x-auto pb-1">
        <svg
          width={width}
          height={totalH}
          className="block overflow-visible"
          role="img"
          aria-label={panel.label}
        >
          {/* Container fill (e.g. Container With Most Water). */}
          {fill && fill.to > fill.from && (
            <motion.rect
              initial={false}
              animate={{
                x: cx(fill.from),
                width: cx(fill.to) - cx(fill.from),
                y: y(fill.height),
                height: fill.height * scale,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              fill="var(--color-viz-blue)"
              fillOpacity={0.22}
              stroke="var(--color-viz-blue)"
              strokeOpacity={0.5}
              strokeDasharray="3 3"
            />
          )}

          {values.map((v, i) => (
            <g key={i}>
              <motion.rect
                initial={false}
                animate={{
                  y: y(v),
                  height: Math.max(v * scale, v === 0 ? 2 : 0),
                  fill: barFill[tones[i] ?? "default"],
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                x={x(i)}
                width={BAR_W}
                rx={3}
              />
              {/* Trapped water column. */}
              {water[i] > 0 && (
                <motion.rect
                  initial={false}
                  animate={{ y: y(v + water[i]), height: water[i] * scale }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  x={x(i)}
                  width={BAR_W}
                  fill="var(--color-viz-blue)"
                  fillOpacity={0.55}
                  rx={2}
                />
              )}
              <motion.text
                initial={false}
                animate={{ y: y(v + (water[i] ?? 0)) - 4 }}
                x={cx(i)}
                textAnchor="middle"
                className="fill-fg-muted font-mono text-[10px]"
              >
                {v}
              </motion.text>
              <text
                x={cx(i)}
                y={CHART_H + 13}
                textAnchor="middle"
                className="fill-fg-subtle font-mono text-[10px]"
              >
                {i}
              </text>
            </g>
          ))}

          {guides.map((g) => (
            <g key={g.label}>
              <motion.line
                initial={false}
                animate={{
                  x1: x(Math.min(g.from, g.to)),
                  x2: x(Math.max(g.from, g.to)) + BAR_W,
                  y1: y(g.height),
                  y2: y(g.height),
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                stroke={pointerColor[g.color ?? "blue"]}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <motion.text
                initial={false}
                animate={{ x: x(Math.max(g.from, g.to)) + BAR_W + 4, y: y(g.height) + 3 }}
                className="font-mono text-[10px]"
                fill={pointerColor[g.color ?? "blue"]}
              >
                {g.label}
              </motion.text>
            </g>
          ))}

          {fill?.label && fill.to > fill.from && (
            <text
              x={(cx(fill.from) + cx(fill.to)) / 2}
              y={y(fill.height / 2) + 4}
              textAnchor="middle"
              className="fill-fg font-mono text-xs font-semibold"
            >
              {fill.label}
            </text>
          )}

          <line x1={0} x2={width} y1={CHART_H} y2={CHART_H} stroke="var(--color-border-strong)" />

          {pointers.map((p) => (
            <motion.g
              key={p.label}
              initial={false}
              animate={{ x: cx(p.index) }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              style={{ color: pointerColor[p.color ?? "red"] }}
            >
              <text
                x={0}
                y={CHART_H + AXIS_H + 10}
                textAnchor="middle"
                fill="currentColor"
                className="text-[10px]"
              >
                ▲
              </text>
              <text
                x={0}
                y={CHART_H + AXIS_H + 23}
                textAnchor="middle"
                fill="currentColor"
                className="font-mono text-[10px] font-medium"
              >
                {p.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </PanelFrame>
  );
}
