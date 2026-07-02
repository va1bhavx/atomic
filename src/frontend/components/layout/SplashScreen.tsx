import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedLogo } from "./AnimatedLogo";
import { StartupStatus, type StartupStep } from "./StartupStatus";
import { ProgressIndicator } from "./ProgressIndicator";
import { VersionBadge } from "./VersionBadge";
import { cn } from "../../lib/utils";

interface SplashScreenProps {
  /** Called once the splash has fully faded out. */
  onComplete?: () => void;
  version?: string;
}

const STARTUP_STEPS: readonly StartupStep[] = [
  { label: "Initializing Atomic", duration: 300 },
  { label: "Loading Database Drivers", duration: 430 },
  { label: "Preparing Native Workspace", duration: 340 },
  { label: "Configuring Secure Keychain", duration: 390 },
  { label: "Discovering Local Connections", duration: 450 },
  { label: "Loading Extensions", duration: 320 },
  { label: "Ready", duration: 240 },
];

const ENTER_DELAY_MS = 420;
const READY_HOLD_MS = 320;
const EXIT_DURATION_MS = 500;

/** Deterministic particle field — barely visible, drifting slowly. */
const PARTICLES = [
  { left: "18%", top: "26%", size: 2, duration: 9, delay: 0 },
  { left: "76%", top: "22%", size: 3, duration: 11, delay: 1.6 },
  { left: "64%", top: "68%", size: 2, duration: 10, delay: 0.8 },
  { left: "28%", top: "72%", size: 3, duration: 12, delay: 2.4 },
  { left: "88%", top: "48%", size: 2, duration: 9.5, delay: 1.2 },
  { left: "10%", top: "52%", size: 2, duration: 10.5, delay: 3 },
] as const;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Atomic startup splash. Runs a simulated boot sequence for ~3s,
 * then fades everything out together and calls onComplete.
 */
export function SplashScreen({ onComplete, version }: SplashScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    let elapsed = reducedMotion ? 100 : ENTER_DELAY_MS;

    STARTUP_STEPS.forEach((step, index) => {
      elapsed += reducedMotion ? 90 : step.duration;
      timers.push(
        window.setTimeout(() => setCompletedCount(index + 1), elapsed),
      );
    });

    elapsed += reducedMotion ? 120 : READY_HOLD_MS;
    timers.push(window.setTimeout(() => setExiting(true), elapsed));

    elapsed += reducedMotion ? 150 : EXIT_DURATION_MS;
    timers.push(window.setTimeout(() => onCompleteRef.current?.(), elapsed));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reducedMotion]);

  const progress = useMemo(
    () => completedCount / STARTUP_STEPS.length,
    [completedCount],
  );

  const enterClass = cn(
    "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "motion-reduce:transition-none",
    mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
  );

  const enterDelay = (delayMs: number) =>
    ({ transitionDelay: mounted ? `${delayMs}ms` : "0ms" }) as const;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center",
        "overflow-hidden bg-background font-sans select-none",
        "transition-opacity duration-500 ease-out motion-reduce:transition-none",
        exiting && "pointer-events-none opacity-0",
      )}
      aria-busy={!exiting}
    >
      <style>{`
        @keyframes splash-blink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }
        @keyframes splash-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
        @keyframes splash-breathe { 0%, 100% { opacity: 0.04; transform: scale(1); } 50% { opacity: 0.07; transform: scale(1.05); } }
        @keyframes splash-drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
      `}</style>

      {/* Faint blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-muted-foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-muted-foreground) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(75% 75% at 50% 45%, rgb(0 0 0) 0%, transparent 100%)",
        }}
      />

      {/* Ambient primary glow, breathing */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 motion-safe:animate-[splash-breathe_7s_ease-in-out_infinite] motion-reduce:opacity-[0.04]"
        style={{
          background:
            "radial-gradient(560px circle at 50% 40%, var(--color-primary), transparent 70%)",
        }}
      />

      {/* Soft vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 42%, transparent 55%, rgb(0 0 0 / 0.4) 100%)",
        }}
      />

      {/* Drifting particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PARTICLES.map((particle) => (
          <span
            key={`${particle.left}-${particle.top}`}
            className="absolute rounded-full bg-foreground opacity-[0.05] motion-safe:animate-[splash-drift_var(--drift-duration)_ease-in-out_infinite]"
            style={
              {
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                animationDelay: `${particle.delay}s`,
                "--drift-duration": `${particle.duration}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center">
        <AnimatedLogo />

        <h1
          className={cn(
            "mt-9 text-2xl font-semibold text-foreground",
            "tracking-[0.35em] -mr-[0.35em]",
            enterClass,
          )}
          style={enterDelay(150)}
        >
          ATOMIC
        </h1>

        <p
          className={cn("mt-2.5 text-sm text-muted-foreground", enterClass)}
          style={enterDelay(250)}
        >
          Native Database Workspace
        </p>

        <div className={cn("mt-12", enterClass)} style={enterDelay(400)}>
          <StartupStatus
            steps={STARTUP_STEPS}
            completedCount={completedCount}
          />
        </div>

        <div className={cn("mt-8", enterClass)} style={enterDelay(480)}>
          <ProgressIndicator value={progress} />
        </div>
      </div>

      <div
        className={cn("absolute bottom-10", enterClass)}
        style={enterDelay(560)}
      >
        <VersionBadge version={version} />
      </div>
    </div>
  );
}
