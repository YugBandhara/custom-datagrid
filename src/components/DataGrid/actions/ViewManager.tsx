"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "../../ui/DropDownMenu";
import { Button } from "../../ui/Button";
import { Grid3X3 } from "lucide-react";
import { Density } from "@/types/grid.types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DENSITY_LABELS,DENSITY_OPTIONS } from "@/constants/DataGrid/DataGridActions.constants";
import { useDataGridContext } from "@/contexts/DataGrid/DataGridContext";

export default function DensitySelector() {
  const { state, dispatch } = useDataGridContext();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1330px)");

  const handleChange = (density: Density) => {
    dispatch({ type: "SET_DENSITY", payload: density });
  };

  const DensityOptions = (
    <div className="flex flex-col gap-2 mt-2">
      {DENSITY_OPTIONS.map((DENSITY_OPTIONS) => (
        <button
          key={DENSITY_OPTIONS}
          onClick={() => handleChange(DENSITY_OPTIONS)}
          className="flex items-center gap-2 px-3 py-1 border rounded-md text-sm w-full bg-background text-foreground"
        >
          <Grid3X3 className="h-4 w-4" />
          {DENSITY_LABELS[DENSITY_OPTIONS]}
          {state.density === DENSITY_OPTIONS && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
        </button>
      ))}
    </div>
  );

  return isMobile || isTablet ? (
    <div className="flex flex-col items-start gap-2">
  
      {DensityOptions}
    </div>
  ) : (

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Grid3X3 className="h-4 w-4 mr-2" />
          Density
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 z-[999]">
        <div className="px-2 py-1 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground">
            Select Row Density
          </span>
        </div>
        {DENSITY_OPTIONS.map((DENSITY_OPTIONS) => (
          <DropdownMenuCheckboxItem
            key={DENSITY_OPTIONS}
            checked={state.density === DENSITY_OPTIONS}
            onCheckedChange={() => handleChange(DENSITY_OPTIONS)}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            {DENSITY_LABELS[DENSITY_OPTIONS]}
            {state.density === DENSITY_OPTIONS && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
