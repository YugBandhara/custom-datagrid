"use client";

import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useDataGridContext } from "@/contexts/DataGridContext";
import SortableHeaderCell from "./SortableHeaderCell";
import SelectableHeaderCell from "./SelectableHeaderCell";
import GroupHeaderRow from "./GroupHeaderRow";
import { Column } from "@/types/grid.types";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  columns: Column[];
  allSelected: boolean;
  onToggleAll: () => void;
  isIndeterminate?: boolean;
}

export default function DataGridHeader({
  columns,
  allSelected,
  onToggleAll,
  isIndeterminate,
}: Props) {
  const { state, dispatch } = useDataGridContext();

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible !== false),
    [columns]
  );

  const pinnedLeft = useMemo(() => visibleColumns.filter((col) => col.pinned === "left"), [visibleColumns]);
  const pinnedRight = useMemo(() => visibleColumns.filter((col) => col.pinned === "right"), [visibleColumns]);
  const unpinned = useMemo(() => visibleColumns.filter((col) => !col.pinned), [visibleColumns]);
  const orderedColumns = [...pinnedLeft, ...unpinned, ...pinnedRight];

  const leftOffsets = useMemo(() => {
    let left = 30;
    const offsets: Record<string, number> = {};
    for (const col of pinnedLeft) {
      offsets[col.field] = left;
      left += col.width || 150;
    }
    return offsets;
  }, [pinnedLeft]);

  const rightOffsets = useMemo(() => {
    let right = 0;
    const offsets: Record<string, number> = {};
    for (let i = pinnedRight.length - 1; i >= 0; i--) {
      const col = pinnedRight[i];
      offsets[col.field] = right;
      right += col.width || 150;
    }
    return offsets;
  }, [pinnedRight]);

  const groupedColumns = useMemo(() => {
    return orderedColumns.reduce((acc, col) => {
      const group = col.group || "Ungrouped";
      if (!acc[group]) acc[group] = [];
      acc[group].push(col);
      return acc;
    }, {} as Record<string, Column[]>);
  }, [orderedColumns]);

  const getSortIcon = useCallback(
    (field: string) => {
      const sort = state.sortModel.find((s) => s.field === field);
      if (!sort) {
        return (
          <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        );
      }
  
      return sort.direction === "asc" ? (
        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      );
    },
    [state.sortModel]
  );

  const handleSort = useCallback(
    (e: React.MouseEvent<HTMLDivElement>,field: string) => {
      dispatch({ type: "TOGGLE_SORT", payload: field , multi:e.shiftKey });
    },
    [dispatch]
  );

  return (
    <>
      {/* Optional Group Header Row */}
      <GroupHeaderRow
        groupedColumns={groupedColumns}
        leftOffsets={leftOffsets}
        rightOffsets={rightOffsets}
      />

      {/* Header Row */}
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-[100] bg-[hsl(var(--grid-header))] overflow-x-auto"
      >
        <SelectableHeaderCell
          allSelected={allSelected}
          isIndeterminate={isIndeterminate}
          onToggleAll={onToggleAll}
        />

        {orderedColumns.map((col) => (
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
    </>
  );
}
