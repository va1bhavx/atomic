import type { ReactNode } from "react";
import { AlertCircle, Inbox, Search, RotateCw } from "lucide-react";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";

export interface TableFallbackConfig {
  illustration?: ReactNode | string;
  title: string;
  subtitle: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

interface TableFallbackProps {
  type: "loading" | "error" | "no-data" | "no-results";
  columnCount?: number;
  rowCount?: number;
  customConfig?: TableFallbackConfig;
  onRetry?: () => void;
  onClearFilters?: () => void;
}

export function TableFallback({
  type,
  columnCount = 4,
  rowCount = 5,
  customConfig,
  onRetry,
  onClearFilters,
}: TableFallbackProps) {
  // 1. Loading Skeleton grid
  if (type === "loading") {
    return (
      <div className="w-full divide-y divide-border/60 animate-pulse">
        {Array.from({ length: rowCount }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center py-4 px-4 gap-4">
            {Array.from({ length: columnCount }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="flex-1"
                style={{
                  maxWidth:
                    cIdx === 0 ? "140px" : cIdx === 1 ? "240px" : "100%",
                }}
              >
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Determine fallback details
  let icon: ReactNode = (
    <Inbox size={42} className="text-muted-foreground/60" />
  );
  let title = "No data available";
  let subtitle =
    "There are currently no rows recorded in this table workspace.";
  let action: ReactNode = null;

  if (type === "error") {
    icon = <AlertCircle size={42} className="text-destructive/80" />;
    title = "Failed to fetch data";
    subtitle = "An unexpected error occurred while loading this data slice.";
    if (onRetry) {
      action = (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl"
        >
          <RotateCw size={14} /> Try Again
        </Button>
      );
    }
  } else if (type === "no-results") {
    icon = <Search size={42} className="text-muted-foreground/60" />;
    title = "No results found";
    subtitle = "Your active search filters did not match any database records.";
    if (onClearFilters) {
      action = (
        <Button
          onClick={onClearFilters}
          variant="outline"
          size="sm"
          className="rounded-xl"
        >
          Clear Filters
        </Button>
      );
    }
  }

  // Override with user custom config if present
  if (customConfig) {
    if (customConfig.illustration) {
      icon =
        typeof customConfig.illustration === "string" ? (
          <img
            src={customConfig.illustration}
            alt="Fallback illustration"
            className="w-20 h-20 object-contain mb-2"
          />
        ) : (
          customConfig.illustration
        );
    }
    title = customConfig.title;
    subtitle = customConfig.subtitle;
    if (customConfig.actionButton) {
      action = (
        <Button
          onClick={customConfig.actionButton.onClick}
          size="sm"
          className="rounded-xl"
        >
          {customConfig.actionButton.label}
        </Button>
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 py-20 space-y-4 max-w-sm mx-auto animate-in fade-in-0 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-muted/40 border flex items-center justify-center shadow-inner">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-bold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
