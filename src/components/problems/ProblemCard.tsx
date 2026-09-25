import { ExternalLink, Play } from "lucide-react";
import Link from "next/link";

import { DifficultyBadge } from "@/components/ui/Badge";
import type { CatalogItem } from "@/lib/types";
import { leetcodeUrl } from "@/lib/site";
import type { Topic } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Stable hue per primary topic so posters in the same row feel related. */
const topicHue: Partial<Record<Topic, number>> = {
  Array: 350,
  "Hash Table": 20,
  String: 40,
  "Two Pointers": 190,
  "Sliding Window": 200,
  Stack: 270,
  "Monotonic Stack": 280,
  "Binary Search": 160,
  "Linked List": 300,
  Tree: 120,
  "Binary Search Tree": 130,
  Trie: 90,
  Heap: 60,
  Backtracking: 330,
  Graph: 210,
  BFS: 220,
  DFS: 230,
  "Union Find": 240,
  "Dynamic Programming": 10,
  Greedy: 30,
  Intervals: 180,
  Matrix: 250,
  Math: 80,
  "Bit Manipulation": 100,
  Design: 260,
};

const hueFor = (item: CatalogItem): number => topicHue[item.topics[0]] ?? (item.id * 47) % 360;

export function Poster({ item, className }: { item: CatalogItem; className?: string }) {
  const hue = hueFor(item);
  return (
    <div
      className={cn("bg-surface-2 relative overflow-hidden", className)}
      style={{
        backgroundImage: `radial-gradient(120% 90% at 100% 0%, hsl(${hue} 60% 22% / 0.9), transparent 60%), radial-gradient(80% 80% at 0% 100%, hsl(${(hue + 40) % 360} 50% 14% / 0.9), transparent 60%)`,
      }}
      aria-hidden
    >
      <div className="bg-grid absolute inset-0 opacity-60" />
      <span className="font-display text-fg/8 absolute -right-1 -bottom-4 text-[5.5rem] leading-none tracking-tight tabular-nums select-none sm:text-[6.5rem]">
        {item.id}
      </span>
      <span className="text-fg/60 absolute top-3 left-3 font-mono text-[10px] tracking-wider uppercase">
        {item.topics[0]}
      </span>
    </div>
  );
}

export function ProblemCard({ item, className }: { item: CatalogItem; className?: string }) {
  const body = (
    <>
      <Poster item={item} className="rounded-t-card aspect-video" />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-fg line-clamp-2 text-sm leading-snug font-medium">
            <span className="text-fg-subtle mr-1.5 font-mono text-xs">#{item.id}</span>
            {item.title}
          </h3>
          <DifficultyBadge difficulty={item.difficulty} className="mt-0.5 shrink-0" />
        </div>
        <p className="text-fg-subtle mt-auto flex items-center gap-1.5 text-[11px]">
          {item.available ? (
            <>
              <Play className="text-brand size-3 fill-current" aria-hidden />
              <span className="text-fg-muted">Python · Go · Animated</span>
            </>
          ) : item.premium ? (
            <>
              <ExternalLink className="size-3" aria-hidden /> LeetCode Premium
            </>
          ) : (
            <>
              <ExternalLink className="size-3" aria-hidden /> Coming soon · view on LeetCode
            </>
          )}
        </p>
      </div>
    </>
  );

  const base = cn(
    "group flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-[transform,border-color,box-shadow] duration-200",
    "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)]",
    className,
  );

  return item.available ? (
    <Link href={`/problems/${item.slug}`} className={base} aria-label={`${item.title} — deep dive`}>
      {body}
    </Link>
  ) : (
    <a
      href={leetcodeUrl(item.slug)}
      target="_blank"
      rel="noreferrer"
      className={cn(base, "opacity-80 hover:opacity-100")}
      aria-label={`${item.title} on LeetCode`}
    >
      {body}
    </a>
  );
}
