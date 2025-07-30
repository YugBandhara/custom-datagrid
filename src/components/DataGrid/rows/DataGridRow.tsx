"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Column } from "@/types/grid.types";
import { Checkbox } from "../../ui/CheckBox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { validateField } from "@/utils/validators";

import Modal from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { User } from "../../../types/api.types"
import DataGridCell from "./DataGridCell";
import { DENSITY_CLASSESS } from "@/constants/DataGrid/DataGridRows.constants";
import { getLeftOffsets, getRightOffsets } from "@/utils/gridOffsetUtils";
import EditRowModal from "../modals/EditRowModal";
import ViewRowModal from "../modals/ViewRowModal";
import { DataGridRowProps } from "@/types/DataGrid/DataGridRow.types";
import { useDataGridContext } from "@/contexts/DataGrid/DataGridContext";

const DataGridRow = ({
  id,
  row,
  columns,
  rowIndex,
  isSelected,
  onToggle,
}: DataGridRowProps)  =>{
  const { attributes, setNodeRef, transform, transition } =
    useSortable({ id });
  const { state, dispatch } = useDataGridContext();
  const [viewRowData, setViewRowData] = useState<User>();
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRowData, setEditRowData] = useState<User>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const style = { transform: CSS.Transform.toString(transform), transition };
  const visibleColumns = useMemo(() => {
    const pinnedLeft = columns.filter((col) => col.pinned === "left");
    const pinnedRight = columns.filter((col) => col.pinned === "right");
    const unpinned = columns.filter((col) => !col.pinned);
    return [...pinnedLeft, ...unpinned, ...pinnedRight].filter(
      (col) => col.visible !== false
    );
  }, [columns]);


  const leftOffsets = useMemo(
    () => getLeftOffsets(columns),
    [columns]
  );

  const rightOffsets = useMemo(
    () => getRightOffsets(columns),
    [columns]
  );


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

    dispatch({
      type: "UPDATE_ROW",
      payload: { ...row, [editingField]: editValue },
    });
    setEditingField(null);
    setEditValue("");
    setError(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
    setError(null);
  };

  const handleEditRow = (row: User) => {
    setEditRowData({ ...row });
    setModalOpen(true);
  };

  const handleUpdateRow = () => {
    if (!editRowData) return;
    dispatch({ type: "UPDATE_ROW", payload: editRowData });
    setModalOpen(false);
  };

  return (
    <>
      <motion.tr
        ref={setNodeRef}
        {...attributes}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, delay: rowIndex * 0.015 }}
        style={style}
        className={`border-b text-sm transition-colors duration-200 ${DENSITY_CLASSESS[state.density]
          }`}
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
                ${col.field !== "actions"
                  ? "hover:bg-[hsl(var(--color-bg-hover))]"
                  : ""
                } 
                ${isEditing ? "cursor-text" : "cursor-pointer"} 
                ${DENSITY_CLASSESS[state.density]}`}
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
                if (
                  col.field !== "id" &&
                  col.field !== "actions" &&
                  !isEditing
                ) {
                  handleCellClick(col.field, String(value));
                }
              }}
            >
              <DataGridCell
                col={col}
                value={String(value)}
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
                onViewRow={(row) => {
                  console.log(row)
                  setViewRowData(row);
                  setViewModalOpen(true);
                }}

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
      </motion.tr>

      <EditRowModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        columns={visibleColumns}
        row={row}
        editRowData={editRowData}
        setEditRowData={setEditRowData}
        onSubmit={handleUpdateRow}
        fieldErrors={fieldErrors}
        setFieldErrors={setFieldErrors}
      />

      <ViewRowModal
        isOpen={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        user={viewRowData}
      />
    </>
  );
}

export default DataGridRow
