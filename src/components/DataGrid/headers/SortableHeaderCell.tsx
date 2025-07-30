"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { MoreHorizontal, Pin, Group } from "lucide-react";
import { Button } from "../../ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/DropDownMenu";

import { PinSide } from "@/types/grid.types";
import { PIN_OPTIONS, COLUMN_GROUPS, DEFAULT_COLUMN_WIDTH, MIN_COLUMN_WIDTH } from "../../../constants/DataGrid/DataGridHeader.constants";
import { SortableHeaderCellProps } from "@/types/DataGrid/DataGridHeader.types";
import { getHeaderCellStyle } from "@/utils/getHeaderCellStyle";
import { useDataGridContext } from "@/contexts/DataGrid/DataGridContext";
  
const SortableHeaderCell = ({
  col,
  handleSort,
  getSortIcon,
  leftOffset,
  rightOffset,
}: SortableHeaderCellProps) => {
  const { dispatch } = useDataGridContext();
  const isDraggable = col.field !== "avatar";

  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: col.field,
    disabled: !isDraggable,
  });

  const style = getHeaderCellStyle(col, transform, isDraggable, leftOffset, rightOffset);

  const handlePin = (side: PinSide) => {
    dispatch({ type: "PIN_COLUMN", payload: { field: col.field, side } });
  };

  const startResizing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = col.width || DEFAULT_COLUMN_WIDTH;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(startWidth + (e.clientX - startX), MIN_COLUMN_WIDTH);
      dispatch({
        type: "UPDATE_COLUMN_WIDTH",
        payload: { field: col.field, width: newWidth },
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <motion.th
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className={`relative py-2 sm:py-3 text-xs sm:text-sm select-none whitespace-nowrap text-center group ${
        col.pinned ? "shadow-md bg-[hsl(var(--grid-header))] z-40" : "bg-[hsl(var(--grid-header))]"
      }`}
    >
      <div className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2 cursor-pointer flex-wrap sm:flex-nowrap max-w-full overflow-hidden">
        <span
          {...(isDraggable ? attributes : {})}
          {...(isDraggable ? listeners : {})}
          className={`text-gray-400 ${
            col.pinned || !isDraggable ? "cursor-default" : "cursor-move"
          }`}
          title={isDraggable ? "Drag to reorder" : ""}
        >
          ≡
        </span>

        <div
          className="flex items-center gap-1 truncate max-w-full sm:max-w-none"
          onClick={(e) => {
            e.stopPropagation();
            if (col.field !== "avatar") handleSort(e, col.field);
          }}
        >
          <span className="truncate">{col.headerName}</span>
          {!(col.field === "avatar" || col.field === "actions") && getSortIcon(col.field)}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 z-[9999] max-h-[70vh] overflow-auto px-2 py-2 text-sm">
            <div className="px-2 py-1 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">More Actions</span>
            </div>

            <div className="px-2 pt-2 pb-1 text-xs text-muted-foreground font-semibold">Group</div>
            {COLUMN_GROUPS.map((group) => (
              <DropdownMenuCheckboxItem
                key={group ?? "none"}
                checked={col.group === group}
                onCheckedChange={() =>
                  dispatch({ type: "UPDATE_COLUMN_GROUP", payload: { field: col.field, group } })
                }
              >
                <Group className="mr-2 h-4 w-4" />
                {group ?? "No Group"}
              </DropdownMenuCheckboxItem>
            ))}

            <div className="px-2 pt-3 pb-1 text-xs text-muted-foreground font-semibold border-t border-border mt-2">
              Pin
            </div>
            {PIN_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.name}
                checked={col.pinned === option.value}
                onCheckedChange={() => handlePin(option.value)}
                className={option.color === "red" ? "text-red-500" : ""}
              >
                <Pin className="mr-2 h-4 w-4" />
                {option.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {col.pinned && <Pin className="text-red-500 h-3 w-3 cursor-default" />}
      </div>

      <div
        onMouseDown={startResizing}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="w-1 h-6 bg-border rounded-full hover:bg-primary" />
      </div>
    </motion.th>
  );
};

export default SortableHeaderCell;
