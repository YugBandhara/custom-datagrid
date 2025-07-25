'use client';

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Column } from "@/types/grid.types";
import { Checkbox } from "../ui/CheckBox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDataGridContext } from "@/contexts/DataGridContext";
import { validateField } from "@/utils/validators";
import DataGridCell from "./DataGridCell";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";

interface Props {
  id: string;
  row: any;
  columns: Column[];
  rowIndex: number;
  isSelected: boolean;
  onToggle: (id: string, checked: boolean) => void;
}

export default function DataGridRow({
  id,
  row,
  columns,
  rowIndex,
  isSelected,
  onToggle,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { state, dispatch } = useDataGridContext();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRowData, setEditRowData] = useState<any>(null);

  const style = { transform: CSS.Transform.toString(transform), transition };

  const densityClasses = {
    compact: "py-1 text-xs",
    standard: "py-2 text-sm",
    comfortable: "py-3 text-base",
  };

  // Visible columns
  const visibleColumns = useMemo(() => {
    const pinnedLeft = columns.filter(col => col.pinned === "left");
    const pinnedRight = columns.filter(col => col.pinned === "right");
    const unpinned = columns.filter(col => !col.pinned);
    return [...pinnedLeft, ...unpinned, ...pinnedRight].filter(col => col.visible !== false);
  }, [columns]);

  // Sticky offset calculations
  const leftOffsets = useMemo(() => {
    let left = 30;
    const offsets: Record<string, number> = {};
    for (const col of columns.filter(c => c.pinned === "left")) {
      offsets[col.field] = left;
      left += col.width || 150;
    }
    return offsets;
  }, [columns]);

  const rightOffsets = useMemo(() => {
    let right = 0;
    const offsets: Record<string, number> = {};
    const pinnedRight = columns.filter(c => c.pinned === "right").reverse();
    for (const col of pinnedRight) {
      offsets[col.field] = right;
      right += col.width || 150;
    }
    return offsets;
  }, [columns]);

  const handleCellClick = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleChange = (value: string) => setEditValue(value);

  const handleCommit = () => {
    if (!editingField) return;
    const validationError = validateField(editingField, editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    dispatch({ type: "UPDATE_ROW", payload: { ...row, [editingField]: editValue } });
    setEditingField(null);
    setEditValue("");
    setError(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
    setError(null);
  };

  const handleEditRow = (row: any) => {
    setEditRowData({ ...row });
    setModalOpen(true);
  };

  const handleUpdateRow = () => {
    dispatch({ type: "UPDATE_ROW", payload: editRowData });
    setModalOpen(false);
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        {...attributes}
        style={style}
        className={`border-b text-sm transition-colors duration-200 ${densityClasses[state.density]}`}
      >
        {/* Checkbox */}
        <td className="sticky left-0 z-40 w-[30px] align-middle bg-[hsl(var(--color-bg-default))] text-[hsl(var(--color-text))]">
          <div className="h-full flex items-center justify-center">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onToggle(id, !!checked)}
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>
        </td>

        {/* Data Cells */}
        {visibleColumns.map((col) => {
          const isEditing = editingField === col.field;
          const value = row[col.field];
          const width = col.width || 150;

          const stickyStyle: React.CSSProperties = {};
          if (col.pinned === "left") {
            stickyStyle.position = "sticky";
            stickyStyle.left = `${leftOffsets[col.field]}px`;
            stickyStyle.zIndex = 50;
          }
          if (col.pinned === "right") {
            stickyStyle.position = "sticky";
            stickyStyle.right = `${rightOffsets[col.field]}px`;
            stickyStyle.zIndex = 50;
          }

          return (
            <td
              key={col.field}
              className={`px-4 text-center border-r group transition-colors duration-150 
                bg-[hsl(var(--color-bg-default))] text-[hsl(var(--color-text))] 
                border-[hsl(var(--color-border))] 
                ${col.field !== "actions" ? "hover:bg-[hsl(var(--color-bg-hover))]" : ""} 
                ${isEditing ? "cursor-text" : "cursor-pointer"} 
                ${densityClasses[state.density]}`}
              style={{
                width,
                minWidth: width,
                maxWidth: width,
                borderRight: "none",
                ...stickyStyle,
              }}
              title={
                col.field === "id"
                  ? "Id cannot be edited"
                  : col.field !== "actions"
                  ? "Click to edit"
                  : ""
              }
              onClick={() => {
                if (col.field !== "id" && col.field !== "actions" && !isEditing) {
                  handleCellClick(col.field, value);
                }
              }}
            >
              <DataGridCell
                col={col}
                value={value}
                row={row}
                isEditing={isEditing}
                editValue={editValue}
                error={error}
                onChange={handleChange}
                onCommit={handleCommit}
                onCancel={handleCancel}
                onEditRow={handleEditRow}
                onDeleteRow={(id) =>
                  dispatch({ type: "DELETE_ROW", payload: id })
                }
                onViewRow={(row) => alert(`Viewing: ${row.id}`)}
                wrapperMotionProps={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                  transition: { duration: 0.2, delay: rowIndex * 0.02 },
                }}
              />
            </td>
          );
        })}
      </tr>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Edit Row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateRow();
          }}
          className="flex flex-col max-h-[90vh] w-full relative"
        >
          <div className="overflow-y-auto pr-2 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {visibleColumns
                .filter((col) => col.field !== "id" && col.field !== "actions")
                .map((col) => (
                  <div key={col.field} className="relative group">
                    <input
                      id={col.field}
                      className="peer h-12 w-full rounded-xl px-4 pt-5 pb-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        backgroundColor: "var(--color-bg-default)",
                        color: "var(--color-text)",
                        borderColor: "var(--color-border)",
                        borderWidth: "1px",
                      }}
                      value={editRowData?.[col.field] || ""}
                      placeholder=" "
                      onChange={(e) =>
                        setEditRowData((prev: any) => ({
                          ...prev,
                          [col.field]: e.target.value,
                        }))
                      }
                    />
                    <label
                      htmlFor={col.field}
                      className="absolute left-4 top-2 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm"
                      style={{ color: "var(--color-border)" }}
                    >
                      {col.headerName}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 w-full px-6 py-4 border-t flex justify-end gap-3 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]"
            style={{
              backgroundColor: "var(--color-bg-default)",
              borderColor: "var(--color-border)",
            }}
          >
            <Button type="button" variant="secondary" onClick={() => setEditRowData(row)}>
              Reset
            </Button>
            <Button type="submit" variant="default">
              Update
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
