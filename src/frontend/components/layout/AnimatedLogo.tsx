import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface AnimatedLogoProps {
  className?: string;
}

/**
 * Atomic logo mark. Fades in with a slight scale and soft upward
 * movement, backed by a faint primary bloom and a soft drop shadow.
 */
export function AnimatedLogo({ className }: AnimatedLogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Ambient bloom behind the logo — breathes slowly at ~5% opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12 rounded-full bg-primary blur-3xl motion-safe:animate-[splash-breathe_6s_ease-in-out_infinite] motion-reduce:opacity-[0.05]"
      />

      <div
        className={cn(
          "relative flex size-20 items-center justify-center rounded-2xl",
          "border border-border-primary bg-card",
          "shadow-[0_16px_40px_-16px_rgb(0_0_0/0.8),0_2px_8px_-2px_rgb(0_0_0/0.5)]",
          "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "motion-reduce:transition-none",
          mounted
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.96] opacity-0",
        )}
      >
        {/* Inner top edge highlight for a machined, native feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl border-t border-foreground/[0.06]"
        />

        <svg
          viewBox="0 0 40 40"
          className="size-10"
          role="img"
          aria-label="Atomic"
        >
          <g
            className="stroke-muted-foreground/50"
            fill="none"
            strokeWidth="1.25"
          >
            <ellipse cx="20" cy="20" rx="15" ry="6.5" />
            <ellipse
              cx="20"
              cy="20"
              rx="15"
              ry="6.5"
              transform="rotate(60 20 20)"
            />
            <ellipse
              cx="20"
              cy="20"
              rx="15"
              ry="6.5"
              transform="rotate(120 20 20)"
            />
          </g>
          <circle cx="20" cy="20" r="3" className="fill-primary" />
          <circle cx="20" cy="20" r="5.5" className="fill-primary/15" />
        </svg>
      </div>
    </div>
  );
}
