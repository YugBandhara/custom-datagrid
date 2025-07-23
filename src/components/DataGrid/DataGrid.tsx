"use client";

import React, { useState } from "react";
import { useDataGridContext } from "@/contexts/DataGridContext";
import { sortData } from "../../utils/gridHelpers";
import DataGridHeader from "./DataGridHeader";
import DataGridRow from "./DataGridRow";
import FilterPanel from "./FilterPanel";
import { BsDownload, BsSun, BsMoon, BsFilter } from "react-icons/bs";
import useTheme from "@/hooks/useTheme";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Pagination } from "./Pagination";
import { Input } from "../ui/Input";
import ColumnManager from "./ColumnManager";
import ViewManager from "./ViewManager";
import { exportCSV, exportJSON } from "../../utils/exportUtils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu";
import { Download, FileText } from "lucide-react";

export default function DataGrid() {
  const { state, dispatch } = useDataGridContext();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [showColumns, setShowColumns] = useState(false);
  const { page, pageSize } = state.pagination;

  const filteredData = sortData(
    state.data.filter((row) => {
      const matchesSearch = Object.values(row).some((val) =>
        val?.toString().toLowerCase().includes(search.toLowerCase())
      );

      const matchesFilters = Object.entries(state.filterModel).every(
        ([field, value]) => {
          if (!value) return true;
          if (field === "status") {
            return row.status?.toLowerCase() === value.toLowerCase();
          }
          return row[field]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      );

      return matchesSearch && matchesFilters;
    }),
    state.sortModel
  );

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = state.columns.findIndex((col) => col.field === active.id);
    const newIndex = state.columns.findIndex((col) => col.field === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(state.columns, oldIndex, newIndex);
      dispatch({ type: "SET_COLUMNS", payload: reordered });
    }
  };

  const paginatedData = filteredData.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleFilterChange = (field: string, value: string) => {
    dispatch({
      type: "SET_FILTER_MODEL",
      payload: {
        ...state.filterModel,
        [field]: value === "all" ? "" : value,
      },
    });
  };

  const handleClick = () => {
    setShowFilters((prev) => {
      const newState = !prev;

      if (!newState) {
        setTimeout(() => {
          dispatch({ type: "SET_FILTER_MODEL", payload: {} });
        }, 0);
      }

      return newState;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((row) => row.id.toString()));
    }
    setSelectAll(!selectAll);
  };

  const toggleRowSelect = (id: string, checked: boolean) => {
    console.log(id, "isddddd");
    setSelectedRows((prev) =>
      checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
    );
  };

  return (
    <div className="   p-10 max-w-[100%] mx-auto mt-8 shadow-xl rounded-lg border transition-colors duration-300">
      {/* Top Controls */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex gap-2 items-center w-full md:w-auto flex-1">
          <Input
            type="text"
            placeholder="🔍 Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[200px] border-muted bg-background hover:border-ring focus:border-primary transition-all"
          />
          {selectedRows.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedRows.length} selected
            </Badge>
          )}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Button variant="outline" size="sm" onClick={handleClick}>
            <BsFilter /> Filter
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">
                  Export Data
                </span>
              </div>
              <div className="flex flex-col gap-2 px-1 py-1">
                <DropdownMenuCheckboxItem
                  checked={false}
                  className="px-2 py-3 flex items-center gap-2"
                  onSelect={() => exportCSV(filteredData)}
                >
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={false}
                  className="px-2 py-3 flex items-center gap-2"
                  onSelect={() => exportJSON(filteredData)}
                >
                  <FileText className="h-4 w-4" />
                  Export as JSON
                </DropdownMenuCheckboxItem>
                <div className="px-2 py-1 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground">
                    Print Data
                  </span>
                  <DropdownMenuCheckboxItem
                    checked={false}
                    className="px-2 py-3 flex items-center gap-2"
                    onSelect={() => exportJSON(filteredData)}
                  >
                    <FileText className="h-4 w-4" />
                    Print
                  </DropdownMenuCheckboxItem>

                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={toggleTheme} variant="outline" size="sm">
            {theme === "light" ? <BsMoon /> : <BsSun />}
          </Button>

          <ColumnManager />
          <ViewManager />
        </div>
      </div>
      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {state.columns.map((col) => (
            <FilterPanel
              key={col.field}
              column={col}
              onFilterChange={handleFilterChange}
            />
          ))}
        </div>
      )}

<div className="relative max-h-[700px] overflow-x-auto overflow-y-auto border rounded-md shadow-sm">
    <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={handleColumnDragEnd}
  >
  <table className="min-w-full border-collapse">
          <SortableContext
        items={state.columns.map((col) => col.field)}
        strategy={horizontalListSortingStrategy}
       >
    <thead className="sticky top-0  bg-white dark:bg-slate-900">
      <DataGridHeader
        columns={state.columns}
        allSelected={selectAll}
        onToggleAll={toggleSelectAll}
      />
    </thead>
    </SortableContext>
    <tbody>
      {paginatedData.map((row, i) => (
        <DataGridRow
          key={row.id}
          id={row.id.toString()}
          row={row}
          rowIndex={i}
          columns={state.columns}
          isSelected={selectedRows.includes(row.id.toString())}
          onToggle={(id, checked) => toggleRowSelect(id, checked)}
        />
      ))}
    </tbody>
  </table>
  </DndContext>
</div>




      {/* </div> */}

      <Pagination
        pagination={{ page, pageSize }}
        onPageChange={(newPage) =>
          dispatch({ type: "SET_PAGE", payload: newPage })
        }
        onPageSizeChange={(newSize) =>
          dispatch({ type: "SET_PAGE_SIZE", payload: newSize })
        }
        rowCount={filteredData.length}
        totalRows={state.data.length}
      />
    </div>
  );
}
