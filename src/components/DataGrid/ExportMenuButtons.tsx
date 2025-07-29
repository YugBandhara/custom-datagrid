"use client";
import React from "react";
import { FileText } from "lucide-react";
import { exportCSV, exportJSON } from "@/utils/exportUtils";

const ExportMenuButtons = ({ data }: { data: any[] }) => {
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => exportCSV(data)}
        className="px-3 py-2 flex items-center gap-2 rounded-md text-sm hover:bg-muted transition"
      >
        <FileText className="h-4 w-4 text-blue-500" />
        Export as CSV
      </button>
      <button
        onClick={() => exportJSON(data)}
        className="px-3 py-2 flex items-center gap-2 rounded-md text-sm hover:bg-muted transition"
      >
        <FileText className="h-4 w-4 text-green-500" />
        Export as JSON
      </button>
    </div>
  );
};

export default ExportMenuButtons;
