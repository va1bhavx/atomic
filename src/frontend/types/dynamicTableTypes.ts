import type { ColumnDef } from "@tanstack/react-table";
import type { TableFallbackConfig } from "../components/web/dynamic-table/table-fallback";

export interface FilterOption {
  columnId: string;
  label: string;
  type: "text" | "select";
  choices?: { label: string; value: any }[];
  placeholder?: string;
}

export interface FetchParams {
  pageIndex: number;
  pageSize: number;
  sorting: { id: string; desc: boolean }[];
  filters: Record<string, any>;
}

export interface DynamicTableProps<TData> {
  // 1. Data Fetching
  endpoint:
    | string
    | ((params: FetchParams) => Promise<{ data: TData[]; total: number }>);
  queryKey: unknown[];

  // 2. Column Configurations
  columns: ColumnDef<TData>[];

  // 3. Header Customization
  headerTitle?: string;
  headerDescription?: string;
  headerActions?: React.ReactNode;

  // 4. Fallbacks
  fallback?: TableFallbackConfig;

  // 5. Active Filters Configuration
  filters?: FilterOption[];

  // 6. Pagination Configurations
  enablePagination?: boolean;
  defaultPageSize?: number;

  // 7.
  rowClassName?: string;
  columnClassName?: string;
}
