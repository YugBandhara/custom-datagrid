import { User } from "./api.types";

export interface Column {
    field: string;
    headerName: string;
    width?: number;
    sortable?: boolean;
    pinned?: PinSide;
    filterable?: boolean;
    editable?: boolean;
    visible?: boolean;
    group?:string | null ;
    type?: 'text' | 'number' | 'date' | 'select' | 'actions';
  }
  
  export type PinSide = "left" | "right" | null;
  export interface SortModel {
    field: string;
    direction: 'asc' | 'desc';
    multi?:boolean
  }
  
  export type FilterModel = Record<string, string>;
  export type Density = "compact" | "standard" | "comfortable";
  export interface PaginationState {
    page: number;
    pageSize: number;
  }
  
  export interface GridState {
    data: User[];
    columns: Column[];
    visibleColumns: string[];
    pinnedColumns: { left: string[]; right: string[] };
    sortModel: SortModel[];
    filterModel: FilterModel;
    selectedRows: Set<string>;
    pagination: PaginationState;
    loading: boolean;
  density: Density,
  groupOrder: string[],
    error: string | null;
  }