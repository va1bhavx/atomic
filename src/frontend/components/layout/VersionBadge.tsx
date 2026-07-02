import { cn } from "../../lib/utils";

interface VersionBadgeProps {
  version?: string;
  className?: string;
}

/** Small pill displaying the current build version. */
export function VersionBadge({
  version = "v0.1.0-alpha",
  className,
}: VersionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border-primary bg-card",
        "px-2.5 py-1 font-mono text-[11px] leading-none text-muted-foreground",
        className,
      )}
    >
      {version}
    </span>
  );
}
