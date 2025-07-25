// components/DataGrid/Controls/Controls.tsx
"use client";

import React from "react";
import SearchInput from "./SearchInput";
import BulkActions from "./BulkActions";
import ExportMenu from "./ExportMenu";
import ThemeSelector from "./ThemeSelector";
import FilterToggleButton from "./FilterToggleButton";
import ColumnManager from "./ColumnManager";
import ViewManager from "./ViewManager";
import { Badge } from "@/components/ui/Badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/DropDownMenu";
import { Button } from "../ui/Button";
import { FileText } from "lucide-react";

interface ControlsProps {
  search: string;
  setSearch: (val: string) => void;
  selectedRows: string[];
  hiddenColumnsCount: number;
  filterOpen: boolean;
  setFilterOpen: (val: boolean) => void;
  data: any[];
  filteredData: any[];
  onDelete: (selected: string[]) => void;
}

export default function Controls({
  search,
  setSearch,
  selectedRows,
  hiddenColumnsCount,
  filterOpen,
  setFilterOpen,
  data,
  filteredData,
  onDelete,
}: ControlsProps) {
  return (
    <div className="flex items-center flex-wrap justify-between gap-2 w-full mb-3">
    {/* Left: Search */}
    <SearchInput value={search} onChange={setSearch} />
  
    {/* Center: Badges */}
    <div className="flex-grow flex  gap-2">
      {selectedRows.length > 0 && (
        <Badge variant="secondary">
          Selected: {selectedRows.length}
        </Badge>
      )}
      {hiddenColumnsCount > 0 && (
        <Badge variant="outline">
          Hidden Columns: {hiddenColumnsCount}
        </Badge>
      )}
    </div>
  
    {/* Right controls */}
    <div className="flex items-center gap-2 flex-wrap justify-end">
      <BulkActions selectedRows={selectedRows} data={data} onDelete={onDelete} />
      <FilterToggleButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
  
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 z-[999] p-2 space-y-1">
          <ExportMenu data={data} />
        </DropdownMenuContent>
      </DropdownMenu>
  
      <ThemeSelector />
      <ColumnManager />
      <ViewManager />
    </div>
  </div>
  
  );
}

