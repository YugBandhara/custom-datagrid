"use client";

import React from "react";
import { Checkbox } from "../../ui/CheckBox";
import { SelectableHeaderCellsProps } from "@/types/DataGrid/DataGridHeader.types";

const SelectableHeaderCell = ({ allSelected, isIndeterminate, onToggleAll }: SelectableHeaderCellsProps) => (
  <th
    className="sticky left-0 z-[101] bg-[hsl(var(--grid-header))] w-[30px] min-w-[30px] max-w-[30px]"
    style={{ left: 0 }}
  >
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggleAll();
      }}
      className="flex items-center justify-center cursor-pointer"
    >
      <Checkbox
        checked={allSelected ? true : isIndeterminate ? "indeterminate" : false}
        onCheckedChange={() => {}}
        onPointerDown={(e) => e.preventDefault()}
      />
    </div>
  </th>
);

export default SelectableHeaderCell;
