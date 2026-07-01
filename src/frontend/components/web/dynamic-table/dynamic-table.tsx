import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { makeApiRequest } from "../../../services/makeApiRequest";
import { TableHeader } from "./table-header";
import { TablePagination } from "./table-pagination";
import { TableFallback, type TableFallbackConfig } from "./table-fallback";
import type {
  DynamicTableProps,
  FetchParams,
} from "../../../types/dynamicTableTypes";

export function DynamicTable<TData>({
  endpoint,
  queryKey,
  columns,
  headerTitle,
  headerDescription,
  headerActions,
  fallback,
  filters = [],
  enablePagination = true,
  defaultPageSize = 10,
  rowClassName,
  columnClassName: _columnClassName,
}: DynamicTableProps<TData>) {
  // 1. Layout Local States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  // 2. Sync React Query Fetch parameters
  const fetchParams: FetchParams = useMemo(() => {
    return {
      pageIndex,
      pageSize,
      sorting: sorting.map((s) => ({ id: s.id, desc: s.desc })),
      filters: activeFilters,
    };
  }, [pageIndex, pageSize, sorting, activeFilters]);

  // 3. Data Fetcher wrapper
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [...queryKey, fetchParams],
    queryFn: async () => {
      if (typeof endpoint === "function") {
        return await endpoint(fetchParams);
      } else {
        // Fallback calling central axios instance makeApiRequest helper
        return await makeApiRequest<{ data: TData[]; total: number }>({
          url: endpoint,
          method: "GET",
          params: {
            page: pageIndex + 1,
            limit: pageSize,
            sort:
              sorting.length > 0
                ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
                : undefined,
            ...activeFilters,
          },
        });
      }
    },
  });

  const tableData = data?.data ?? [];
  const totalRecords = data?.total ?? 0;
  const pageCount = Math.ceil(totalRecords / pageSize);

  // 4. Initialize TanStack table
  const table = useReactTable({
    data: tableData,
    columns,
    pageCount,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  // Filter actions
  const handleFilterChange = (columnId: string, value: any) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === undefined || value === "") {
        delete next[columnId];
      } else {
        next[columnId] = value;
      }
      return next;
    });
    setPageIndex(0); // Reset page index when filter is adjusted
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setPageIndex(0);
  };

  // Determine active fallback display state
  const isNoResults =
    !isLoading &&
    !isError &&
    tableData.length === 0 &&
    Object.keys(activeFilters).length > 0;
  const isNoData =
    !isLoading &&
    !isError &&
    tableData.length === 0 &&
    Object.keys(activeFilters).length === 0;

  return (
    <div className=" bg-card  shadow-sm overflow-hidden flex flex-col w-full animate-in fade-in-0 duration-300 relative">
      {/* Table Header controls */}
      {(headerTitle ||
        headerDescription ||
        filters.length > 0 ||
        headerActions) && (
        <TableHeader
          title={headerTitle}
          description={headerDescription}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          headerActions={headerActions}
        />
      )}

      {/* Main Table view container */}
      <div className="flex-1 overflow-x-auto relative min-h-[300px]">
        {isLoading ? (
          <TableFallback type="loading" columnCount={columns.length} />
        ) : isError ? (
          <TableFallback
            type="error"
            onRetry={refetch}
            customConfig={fallback}
          />
        ) : isNoResults ? (
          <TableFallback
            type="no-results"
            onClearFilters={handleClearFilters}
          />
        ) : isNoData ? (
          <TableFallback type="no-data" customConfig={fallback} />
        ) : (
          <table className="w-full text-left border-collapse select-text relative">
            <thead className="sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className={`border-b  border-border-primary  text-xs font-bold text-muted-foreground select-none ${rowClassName}`}
                >
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`py-3 px-4 select-none ${isSortable ? "cursor-pointer hover:bg-muted/20 hover:text-foreground" : ""}`}
                      >
                        <div className="flex items-center gap-1">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}

                          {/* Sort direction icons */}
                          {isSortable && (
                            <span className="text-muted-foreground/60">
                              {sortDirection === "asc" ? (
                                <ArrowUp size={12} />
                              ) : sortDirection === "desc" ? (
                                <ArrowDown size={12} />
                              ) : (
                                <ArrowUpDown
                                  size={12}
                                  className="opacity-0 group-hover:opacity-100"
                                />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border-primary text-xs font-medium text-foreground">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-muted/10 transition-colors select-text ${rowClassName || ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3.5 px-4 select-text">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer pagination selectors */}
      {enablePagination && !isLoading && !isError && tableData.length > 0 && (
        <TablePagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalRecords={totalRecords}
          pageCount={pageCount}
          onPageChange={setPageIndex}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageIndex(0);
          }}
        />
      )}
    </div>
  );
}
export type { TableFallbackConfig };
