import { cn } from "@/lib/utils";

export function PanelFrame({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0", className)}>
      {label ? (
        <h4 className="text-fg-subtle mb-2 font-mono text-[11px] tracking-wider uppercase">
          {label}
        </h4>
      ) : null}
      {children}
    </section>
  );
}

/** Labelled arrow under a cell; shared by array and bar panels. */
export function PointerTag({ label, color }: { label: string; color: string }) {
  return (
    <span className="flex flex-col items-center leading-none" style={{ color }}>
      <span aria-hidden className="text-[10px]">
        ▲
      </span>
      <span className="mt-0.5 font-mono text-[10px] font-medium whitespace-nowrap">{label}</span>
    </span>
  );
}
