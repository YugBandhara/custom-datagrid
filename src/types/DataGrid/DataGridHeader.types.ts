import { Column } from "@/types/grid.types";

export interface DataGridHeaderProps {
  columns: Column[];
  allSelected: boolean;
  onToggleAll: () => void;
  isIndeterminate?: boolean;
}

export  interface SortableHeaderCellProps {
  col: Column;
  handleSort: (e: React.MouseEvent<HTMLDivElement>, field: string) => void;
  getSortIcon: (field: string) => React.ReactNode;
  leftOffset: number;
  rightOffset: number;
}
export interface DraggableGroupHeaderProps {
  group: string;
  colSpan: number;
}

export interface GroupHeaderRowProps {
  groupedColumns: Record<string, Column[]>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
}

export interface SelectableHeaderCellsProps {
  allSelected: boolean;
  isIndeterminate?: boolean;
  onToggleAll: () => void;
}


