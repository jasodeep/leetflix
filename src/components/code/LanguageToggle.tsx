"use client";

import { motion } from "motion/react";

import { LANGUAGE_LABEL, LANGUAGES, type Language } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LanguageToggle({
  value,
  onChange,
  className,
}: {
  value: Language;
  onChange: (lang: Language) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Solution language"
      className={cn("border-border bg-surface inline-flex rounded-md border p-0.5", className)}
    >
      {LANGUAGES.map((lang) => {
        const active = lang === value;
        return (
          <button
            key={lang}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(lang)}
            className={cn(
              "relative rounded-[5px] px-2.5 py-1 font-mono text-xs transition-colors",
              active ? "text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="bg-fg absolute inset-0 rounded-[5px]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                aria-hidden
              />
            )}
            <span className="relative">{LANGUAGE_LABEL[lang]}</span>
          </button>
        );
      })}
    </div>
  );
}
