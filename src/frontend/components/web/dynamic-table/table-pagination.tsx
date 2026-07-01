import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../../ui/button";

interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  pageCount: number;
  onPageChange: (index: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({
  pageIndex,
  pageSize,
  totalRecords,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const startOffset = totalRecords === 0 ? 0 : pageIndex * pageSize + 1;
  const endOffset = Math.min((pageIndex + 1) * pageSize, totalRecords);

  const canPrevious = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  return (
    <div className="h-12 border-t border-border-primary flex items-center justify-between px-4 bg-muted text-xs font-semibold text-muted-foreground select-none">
      {/* 1. Left side info indicator */}
      <div className="flex items-center gap-1">
        <span>Showing</span>
        <span className="text-foreground font-bold">{startOffset}</span>
        <span>to</span>
        <span className="text-foreground font-bold">{endOffset}</span>
        <span>of</span>
        <span className="text-foreground font-bold">{totalRecords}</span>
        <span>records</span>
      </div>

      {/* 2. Middle pagination buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(0)}
          disabled={!canPrevious}
          className="w-7 h-7 rounded-lg"
        >
          <ChevronsLeft size={14} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={!canPrevious}
          className="w-7 h-7 rounded-lg"
        >
          <ChevronLeft size={14} />
        </Button>

        {/* Page counter display */}
        <span className="px-2 text-[11px] font-bold text-foreground">
          Page {pageIndex + 1} of {Math.max(1, pageCount)}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={!canNext}
          className="w-7 h-7 rounded-lg"
        >
          <ChevronRight size={14} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(pageCount - 1)}
          disabled={!canNext}
          className="w-7 h-7 rounded-lg"
        >
          <ChevronsRight size={14} />
        </Button>
      </div>

      {/* 3. Right side page size selector */}
      <div className="flex items-center gap-2">
        <span>Page Size</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-7 border border-border-primary rounded-xl bg-background px-2 py-0 text-xs font-semibold text-foreground focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} rows
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
