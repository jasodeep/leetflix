"use client";

import { useState } from "react";

import { LogoMark } from "@/components/brand/Logo";

/**
 * Full-viewport boot on first document load. CSS-driven so SSR and hydration
 * match; the node unmounts after the wipe so it never intercepts clicks.
 */
export function BootCurtain() {
  const [gone, setGone] = useState(false);
  if (gone) return null;

  return (
    <div
      className="boot-curtain"
      aria-hidden
      onAnimationEnd={(e) => {
        if (e.animationName.includes("boot-out")) setGone(true);
      }}
    >
      <div className="boot-curtain-inner">
        <div className="logo-glow boot-mark">
          <LogoMark size={52} />
        </div>
        <p className="font-display text-brand boot-word">LEETFLIX</p>
        <span className="boot-rule" />
        <p className="text-fg-subtle font-mono text-[10px] tracking-[0.32em] uppercase">
          Watch. Code. Repeat.
        </p>
      </div>
    </div>
  );
}
