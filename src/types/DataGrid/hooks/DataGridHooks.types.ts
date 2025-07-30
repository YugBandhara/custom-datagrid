
import { DataGridAction } from "@/contexts/DataGrid/dataGridTypes";
import { User } from "@/types/api.types";
import { Dispatch, SetStateAction } from "react";

export interface UseDataGridShortcutsProps {
    page: number;
    pageSize: number;
    filteredLength: number;
    allRowIds: string[];
    selectedRows: string[];
    setSelectedRows: Dispatch<SetStateAction<string[]>>;
    dispatch: React.Dispatch<DataGridAction>;
    data: User[];
  };