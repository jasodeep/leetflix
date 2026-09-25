"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { LanguageToggle } from "@/components/code/LanguageToggle";
import { loadTraces } from "@/content/traces";
import type { HighlightedCode } from "@/lib/code/tokens";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { defaultRawInputs, InputParseError, parseInputs } from "@/lib/inputs";
import type { ResolvedMarkers } from "@/lib/markers";
import type { ApproachKind, InputField, Language } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StepLimitError } from "@/lib/viz/recorder";
import type { Step, TraceInput, TraceModule } from "@/lib/viz/types";

import { InputEditor } from "./InputEditor";
import { PlayerStage } from "./PlayerStage";

export interface PlayerApproach {
  id: string;
  title: string;
  kind: ApproachKind;
  code: Record<Language, { highlighted: HighlightedCode; markers: ResolvedMarkers }>;
}

interface AlgorithmPlayerProps {
  slug: string;
  approaches: PlayerApproach[];
  inputs: InputField[];
}

type TraceState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; steps: Step[]; key: string };

/**
 * The interactive walkthrough. Loads the problem's trace module lazily, runs
 * the selected approach against user-editable inputs, and hands the resulting
 * step list to a `PlayerStage` keyed per run.
 */
export function AlgorithmPlayer({ slug, approaches, inputs }: AlgorithmPlayerProps) {
  const [lang, setLang] = useLanguage();
  // Lead with the approach people came to see; brute force is a click away.
  const [approachId, setApproachId] = useState(
    () => (approaches.find((a) => a.kind === "optimal") ?? approaches[0]).id,
  );
  const approach = approaches.find((a) => a.id === approachId) ?? approaches[0];

  const [traces, setTraces] = useState<TraceModule | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadTraces(slug)
      .then((m) => !cancelled && setTraces(m))
      .catch(
        (e: unknown) => !cancelled && setLoadError(e instanceof Error ? e.message : String(e)),
      );
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Raw text is edited freely; only "Run" (or Enter) re-parses and re-traces.
  const [raw, setRaw] = useState(() => defaultRawInputs(inputs));
  const [applied, setApplied] = useState<TraceInput>(() =>
    parseInputs(inputs, defaultRawInputs(inputs)),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);

  const submit = useCallback(() => {
    try {
      setApplied(parseInputs(inputs, raw));
      setErrors({});
      setDirty(false);
    } catch (e) {
      if (e instanceof InputParseError) setErrors({ [e.field]: e.message });
      else throw e;
    }
  }, [inputs, raw]);

  const reset = useCallback(() => {
    const d = defaultRawInputs(inputs);
    setRaw(d);
    setApplied(parseInputs(inputs, d));
    setErrors({});
    setDirty(false);
  }, [inputs]);

  const trace: TraceState = useMemo(() => {
    if (loadError) return { status: "error", message: loadError };
    if (!traces) return { status: "loading" };
    const fn = traces[approach.id];
    if (!fn) return { status: "error", message: `No trace for approach "${approach.id}".` };
    try {
      return {
        status: "ready",
        steps: fn(applied),
        key: `${approach.id}:${JSON.stringify(applied)}`,
      };
    } catch (e) {
      const message =
        e instanceof StepLimitError
          ? e.message
          : `Trace failed: ${e instanceof Error ? e.message : String(e)}`;
      return { status: "error", message };
    }
  }, [traces, loadError, approach.id, applied]);

  return (
    <div className="rounded-card border-border bg-surface border">
      <div className="border-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        {approaches.length > 1 ? (
          <div role="tablist" aria-label="Approach" className="flex flex-wrap gap-1.5">
            {approaches.map((a) => (
              <button
                key={a.id}
                role="tab"
                type="button"
                aria-selected={a.id === approach.id}
                onClick={() => setApproachId(a.id)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm transition-colors",
                  a.id === approach.id
                    ? "border-fg bg-fg text-bg"
                    : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {a.title}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-fg-muted text-sm">
            Approach: <span className="text-fg">{approach.title}</span>
          </p>
        )}
        <LanguageToggle value={lang} onChange={setLang} />
      </div>

      <div className="border-border border-b p-4">
        <InputEditor
          fields={inputs}
          values={raw}
          errors={errors}
          dirty={dirty}
          onChange={(name, value) => {
            setRaw((r) => ({ ...r, [name]: value }));
            setDirty(true);
          }}
          onReset={reset}
          onSubmit={submit}
        />
      </div>

      {trace.status === "loading" && (
        <div className="text-fg-muted flex min-h-[22rem] items-center justify-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden /> Loading animation…
        </div>
      )}
      {trace.status === "error" && (
        <div className="border-viz-red/40 bg-viz-red/10 text-fg m-4 flex min-h-[10rem] items-center justify-center rounded-md border p-4 text-sm">
          {trace.message}
        </div>
      )}
      {trace.status === "ready" && (
        <PlayerStage
          key={trace.key}
          steps={trace.steps}
          code={approach.code[lang].highlighted}
          markers={approach.code[lang].markers}
        />
      )}
    </div>
  );
}
