"use client";

import React from 'react';
import { PaginationState } from '@/types/grid.types';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  totalRows?: number;
  className?: string;
  rowCount:number;
}

export function Pagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  totalRows,
  className,
  rowCount
}: PaginationProps) {
  const { page, pageSize } = pagination;
  const totalPages = Math.ceil(rowCount / pageSize);
  const startRow = page * pageSize + 1;
  const endRow = Math.min((page + 1) * pageSize, rowCount);

  const handleFirstPage = () => onPageChange(0);
  const handlePreviousPage = () => onPageChange(Math.max(0, page - 1));
  const handleNextPage = () => onPageChange(Math.min(totalPages - 1, page + 1));
  const handleLastPage = () => onPageChange(totalPages - 1);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(0, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 1) {
      rangeWithDots.push(0);
      if (range[0] > 2) {
        rangeWithDots.push('...');
      }
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages - 2) {
      if (range[range.length - 1] < totalPages - 3) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages - 1);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn(
      "flex items-center justify-between gap-4 px-4 py-3 border-t border-grid-border bg-card",
      className
    )}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Showing {startRow.toLocaleString()} to {endRow.toLocaleString()} of {rowCount.toLocaleString()} results
        </span>
        {totalRows !== undefined && totalRows !== rowCount && (
          <span className="text-xs">(filtered from {totalRows.toLocaleString()} total)</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={handleFirstPage} disabled={page === 0} className="h-8 w-8 p-0">
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 0} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {getVisiblePages().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">...</span>
              );
            }

            const pageIndex = pageNum as number;
            return (
              <Button
                key={pageIndex}
                variant={pageIndex === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageIndex)}
                className="h-8 w-8 p-0"
              >
                {pageIndex + 1}
              </Button>
            );
          })}
        </div>

        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page >= totalPages - 1} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={handleLastPage} disabled={page >= totalPages - 1} className="h-8 w-8 p-0">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}