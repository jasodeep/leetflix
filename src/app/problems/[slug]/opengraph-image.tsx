import { ImageResponse } from "next/og";

import { problems } from "@/content/problems";
import { SOLVED_SLUGS } from "@/content/solvers/pick";
import { getProblem } from "@/lib/get-problem";

export const dynamic = "force-static";
export const alt = "Leetflix animated LeetCode solution";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  const slugs = new Set<string>([...problems.map((p) => p.slug), ...SOLVED_SLUGS]);
  return [...slugs].map((slug) => ({ slug }));
}

const tone: Record<string, string> = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

export default async function ProblemOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = getProblem(slug);
  const title = problem?.title ?? slug;
  const id = problem?.id ?? "";
  const difficulty = problem?.difficulty ?? "Medium";
  const topics = (problem?.topics ?? []).slice(0, 3).join(" · ");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a0b",
        color: "#ededf0",
        padding: "72px",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 24, letterSpacing: 6, fontWeight: 700 }}>LEETFLIX</div>
        <div
          style={{
            display: "flex",
            padding: "8px 16px",
            borderRadius: 999,
            border: `1px solid ${tone[difficulty] ?? "#f59e0b"}`,
            color: tone[difficulty] ?? "#f59e0b",
            fontSize: 20,
          }}
        >
          {difficulty}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 22, color: "#66666e", fontFamily: "ui-monospace, monospace" }}>
          {id ? `${id}. animated solution` : "animated solution"}
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, color: "#9a9aa3" }}>
          {`Watch the algorithm · Python and Go${topics ? ` · ${topics}` : ""}`}
        </div>
      </div>
    </div>,
    size,
  );
}
