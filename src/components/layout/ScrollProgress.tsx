"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Hairline reading-progress bar along the bottom edge of the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 36, restDelta: 0.001 });
  return (
    <motion.div
      className="absolute inset-x-0 -bottom-px h-0.5 origin-left shadow-[0_0_14px_var(--color-brand)]"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #e50914, #a78bfa, #22d3ee, #e50914)",
      }}
      aria-hidden
    />
  );
}
