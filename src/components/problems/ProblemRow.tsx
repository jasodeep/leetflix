"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import type { Row } from "@/lib/problems";

import { ProblemCard } from "./ProblemCard";

/** Netflix-style horizontal shelf with scroll-snap and arrow paddles. */
export function ProblemRow({ row }: { row: Row }) {
  const scroller = useRef<HTMLDivElement>(null);
  const page = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section aria-labelledby={`row-${row.id}`} className="group/row">
      <div className="mx-auto mb-3 flex max-w-7xl items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h2 id={`row-${row.id}`} className="text-fg text-lg font-semibold tracking-tight">
            {row.title}
          </h2>
          {row.subtitle && <p className="text-fg-subtle text-sm">{row.subtitle}</p>}
        </div>
        <div className="hidden gap-1 opacity-0 transition-opacity group-hover/row:opacity-100 sm:flex">
          <button
            type="button"
            onClick={() => page(-1)}
            className="border-border bg-surface text-fg-muted hover:text-fg flex size-8 items-center justify-center rounded-md border"
            aria-label={`Scroll ${row.title} left`}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            className="border-border bg-surface text-fg-muted hover:text-fg flex size-8 items-center justify-center rounded-md border"
            aria-label={`Scroll ${row.title} right`}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory scroll-px-4 scrollbar-none gap-3 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {row.items.map((item) => (
          <ProblemCard key={item.slug} item={item} className="w-56 shrink-0 snap-start sm:w-64" />
        ))}
      </div>
    </section>
  );
}
