"use client";

import { ArrowUp, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Kbd } from "@/components/ui/Badge";
import {
  applyQuery,
  DEFAULT_QUERY,
  difficultyStats,
  hasActiveFilter,
  methodStats,
  paginate,
  readQuery,
  typeStats,
  writeQuery,
  type Query,
  type SortKey,
} from "@/lib/catalog-query";
import { useUrlSearch } from "@/lib/hooks/useUrlSearch";
import { topicLabel, type CatalogItem } from "@/lib/types";
import { clamp, cn } from "@/lib/utils";

import { difficultyText, ProblemTableRow, ROW_GRID } from "./ProblemTableRow";

interface ProblemTableProps {
  items: CatalogItem[];
}

const spring = { type: "spring", stiffness: 500, damping: 40 } as const;

/**
 * The LeetCode-style problem list. Filters, sort and page live in the URL so
 * every view is shareable on a static host. Keyboard: `/` search, `j`/`k`
 * move, `Enter` open, `Esc` clear.
 */
export function ProblemTable({ items }: ProblemTableProps) {
  const [params, setParams] = useUrlSearch();
  const query = useMemo(() => readQuery(params), [params]);
  const diffs = useMemo(() => difficultyStats(items), [items]);
  const types = useMemo(() => typeStats(items), [items]);
  const methods = useMemo(() => methodStats(items), [items]);

  const filtered = useMemo(() => applyQuery(items, query), [items, query]);
  const page = useMemo(() => paginate(filtered, query.page), [filtered, query.page]);

  const update = useCallback(
    (patch: Partial<Query>, { keepPage = false } = {}) =>
      setParams(writeQuery({ ...query, ...patch, ...(keepPage ? {} : { page: 1 }) })),
    [query, setParams],
  );

  const toggleSort = (key: SortKey) =>
    update(
      query.sort === key
        ? { dir: query.dir === "asc" ? "desc" : "asc" }
        : { sort: key, dir: "asc" },
      { keepPage: true },
    );

  // Row cursor: shared by hover and j/k so the highlight is one moving thing.
  const [cursor, setCursor] = useState(-1);
  const rows = useRef(new Map<number, HTMLDivElement>());
  const register = useCallback((i: number, el: HTMLDivElement | null) => {
    if (el) rows.current.set(i, el);
    else rows.current.delete(i);
  }, []);
  const searchRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (typing) {
        if (e.key === "Escape") (e.target as HTMLElement).blur();
        return;
      }
      if (e.key === "j" || e.key === "k" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const dir = e.key === "j" || e.key === "ArrowDown" ? 1 : -1;
        const next = clamp(cursor + dir, 0, rows.current.size - 1);
        setCursor(next);
        rows.current.get(next)?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        rows.current.get(cursor)?.querySelector("a")?.click();
      } else if (e.key === "Escape") {
        setCursor(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor]);

  const goToPage = (n: number) => {
    update({ page: n }, { keepPage: true });
    tableRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-56 flex-1">
            <Search
              className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              ref={searchRef}
              type="search"
              value={query.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search by number, title, type or method"
              spellCheck={false}
              autoComplete="off"
              className="search-glow border-border bg-surface/80 text-fg placeholder:text-fg-subtle h-10 w-full rounded-md border pr-10 pl-9 text-sm backdrop-blur-sm transition-[border-color,box-shadow] outline-none"
              aria-label="Search problems"
            />
            <span className="absolute top-1/2 right-2 -translate-y-1/2">
              {query.q ? (
                <button
                  type="button"
                  onClick={() => update({ q: "" })}
                  className="text-fg-subtle hover:text-fg rounded p-1"
                  aria-label="Clear search"
                >
                  <X className="size-4" aria-hidden />
                </button>
              ) : (
                <span className="hidden sm:inline-flex">
                  <Kbd>/</Kbd>
                </span>
              )}
            </span>
          </label>

          <AvailableSwitch checked={query.available} onChange={(v) => update({ available: v })} />
        </div>

        <FilterRail
          label="Difficulty"
          allLabel="All"
          pillId="difficulty-pill"
          value={query.difficulty}
          onChange={(d) => update({ difficulty: d })}
          options={diffs.map((s) => ({
            id: s.difficulty,
            label: s.difficulty,
            count: s.total,
            className: difficultyText[s.difficulty],
          }))}
        />
        <FilterRail
          label="Type"
          allLabel="All types"
          pillId="type-pill"
          value={query.type}
          onChange={(t) => update({ type: t })}
          options={types.map((s) => ({
            id: s.topic,
            label: topicLabel(s.topic),
            count: s.count,
          }))}
        />
        <FilterRail
          label="Method"
          allLabel="All methods"
          pillId="method-pill"
          value={query.method}
          onChange={(t) => update({ method: t })}
          options={methods.map((s) => ({
            id: s.topic,
            label: topicLabel(s.topic),
            count: s.count,
          }))}
        />
      </div>

      <div className="text-fg-subtle flex items-center justify-between font-mono text-xs">
        <p aria-live="polite">
          {page.total === 0
            ? "No matches"
            : `Showing ${page.from}–${page.to} of ${page.total}${
                page.total !== items.length ? ` (of ${items.length})` : ""
              }`}
        </p>
        <AnimatePresence>
          {hasActiveFilter(query) && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              onClick={() => setParams(writeQuery(DEFAULT_QUERY))}
              className="hover:text-fg flex items-center gap-1 underline-offset-4 hover:underline"
            >
              <X className="size-3" aria-hidden /> Clear filters
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div
        ref={tableRef}
        role="table"
        aria-label="Problems"
        aria-rowcount={page.total}
        className="pointer-glow rounded-card border-border bg-surface/80 relative scroll-mt-20 border shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_-40px_rgba(229,9,20,0.35)] backdrop-blur-sm"
        onMouseLeave={() => setCursor(-1)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
      >
        {/* No overflow-hidden on the parent: it would trap the sticky header. */}
        <div
          role="rowgroup"
          className="border-border bg-surface-2/80 supports-[backdrop-filter]:bg-surface-2/60 rounded-t-card sticky top-14 z-20 border-b backdrop-blur"
        >
          <div
            role="row"
            className={cn(
              ROW_GRID,
              "text-fg-subtle h-10 px-3 font-mono text-[11px] tracking-wider uppercase sm:px-4",
            )}
          >
            <div role="columnheader" className="text-center">
              <span className="sr-only">Status</span>
              <span aria-hidden>●</span>
            </div>
            <SortHeader
              label="#"
              sortKey="id"
              query={query}
              onSort={toggleSort}
              className="hidden sm:flex"
            />
            <SortHeader label="Title" sortKey="title" query={query} onSort={toggleSort} />
            <SortHeader label="Difficulty" sortKey="difficulty" query={query} onSort={toggleSort} />
            <div role="columnheader" className="hidden lg:block">
              Type
            </div>
            <div role="columnheader" className="hidden lg:block">
              Method
            </div>
            <div role="columnheader" className="hidden text-right sm:block">
              Solutions
            </div>
          </div>
        </div>

        <div role="rowgroup" className="relative z-10">
          <AnimatePresence initial={false} mode="popLayout">
            {page.items.map((item, i) => (
              <ProblemTableRow
                key={item.slug}
                item={item}
                index={i}
                active={i === cursor}
                onHover={setCursor}
                register={register}
              />
            ))}
          </AnimatePresence>

          {page.items.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              role="row"
              className="text-fg-muted flex flex-col items-center gap-3 px-6 py-16 text-center text-sm"
            >
              <div role="cell" className="space-y-2">
                <p className="font-display text-fg-subtle text-4xl tracking-wide">NO RESULTS</p>
                <p>Nothing in the catalogue matches. Try another number, title or topic.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-fg-subtle hidden items-center gap-1.5 text-[11px] lg:flex">
          <Kbd>/</Kbd> search <span className="mx-1" /> <Kbd>j</Kbd>
          <Kbd>k</Kbd> move <span className="mx-1" /> <Kbd>↵</Kbd> open
        </p>
        {page.pageCount > 1 && (
          <Pagination page={page.page} pageCount={page.pageCount} onChange={goToPage} />
        )}
      </div>
    </div>
  );
}

function SortHeader({
  label,
  sortKey,
  query,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  query: Query;
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = query.sort === sortKey;
  return (
    <div
      role="columnheader"
      aria-sort={active ? (query.dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn("flex", className)}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "hover:text-fg -ml-1 flex items-center gap-1 rounded px-1 py-0.5 tracking-wider uppercase transition-colors",
          active && "text-fg",
        )}
      >
        {label}
        <motion.span
          initial={false}
          animate={{ opacity: active ? 1 : 0, rotate: query.dir === "asc" ? 0 : 180 }}
          transition={spring}
          className="inline-flex"
          aria-hidden
        >
          <ArrowUp className="size-3" />
        </motion.span>
      </button>
    </div>
  );
}

function AvailableSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "border-border bg-surface hover:border-border-strong flex h-10 items-center gap-2.5 rounded-md border px-3 text-xs font-medium transition-colors",
        checked ? "text-fg" : "text-fg-muted",
      )}
    >
      <span
        className={cn(
          "relative flex h-4 w-7 items-center rounded-full transition-colors",
          checked ? "bg-brand" : "bg-border-strong",
        )}
        aria-hidden
      >
        <motion.span
          layout
          transition={spring}
          className={cn(
            "absolute size-3 rounded-full bg-white shadow",
            checked ? "right-0.5" : "left-0.5",
          )}
        />
      </span>
      Animated only
    </button>
  );
}

function FilterRail<T extends string>({
  label,
  allLabel,
  options,
  value,
  onChange,
  pillId,
}: {
  label: string;
  allLabel: string;
  options: { id: T; label: string; count: number; className?: string }[];
  value: T | null;
  onChange: (v: T | null) => void;
  pillId: string;
}) {
  const chip = (active: boolean, extra?: string) =>
    cn(
      "relative shrink-0 rounded-full px-3 py-1 text-xs transition-colors",
      active
        ? (extra ?? "text-bg")
        : extra
          ? cn(extra, "opacity-70 hover:opacity-100")
          : "text-fg-muted hover:text-fg",
    );
  return (
    <div className="space-y-1.5">
      <p className="text-fg-subtle font-mono text-[10px] tracking-wider uppercase">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className="mask-fade-x -mx-4 flex scrollbar-none gap-1.5 overflow-x-auto px-4 py-0.5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        <motion.button
          type="button"
          role="radio"
          aria-checked={value === null}
          onClick={() => onChange(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className={chip(value === null)}
        >
          {value === null && <RailPill id={pillId} />}
          <span className="relative">{allLabel}</span>
        </motion.button>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <motion.button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(active ? null : opt.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className={chip(active, opt.className)}
            >
              {active && <RailPill id={pillId} />}
              <span className="relative">
                {opt.label}
                <span
                  className={cn(
                    "ml-1.5 font-mono text-[10px] tabular-nums",
                    active ? "text-current/70" : "text-fg-subtle",
                  )}
                >
                  {opt.count}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const RailPill = ({ id }: { id: string }) => (
  <motion.span
    layoutId={id}
    className="bg-fg absolute inset-0 rounded-full"
    transition={spring}
    aria-hidden
  />
);

function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (n: number) => void;
}) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const btn =
    "flex size-8 items-center justify-center rounded-md border text-xs transition-colors disabled:opacity-40";
  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={cn(btn, "border-border text-fg-muted hover:text-fg")}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={cn(
            btn,
            "relative font-mono",
            n === page ? "text-bg border-fg" : "border-border text-fg-muted hover:text-fg",
          )}
        >
          {n === page && (
            <motion.span
              layoutId="page-pill"
              className="bg-fg absolute inset-0 rounded-[5px]"
              transition={spring}
              aria-hidden
            />
          )}
          <span className="relative">{n}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        className={cn(btn, "border-border text-fg-muted hover:text-fg")}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  );
}
