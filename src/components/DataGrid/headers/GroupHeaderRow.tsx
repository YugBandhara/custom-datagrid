"use client";

import React from "react";
import { Column } from "@/types/grid.types";

interface Props {
  groupedColumns: Record<string, Column[]>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
}

const GroupHeaderRow = ({ groupedColumns, leftOffsets, rightOffsets }: Props) => {
  return (
    <tr className="bg-muted dark:bg-muted text-sm font-semibold border-b">
      <th className="sticky left-0 z-[60] bg-muted" style={{ left: 0 }} />
      {Object.entries(groupedColumns).map(([group, cols]) => {
        const pinnedSide = cols[0].pinned;
        const firstField = cols[0].field;
        const lastField = cols[cols.length - 1].field;
        const style: React.CSSProperties = {
          position: pinnedSide ? "sticky" : "relative",
          left: pinnedSide === "left" ? `${leftOffsets[firstField] || 0}px` : undefined,
          right: pinnedSide === "right" ? `${rightOffsets[lastField] || 0}px` : undefined,
          zIndex: pinnedSide ? 50 : undefined,
          background: "inherit",
        };
        return (
          <th
            key={group}
            colSpan={cols.length}
            className="text-center px-2 py-2 border-r text-muted-foreground"
            style={style}
          >
            {group}
          </th>
        );
      })}
    </tr>
  );
};

export default GroupHeaderRow;
