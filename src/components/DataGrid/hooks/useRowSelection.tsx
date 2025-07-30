import { useCallback, useState } from "react";

 const  useRowSelection = (allRowIds: string[]) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const isAllSelected = selectedRows.length === allRowIds.length;
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected;

  const toggleSelectAll = useCallback(() => {
    setSelectedRows(isAllSelected || isIndeterminate ? [] : allRowIds);
  }, [isAllSelected, isIndeterminate, allRowIds]);

  const toggleRowSelect = useCallback((id: string, checked: boolean) => {
    setSelectedRows((prev) =>
      checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
    );
  }, []);

  return { selectedRows, setSelectedRows, isAllSelected, isIndeterminate, toggleSelectAll, toggleRowSelect };
}
export default useRowSelection
