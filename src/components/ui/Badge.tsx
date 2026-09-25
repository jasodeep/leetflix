import type { Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "text-easy border-easy/30 bg-easy/10",
  Medium: "text-medium border-medium/30 bg-medium/10",
  Hard: "text-hard border-hard/30 bg-hard/10",
};

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase",
        difficultyStyles[difficulty],
        className,
      )}
    >
      {difficulty}
    </span>
  );
}

export function Chip({
  children,
  className,
  active = false,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap transition-colors",
        active ? "border-fg bg-fg text-bg" : "border-border bg-surface-2 text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="border-border-strong bg-surface-3 text-fg-muted inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[10px]">
      {children}
    </kbd>
  );
}
