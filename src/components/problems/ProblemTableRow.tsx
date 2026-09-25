"use client";

import { ExternalLink, Lock, Play } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { leetcodeUrl } from "@/lib/site";
import { methodsOf, topicLabel, typesOf, type CatalogItem, type Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

export const difficultyText: Record<Difficulty, string> = {
  Easy: "text-easy",
  Medium: "text-medium",
  Hard: "text-hard",
};

/** Shared grid template so header and rows line up without a real <table>. */
export const ROW_GRID =
  "grid grid-cols-[2.5rem_minmax(0,1fr)_5.5rem] items-center gap-x-3 sm:grid-cols-[2.5rem_3.5rem_minmax(0,1fr)_5.5rem_7rem] lg:grid-cols-[2.5rem_3.5rem_minmax(0,1fr)_5.5rem_minmax(0,8.5rem)_minmax(0,10rem)_6.5rem]";

const Tag = ({ label }: { label: string }) => (
  <span className="bg-surface-2 text-fg-muted truncate rounded px-1.5 py-0.5 text-[11px]">
    {label}
  </span>
);

const TagCell = ({ tags }: { tags: string[] }) => (
  <div role="cell" className="hidden min-w-0 items-center gap-1 lg:flex">
    {tags.length === 0 ? (
      <span className="text-fg-subtle">—</span>
    ) : (
      <>
        <Tag label={tags[0]!} />
        {tags.length > 1 && (
          <span className="text-fg-subtle shrink-0 font-mono text-[11px]">+{tags.length - 1}</span>
        )}
      </>
    )}
  </div>
);

interface RowProps {
  item: CatalogItem;
  index: number;
  active: boolean;
  onHover: (index: number) => void;
  register: (index: number, el: HTMLDivElement | null) => void;
}

/**
 * One catalogue row. Semantically a `row` of the ARIA table above it; the
 * whole thing is clickable via a stretched link so the markup stays a plain
 * anchor for keyboard and screen-reader users.
 */
export function ProblemTableRow({ item, index, active, onHover, register }: RowProps) {
  const href = item.available ? `/problems/${item.slug}` : leetcodeUrl(item.slug);
  const stretch = "after:absolute after:inset-0 after:content-['']";

  return (
    <motion.div
      ref={(el) => register(index, el)}
      role="row"
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{
        opacity: { duration: 0.25, delay: Math.min(index, 16) * 0.02 },
        y: { duration: 0.25, delay: Math.min(index, 16) * 0.02 },
        layout: { type: "spring", stiffness: 500, damping: 40 },
      }}
      onMouseEnter={() => onHover(index)}
      data-active={active || undefined}
      className={cn(
        ROW_GRID,
        "row-sheen border-border/70 relative isolate min-h-12 overflow-hidden border-b px-3 py-2 text-sm last:border-b-0 sm:px-4",
        !item.available && "text-fg-muted",
      )}
    >
      {active && (
        <motion.div
          layoutId="row-cursor"
          className="row-cursor-wash pointer-events-none absolute inset-0 -z-10"
          transition={{ type: "spring", stiffness: 600, damping: 45 }}
          aria-hidden
        >
          <span className="bg-brand absolute inset-y-0 left-0 w-0.5 shadow-[0_0_12px_var(--color-brand)]" />
        </motion.div>
      )}

      <div role="cell" className="flex justify-center">
        {item.available ? (
          <span className="relative flex size-6 items-center justify-center" title="Animated">
            {active && (
              <span
                className="bg-brand/40 animate-ping-ring absolute inset-0 rounded-full"
                aria-hidden
              />
            )}
            <span className="bg-brand relative flex size-5 items-center justify-center rounded-full text-white">
              <Play className="ml-px size-2.5 fill-current" aria-hidden />
            </span>
            <span className="sr-only">Animated deep-dive available</span>
          </span>
        ) : item.premium ? (
          <Lock className="text-fg-subtle size-3.5" aria-label="LeetCode Premium" />
        ) : (
          <span className="bg-border-strong size-1.5 rounded-full" aria-label="Coming soon" />
        )}
      </div>

      <div role="cell" className="text-fg-subtle hidden font-mono text-xs tabular-nums sm:block">
        {item.id}
      </div>

      <div role="cell" className="min-w-0">
        {item.available ? (
          <Link
            href={href}
            className={cn("block truncate font-medium outline-none", stretch)}
            aria-label={`${item.id}. ${item.title}`}
          >
            <span className="text-fg-subtle mr-1.5 font-mono text-xs sm:hidden">{item.id}.</span>
            {item.title}
          </Link>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={cn("block truncate outline-none", stretch)}
            aria-label={`${item.id}. ${item.title} on LeetCode`}
          >
            <span className="text-fg-subtle mr-1.5 font-mono text-xs sm:hidden">{item.id}.</span>
            {item.title}
          </a>
        )}
      </div>

      <div role="cell" className={cn("text-xs font-medium", difficultyText[item.difficulty])}>
        {item.difficulty}
      </div>

      <TagCell tags={typesOf(item.topics).map(topicLabel)} />
      <TagCell tags={methodsOf(item.topics).map(topicLabel)} />

      <div role="cell" className="hidden justify-end sm:flex">
        {item.available ? (
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <span className="border-border text-fg-muted rounded border px-1.5 py-px">py</span>
            <span className="border-border text-fg-muted rounded border px-1.5 py-px">go</span>
          </span>
        ) : (
          <span className="text-fg-subtle flex items-center gap-1 text-[11px]">
            LeetCode <ExternalLink className="size-3" aria-hidden />
          </span>
        )}
      </div>
    </motion.div>
  );
}
