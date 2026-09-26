"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/** Primary nav with a sliding underline that follows the active view. */
export function HeaderNav() {
  const pathname = usePathname();
  const path = pathname.replace(/\/+$/, "") || "/";
  const onList = path === "/";
  const slug = path.startsWith("/problems/") ? path.slice("/problems/".length) : null;

  return (
    <nav className="hidden h-full items-center gap-1 text-sm sm:flex" aria-label="Primary">
      <Link
        href="/"
        aria-current={onList ? "page" : undefined}
        className={cn(
          "relative flex h-14 items-center px-2 transition-colors",
          onList ? "text-fg" : "text-fg-muted hover:text-fg",
        )}
      >
        Problems
        {onList && (
          <motion.span
            layoutId="nav-underline"
            className="bg-brand absolute inset-x-2 -bottom-px h-0.5 rounded-full"
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            aria-hidden
          />
        )}
      </Link>
      {slug && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-fg-subtle flex items-center gap-2 px-2 font-mono text-xs"
        >
          <span aria-hidden>/</span> {slug}
        </motion.span>
      )}
    </nav>
  );
}
