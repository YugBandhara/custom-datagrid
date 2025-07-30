"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "@/contexts/ThemeContext";
import { UseDataGridShortcutsProps } from "@/types/DataGrid/hooks/DataGridHooks.types";


const useDataGridShortcuts = ({
  page,
  pageSize,
  filteredLength,
  allRowIds,
  selectedRows,
  setSelectedRows,
  dispatch,
  data,
}: UseDataGridShortcutsProps) => {
  const { setThemeManually } = useTheme();

  useHotkeys(["ctrl+right", "meta+right"], () => {
    if ((page + 1) * pageSize < filteredLength) {
      dispatch({ type: "SET_PAGE", payload: page + 1 });
    }
  });

  useHotkeys(["ctrl+left", "meta+left"], () => {
    if (page > 0) {
      dispatch({ type: "SET_PAGE", payload: page - 1 });
    }
  });

  useHotkeys(["ctrl+shift+a", "meta+shift+a"], () => {
    setSelectedRows(allRowIds);
  });

  useHotkeys("esc", () => {
    setSelectedRows([]);
  });

  useHotkeys(["ctrl+shift+1", "meta+shift+1"], () => {
    setThemeManually("dark");
  });

  useHotkeys(["ctrl+shift+2", "meta+shift+2"], () => {
    setThemeManually("light");
  });

  useHotkeys(["del", "meta+backspace"], () => {
    if (selectedRows.length > 0) {
      const remaining = data.filter(
        (row) => !selectedRows.includes(row.id.toString())
      );
      dispatch({ type: "SET_DATA", payload: remaining });
      setSelectedRows([]);
    }
  });
};

export default useDataGridShortcuts
