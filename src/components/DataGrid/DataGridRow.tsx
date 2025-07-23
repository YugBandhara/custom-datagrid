'use client';

import React, { useState } from "react";
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const { state, dispatch } = useDataGridContext();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRowData, setEditRowData] = useState<any>(null);

  const pinnedLeft = columns.filter((col) => col.pinned === "left");
  const pinnedRight = columns.filter((col) => col.pinned === "right");
  const unpinned = columns.filter((col) => !col.pinned);
  const visibleColumns = [...pinnedLeft, ...unpinned, ...pinnedRight].filter(
    (col) => col.visible !== false
  );

  const leftOffsets: Record<string, number> = {};
  let left = 30;
  for (const col of pinnedLeft) {
    leftOffsets[col.field] = left;
    left += col.width || 150;
  }

  const rightOffsets: Record<string, number> = {};
  let right = 0;
  for (let i = pinnedRight.length - 1; i >= 0; i--) {
    const col = pinnedRight[i];
    rightOffsets[col.field] = right;
    right += col.width || 150;
  }

  const densityClasses = {
    compact: "py-1 text-xs",
    standard: "py-2 text-sm",
    comfortable: "py-3 text-base",
  };

  const handleCellClick = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleEditRow = (row: any) => {
    setEditRowData({ ...row }); // clone to avoid mutation
    setModalOpen(true);
  };

  const handleUpdateRow = () => {
    dispatch({ type: "UPDATE_ROW", payload: editRowData });
    setModalOpen(false);
  };

  const handleChange = (value: string) => {
    setEditValue(value);
  };

  const handleCommit = () => {
    if (!editingField) return;

    const validationError = validateField(editingField, editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const updatedRow = { ...row, [editingField]: editValue };
    dispatch({ type: "UPDATE_ROW", payload: updatedRow });
    setEditingField(null);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
    setError(null);
  };

  return (
    <>
   <tr
  ref={setNodeRef}
  // style={style}
  className={`border-b text-sm text-gray-800 dark:text-gray-100 
    hover:bg-gray-100 dark:hover:bg-slate-800 
    transition-colors duration-200 ${densityClasses[state.density]}`}
>

  <td
            className="sticky left-0 z-40 bg-white dark:bg-slate-900 w-[30px] border-r border-gray-200 align-middle"
            style={{ boxShadow: "2px 0 5px -2px rgba(0,0,0,0.08)" }}
          >
  <div className="flex items-center justify-center h-full ">
    <Checkbox
      checked={isSelected}
      onCheckedChange={(checked) => onToggle(id, !!checked)}
      onPointerDown={(e) => e.stopPropagation()}
    />
  </div>
</td>


  {/* Data Cells */}
  {visibleColumns.map((col) => {
    const value = row[col.field];
    const width = col.width || 150;
    const isEditing = editingField === col.field;

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
        className={` px-4 text-center border-r border-slate-200 dark:border-slate-700 
          bg-white dark:bg-slate-900 group transition-colors duration-150
          ${isEditing ? "cursor-text" : "cursor-pointer"} 
          ${col.field !== "actions" ? "hover:bg-slate-100 dark:hover:bg-slate-800" : ""} 
          ${densityClasses[state.density]}`}
        style={{
          width: `${width}px`,
          minWidth: `${width}px`,
          maxWidth: `${width}px`,
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
            handleCellClick(col.field, row[col.field]);
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
          wrapperMotionProps={{
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.2, delay: rowIndex * 0.02 },
          }}
          onDeleteRow={(id) =>
            dispatch({ type: "DELETE_ROW", payload: id })
          }
          onViewRow={(row) => alert(`Viewing: ${row.id}`)}
        />
      </td>
    );
  })}
</tr>


      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Row"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateRow();
          }}
          className="relative flex flex-col max-h-[90vh] w-full"
        >
          {/* Scrollable Form Area */}
          <div className="overflow-y-auto pr-2 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {visibleColumns
                .filter((col) => col.field !== "id" && col.field !== "actions")
                .map((col) => (
                  <div key={col.field} className="relative group">
                    <input
                      id={col.field}
                      className="peer h-12 w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 pt-5 pb-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="absolute left-4 top-2 text-xs text-gray-500 dark:text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400"
                    >
                      {col.headerName}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditRowData(row)}
            >
              Reset
            </Button>
            <Button variant="default" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Modal>


    </>
  );
}
