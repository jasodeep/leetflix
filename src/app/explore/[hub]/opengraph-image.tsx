import { ImageResponse } from "next/og";

import { hubOf, itemsForHub, SEO_HUBS } from "@/lib/seo";

export const dynamic = "force-static";
export const alt = "Leetflix topic hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return SEO_HUBS.map((hub) => ({ hub: hub.slug }));
}

export default async function HubOpenGraphImage({ params }: { params: Promise<{ hub: string }> }) {
  const { hub: slug } = await params;
  const hub = hubOf(slug);
  const items = hub ? itemsForHub(hub) : [];
  const animated = items.filter((i) => i.available).length;

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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 24, letterSpacing: 6, fontWeight: 700 }}>LEETFLIX</div>
        <div style={{ fontSize: 22, color: "#9a9aa3", textTransform: "uppercase" }}>
          {hub?.kind ?? "explore"}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.08 }}>
          {hub?.title ?? "Explore"}
        </div>
        <div style={{ fontSize: 24, color: "#9a9aa3" }}>
          {`${items.length.toLocaleString()} problems · ${animated} animated walkthroughs`}
        </div>
      </div>
    </div>,
    size,
  );
}
