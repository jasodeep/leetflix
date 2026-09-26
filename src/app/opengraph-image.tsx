import { ImageResponse } from "next/og";

import { catalogStats } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const alt = site.titleDefault;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: "#e50914",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          L
        </div>
        <div style={{ fontSize: 28, letterSpacing: 6, fontWeight: 700 }}>LEETFLIX</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5 }}>
          Every LeetCode problem. Solutions you can watch.
        </div>
        <div style={{ fontSize: 26, color: "#9a9aa3", lineHeight: 1.35 }}>
          {`${stats.total.toLocaleString()} problems · ${stats.animated} animated walkthroughs · Python and Go`}
        </div>
      </div>
    </div>,
    size,
  );
}
