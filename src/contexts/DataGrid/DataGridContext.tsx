// contexts/data-grid/DataGridContext.tsx
'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DataGridContextType } from './dataGridTypes';
import { dataGridReducer, initialGridState } from './dataGridReducer';

const DataGridContext = createContext<DataGridContextType>({
  state: initialGridState,
  dispatch: () => {},
});

export const DataGridProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dataGridReducer, initialGridState);

  return (
    <DataGridContext.Provider value={{ state, dispatch }}>
      {children}
    </DataGridContext.Provider>
  );
};

export const useDataGridContext = () => useContext(DataGridContext);
