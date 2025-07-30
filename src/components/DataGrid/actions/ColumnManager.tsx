"use client";

import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "../../ui/DropDownMenu";
import { Button } from "../../ui/Button";
import { Eye } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Checkbox } from "../../ui/CheckBox";
import { useDataGridContext } from "@/contexts/DataGrid/DataGridContext";

export default function ColumnManager() {
  const { state, dispatch } = useDataGridContext();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1330px)");

  useEffect(() => {
    const allHidden = state.columns.every((col) => col.visible === false);

    if (allHidden) {
      const resetColumns = state.columns.map((col) => ({
        ...col,
        visible: true,
      }));

      const alreadyReset = state.columns.every((col) => col.visible);
      if (!alreadyReset) {
        dispatch({ type: "SET_COLUMNS", payload: resetColumns });
      }
    }
  }, [state.columns, dispatch]);

  const onToggleColumn = (field: string) => {
    dispatch({
      type: "TOGGLE_COLUMN_VISIBILITY",
      payload: field,
    });
  };

  const ColumnOptions = (
    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto w-fit  px-1 py-2">
      {state.columns.map((column) => (
        <div key={column.field} className="flex items-center gap-2">
          <Checkbox
            checked={column.visible}
            onCheckedChange={() => onToggleColumn(column.field)}
          />
          <span className="text-sm">{column.headerName}</span>
        </div>
      ))}
    </div>
  );

  return isMobile || isTablet ? (
    <div className="flex flex-col items-start gap-2 mt-2">

      {ColumnOptions}
    </div>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto ">
          <Eye className="h-4 w-4 mr-2 " />
          Columns
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 z-[999] max-h-64 overflow-y-auto"
      >
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
