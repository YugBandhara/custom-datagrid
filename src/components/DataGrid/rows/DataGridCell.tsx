'use client';

import React from "react";
import { motion } from "framer-motion";
import { Input } from "../../ui/Input";
import { Pencil, Eye, Trash } from "lucide-react";
import { Button } from "../../ui/Button";
import { DataGridCellProps } from "@/types/DataGrid/DataGridRow.types";


const  DataGridCell = ({
  col,
  value,
  row,
  isEditing,
  editValue,
  error,
  onChange,
  onCommit,
  onCancel,
  wrapperMotionProps,
  onEditRow,
  onDeleteRow,
  onViewRow
}: DataGridCellProps) =>{
  const field = col.field;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onCommit();
    if (e.key === "Escape") onCancel();
  };

  const renderEditCell = () => (
    <motion.span className="flex flex-col items-center" {...wrapperMotionProps}>
      <Input
        autoFocus
        value={editValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={handleKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-center"
      />
      {error && <motion.span className="text-red-500 text-xs mt-1">{error}</motion.span>}
    </motion.span>
  );

  const renderPencilIcon = () => (
    <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
  );

  const renderAvatar = () => (
    <motion.span className="flex justify-center items-center gap-1 group">
      <motion.img
        layoutId={`avatar-${row.id}`}
        src={value}
        alt="avatar"
        className="w-8 h-8 rounded-full object-cover mx-auto"
      />
      {renderPencilIcon()}
    </motion.span>
  );

  const renderStatus = () => {
    const status = value?.toLowerCase();
    const isActive = status === "active";

    return (
      <motion.span className="flex justify-center group">
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold flex items-center justify-center gap-1 ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value}
          {renderPencilIcon()}
        </span>
      </motion.span>
    );
  };

  const renderActions = () => (
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

  const renderDefaultCell = () => (
    <motion.span
      className="flex items-center justify-center gap-1 group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      {...wrapperMotionProps}
    >
      <span className="truncate">{value}</span>
      {field !== "id" && field !== "actions" && renderPencilIcon()}
    </motion.span>
  );

  if (isEditing) return renderEditCell();
  if (field === "avatar" && typeof value === "string") return renderAvatar();
  if (typeof value === "string" && ["active", "inactive"].includes(value.toLowerCase()))
    return renderStatus();
  if (field === "actions") return renderActions();

  return renderDefaultCell();
}

export default DataGridCell

