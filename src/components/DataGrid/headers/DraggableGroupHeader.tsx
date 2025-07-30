import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DraggableGroupHeaderProps } from "@/types/DataGrid/DataGridHeader.types";


const DraggableGroupHeader: React.FC<DraggableGroupHeaderProps> = ({
  group,
  colSpan,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `group-${group}`, // ensure ID is unique and doesn't clash with column IDs
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      colSpan={colSpan}
      className="text-center px-2 py-2 border-r border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 select-none cursor-move"
      {...attributes}
      {...listeners}
    >
      {group}
    </th>
  );
};

export default DraggableGroupHeader;
