"use client";

import React, { useEffect, useState } from "react";
import SearchInput from "../filters/SearchInput";
import BulkActions from "../actions/BulkActions";
import ExportMenuDropdown from "../actions/ExportMenuDropdown";
import ExportMenuButtons from "../actions/ExportMenuButtons";

import FilterToggleButton from "../filters/FilterToggleButton";
import ColumnManager from "../actions/ColumnManager";


import { Badge } from "@/components/ui/Badge";
import { Button } from "../../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/DropDownMenu";

import { FileText, Settings } from "lucide-react";
import { BsPalette } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { useDataGridContext } from "@/contexts/DataGridContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { User } from "@/types/api.types";
import ThemeSelector from "../theme/ThemeSelector";
import ThemeToggle from "../theme/ThemeToggle";
import ViewManager from "../actions/ViewManager";

interface ControlsProps {
  search: string;
  setSearch: (val: string) => void;
  selectedRows: string[];
  hiddenColumnsCount: number;
  filterOpen: boolean;
  setFilterOpen: (val: boolean) => void;
  data: User[];
  onDelete: (selected: string[]) => void;
}

export default function Controls({
  search,
  setSearch,
  selectedRows,
  hiddenColumnsCount,
  filterOpen,
  setFilterOpen,
  data,
  onDelete,
}: ControlsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { dispatch } = useDataGridContext();

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1330px)");
    const [open, setOpen] = useState(false);

  const handleDropDown = () => {
    setOpen(false)
  };
  

  useEffect(() => {
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = drawerOpen ? "hidden" : originalOverflow;
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!isTablet && drawerOpen) setDrawerOpen(false);
  }, [isTablet, drawerOpen]);

  return (
    <>
      {/* 🌗 Always show ThemeToggle on top-right */}
      <div className="flex justify-end w-full mb-2">
        <ThemeToggle />
      </div>

      {/* 🔧 Controls Layout */}
      <div className="flex  sm:flex-row sm:items-center gap-3 w-full mb-4">
        {/* 🔍 Search Input */}
        <div className="w-full sm:w-auto">
          <SearchInput value={search} onChange={setSearch}  />
        </div>

        {/* Middle Flexible Space (only on tablet & up) */}
        <div className="flex-1 hidden sm:block" />

        {/* 🧰 Right Controls */}
        <div className="flex flex-wrap gap-2 items-center justify-end w-full sm:w-auto">
          {!isMobile && (
            <>
              {selectedRows.length > 0 && (
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  Selected: {selectedRows.length}
                </Badge>
              )}
              {hiddenColumnsCount > 0 && (
                <Badge variant="outline" className="text-xs sm:text-sm">
                  Hidden Columns: {hiddenColumnsCount}
                </Badge>
              )}
            </>
          )}

          {!isTablet ? (
            <>
              <BulkActions
                selectedRows={selectedRows}
                data={data}
                onDelete={onDelete}
              />
              <FilterToggleButton
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
              />
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 z-[999] p-2 space-y-1"
                >
                  <ExportMenuDropdown data={data} handleDropDown={handleDropDown} />
                </DropdownMenuContent>
              </DropdownMenu>
              <ColumnManager />
              <ViewManager />
              <ThemeSelector />
            </>
          ) : (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setDrawerOpen(true)}
            >
              <Settings className="h-4 w-4" />
              Options
            </Button>
          )}
        </div>
      </div>

      {/* 🎬 Overlay Backdrop */}
      {drawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-background z-[999]"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* 📱 Slide-in Drawer for Tablet/Mobile */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-80 h-full bg-background shadow-lg z-[1000] border-l p-4 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Grid Options</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDrawerOpen(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {hiddenColumnsCount > 0 && (
                <Badge variant="outline" className="text-xs sm:text-sm">
                  Hidden Columns: {hiddenColumnsCount}
                </Badge>
              )}

              <div onClick={() => setDrawerOpen(false)}>
                <h3 className="text-sm font-semibold mb-2">Filters</h3>
                <FilterToggleButton
                  filterOpen={filterOpen}
                  setFilterOpen={setFilterOpen}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Bulk Actions</h3>
                <p className="text-sm italic text-muted-foreground px-2 py-1 bg-muted rounded-md">
                  Action only on selected rows
                </p>
                {selectedRows.length > 0 && (
                  <BulkActions
                    selectedRows={selectedRows}
                    data={data}
                    onDelete={onDelete}
                  />
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Export</h3>
                <ExportMenuButtons data={data} />
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <BsPalette className="h-4 w-4" />
                  <h3 className="text-sm font-semibold mb-2">Theme</h3>
                </div>
                <ThemeSelector />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Columns</h3>
                <ColumnManager />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Density</h3>
                <ViewManager />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
