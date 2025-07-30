"use client";

import React from "react";
import { Button } from "../../ui/Button";
import { Funnel } from "lucide-react";

const  FilterToggleButton = ({
  filterOpen,
  setFilterOpen,
}: {
  filterOpen: boolean;
  setFilterOpen: (val: boolean) => void;
}) =>{
  return (
    <Button
    size="sm"
    variant="outline" className="gap-2 w-full sm:w-auto" 
      onClick={() => setFilterOpen(!filterOpen)}
    >
      <Funnel className="h-4 w-4" />
      {filterOpen ? "Hide Filters" : "Show Filters"}
    </Button>
  );
}
export default FilterToggleButton