import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

interface ProgressIndicatorProps {
  /** Target progress from 0 to 1. The bar eases toward it smoothly. */
  value: number;
  className?: string;
}

/**
 * Thin, rounded progress bar. Rendered width chases the target value
 * with a requestAnimationFrame lerp so step changes feel continuous
 * rather than stepped. Uses only theme tokens; the glow is primary.
 */
export function ProgressIndicator({
  value,
  className,
}: ProgressIndicatorProps) {
  const [displayed, setDisplayed] = useState(0);
  const targetRef = useRef(value);
  const frameRef = useRef(0);

  useEffect(() => {
    targetRef.current = Math.min(Math.max(value, 0), 1);
  }, [value]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tick = () => {
      setDisplayed((previous) => {
        const target = targetRef.current;
        if (reduceMotion) return target;
        const next = previous + (target - previous) * 0.075;
        return Math.abs(target - next) < 0.0005 ? target : next;
      });
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const percent = Math.round(displayed * 1000) / 10;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-label="Starting Atomic"
      className={cn(
        "h-0.5 w-64 overflow-hidden rounded-full bg-card",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-primary shadow-[0_0_10px_0] shadow-primary/40"
        style={{ width: `${Math.max(percent, 1.5)}%` }}
      />
    </div>
  );
}
