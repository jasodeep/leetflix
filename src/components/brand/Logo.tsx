import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Wordmark height in px. Width scales with it. */
  size?: number;
}

/**
 * Netflix-parody wordmark. Tall condensed letters, brand red with a vertical
 * gradient, and the trademark curved baseline. Pure SVG so it stays crisp at
 * any size and needs no image asset.
 */
export function Logo({ className, size = 28 }: LogoProps) {
  const width = size * 5.35;
  return (
    <svg
      viewBox="0 0 535 100"
      width={width}
      height={size}
      role="img"
      aria-label="Leetflix"
      className={cn("shrink-0 select-none", className)}
    >
      <defs>
        <linearGradient id="lf-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff2a35" />
          <stop offset="0.55" stopColor="#e50914" />
          <stop offset="1" stopColor="#a4060e" />
        </linearGradient>
        <filter id="lf-shadow" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.55" />
        </filter>
        {/* Netflix's letters sit on a gentle arc; a textPath does that for free. */}
        <path id="lf-arc" d="M 4 88 Q 267 52 531 88" fill="none" />
      </defs>
      <text
        fontFamily="var(--font-display), Impact, 'Arial Narrow Bold', sans-serif"
        fontSize="104"
        letterSpacing="2"
        fill="url(#lf-red)"
        filter="url(#lf-shadow)"
        style={{ fontWeight: 400 }}
      >
        <textPath href="#lf-arc" startOffset="50%" textAnchor="middle">
          LEETFLIX
        </textPath>
      </text>
    </svg>
  );
}

/** Compact "L" mark for favicons, footers and tight spaces. */
export function LogoMark({ className, size = 24 }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-label="Leetflix"
      className={cn("shrink-0", className)}
    >
      <rect width="48" height="48" rx="8" fill="#0a0a0b" />
      <path d="M14 8h9v24h13v8H14z" fill="#e50914" />
      <path d="M14 8h9v32h-9z" fill="#ff2a35" opacity="0.9" />
    </svg>
  );
}
