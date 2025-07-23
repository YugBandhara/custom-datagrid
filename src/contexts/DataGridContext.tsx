'use client';

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Density, GridState } from '@/types/grid.types';

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
};

type Action = { type: string; payload?: any };

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

    case 'TOGGLE_COLUMN_VISIBILITY':
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.field === action.payload
            ? { ...col, visible: !col.visible }
            : col
        ),
      };

    case 'TOGGLE_SORT': {
      const field = action.payload;
      const existing = state.sortModel.find((s) => s.field === field);
      let newSortModel = [...state.sortModel];

      if (existing) {
        if (existing.direction === 'asc') {
          existing.direction = 'desc';
        } else {
          newSortModel = newSortModel.filter((s) => s.field !== field);
        }
      } else {
        newSortModel.push({ field, direction: 'asc' });
      }

      return { ...state, sortModel: [...newSortModel] };
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

      const updatedColumns = state.columns.map((col) => {
        if (col.field !== field) return col;

        if (side === null && !col.pinned) return col;
        if ((side === 'left' || side === 'right') && col.pinned === side) return col;

        return { ...col, pinned: side };
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
      console.log(updatedData,"updatedData")
      return { ...state, data: updatedData };
    }
    case "DELETE_ROW":
      return {
        ...state,
        data: state.data.filter((row) => row.id !== action.payload),
      };
    
    default:
      return state;
  }
}

const DataGridContext = createContext<{
  state: GridState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export const DataGridProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DataGridContext.Provider value={{ state, dispatch }}>
      {children}
    </DataGridContext.Provider>
  );
};

export const useDataGridContext = () => useContext(DataGridContext);
