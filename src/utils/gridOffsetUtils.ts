import { Column } from "@/types/grid.types";
import { DEFAULT_COLUMN_WIDTH, LEFT_OFFSET_START } from "../constants/DataGrid/DataGridHeader.constants";

export function getLeftOffsets(columns: Column[]): Record<string, number> {
  let left = LEFT_OFFSET_START;
  const offsets: Record<string, number> = {};

  for (const col of columns.filter((c) => c.pinned === "left")) {
    offsets[col.field] = left;
    left += col.width || DEFAULT_COLUMN_WIDTH;
  }

  return offsets;
}
export function getRightOffsets(columns: Column[]): Record<string, number> {
  let right = 0;
  const offsets: Record<string, number> = {};

  for (const col of [...columns.filter((c) => c.pinned === "right")].reverse()) {
    offsets[col.field] = right;
    right += col.width || DEFAULT_COLUMN_WIDTH;
  }

  return offsets;
}
