import { Suspense } from "react";

import { ProblemTable } from "@/components/problems/ProblemTable";
import { catalogItems } from "@/lib/problems";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense>
        <ProblemTable items={[...catalogItems]} />
      </Suspense>
    </div>
  );
}
