"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface TocSection {
  id: string;
  label: string;
}

/**
 * Sticky "on this page" nav that tracks the section currently in view. The
 * marker slides between entries rather than jumping.
 */
export function TableOfContents({ sections }: { sections: readonly TocSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    // Sections are observed against a band 20–40% down the viewport; the
    // first section (in document order) overlapping that band is current.
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const current = sections.find((s) => visible.has(s.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav className="relative space-y-0.5 text-sm" aria-label="On this page">
      <span className="bg-border absolute inset-y-1 left-0 w-px" aria-hidden />
      {sections.map((s) => {
        const isActive = s.id === active;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "relative block py-1.5 pl-4 transition-colors",
              isActive ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="toc-marker"
                className="bg-brand absolute inset-y-1 left-0 w-px"
                transition={{ type: "spring", stiffness: 400, damping: 36 }}
                aria-hidden
              />
            )}
            {s.label}
          </a>
        );
      })}
    </nav>
  );
}
