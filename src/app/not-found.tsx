import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8">
      <p className="font-display text-brand text-8xl leading-none">404</p>
      <h1 className="text-fg text-2xl font-semibold tracking-tight">
        This episode isn&apos;t available in your region.
      </h1>
      <p className="text-fg-muted max-w-md">
        Or anywhere, really. The page you asked for doesn&apos;t exist. Try the catalogue instead.
      </p>
      <Link
        href="/problems"
        className="bg-fg text-bg inline-flex h-10 items-center rounded-md px-4 text-sm font-medium"
      >
        Browse problems
      </Link>
    </div>
  );
}
