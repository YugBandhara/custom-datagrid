"use client";
import React from 'react';
import { Button } from '../../ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaginationProps } from '@/types/DataGrid/DataGridPagination.type';

import {
  DEFAULT_PAGE_SIZE_OPTIONS,
  PAGINATION_CLASSNAMES as styles,
} from "../../../constants/DataGrid/DataGridPagination.constants";

const Pagination = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  totalRows,
  className,
  rowCount,
}: PaginationProps)  =>{
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
    <div
      className={cn(styles.wrapper, className)}
    >
      <div className={styles.infoWrapper}>
        <span>
          Showing {startRow.toLocaleString()} to {endRow.toLocaleString()} of {rowCount.toLocaleString()} results
        </span>
        {totalRows !== undefined && totalRows !== rowCount && (
          <span className="ml-2 text-xs text-muted-foreground">
            (filtered from {totalRows.toLocaleString()} total)
          </span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
        <div className={styles.controlsWrapper}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFirstPage}
            disabled={page === 0}
            className={styles.button}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page === 0}
            className={styles.button}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 px-1">
            {getVisiblePages().map((pageNum, index) =>
              pageNum === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className={styles.ellipsis}
                >
                  ...
                </span>
              ) : (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(Number(pageNum))}
                  className={styles.button}
                >
                  {Number(pageNum) + 1}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className={styles.button}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLastPage}
            disabled={page >= totalPages - 1}
            className={styles.button}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>

          <span className={styles.mobilePageIndicator}>
            Page {page + 1} of {totalPages}
          </span>
        </div>

        <div className={styles.rowsPerPageWrapper}>
          <span>Rows per page:</span>
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
      </div>
    </div>
  );
}

export default Pagination
