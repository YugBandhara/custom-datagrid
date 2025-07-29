"use client";

import { Column } from "@/types/grid.types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/Select";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Filter, Search, CheckCircle, XCircle } from "lucide-react";

interface Props {
  column: Column;
  onFilterChange: (field: string, value: string) => void;
  filterValue?: string;
}

export default function FilterPanel({ column, onFilterChange, filterValue = "" }: Props) {
  if (["avatar"].includes(column.field)) return null;

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "status":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const showReset = filterValue !== "" && filterValue !== "all";

  return (
    <Card className="rounded-xl border bg-muted/30 shadow-md hover:shadow-lg transition-shadow w-full">
      <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary shrink-0" />
            <Label
              htmlFor={`filter-${column.field}`}
              className="text-sm font-semibold text-foreground"
            >
              Filter by <span className="capitalize">{column.headerName}</span>
            </Label>
          </div>

          {/* Reset Button */}
          {showReset && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-red-600 hover:underline px-1 py-0 h-auto self-end sm:self-auto"
              onClick={() => onFilterChange(column.field, "")}
            >
              Reset
            </Button>
          )}
        </div>

        {/* Filter Input */}
        {column.field === "status" ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {getFieldIcon(column.field)}
              <span className="font-medium">Select status</span>
            </div>
            <Select
              value={filterValue || "all"}
              onValueChange={(value) => {
                onFilterChange(column.field, value);
              }}
            >
              <SelectTrigger className="w-full border-muted bg-background hover:border-ring focus:ring-ring focus:ring-1 transition">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-muted">
                <SelectItem value="all" className="text-muted-foreground">
                  All status
                </SelectItem>
                <SelectItem value="active" className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-red-500" />
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-1 relative">
            <div className="relative">
              <Input
                id={`filter-${column.field}`}
                type="text"
                placeholder={`Enter ${column.headerName.toLowerCase()}...`}
                value={filterValue}
                onChange={(e) =>
                  onFilterChange(column.field, e.target.value)
                }
                className="pl-9 border-muted bg-background hover:border-ring focus:border-primary transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-xs text-muted-foreground italic pt-1 sm:pt-2">
          {column.field === "status"
            ? "Use dropdown to filter by user status"
            : `Search through ${column.headerName.toLowerCase()} values`}
        </div>
      </CardContent>
    </Card>
  );
}
