import { CSS, type Transform } from "@dnd-kit/utilities";
import { Column } from "@/types/grid.types";
import { DEFAULT_COLUMN_WIDTH } from "../constants/DataGrid/DataGridHeader.constants";

export const getHeaderCellStyle = (
  col: Column,
  transform: Transform | null,
  isDraggable: boolean,
  leftOffset: number,
  rightOffset: number
): React.CSSProperties => {
  const style: React.CSSProperties = {
    transition: transform ? "transform 0.2s ease" : undefined,
    willChange: "transform",
    width: `clamp(80px, ${col.width || DEFAULT_COLUMN_WIDTH}px, 300px)`,
    minWidth: "80px",
    position: col.pinned ? "sticky" : "relative",
    top: 0,
    left: col.pinned === "left" ? `${leftOffset}px` : undefined,
    right: col.pinned === "right" ? `${rightOffset}px` : undefined,
    zIndex: col.pinned ? 40 : undefined,
    backfaceVisibility: "hidden",
    transformStyle: "preserve-3d",
  };

  if (!col.pinned && isDraggable && transform) {
    style.transform = CSS.Transform.toString(transform);
  }

  return style;
};
