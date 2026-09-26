import { ImageResponse } from "next/og";

import { catalogStats } from "@/lib/seo";

export const dynamic = "force-static";
export const alt = "Explore LeetCode problems on Leetflix";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function ExploreOpenGraphImage() {
  const stats = catalogStats();
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
      <div style={{ fontSize: 24, letterSpacing: 6, fontWeight: 700 }}>LEETFLIX · EXPLORE</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.08 }}>
          Browse every problem by difficulty, type, and method.
        </div>
        <div style={{ fontSize: 26, color: "#9a9aa3" }}>
          {`${stats.total.toLocaleString()} problems · animated Python and Go walkthroughs`}
        </div>
      </div>
    </div>,
    size,
  );
}
