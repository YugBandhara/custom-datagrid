import { MotionProps } from "framer-motion";
import { User } from "../api.types";
import { Column } from "../grid.types";

export interface DataGridCellProps {
    col: Column;
    value: string;
    row: User;
    isEditing: boolean;
    editValue: string;
    error?: string | null;
    onChange: (value: string) => void;
    onCommit: () => void;
    onCancel: () => void;
    wrapperMotionProps?: MotionProps;
    onEditRow?: (row: User) => void;
    onDeleteRow?: (rowId: string | number) => void;
    onViewRow?: (row: User) => void;
  }

  export interface  DataGridRowProps {
  id: string;
  row: User;
  columns: Column[];
  rowIndex: number;
  isSelected: boolean;
  onToggle: (id: string, checked: boolean) => void;
}
  