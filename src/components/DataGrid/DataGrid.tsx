"use client";

import React, { useState } from "react";
import { useDataGridContext } from "@/contexts/DataGridContext";
import { sortData } from "../../utils/gridHelpers";
import DataGridHeader from "./DataGridHeader";
import DataGridRow from "./DataGridRow";
import FilterPanel from "./FilterPanel";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import Controls from "./Control";
import { Pagination } from "./Pagination";
import { AnimatePresence } from "framer-motion";

export default function DataGrid() {
  const { state, dispatch } = useDataGridContext();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { page, pageSize } = state.pagination;

  const filteredData = sortData(
    state.data.filter((row) => {
      const matchesSearch = Object.values(row).some((val) =>
        val?.toString().toLowerCase().includes(search.toLowerCase())
      );
      const matchesFilters = Object.entries(state.filterModel).every(([field, value]) => {
        if (!value) return true;
        if (field === "status") {
          return row.status?.toLowerCase() === value.toLowerCase();
        }
        return row[field]?.toString().toLowerCase().includes(value.toLowerCase());
      });
      return matchesSearch && matchesFilters;
    }),
    state.sortModel
  );

  const paginatedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);
  const allRowIds = paginatedData.map((row) => row.id.toString());
  const isAllSelected = selectedRows.length === allRowIds.length;
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected;
  const sensors = useSensors(useSensor(PointerSensor));
  const hiddenColumnsCount = state.columns.filter((col) => !col.visible).length;

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    dispatch({
      type: "REORDER_COLUMN",
      payload: {
        activeId: active.id,
        overId: over.id,
      },
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    dispatch({
      type: "SET_FILTER_MODEL",
      payload: {
        ...state.filterModel,
        [field]: value === "all" ? "" : value,
      },
    });
  };

  const toggleSelectAll = () => {
    setSelectedRows(isAllSelected || isIndeterminate ? [] : allRowIds);
  };

  const toggleRowSelect = (id: string, checked: boolean) => {
    setSelectedRows((prev) =>
      checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
    );
  };

  return (
    <div className="p-10 max-w-[100%] mx-auto mt-8 shadow-xl rounded-lg border transition-colors duration-300">
      <Controls
        search={search}
        setSearch={setSearch}
        selectedRows={selectedRows}
        hiddenColumnsCount={hiddenColumnsCount}
        filterOpen={showFilters}
        setFilterOpen={setShowFilters}
        data={state.data}
        filteredData={filteredData}
        onDelete={() => {
          const remaining = state.data.filter(
            (row) => !selectedRows.includes(row.id.toString())
          );
          dispatch({ type: "SET_DATA", payload: remaining });
          setSelectedRows([]);
        }}
      />

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
              <thead className="sticky top-0 z-[100] bg-white dark:bg-slate-900">
                <DataGridHeader
                  columns={state.columns}
                  allSelected={isAllSelected}
                  onToggleAll={toggleSelectAll}
                  isIndeterminate={isIndeterminate}
                />
              </thead>
            </SortableContext>
            <tbody>
            <AnimatePresence initial={false}>
              {paginatedData.map((row, i) => (
                <DataGridRow
                  key={row.id}
                  id={row.id.toString()}
                  row={row}
                  rowIndex={i}
                  columns={state.columns}
                  isSelected={selectedRows.includes(row.id.toString())}
                  onToggle={toggleRowSelect}
                />
              ))}
              </AnimatePresence>
            </tbody>
          </table>
        </DndContext>
      </div>

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