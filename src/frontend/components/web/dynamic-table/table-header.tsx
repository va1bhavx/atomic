import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../../ui/input";
import type { FilterOption } from "../../../types/dynamicTableTypes";

interface TableHeaderProps {
  title?: string;
  description?: string;
  filters?: FilterOption[];
  activeFilters: Record<string, any>;
  onFilterChange: (columnId: string, value: any) => void;
  headerActions?: React.ReactNode;
}

// Debounced input search component to prevent API spamming
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
} & Omit<React.ComponentProps<"input">, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="relative w-full max-w-[240px] flex items-center">
      <Search
        size={14}
        className="absolute left-3 text-muted-foreground pointer-events-none"
      />
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 rounded-xl border bg-background text-xs h-8"
      />
    </div>
  );
}

export function TableHeader({
  title,
  description,
  filters = [],
  activeFilters,
  onFilterChange,
  headerActions,
}: TableHeaderProps) {
  const hasFilters = filters.length > 0;

  return (
    <div className="flex flex-col gap-4 p-3 border-b border-border-primary bg-card select-none">
      {/* 1. Title area */}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* 2. Controls and Actions row */}
      {(hasFilters || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Dynamic Filters column */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {filters.map((filter) => {
              if (filter.type === "text") {
                return (
                  <DebouncedInput
                    key={filter.columnId}
                    placeholder={
                      filter.placeholder || `Search ${filter.label}...`
                    }
                    value={activeFilters[filter.columnId] || ""}
                    onChange={(val) => onFilterChange(filter.columnId, val)}
                  />
                );
              }

              if (filter.type === "select") {
                return (
                  <div key={filter.columnId} className="flex items-center">
                    <select
                      value={activeFilters[filter.columnId] || ""}
                      onChange={(e) =>
                        onFilterChange(
                          filter.columnId,
                          e.target.value || undefined,
                        )
                      }
                      className="h-8 border border-input rounded-xl bg-background px-3 py-0 text-xs font-semibold text-foreground focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer min-w-[140px]"
                    >
                      <option value="">All {filter.label}</option>
                      {filter.choices?.map((choice: { label: string; value: any }) => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* User actions injector slot */}
          {headerActions && (
            <div className="flex items-center gap-2">{headerActions}</div>
          )}
        </div>
      )}
    </div>
  );
}
