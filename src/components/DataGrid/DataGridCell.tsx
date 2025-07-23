'use client';

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { Input } from "../ui/Input";
import { Pencil, Eye, Trash } from "lucide-react";
import { Column } from "@/types/grid.types";
import { Button } from "../ui/Button";

interface Props {
  col: Column;
  value: any;
  row: any;
  isEditing: boolean;
  editValue: string;
  error?: string | null;
  onChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  wrapperMotionProps?: MotionProps;

  // Optional props for actions
  onEditRow?: (row: any) => void;
  onDeleteRow?: (rowId: string | number) => void;
  onViewRow?: (row: any) => void;
}

export default function DataGridCell({
  col,
  value,
  row,
  isEditing,
  editValue,
  error,
  onChange,
  onCommit,
  onCancel,
  onEditRow,
  onDeleteRow,
  onViewRow,
  wrapperMotionProps
}: Props) {
  // Render input if cell is being edited
  if (isEditing) {
    return (
      <motion.span className="flex flex-col items-center">
        <Input
          autoFocus
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onCommit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommit();
            if (e.key === "Escape") onCancel();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-center"
        />
        {error && <motion.span className="text-red-500 text-xs mt-1">{error}</motion.span>}
      </motion.span>
    );
  }

  // Avatar display
  if (col.field === "avatar" && typeof value === "string") {
    return (
      <motion.span className="flex justify-center items-center gap-1 group">
        <motion.img
          layoutId={`avatar-${row.id}`}
          src={value}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover mx-auto"
        />
        <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </motion.span>
    );
  }

  // Status badge
  const isStatus =
    typeof value === "string" &&
    (value.toLowerCase() === "active" || value.toLowerCase() === "inactive");

  if (isStatus) {
    return (
      <motion.span className="flex justify-center group">
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold flex items-center justify-center gap-1 ${
            value.toLowerCase() === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
          <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </span>
      </motion.span>
    );
  }

  // Action buttons
  if (col.field === "actions") {
    return (
      <motion.span className="flex justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewRow?.(row);
          }}
        >
          <Eye className="w-2 h-2" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEditRow?.(row);
          }}
        >
          <Pencil className="w-2 h-2" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRow?.(row.id);
          }}
        >
          <Trash className="w-2 h-2" />
        </Button>
      </motion.span>
    );
  }

  // Default cell display
  return (
    <motion.span
      className="flex items-center justify-center gap-1 group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <span className="truncate">{value}</span>
      {col.field !== "id" && col.field !== "actions" && (
        <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </motion.span>
  );
}
