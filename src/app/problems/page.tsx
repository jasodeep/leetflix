import type { Metadata } from "next";
import { Suspense } from "react";

import { ProblemBrowser } from "@/components/problems/ProblemBrowser";
import { allTopics, catalogItems } from "@/lib/problems";

export const metadata: Metadata = {
  title: "Browse problems",
  description:
    "Search and filter the full Leetflix catalogue by title, number, difficulty and topic.",
};

export default function ProblemsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-fg text-3xl font-semibold tracking-tight">Browse</h1>
        <p className="text-fg-muted">
          The full catalogue. Problems marked <span className="text-brand">▶</span> have a complete
          deep-dive with Python and Go solutions and an interactive animation; the rest link to
          LeetCode until their episode airs.
        </p>
      </header>
      <Suspense>
        <ProblemBrowser items={[...catalogItems]} topics={allTopics()} />
      </Suspense>
    </div>
  );
}
