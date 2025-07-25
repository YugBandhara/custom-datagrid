'use client';

import React, { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '../ui/DropDownMenu';
import { Button } from '../ui/Button';
import { Eye } from 'lucide-react';
import { useDataGridContext } from '@/contexts/DataGridContext';

export default function ColumnManager() {
  const { state, dispatch } = useDataGridContext();
  useEffect(() => {
    const allHidden = state.columns.every((col) => col.visible === false);
  
    if (allHidden) {
      const resetColumns = state.columns.map((col) => ({
        ...col,
        visible: true,
      }));
  
      const alreadyReset = state.columns.every((col) => col.visible);
      if (!alreadyReset) {
        dispatch({ type: 'SET_COLUMNS', payload: resetColumns });
      }
    }
  }, [state.columns, dispatch]);


  const onToggleColumn = (field: string) => {
    dispatch({
      type: 'TOGGLE_COLUMN_VISIBILITY',
      payload: field,
    });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-[999]">
        <div className="px-2 py-1 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground">
            Show/Hide Columns
          </span>
        </div>
        {state.columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.field}
            checked={column.visible}
            onCheckedChange={() => onToggleColumn(column.field)}
          >
            {column.headerName}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
