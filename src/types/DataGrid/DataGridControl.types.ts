import { User } from "../api.types";
import { Column } from "../grid.types";

export interface ControlsProps {
    search: string;
    setSearch: (val: string) => void;
    selectedRows: string[];
    hiddenColumnsCount: number;
    filterOpen: boolean;
    setFilterOpen: (val: boolean) => void;
    data: User[];
    onDelete: (selected: string[]) => void;
  }
  
  export interface FilterPannelProps {
    column: Column;
    onFilterChange: (field: string, value: string) => void;
    filterValue?: string;
  }