"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { Chip } from "@/components/ui/Badge";
import { useUrlSearch } from "@/lib/hooks/useUrlSearch";
import {
  DIFFICULTIES,
  difficultyRank,
  type CatalogItem,
  type Difficulty,
  type Topic,
} from "@/lib/types";
import { cn } from "@/lib/utils";

import { ProblemCard } from "./ProblemCard";

interface Filters {
  q: string;
  difficulty: Difficulty | null;
  topic: Topic | null;
  available: boolean;
}

const EMPTY: Filters = { q: "", difficulty: null, topic: null, available: false };

const readFilters = (p: URLSearchParams, topics: Topic[]): Filters => {
  const d = p.get("difficulty");
  const t = p.get("topic");
  return {
    q: p.get("q") ?? "",
    difficulty: DIFFICULTIES.includes(d as Difficulty) ? (d as Difficulty) : null,
    topic: t && topics.includes(t as Topic) ? (t as Topic) : null,
    available: p.get("available") === "1",
  };
};

const writeFilters = (f: Filters): URLSearchParams => {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.difficulty) p.set("difficulty", f.difficulty);
  if (f.topic) p.set("topic", f.topic);
  if (f.available) p.set("available", "1");
  return p;
};

const matches = (item: CatalogItem, q: string): boolean => {
  if (!q) return true;
  const needle = q.trim().toLowerCase();
  if (/^\d+$/.test(needle)) return String(item.id).startsWith(needle);
  return (
    item.title.toLowerCase().includes(needle) ||
    item.topics.some((t) => t.toLowerCase().includes(needle))
  );
};

/**
 * Client-side search + filter over the whole catalogue. State lives in the
 * URL (replaceState, no navigation) so filtered views are shareable even on a
 * static host.
 */
export function ProblemBrowser({ items, topics }: { items: CatalogItem[]; topics: Topic[] }) {
  const [params, setParams] = useUrlSearch();
  const filters = useMemo(() => readFilters(params, topics), [params, topics]);
  const setFilters = (next: Filters) => setParams(writeFilters(next));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current)
        inputRef.current?.blur();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(
    () =>
      items
        .filter((i) => matches(i, filters.q))
        .filter((i) => !filters.difficulty || i.difficulty === filters.difficulty)
        .filter((i) => !filters.topic || i.topics.includes(filters.topic))
        .filter((i) => !filters.available || i.available)
        .sort(
          (a, b) =>
            Number(b.available) - Number(a.available) ||
            difficultyRank[a.difficulty] - difficultyRank[b.difficulty] ||
            a.id - b.id,
        ),
    [items, filters],
  );

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters({ ...filters, [k]: v });
  const anyFilter = filters.q || filters.difficulty || filters.topic || filters.available;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="relative block">
          <Search
            className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={filters.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search by title, number or topic…  (press / to focus)"
            className="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-fg h-11 w-full rounded-md border pr-10 pl-10 text-sm transition-colors outline-none"
            aria-label="Search problems"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => set("q", "")}
              className="text-fg-subtle hover:text-fg absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => set("available", !filters.available)}
            className="rounded-full"
          >
            <Chip active={filters.available}>▶ Now streaming</Chip>
          </button>
          <span className="bg-border mx-1 h-4 w-px" aria-hidden />
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => set("difficulty", filters.difficulty === d ? null : d)}
              className="rounded-full"
            >
              <Chip active={filters.difficulty === d}>{d}</Chip>
            </button>
          ))}
          <span className="bg-border mx-1 h-4 w-px" aria-hidden />
          <select
            value={filters.topic ?? ""}
            onChange={(e) => set("topic", (e.target.value || null) as Topic | null)}
            className="border-border bg-surface-2 text-fg-muted focus:border-fg h-7 rounded-full border px-2.5 text-xs outline-none"
            aria-label="Filter by topic"
          >
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {anyFilter && (
            <button
              type="button"
              onClick={() => setFilters(EMPTY)}
              className="text-fg-subtle hover:text-fg ml-auto text-xs underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <p className="text-fg-subtle font-mono text-xs" aria-live="polite">
        {results.length} of {items.length} problems
      </p>

      <div
        className={cn(
          "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          results.length === 0 && "hidden",
        )}
      >
        {results.map((item) => (
          <ProblemCard key={item.slug} item={item} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="rounded-card border-border text-fg-muted border border-dashed p-10 text-center text-sm">
          Nothing matches. Try a different title, number or topic.
        </div>
      )}
    </div>
  );
}
