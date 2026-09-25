"use client";

import { motion } from "motion/react";

import type { DifficultyStat } from "@/lib/catalog-query";
import type { Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

const stroke: Record<Difficulty, string> = {
  Easy: "var(--color-easy)",
  Medium: "var(--color-medium)",
  Hard: "var(--color-hard)",
};

const text: Record<Difficulty, string> = {
  Easy: "text-easy",
  Medium: "text-medium",
  Hard: "text-hard",
};

const SIZE = 96;
const R = 40;
const C = 2 * Math.PI * R;

/**
 * LeetCode-style progress ring: one arc per difficulty, sized by how many of
 * that difficulty have an animated deep-dive. Arcs draw in on mount.
 */
export function DifficultyRing({
  stats,
  className,
}: {
  stats: DifficultyStat[];
  className?: string;
}) {
  const total = stats.reduce((n, s) => n + s.total, 0);
  const available = stats.reduce((n, s) => n + s.available, 0);
  const gap = 0.02; // fraction of circumference between arcs

  const arcs = stats.map((s, i) => {
    const share = total === 0 ? 0 : s.total / total;
    const before = stats.slice(0, i).reduce((n, p) => n + p.total, 0);
    const trackLen = Math.max(0, share - gap) * C;
    const fillLen = s.total === 0 ? 0 : trackLen * (s.available / s.total);
    return { ...s, start: total === 0 ? 0 : (before / total) * C, trackLen, fillLen };
  });

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90" aria-hidden>
          {arcs.map((a) => (
            <g key={a.difficulty}>
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={stroke[a.difficulty]}
                strokeOpacity={0.18}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={`${a.trackLen} ${C - a.trackLen}`}
                strokeDashoffset={-a.start}
              />
              <motion.circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={stroke[a.difficulty]}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDashoffset={-a.start}
                initial={{ strokeDasharray: `0 ${C}` }}
                animate={{ strokeDasharray: `${a.fillLen} ${C - a.fillLen}` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              />
            </g>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <motion.span
            className="text-fg font-mono text-2xl font-semibold tabular-nums"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {available}
          </motion.span>
          <span className="text-fg-subtle mt-1 font-mono text-[10px]">/ {total}</span>
        </div>
      </div>

      <dl className="grid gap-1.5 font-mono text-xs">
        {stats.map((s) => (
          <div key={s.difficulty} className="flex items-baseline gap-3">
            <dt className={cn("w-14", text[s.difficulty])}>{s.difficulty}</dt>
            <dd className="text-fg tabular-nums">
              {s.available}
              <span className="text-fg-subtle"> / {s.total}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
