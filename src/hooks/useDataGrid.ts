import { useDataGridContext } from '../contexts/DataGridContext';

export const useDataGrid = () => {
  const { state, dispatch } = useDataGridContext();
  return { state, dispatch };
};


