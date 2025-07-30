import { useDataGridContext } from "@/contexts/DataGrid/DataGridContext";


export const useDataGrid = () => {
  const { state, dispatch } = useDataGridContext();
  return { state, dispatch };
};


