"use client";

import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

import GroupHeaderRow from "./GroupHeaderRow";
import SelectableHeaderCell from "./SelectableHeaderCell";
import SortableHeaderCell from "./SortableHeaderCell";
import { DataGridHeaderProps } from "../../../types/DataGrid/DataGridHeader.types";
import { getLeftOffsets, getRightOffsets } from "@/utils/gridOffsetUtils";
import { useDataGridContext } from "@/contexts/DataGrid/DataGridContext";

const  DataGridHeader = ({
  columns,
  allSelected,
  onToggleAll,
  isIndeterminate,
}: DataGridHeaderProps)=> {
  const { state, dispatch } = useDataGridContext();

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => col.visible !== false);
  }, [columns]);

  const pinnedLeft = useMemo(() => visibleColumns.filter((col) => col.pinned === "left"), [visibleColumns]);
  const pinnedRight = useMemo(() => visibleColumns.filter((col) => col.pinned === "right"), [visibleColumns]);
  const unpinned = useMemo(() => visibleColumns.filter((col) => !col.pinned), [visibleColumns]);

  const orderedColumns = useMemo(() => [...pinnedLeft, ...unpinned, ...pinnedRight], [
    pinnedLeft,
    unpinned,
    pinnedRight,
  ]);

 
  const leftOffsets = useMemo(
    () => getLeftOffsets(pinnedLeft),
    [pinnedLeft]
  );

  const rightOffsets = useMemo(
    () => getRightOffsets(pinnedRight),
    [pinnedRight]
  );
  

  const groupedColumns = useMemo(() => {
    return orderedColumns.reduce((acc, col) => {
      const group = col.group || "Ungrouped";
      if (!acc[group]) acc[group] = [];
      acc[group].push(col);
      return acc;
    }, {} as Record<string, typeof columns>);
  }, [orderedColumns]);


  const getSortIcon = useCallback(
    (field: string) => {
      const sort = state.sortModel.find((s) => s.field === field);
      if (!sort) return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground" />;

      return sort.direction === "asc" ? (
        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      );
    },
    [state.sortModel]
  );

  const handleSort = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, field: string) => {
      dispatch({ type: "TOGGLE_SORT", payload: field, multi: e.shiftKey });
    },
    [dispatch]
  );

  return (
    <>
      <GroupHeaderRow
        groupedColumns={groupedColumns}
        leftOffsets={leftOffsets}
        rightOffsets={rightOffsets}
      />

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
export default DataGridHeader
