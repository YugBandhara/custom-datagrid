"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal, Pin, Group } from "lucide-react";

import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu";
import { useDataGridContext } from "@/contexts/DataGridContext";
import { Column } from "@/types/grid.types";

interface SortableHeaderCellProps {
  col: Column;
  handleSort: (e: React.MouseEvent<HTMLDivElement>, field: string) => void
  getSortIcon: (field: string) => React.ReactNode;
  leftOffset: number;
  rightOffset: number;
}

const SortableHeaderCell = ({
  col,
  handleSort,
  getSortIcon,
  leftOffset,
  rightOffset,
}: SortableHeaderCellProps) => {
  const { dispatch } = useDataGridContext();

  const isDraggable = col.field !== "avatar";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: col.field, disabled: !isDraggable });

  const style: React.CSSProperties = {
    transform: col.pinned || !isDraggable ? undefined : CSS.Transform.toString(transform),
    transition: transform ? "transform 0.2s ease" : undefined,
    willChange: "transform",
    width: `${col.width || 150}px`,
    minWidth: `${col.width || 150}px`,
    maxWidth: `${col.width || 150}px`,
    position: col.pinned ? "sticky" : "relative",
    top: 0,
    left: col.pinned === "left" ? `${leftOffset}px` : undefined,
    right: col.pinned === "right" ? `${rightOffset}px` : undefined,
    zIndex: col.pinned ? 40 : undefined,
    backfaceVisibility: "hidden",
    transformStyle: "preserve-3d",
  };
  

  const handlePin = (side: "left" | "right" | null) => {
    dispatch({ type: "PIN_COLUMN", payload: { field: col.field, side } });
  };

  const startResizing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = col.width || 150;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(startWidth + (e.clientX - startX), 50);
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

  const pinOptions:{
    name: string;
    value: "left" | "right" | null;
    color: string;
  }[] = [
    { name: "📌 Pin Left", value: "left", color: "default" },
    { name: "📌 Pin Right", value: "right", color: "default" },
    { name: "❌ Unpin", value: null, color: "red" },
  ];

  return (
<motion.th
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className={`relative py-2 sm:py-3 text-xs sm:text-sm select-none whitespace-nowrap text-center group ${
        col.pinned
          ? "shadow-md bg-[hsl(var(--grid-header))] z-40"
          : "bg-[hsl(var(--grid-header))]"
      }`}
    >
      <div
        className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2 cursor-pointer flex-wrap sm:flex-nowrap"
        onClick={(e) => {
          e.stopPropagation();
          if (col.field !== "avatar") handleSort(e,col.field);
        }}
      >
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

        <span className="flex items-center gap-1 truncate max-w-[120px] sm:max-w-none">
  {col.headerName}
  {!(col.field === "avatar" || col.field === "actions") && getSortIcon(col.field)}
</span>
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
  <DropdownMenuContent
    align="end"
    className="w-48 max-w-[90vw] max-h-[70vh] overflow-auto sm:w-48 sm:max-w-none z-[999] px-2 py-2 text-sm"
  >
    <div className="px-2 py-1 border-b border-border">
      <span className="text-xs font-medium text-muted-foreground">More Actions</span>
    </div>

    <div className="px-2 pt-2 pb-1 text-xs text-muted-foreground font-semibold">Group</div>
    {["General", "Contact", "Employment", "Actions", null].map((group) => (
      <DropdownMenuCheckboxItem
        key={group ?? "none"}
        checked={col.group === group}
        onCheckedChange={() =>
          dispatch({
            type: "UPDATE_COLUMN_GROUP",
            payload: { field: col.field, group },
          })
        }
      >
        <Group className="mr-2 h-4 w-4" />
        {group ?? "No Group"}
      </DropdownMenuCheckboxItem>
    ))}

    <div className="px-2 pt-3 pb-1 text-xs text-muted-foreground font-semibold border-t border-border mt-2">
      Pin
    </div>
    {pinOptions.map((option) => (
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

      </div>

      {/* Resize handle */}
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
