import Link from "next/link";

import { LogoMark } from "@/components/brand/Logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-border/60 mt-24 border-t">
      <div className="text-fg-muted mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <LogoMark size={22} />
          <p>
            <span className="text-fg">{site.name}</span> — {site.tagline}
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          <Link href="/" className="hover:text-fg">
            Problems
          </Link>
          <a href={site.github} target="_blank" rel="noreferrer" className="hover:text-fg">
            GitHub
          </a>
          <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="hover:text-fg">
            LeetCode
          </a>
        </nav>
        <p className="text-fg-subtle text-xs">
          Parody. Not affiliated with Netflix or LeetCode. Problem statements © their respective
          owners.
        </p>
      </div>
    </footer>
  );
}
