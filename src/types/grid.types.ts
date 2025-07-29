export interface Column {
    field: string;
    headerName: string;
    width?: number;
    sortable?: boolean;
    pinned?: 'left' | 'right' | null ;
    filterable?: boolean;
    editable?: boolean;
    visible?: boolean;
    group?:string | null ;
    type?: 'text' | 'number' | 'date' | 'select' | 'actions';
  }
  
  export interface SortModel {
    field: string;
    direction: 'asc' | 'desc';
    multi?:boolean
  }
  
  export type FilterModel = Record<string, any>;
  export type Density = "compact" | "standard" | "comfortable";
  export interface PaginationState {
    page: number;
    pageSize: number;
  }
  
  export interface GridState {
    data: any[];
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