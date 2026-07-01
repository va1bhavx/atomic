import type { FilterOption } from "./dynamicTableTypes";

export interface TableHeaderProps {
  title?: string;
  description?: string;
  filters?: FilterOption[];
  activeFilters: Record<string, unknown>;
  onFilterChange: (columnId: string, value: unknown) => void;
  headerActions?: React.ReactNode;
}
