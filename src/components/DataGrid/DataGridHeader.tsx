"use client";

import React, { JSX } from "react";
import { useDataGridContext } from "@/contexts/DataGridContext";
import { Column } from "@/types/grid.types";
import { FaSort, FaSortUp, FaSortDown, FaThumbtack } from "react-icons/fa";
import { motion } from "framer-motion";
import { Checkbox } from "../ui/CheckBox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu";

interface Props {
  columns: Column[];
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
}

interface SortableHeaderCellProps {
  col: Column;
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => JSX.Element;
  leftOffset?: number;
  rightOffset?: number;
}

const SortableHeaderCell = ({
  col,
  handleSort,
  getSortIcon,
  leftOffset,
  rightOffset
}: SortableHeaderCellProps) => {
  const { dispatch } = useDataGridContext();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: col.field });

  const style: React.CSSProperties = {
    transform: col.pinned ? undefined : CSS.Transform.toString(transform),
    transition,
    width: `${col.width || 150}px`,
    minWidth: `${col.width || 150}px`,
    maxWidth: `${col.width || 150}px`,
    position: col.pinned ? "sticky" : "relative",
    top: 0,
    left: col.pinned === "left" ? `${leftOffset}px` : undefined,
    right: col.pinned === "right" ? `${rightOffset}px` : undefined,
    zIndex: col.pinned ? 40 : undefined,
// ensure pinned stays same color
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
  }[]  = [
    { name: "📌 Pin Left", value: "left", color: "default" },
    { name: "📌 Pin Right", value: "right", color: "default" },
    { name: "❌ Unpin", value: null, color: "red" },
  ];

  return (
    <motion.th
      ref={setNodeRef}
      style={style}
      className={`relative py-3 font-medium select-none whitespace-nowrap text-center border border-r group ${
        col.pinned ? "shadow-md bg-background z-40" : "bg-background"
      }`}
    >
      <div
        className="flex items-center justify-center gap-2 cursor-pointer px-2"
        onClick={(e) => {
          e.stopPropagation();
          if (col.field !== "avatar") handleSort(col.field);
        }}
      >
        <span
          {...attributes}
          {...listeners}
          className={`text-gray-500 ${
            col.pinned ? "cursor-default" : "cursor-move"
          }`}
          title="Drag to reorder"
        >
          ≡
        </span>

        <span className="flex items-center gap-1">
          {col.headerName}
          {getSortIcon(col.field)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <FaThumbtack
              className={`${
                col.pinned !== null ? "text-red-600" : ""
              } text-gray-400 hover:text-blue-500 cursor-pointer`}
              onClick={(e) => e.stopPropagation()}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <div className="px-2 py-1 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">
                Pin Options
              </span>
            </div>
            {pinOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.name}
                checked={col.pinned === option.value}
                onCheckedChange={() => handlePin(option.value)}
                className={option.color === "red" ? "text-red-500" : ""}
              >
                {option.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        onMouseDown={startResizing}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize "
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="w-1 h-6 bg-gray-300 rounded-full hover:bg-blue-500" />
      </div>
    </motion.th>
  );
};

export default function DataGridHeader({
  columns,
  allSelected,
  onToggleAll,
}: Props) {
  const { state, dispatch } = useDataGridContext();

  const pinnedLeft = columns.filter((col) => col.pinned === "left");
  const pinnedRight = columns.filter((col) => col.pinned === "right");
  const unpinned = columns.filter((col) => !col.pinned);
  const visibleColumns = [...pinnedLeft, ...unpinned, ...pinnedRight].filter(
    (col) => col.visible !== false
  );

  // Calculate left offsets
  const leftOffsets: Record<string, number> = {};
  let left = 30;
  for (const col of pinnedLeft) {
    leftOffsets[col.field] = left;
    left += col.width || 150;
  }

  // Calculate right offsets
  const rightOffsets: Record<string, number> = {};
  let right = 0;
  for (let i = pinnedRight.length - 1; i >= 0; i--) {
    const col = pinnedRight[i];
    rightOffsets[col.field] = right;
    right += col.width || 150;
  }

  const getSortIcon = (field: string): JSX.Element => {
    const sort = state.sortModel.find((s) => s.field === field);
    if (!sort) return <FaSort className="inline" />;
    return sort.direction === "asc" ? (
      <FaSortUp className="inline" />
    ) : (
      <FaSortDown className="inline" />
    );
  };

  const handleSort = (field: string) => {
    dispatch({ type: "TOGGLE_SORT", payload: field });
  };

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-[100] bg-background"
    >
      {/* Sticky Select All Checkbox */}
      <th
  
  className="sticky left-0 z-[60] bg-white dark:bg-slate-900 border-r w-[30px] min-w-[30px] max-w-[30px]"


        style={{
          left: 0,
          width: "30px",
          minWidth: "30px",
          maxWidth: "30px",
        }}
      >
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) => onToggleAll(!!checked)}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </th>

      {visibleColumns.map((col) => (
        <SortableHeaderCell
          key={col.field}
          col={col}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
          leftOffset={leftOffsets[col.field]}
          rightOffset={rightOffsets[col.field]}
        />
      ))}
    </motion.tr>
  );
}
