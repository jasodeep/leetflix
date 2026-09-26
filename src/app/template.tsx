"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Remounts per navigation — wipe line + fade-up so route changes feel cut. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <motion.span
        aria-hidden
        className="page-wipe pointer-events-none absolute inset-x-0 top-0 z-20 origin-left"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{ duration: 0.9, ease, times: [0, 0.55, 1] }}
      />
      <motion.div
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.56, ease, delay: 0.06 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
