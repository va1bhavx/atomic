import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface StartupStep {
  label: string;
  /** How long this step "runs" before completing, in ms. */
  duration: number;
}

interface StartupStatusProps {
  steps: readonly StartupStep[];
  /** Number of steps that have finished. The step at this index is active. */
  completedCount: number;
  className?: string;
}

const LINE_HEIGHT_PX = 24;

/**
 * Simulated startup log. Lines appear one at a time; the active line
 * carries a blinking terminal cursor and completed lines receive a
 * subtle checkmark pop. Height is fixed up front so nothing shifts.
 */
export function StartupStatus({
  steps,
  completedCount,
  className,
}: StartupStatusProps) {
  return (
    <ol
      className={cn("w-64 font-mono text-xs", className)}
      style={{ height: steps.length * LINE_HEIGHT_PX }}
      aria-live="polite"
    >
      {steps.map((step, index) => {
        const isDone = index < completedCount;
        const isActive = index === completedCount;
        const isVisible = isDone || isActive;

        return (
          <li
            key={step.label}
            className={cn(
              "flex h-6 items-center gap-2.5",
              "transition-all duration-300 ease-out motion-reduce:transition-none",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-1 opacity-0",
            )}
          >
            <span className="flex size-4 shrink-0 items-center justify-center">
              {isDone ? (
                <span className="motion-safe:animate-[splash-pop_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
                  <Check
                    className="size-3 text-primary"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </span>
              ) : (
                isActive && (
                  <span
                    aria-hidden
                    className="size-1 rounded-full bg-muted-foreground/60"
                  />
                )
              )}
            </span>

            <span
              className={cn(
                "truncate transition-colors duration-300",
                isDone ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {step.label}
            </span>

            {isActive && (
              <span
                aria-hidden
                className="ml-0.5 inline-block h-3 w-[6px] shrink-0 bg-primary/80 motion-safe:animate-[splash-blink_1.1s_step-end_infinite]"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
