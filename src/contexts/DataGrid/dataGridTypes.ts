// contexts/data-grid/dataGridTypes.ts
import { Column, Density, GridState, SortModel } from "@/types/grid.types";
import { User } from "@/types/api.types";

export type DataGridAction =
  | { type: 'SET_DATA'; payload: GridState['data'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COLUMNS'; payload: Column[] }
  | { type: 'REORDER_COLUMN'; payload: { activeId: string; overId: string } }
  | { type: 'SET_GROUP_ORDER'; payload: string[] }
  | { type: 'TOGGLE_COLUMN_VISIBILITY'; payload: string }
  | { type: 'TOGGLE_SORT'; payload: string; multi?: boolean }
  | { type: 'SET_FILTER_MODEL'; payload: Record<string, string> }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'PIN_COLUMN'; payload: { field: string; side: 'left' | 'right' | null } }
  | { type: 'UPDATE_COLUMN_WIDTH'; payload: { field: string; width: number } }
  | { type: 'SET_DENSITY'; payload: Density }
  | { type: 'UPDATE_ROW'; payload: User }
  | { type: 'DELETE_ROW'; payload: string | number }
  | { type: 'UPDATE_COLUMN_GROUP'; payload: { field: string; group: string | null } };

export interface DataGridContextType {
  state: GridState;
  dispatch: React.Dispatch<DataGridAction>;
}
