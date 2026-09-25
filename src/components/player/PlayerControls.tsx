"use client";

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motion } from "motion/react";

import { Kbd } from "@/components/ui/Badge";
import { SPEEDS, type Playback } from "@/lib/hooks/usePlayback";
import type { Step } from "@/lib/viz/types";
import { cn } from "@/lib/utils";

const IconButton = ({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    whileTap={disabled ? undefined : { scale: 0.92 }}
    className="border-border bg-surface-2 text-fg-muted hover:border-border-strong hover:text-fg flex size-8 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
  >
    {children}
  </motion.button>
);

export function PlayerControls({ playback, steps }: { playback: Playback; steps: Step[] }) {
  const count = steps.length;
  const last = steps[count - 1];
  const progress = count <= 1 ? 1 : playback.index / (count - 1);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        <IconButton onClick={playback.first} disabled={playback.atStart} label="First step (Home)">
          <ChevronFirst className="size-4" aria-hidden />
        </IconButton>
        <IconButton onClick={playback.prev} disabled={playback.atStart} label="Previous step (←)">
          <ChevronLeft className="size-4" aria-hidden />
        </IconButton>

        <span className="relative flex">
          {playback.playing && (
            <span className="bg-brand animate-ping-ring absolute inset-0 rounded-md" aria-hidden />
          )}
          <motion.button
            type="button"
            onClick={playback.toggle}
            aria-label={playback.playing ? "Pause (Space)" : "Play (Space)"}
            title={playback.playing ? "Pause (Space)" : "Play (Space)"}
            whileTap={{ scale: 0.92 }}
            className="border-brand bg-brand hover:bg-brand-hover relative flex size-10 items-center justify-center rounded-md border text-white transition-colors"
          >
            {playback.playing ? (
              <Pause className="size-4 fill-current" aria-hidden />
            ) : (
              <Play className="ml-0.5 size-4 fill-current" aria-hidden />
            )}
          </motion.button>
        </span>

        <IconButton onClick={playback.next} disabled={playback.atEnd} label="Next step (→)">
          <ChevronRight className="size-4" aria-hidden />
        </IconButton>
        <IconButton onClick={playback.last} disabled={playback.atEnd} label="Last step (End)">
          <ChevronLast className="size-4" aria-hidden />
        </IconButton>
      </div>

      <label className="flex min-w-40 flex-1 items-center gap-3">
        <span className="sr-only">Step</span>
        <span className="group relative flex h-6 w-full items-center">
          <span className="bg-border absolute inset-x-0 h-1.5 overflow-hidden rounded-full">
            <motion.span
              className="bg-brand absolute inset-y-0 left-0 origin-left"
              style={{ width: "100%" }}
              animate={{ scaleX: progress }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            />
            {/* End-of-run marker: green when the algorithm finished, red when it stopped early. */}
            {last && last.status !== "running" && (
              <span
                className={cn(
                  "absolute inset-y-0 right-0 w-1",
                  last.status === "done" ? "bg-viz-green" : "bg-viz-red",
                )}
                aria-hidden
              />
            )}
          </span>
          <motion.span
            className="bg-fg pointer-events-none absolute size-3.5 -translate-x-1/2 rounded-full shadow-[0_0_0_3px_var(--color-surface)] transition-transform group-hover:scale-110"
            animate={{ left: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            aria-hidden
          />
          <input
            type="range"
            min={0}
            max={Math.max(0, count - 1)}
            value={playback.index}
            onChange={(e) => playback.seek(Number(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-valuetext={`Step ${playback.index + 1} of ${count}`}
          />
        </span>
        <span className="text-fg-muted shrink-0 font-mono text-xs tabular-nums">
          {String(playback.index + 1).padStart(String(count).length, "0")}
          <span className="text-fg-subtle"> / {count}</span>
        </span>
      </label>

      <div
        role="radiogroup"
        aria-label="Playback speed"
        className="border-border bg-surface inline-flex rounded-md border p-0.5"
      >
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={playback.speed === s}
            onClick={() => playback.setSpeed(s)}
            className={cn(
              "relative rounded-[5px] px-2 py-1 font-mono text-[11px] transition-colors",
              playback.speed === s ? "text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            {playback.speed === s && (
              <motion.span
                layoutId="speed-pill"
                className="bg-fg absolute inset-0 rounded-[5px]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                aria-hidden
              />
            )}
            <span className="relative">{s}×</span>
          </button>
        ))}
      </div>

      <p className="text-fg-subtle hidden items-center gap-1 text-[11px] xl:flex">
        <Kbd>Space</Kbd> play <Kbd>←</Kbd>
        <Kbd>→</Kbd> step
      </p>
    </div>
  );
}
