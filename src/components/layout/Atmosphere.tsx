"use client";

import { useEffect } from "react";

/** Site-wide cursor halo + drifting specks. Pure decoration; layout is unchanged. */
export function Atmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      root.style.setProperty("--glow-x", `${x}px`);
      root.style.setProperty("--glow-y", `${y}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="atmosphere scan-sweep" aria-hidden>
      <div className="atmosphere-cursor" />
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="atmosphere-speck" />
      ))}
    </div>
  );
}
