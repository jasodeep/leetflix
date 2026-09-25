"use client";

import { useCallback, useEffect, useState } from "react";

import { clamp } from "@/lib/utils";

export const SPEEDS = [0.5, 1, 2, 4] as const;
export type Speed = (typeof SPEEDS)[number];
const BASE_MS = 900;

export interface Playback {
  index: number;
  playing: boolean;
  speed: Speed;
  atStart: boolean;
  atEnd: boolean;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
  seek: (i: number) => void;
  setSpeed: (s: Speed) => void;
}

/**
 * Step cursor with auto-advance. The caller is expected to remount (via
 * `key`) when the underlying step list changes, so no reset logic lives here.
 */
export function usePlayback(count: number): Playback {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const maxIndex = Math.max(0, count - 1);
  const current = clamp(index, 0, maxIndex);

  useEffect(() => {
    if (!playing || current >= maxIndex) return;
    const t = window.setTimeout(() => {
      const next = Math.min(current + 1, maxIndex);
      setIndex(next);
      if (next >= maxIndex) setPlaying(false);
    }, BASE_MS / speed);
    return () => window.clearTimeout(t);
  }, [playing, current, maxIndex, speed]);

  const jump = useCallback(
    (to: number) => {
      setPlaying(false);
      setIndex(clamp(to, 0, maxIndex));
    },
    [maxIndex],
  );

  return {
    index: current,
    playing: playing && current < maxIndex,
    speed,
    atStart: current <= 0,
    atEnd: current >= maxIndex,
    toggle: useCallback(() => {
      if (!playing && current >= maxIndex) setIndex(0);
      setPlaying((p) => !p);
    }, [playing, current, maxIndex]),
    next: useCallback(() => jump(current + 1), [jump, current]),
    prev: useCallback(() => jump(current - 1), [jump, current]),
    first: useCallback(() => jump(0), [jump]),
    last: useCallback(() => jump(maxIndex), [jump, maxIndex]),
    seek: jump,
    setSpeed,
  };
}
