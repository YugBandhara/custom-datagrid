"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "../ui/DropDownMenu";
import { Button } from "../ui/Button";
import { Grid3X3 } from "lucide-react";
import { useDataGridContext } from "@/contexts/DataGridContext";
import { Density } from "@/types/grid.types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Define allowed density types
const densityOptions = ["compact", "standard", "comfortable"] as const;

const densityLabels: Record<Density, string> = {
  compact: "Compact",
  standard: "Standard",
  comfortable: "Comfortable",
};

export default function DensitySelector() {
  const { state, dispatch } = useDataGridContext();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1330px)");

  const handleChange = (density: Density) => {
    dispatch({ type: "SET_DENSITY", payload: density });
  };

  const DensityOptions = (
    <div className="flex flex-col gap-2 mt-2">
      {densityOptions.map((densityOption) => (
        <button
          key={densityOption}
          onClick={() => handleChange(densityOption)}
          className="flex items-center gap-2 px-3 py-1 border rounded-md text-sm w-full bg-background text-foreground"
        >
          <Grid3X3 className="h-4 w-4" />
          {densityLabels[densityOption]}
          {state.density === densityOption && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
        </button>
      ))}
    </div>
  );

  return isMobile || isTablet ? (
    // 📱 Show as inline buttons
    <div className="flex flex-col items-start gap-2">
  
      {DensityOptions}
    </div>
  ) : (
    // 🖥️ Use dropdown on desktop
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
        {densityOptions.map((densityOption) => (
          <DropdownMenuCheckboxItem
            key={densityOption}
            checked={state.density === densityOption}
            onCheckedChange={() => handleChange(densityOption)}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            {densityLabels[densityOption]}
            {state.density === densityOption && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
