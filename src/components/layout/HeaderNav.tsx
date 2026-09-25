"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUrlSearch } from "@/lib/hooks/useUrlSearch";
import { cn } from "@/lib/utils";

/** Primary nav with a sliding underline that follows the active view. */
export function HeaderNav() {
  const pathname = usePathname();
  const [params, setParams] = useUrlSearch();
  const onList = pathname === "/";
  const animatedOnly = onList && params.get("available") === "1";
  const slug = pathname.startsWith("/problems/") ? pathname.split("/").pop() : null;

  const links = [
    { key: "all", href: "/", label: "Problems", active: onList && !animatedOnly, available: false },
    {
      key: "animated",
      href: "/?available=1",
      label: "Animated",
      active: animatedOnly,
      available: true,
    },
  ];

  return (
    <nav className="hidden h-full items-center gap-1 text-sm sm:flex" aria-label="Primary">
      {links.map((l) => (
        <Link
          key={l.key}
          href={l.href}
          onClick={(e) => {
            // Already on the list: flip the filter in place instead of re-navigating.
            if (!onList) return;
            e.preventDefault();
            const next = new URLSearchParams(params);
            if (l.available) next.set("available", "1");
            else next.delete("available");
            next.delete("page");
            setParams(next);
          }}
          aria-current={l.active ? "page" : undefined}
          className={cn(
            "relative flex h-14 items-center px-2 transition-colors",
            l.active ? "text-fg" : "text-fg-muted hover:text-fg",
          )}
        >
          {l.label}
          {l.active && (
            <motion.span
              layoutId="nav-underline"
              className="bg-brand absolute inset-x-2 -bottom-px h-0.5 rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
              aria-hidden
            />
          )}
        </Link>
      ))}
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
