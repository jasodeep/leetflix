"use client";

import { RotateCcw } from "lucide-react";

import type { InputField } from "@/lib/types";
import { cn } from "@/lib/utils";

interface InputEditorProps {
  fields: InputField[];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, raw: string) => void;
  onReset: () => void;
  onSubmit: () => void;
  dirty: boolean;
}

export function InputEditor({
  fields,
  values,
  errors,
  onChange,
  onReset,
  onSubmit,
  dirty,
}: InputEditorProps) {
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {fields.map((f) => {
        const error = errors[f.name];
        return (
          <label key={f.name} className="flex min-w-44 flex-1 basis-56 flex-col gap-1">
            <span className="text-fg-muted flex items-baseline justify-between font-mono text-[11px]">
              {f.label}
              {f.hint && (
                <span className="text-fg-subtle ml-3 truncate" title={f.hint}>
                  {f.hint}
                </span>
              )}
            </span>
            <input
              type="text"
              value={values[f.name] ?? ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              spellCheck={false}
              autoComplete="off"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${f.name}-error` : undefined}
              className={cn(
                "bg-bg text-fg placeholder:text-fg-subtle focus:border-fg h-9 rounded-md border px-3 font-mono text-sm transition-colors outline-none",
                error ? "border-viz-red" : "border-border-strong",
              )}
            />
            {error && (
              <span id={`${f.name}-error`} className="text-viz-red font-mono text-[11px]">
                {error}
              </span>
            )}
          </label>
        );
      })}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!dirty}
          className="border-fg bg-fg text-bg h-9 rounded-md border px-3 text-sm font-medium transition-opacity disabled:opacity-40"
        >
          Run
        </button>
        <button
          type="button"
          onClick={onReset}
          className="border-border text-fg-muted hover:border-border-strong hover:text-fg flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Reset
        </button>
      </div>
    </form>
  );
}
