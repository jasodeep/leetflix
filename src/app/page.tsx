import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { Poster } from "@/components/problems/ProblemCard";
import { ProblemRow } from "@/components/problems/ProblemRow";
import { DifficultyBadge } from "@/components/ui/Badge";
import { Viz } from "@/components/viz/Viz";
import { catalogItems, getAllProblems, getCatalogItem, homeRows } from "@/lib/problems";

const FEATURED_SLUG = "trapping-rain-water";

export default function HomePage() {
  const featuredProblem =
    getAllProblems().find((p) => p.slug === FEATURED_SLUG) ?? getAllProblems()[0];
  const featuredItem = getCatalogItem(featuredProblem.slug)!;
  const featuredViz = featuredProblem.examples.find((e) => e.viz)?.viz;
  const rows = homeRows();
  const available = catalogItems.filter((c) => c.available).length;

  return (
    <div className="space-y-14 pb-8">
      <section className="border-border relative overflow-hidden border-b">
        <div
          className="bg-grid absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)] opacity-70"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8 lg:pt-20 lg:pb-24">
          <div className="space-y-7">
            <Logo size={64} className="max-w-full" />
            <h1 className="text-fg text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Binge-worthy algorithms.{" "}
              <span className="text-fg-muted">
                Every LeetCode problem, explained like a series.
              </span>
            </h1>
            <p className="text-fg-muted max-w-xl text-lg leading-8">
              Detailed problem breakdowns, side-by-side{" "}
              <span className="text-fg font-mono">Python</span> and{" "}
              <span className="text-fg font-mono">Go</span> solutions, and step-by-step animations
              you can scrub through like a video.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/problems/${featuredProblem.slug}`}
                className="bg-brand hover:bg-brand-hover inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium text-white transition-colors"
              >
                <Play className="size-4 fill-current" aria-hidden /> Play featured
              </Link>
              <Link
                href="/problems"
                className="border-border-strong bg-surface text-fg hover:border-fg inline-flex h-11 items-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors"
              >
                Browse all {catalogItems.length} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <dl className="text-fg-subtle flex flex-wrap gap-x-8 gap-y-3 pt-2 font-mono text-xs">
              <div>
                <dt className="sr-only">Catalogued</dt>
                <dd>
                  <span className="text-fg text-base tabular-nums">{catalogItems.length}</span>{" "}
                  problems catalogued
                </dd>
              </div>
              <div>
                <dt className="sr-only">Deep dives</dt>
                <dd>
                  <span className="text-fg text-base tabular-nums">{available}</span> animated
                  deep-dives
                </dd>
              </div>
              <div>
                <dt className="sr-only">Languages</dt>
                <dd>
                  <span className="text-fg text-base tabular-nums">2</span> languages, every
                  solution
                </dd>
              </div>
            </dl>
          </div>

          <Link
            href={`/problems/${featuredProblem.slug}`}
            className="group rounded-card border-border bg-surface hover:border-border-strong relative block overflow-hidden border shadow-[0_30px_80px_-30px_rgba(229,9,20,0.35)] transition-colors"
            aria-label={`Featured: ${featuredProblem.title}`}
          >
            <Poster item={featuredItem} className="h-28" />
            <div className="space-y-4 p-5">
              <div className="text-fg-subtle flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase">
                <span className="text-brand">● Featured</span>
                <span>#{featuredProblem.id}</span>
                <DifficultyBadge difficulty={featuredProblem.difficulty} />
              </div>
              <h2 className="text-fg text-xl font-semibold">{featuredProblem.title}</h2>
              <p className="text-fg-muted text-sm leading-6">{featuredProblem.blurb}</p>
              {featuredViz && (
                <div className="border-border bg-bg/60 rounded-md border p-3">
                  <Viz state={featuredViz} />
                </div>
              )}
            </div>
          </Link>
        </div>
      </section>

      <div className="space-y-12">
        {rows.map((row) => (
          <ProblemRow key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}
