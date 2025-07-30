import { PaginationState } from "../grid.types";

export interface PaginationProps {
    pagination: PaginationState;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
    totalRows?: number;
    className?: string;
    rowCount: number;
  }