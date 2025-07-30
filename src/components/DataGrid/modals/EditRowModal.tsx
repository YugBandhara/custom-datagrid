"use client";

import React, { FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Column } from "@/types/grid.types";
import { User } from "@/types/api.types";
import { validateField } from "@/utils/validators";
import { EditRowModalProps } from "@/types/DataGrid/DataGridModal.types";


export default function EditRowModal({
  isOpen,
  onClose,
  columns,
  row,
  editRowData,
  setEditRowData,
  onSubmit,
  fieldErrors,
  setFieldErrors,
}:  EditRowModalProps
) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors: Record<string, string> = {};

    columns
      .filter((col) => col.field !== "id" && col.field !== "actions")
      .forEach((col) => {
        const value = editRowData?.[col.field] || "";
        const error = validateField(col.field, String(value));
        if (error) {
          hasError = true;
          newErrors[col.field] = error;
        }
      });

    if (hasError) {
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});
    if (editRowData) onSubmit(editRowData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Row">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-h-[85vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2 py-4">
          {columns
            .filter((col) => col.field !== "id" && col.field !== "actions")
            .map((col) => (
              <div key={col.field} className="relative">
                <input
                  id={col.field}
                  className="peer h-11 w-full rounded-lg px-3 pt-5 pb-1 text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "var(--color-bg-default)",
                    color: "var(--color-text)",
                    borderColor: "var(--color-border)",
                    borderWidth: "1px",
                  }}
                  value={editRowData?.[col.field] || ""}
                  placeholder=" "
                  onChange={(e) =>
                    setEditRowData((prev) => prev && { ...prev, [col.field]: e.target.value })
                  }
                />
                <label
                  htmlFor={col.field}
                  className="absolute left-3 top-2 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm"
                  style={{ color: "var(--color-border)" }}
                >
                  {col.headerName}
                </label>
                {fieldErrors[col.field] && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors[col.field]}</p>
                )}
              </div>
            ))}
        </div>

        <div className="sticky bottom-0 left-0 w-full px-4 py-3 border-t flex justify-end gap-3 bg-background shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
          <Button type="button" variant="secondary" onClick={() => setEditRowData({ ...row })}>
            Reset
          </Button>
          <Button type="submit" variant="default">
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
}
