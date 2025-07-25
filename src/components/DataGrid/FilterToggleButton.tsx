"use client";

import React from "react";
import { Button } from "../ui/Button";
import { Funnel } from "lucide-react";

export default function FilterToggleButton({
  filterOpen,
  setFilterOpen,
}: {
  filterOpen: boolean;
  setFilterOpen: (val: boolean) => void;
}) {
  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={() => setFilterOpen(!filterOpen)}
    >
      <Funnel className="h-4 w-4" />
      {filterOpen ? "Hide Filters" : "Show Filters"}
    </Button>
  );
}
