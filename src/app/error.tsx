"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8">
      <p className="font-display text-brand text-8xl leading-none">Oops</p>
      <h1 className="text-fg text-2xl font-semibold tracking-tight">
        Something went wrong rendering this page.
      </h1>
      {error.digest && <p className="text-fg-subtle font-mono text-xs">ref: {error.digest}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-fg text-bg inline-flex h-10 items-center rounded-md px-4 text-sm font-medium"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-border text-fg-muted hover:text-fg inline-flex h-10 items-center rounded-md border px-4 text-sm"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
