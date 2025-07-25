"use client";

import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "../ui/DropDownMenu";
import { Button } from "../ui/Button";
import { GripHorizontal } from "lucide-react";
import ExportMenu from "./ExportMenu";

export default function BulkActions({
  selectedRows,
  data,
  onDelete,
}: {
  selectedRows: string[];
  data: any[];
  onDelete: (selected: string[]) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          disabled={selectedRows.length === 0}
        >
          <GripHorizontal className="h-4 w-4" />
          Bulk Actions
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 z-[999] p-2 space-y-1">
      <ExportMenu data={data.filter((row) => selectedRows.includes(row.id?.toString()))} />
        <button
          className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-muted rounded-md transition"
          onClick={() => onDelete(selectedRows)}
        >
          Delete Selected
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
