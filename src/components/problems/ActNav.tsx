"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export const PROBLEM_ACTS = [
  { id: "statement", n: "01", label: "Problem" },
  { id: "solution", n: "02", label: "Solution" },
  { id: "walkthrough", n: "03", label: "Walkthrough" },
] as const;

const spring = { type: "spring", stiffness: 420, damping: 36 } as const;

/** Sticky 3-act rail. Tracks the chapter in view and slides the marker. */
export function ActNav() {
  const [active, setActive] = useState<(typeof PROBLEM_ACTS)[number]["id"]>(PROBLEM_ACTS[0].id);

  useEffect(() => {
    const els = PROBLEM_ACTS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const current = PROBLEM_ACTS.find((s) => visible.has(s.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: 0 },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="On this page"
      className="border-border/70 bg-bg/70 supports-[backdrop-filter]:bg-bg/50 lg:rounded-card sticky top-14 z-30 -mx-4 mb-10 border-y px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:mx-0 lg:border lg:px-2"
    >
      <ol className="relative flex">
        {PROBLEM_ACTS.map((act, i) => {
          const on = act.id === active;
          return (
            <li key={act.id} className="flex-1">
              <a
                href={`#${act.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "relative flex items-center justify-center gap-2 py-3 text-sm transition-colors",
                  on ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="act-marker"
                    className="bg-brand/15 absolute inset-x-1 inset-y-1.5 rounded-md shadow-[0_0_20px_-4px_var(--color-brand)]"
                    transition={spring}
                    aria-hidden
                  />
                )}
                <span className={cn("relative font-mono text-[10px]", on && "text-brand")}>
                  {act.n}
                </span>
                <span className="relative font-medium">{act.label}</span>
                {i < PROBLEM_ACTS.length - 1 && (
                  <span
                    className="bg-border absolute top-1/2 right-0 hidden h-px w-6 -translate-y-1/2 sm:block"
                    aria-hidden
                  />
                )}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
