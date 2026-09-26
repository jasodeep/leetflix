import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { site } from "@/lib/site";

import { HeaderNav } from "./HeaderNav";
import { ScrollProgress } from "./ScrollProgress";

/** lucide dropped brand icons in v1; GitHub's mark is small enough to inline. */
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

export function Header() {
  return (
    <header className="header-shine border-border/50 bg-bg/55 supports-[backdrop-filter]:bg-bg/30 sticky top-0 z-40 border-b backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="logo-glow flex items-center gap-2 rounded-sm"
          aria-label="Leetflix home"
        >
          <Logo size={24} />
        </Link>

        <HeaderNav />

        <div className="ml-auto flex items-center gap-2">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="border-border bg-surface/80 text-fg-muted hover:border-brand/50 hover:text-fg flex size-8 items-center justify-center rounded-md border transition-all duration-300 hover:shadow-[0_0_20px_-6px_var(--color-brand)]"
            aria-label="Source on GitHub"
          >
            <GithubIcon className="size-4" />
          </a>
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}
