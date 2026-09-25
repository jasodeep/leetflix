import { Suspense } from "react";

import { DifficultyRing } from "@/components/problems/DifficultyRing";
import { ProblemTable } from "@/components/problems/ProblemTable";
import { difficultyStats, topicStats } from "@/lib/catalog-query";
import { catalogItems } from "@/lib/problems";

export default function HomePage() {
  const stats = difficultyStats(catalogItems);
  const animated = catalogItems.filter((c) => c.available).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-fg text-2xl font-semibold tracking-tight sm:text-3xl">Problems</h1>
          <p className="text-fg-muted max-w-xl text-sm leading-6 sm:text-[15px]">
            {catalogItems.length} problems. The <span className="text-brand">▶</span> ones have a
            full deep-dive — detailed statement, Python and Go solutions, and an animation you can
            scrub through step by step. The rest link to LeetCode until their episode airs.
          </p>
        </div>
        <div className="rounded-card border-border bg-surface shrink-0 border px-5 py-4">
          <p className="text-fg-subtle mb-3 font-mono text-[11px] tracking-wider uppercase">
            Animated deep-dives
          </p>
          <DifficultyRing stats={stats} />
          <span className="sr-only">
            {animated} of {catalogItems.length} problems have animated deep-dives.
          </span>
        </div>
      </header>

      <Suspense>
        <ProblemTable items={[...catalogItems]} topics={topicStats(catalogItems)} />
      </Suspense>
    </div>
  );
}
