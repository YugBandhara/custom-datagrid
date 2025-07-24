'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '../ui/DropDownMenu';
import { Button } from '../ui/Button';
import { Grid3X3 } from 'lucide-react';
import { useDataGridContext } from '@/contexts/DataGridContext';
import { Density } from '@/types/grid.types';

// Define allowed density types
const densityOptions = ['compact', 'standard', 'comfortable'] as const;


const densityLabels: Record<Density, string> = {
  compact: 'Compact',
  standard: 'Standard',
  comfortable: 'Comfortable',
};

export default function DensitySelector() {
  const { state, dispatch } = useDataGridContext();

  const handleChange = (density: Density) => {
    dispatch({ type: 'SET_DENSITY', payload: density });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
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
