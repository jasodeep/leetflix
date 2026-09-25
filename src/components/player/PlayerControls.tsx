"use client";

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { Kbd } from "@/components/ui/Badge";
import { SPEEDS, type Playback } from "@/lib/hooks/usePlayback";
import { cn } from "@/lib/utils";

const IconButton = ({
  onClick,
  disabled,
  label,
  children,
  primary,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
  primary?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={cn(
      "flex items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-40",
      primary
        ? "border-brand bg-brand hover:bg-brand-hover size-10 text-white"
        : "border-border bg-surface-2 text-fg-muted hover:border-border-strong hover:text-fg size-8",
    )}
  >
    {children}
  </button>
);

export function PlayerControls({ playback, count }: { playback: Playback; count: number }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        <IconButton onClick={playback.first} disabled={playback.atStart} label="First step (Home)">
          <ChevronFirst className="size-4" aria-hidden />
        </IconButton>
        <IconButton onClick={playback.prev} disabled={playback.atStart} label="Previous step (←)">
          <ChevronLeft className="size-4" aria-hidden />
        </IconButton>
        <IconButton
          onClick={playback.toggle}
          label={playback.playing ? "Pause (Space)" : "Play (Space)"}
          primary
        >
          {playback.playing ? (
            <Pause className="size-4" aria-hidden />
          ) : (
            <Play className="ml-0.5 size-4" aria-hidden />
          )}
        </IconButton>
        <IconButton onClick={playback.next} disabled={playback.atEnd} label="Next step (→)">
          <ChevronRight className="size-4" aria-hidden />
        </IconButton>
        <IconButton onClick={playback.last} disabled={playback.atEnd} label="Last step (End)">
          <ChevronLast className="size-4" aria-hidden />
        </IconButton>
      </div>

      <label className="flex min-w-40 flex-1 items-center gap-3">
        <span className="sr-only">Step</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, count - 1)}
          value={playback.index}
          onChange={(e) => playback.seek(Number(e.target.value))}
          className="bg-border accent-brand h-1.5 w-full cursor-pointer appearance-none rounded-full"
          aria-valuetext={`Step ${playback.index + 1} of ${count}`}
        />
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
              "rounded-[5px] px-2 py-1 font-mono text-[11px] transition-colors",
              playback.speed === s ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            {s}×
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
