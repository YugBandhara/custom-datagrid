'use client';

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Column, Density, GridState, SortModel } from '@/types/grid.types';
import { User } from '@/types/api.types';

const initialState: GridState = {
  data: [],
  columns: [],
  density: "standard" as Density,
  visibleColumns: [],
  pinnedColumns: { left: [], right: [] },
  sortModel: [],
  filterModel: {},
  selectedRows: new Set(),
  pagination: { page: 0, pageSize: 25 },
  loading: false,
  error: null,
  groupOrder: [],
};

export type Action =
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

function reducer(state: GridState, action: Action): GridState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_COLUMNS':
      return { ...state, columns: action.payload };
      case "REORDER_COLUMN": {
        const { activeId, overId } = action.payload;
      
        const activeIndex = state.columns.findIndex((col) => col.field === activeId);
        const overIndex = state.columns.findIndex((col) => col.field === overId);
      
        if (activeIndex === -1 || overIndex === -1) return state;
      
        const updatedColumns = [...state.columns];
        const [movedCol] = updatedColumns.splice(activeIndex, 1);
      
        const overCol = state.columns[overIndex];
        const destinationGroup = overCol.group ?? undefined;
      
        console.log("👉 Moving column:", movedCol.field);
        console.log("🔄 Into group:", destinationGroup);
      
        // Update group of dragged column
        movedCol.group = destinationGroup;
      
        // 🔁 If destination group has pinned columns, match their pinned side
        if (destinationGroup) {
          const pinnedInGroup = state.columns.find(
            (col) => col.group === destinationGroup && col.pinned
          );
      
          if (pinnedInGroup) {
            movedCol.pinned = pinnedInGroup.pinned; // "left" or "right"
          }
        }
      
        // Re-insert the column at the new position
        updatedColumns.splice(overIndex, 0, movedCol);
      
        // Filter groupOrder to only include groups that are still used
        const usedGroups = new Set(
          updatedColumns.filter((col) => col.group).map((col) => col.group!)
        );
        const updatedGroupOrder = state.groupOrder.filter((g) => usedGroups.has(g));
      
        return {
          ...state,
          columns: updatedColumns,
          pinnedColumns: {
            left: updatedColumns.filter((col) => col.pinned === "left").map((c) => c.field),
            right: updatedColumns.filter((col) => col.pinned === "right").map((c) => c.field),
          },
          groupOrder: updatedGroupOrder,
        };
      }

    case 'SET_GROUP_ORDER':
      return { ...state, groupOrder: action.payload };

    case 'TOGGLE_COLUMN_VISIBILITY':
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.field === action.payload
            ? { ...col, visible: !col.visible }
            : col
        ),
      };
      case "TOGGLE_SORT": {
        const field = action.payload;
        const multi = action.multi ?? false;
      
        const existing = state.sortModel.find((s) => s.field === field);
      
        let newSortModel: SortModel[];
      
        if (multi) {

          newSortModel = [...state.sortModel];
        } else {

          newSortModel = state.sortModel.filter((s) => s.field === field);
        }
      
        if (!existing) {

          newSortModel.push({ field, direction: "asc" });
        } else if (existing.direction === "asc") {

          newSortModel = newSortModel.map((s) =>
            s.field === field ? { ...s, direction: "desc" } : s
          );
        } else {

          newSortModel = newSortModel.filter((s) => s.field !== field);
        }
      
        return { ...state, sortModel: newSortModel };
      }
      

    case 'SET_FILTER_MODEL':
      return { ...state, filterModel: action.payload };

    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload },
      };

    case 'SET_PAGE_SIZE':
      return {
        ...state,
        pagination: { page: 0, pageSize: action.payload },
      };
      case 'PIN_COLUMN': {
        const { field, side } = action.payload;
      
        const targetCol = state.columns.find((col) => col.field === field);
        if (!targetCol) return state;
      
        const group = targetCol.group;
      
        const updatedColumns = state.columns.map((col) => {
          // 🔒 Pin the entire group
          if (group && col.group === group) {
            if (side === null && col.field === field) {
              console.log("oinjnjn")
              // ✅ Ungroup & unpin only the target column
              return { ...col, group: null, pinned: null };
            }
      
            return { ...col, pinned: side };
          }
      
      
          // 🔒 If not in a group, just pin/unpin the target column
          if (!group && col.field === field) {
            return { ...col, pinned: side };
          }
      
          return col;
        });
      
        return {
          ...state,
          columns: updatedColumns,
          pinnedColumns: {
            left: updatedColumns.filter((col) => col.pinned === 'left').map((c) => c.field),
            right: updatedColumns.filter((col) => col.pinned === 'right').map((c) => c.field),
          },
        };
      }
      
      
      

    case 'UPDATE_COLUMN_WIDTH': {
      const { field, width } = action.payload;
      const updatedColumns = state.columns.map((col) =>
        col.field === field ? { ...col, width } : col
      );
      return {
        ...state,
        columns: updatedColumns,
      };
    }

    case 'SET_DENSITY':
      return { ...state, density: action.payload };

    case 'UPDATE_ROW': {
      const updatedRow = action.payload;
      console.log(updatedRow)
      const updatedData = state.data.map((row) =>
        row.id === updatedRow.id ? updatedRow : row
      );
      console.log(updatedData, "updatedData")
      return { ...state, data: updatedData };
    }
    case "DELETE_ROW":
      return {
        ...state,
        data: state.data.filter((row) => row.id !== action.payload),
      };
      case "UPDATE_COLUMN_GROUP": {
        const { field, group } = action.payload;
      
        const updatedColumns = state.columns.map((col) => {
          if (col.field !== field) return col;
      
          // Cannot group pinned columns
          // if (col.pinned) return { ...col, group: undefined };
      
          return { ...col, group };
        });
      
        // Clean and update groupOrder
        const activeGroups = new Set(updatedColumns.filter(c => c.group).map(c => c.group!));
        const updatedGroupOrder = [...state.groupOrder.filter(g => activeGroups.has(g))];
        if (group && !updatedGroupOrder.includes(group)) {
          updatedGroupOrder.push(group);
        }
      
        // Reorder based on groupOrder
        const grouped: Record<string, Column[]> = {};
        const ungrouped: Column[] = [];
      
        for (const col of updatedColumns) {
          if (col.group) {
            if (!grouped[col.group]) grouped[col.group] = [];
            grouped[col.group].push(col);
          } else {
            ungrouped.push(col);
          }
        }
      
        const orderedGroups = updatedGroupOrder.filter((g) => grouped[g]);
        const reorderedColumns = [
          ...orderedGroups.flatMap((g) => grouped[g]),
          ...ungrouped,
        ];
      
        return {
          ...state,
          columns: reorderedColumns,
          pinnedColumns: {
            left: reorderedColumns.filter((col) => col.pinned === "left").map((c) => c.field),
            right: reorderedColumns.filter((col) => col.pinned === "right").map((c) => c.field),
          },
          groupOrder: updatedGroupOrder,
        };
      }
      
      
      
      
    default:
      return state;
  }
}

const DataGridContext = createContext<{
  state: GridState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => { } });

export const DataGridProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DataGridContext.Provider value={{ state, dispatch }}>
      {children}
    </DataGridContext.Provider>
  );
};

export const useDataGridContext = () => useContext(DataGridContext);
