"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { TokenCode } from "@/components/code/TokenCode";
import { InlineMarkdown } from "@/components/content/InlineMarkdown";
import { Viz } from "@/components/viz/Viz";
import type { HighlightedCode } from "@/lib/code/tokens";
import { usePlayback } from "@/lib/hooks/usePlayback";
import type { ResolvedMarkers } from "@/lib/markers";
import type { Step } from "@/lib/viz/types";

import { PlayerControls } from "./PlayerControls";

interface PlayerStageProps {
  steps: Step[];
  code: HighlightedCode;
  markers: ResolvedMarkers;
}

/**
 * Everything that depends on a concrete step list: the viz, the narration,
 * the transport controls and the code cursor. Remounted by the parent on
 * every new run so playback state starts clean.
 */
export function PlayerStage({ steps, code, markers }: PlayerStageProps) {
  const playback = usePlayback(steps.length);
  const step = steps[playback.index];
  const activeLine = step ? markers[step.marker] : undefined;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    const map: Record<string, () => void> = {
      " ": playback.toggle,
      ArrowRight: playback.next,
      ArrowLeft: playback.prev,
      Home: playback.first,
      End: playback.last,
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Algorithm animation. Use Space to play, arrow keys to step."
      className="focus-visible:ring-fg/40 grid gap-0 outline-none focus-visible:ring-2 focus-visible:ring-inset lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
    >
      <div className="border-border flex min-h-[22rem] flex-col border-b lg:border-r lg:border-b-0">
        <div className="flex-1 p-4 sm:p-5">{step && <Viz state={step.panels} />}</div>

        <div className="border-border bg-surface-2 border-t px-4 py-3 sm:px-5" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {step && (
              <motion.div
                key={playback.index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="prose-code text-fg-muted flex items-start gap-2.5 text-sm leading-6"
              >
                {step.status === "done" ? (
                  <CircleCheck
                    className="text-viz-green mt-1 size-4 shrink-0"
                    aria-label="Finished"
                  />
                ) : step.status === "fail" ? (
                  <CircleX className="text-viz-red mt-1 size-4 shrink-0" aria-label="Stopped" />
                ) : (
                  <span className="bg-brand mt-2 size-2 shrink-0 rounded-full" aria-hidden />
                )}
                <p>
                  <InlineMarkdown text={step.note} />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-border border-t p-4 sm:px-5">
          <PlayerControls playback={playback} count={steps.length} />
        </div>
      </div>

      <div className="min-w-0">
        <TokenCode code={code} activeLine={activeLine} className="rounded-br-card h-full" />
      </div>
    </div>
  );
}
