"use client";

import React from "react";
import { DropdownMenuCheckboxItem } from "../ui/DropDownMenu";
import { FileText } from "lucide-react";
import { exportCSV, exportJSON } from "@/utils/exportUtils";

interface ExportMenuProps {
  data: any[]; // either all data or selected rows
}

const ExportMenu: React.FC<ExportMenuProps> = ({ data }) => {
  return (
    <>
      <DropdownMenuCheckboxItem
        checked={false}
        onSelect={() => exportCSV(data)}
        className="px-2 py-2 flex items-center gap-2"
      >
        <FileText className="h-4 w-4 text-blue-500" />
        Export as CSV
      </DropdownMenuCheckboxItem>

      <DropdownMenuCheckboxItem
        checked={false}
        onSelect={() => exportJSON(data)}
        className="px-2 py-2 flex items-center gap-2"
      >
        <FileText className="h-4 w-4 text-green-500" />
        Export as JSON
      </DropdownMenuCheckboxItem>
    </>
  );
};

export default ExportMenu;
