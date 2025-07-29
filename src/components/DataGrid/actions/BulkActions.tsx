"use client";

import React, { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "../../ui/DropDownMenu";
import { Button } from "../../ui/Button";
import { GripHorizontal, Trash } from "lucide-react";

import ExportMenuButtons from "./ExportMenuButtons";
import ExportMenuDropdown from "./ExportMenuDropdown";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { User } from "@/types/api.types";

export default function BulkActions({
  selectedRows,
  data,
  onDelete,
}: {
  selectedRows: string[];
  data: User[];
  onDelete: (selected: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1330px)");
  const isResponsive = isMobile || isTablet;

  const filteredData = data.filter((row) =>
    selectedRows.includes(row.id?.toString())
  );

  const handleDropDown = () => {
  
    setOpen(false); // Close the dropdown
  };

  if (isResponsive) {
    return (
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <ExportMenuButtons data={filteredData} />

        <button
          className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-muted rounded-md transition"
          onClick={() => {
            onDelete(selectedRows);
            handleDropDown(); // This will close the dropdown
          }}
        >
          <Trash className="h-4 w-4" />
          Delete Selected
        </button>
      </div>

    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 w-full sm:w-auto"
          disabled={selectedRows.length === 0}
        >
          <GripHorizontal className="h-4 w-4" />
          Bulk Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 z-[999] p-2 space-y-1">
        <ExportMenuDropdown data={filteredData} handleDropDown={handleDropDown} />
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button
            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-muted rounded-md transition"
            onClick={() => {onDelete(selectedRows); handleDropDown();}}
          >
            <Trash className="h-4 w-4" />
            Delete Selected
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
