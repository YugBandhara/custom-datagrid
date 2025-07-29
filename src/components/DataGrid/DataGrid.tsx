"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDataGridContext } from "@/contexts/DataGridContext";
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
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";

import { getFilteredData } from "../../utils/dataGridUtils";
import { useDataGridShortcuts } from "./useDataGridShortcuts";
import Controls from "./Control";
import FilterPanel from "./FilterPanel";
import DataGridHeader from "./DataGridHeader";
import DataGridRow from "./DataGridRow";
import { Pagination } from "./Pagination";

export default function DataGrid() {
  const { state, dispatch } = useDataGridContext();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { page, pageSize } = state.pagination;
  const hasActiveFilters = Object.values(state.filterModel).some((val) => val && val !== "");

  const filteredData = getFilteredData(state.data, search, state.filterModel, state.sortModel);
  const paginatedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  const [visibleCount, setVisibleCount] = useState(pageSize / 3); // lazy show part of page
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const visibleData = paginatedData.slice(0, visibleCount);

  const allRowIds = paginatedData.map((row) => row.id.toString());
  const isAllSelected = selectedRows.length === allRowIds.length;
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected;
  const sensors = useSensors(useSensor(PointerSensor));
  const hiddenColumnsCount = state.columns.filter((col) => !col.visible).length;

  useDataGridShortcuts({
    page,
    pageSize,
    filteredLength: filteredData.length,
    allRowIds,
    selectedRows,
    setSelectedRows,
    dispatch,
    data: state.data,
  });

  // Reset visibleCount on page/pageSize change
  useEffect(() => {
    setVisibleCount(Math.min(pageSize / 3, paginatedData.length));
  }, [page, pageSize, paginatedData.length]);

  const loadMore = useCallback(() => {
    if (isLoading || visibleCount >= paginatedData.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize / 3, paginatedData.length));
      setIsLoading(false);
    }, 300);
  }, [visibleCount, paginatedData.length, pageSize, isLoading]);

  useEffect(() => {
    if (!observerRef.current) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    });

    observer.current.observe(observerRef.current);
  }, [loadMore]);

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
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full mx-auto mt-4 sm:mt-6 md:mt-8 shadow-xl rounded-lg border transition-colors duration-300">
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

      {!showFilters && hasActiveFilters && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => dispatch({ type: "SET_FILTER_MODEL", payload: {} })}
            className="text-sm text-red-600 underline hover:text-red-800 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {showFilters && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {state.columns.map((col) => (
            <FilterPanel
              key={col.field}
              column={col}
              filterValue={state.filterModel[col.field] || ""}
              onFilterChange={handleFilterChange}
            />
          ))}
        </div>
      )}

      <div className="relative max-h-[670px] overflow-x-auto overflow-y-auto border rounded-md shadow-sm">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleColumnDragEnd}
        >
          <table className="min-w-full border-collapse table-auto">
            <SortableContext
              items={state.columns.map((col) => col.field)}
              strategy={horizontalListSortingStrategy}
            >
              <thead className="sticky top-0 z-[100] bg-background">
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
                {visibleData.map((row, i) => (
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
        <div ref={observerRef} className="h-6" />
        {isLoading && (
          <div className="text-center text-sm text-gray-500 py-2">Loading more...</div>
        )}
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
