"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Hairline reading-progress bar along the bottom edge of the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      className="bg-brand absolute inset-x-0 -bottom-px h-px origin-left"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
