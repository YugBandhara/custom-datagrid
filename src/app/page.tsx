'use client';

import { useEffect } from 'react';
import { useApi } from '../hooks/useAPi';
import { useDataGridContext } from '@/contexts/DataGridContext';
import DataGrid from '@/components/DataGrid/DataGrid';
import '../lib/i18n';
import { useTranslation } from 'react-i18next';
export default function Page() {
  const { t } = useTranslation();
  const { data, loading, error } = useApi('/api/users');
  const { dispatch } = useDataGridContext();

  useEffect(() => {
    if (data && data.length) {
      dispatch({ type: 'SET_DATA', payload: data });
  
      const baseColumns = Object.keys(data[0]).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        visible: true,
        pinned: null,
      }));
  
      // Add actions column at the end
      const actionColumn = {
        field: "actions",
        headerName: "Actions",
        visible: true,
        pinned: "right",
      };
  
      const allColumns = [...baseColumns, actionColumn];
  
      dispatch({ type: 'SET_COLUMNS', payload: allColumns });
      dispatch({ type: 'SET_VISIBLE_COLUMNS', payload: allColumns.map((c) => c.field) });
    }
  }, [data, dispatch]);
  

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('Custom Data Grid')}</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && <DataGrid />}
    </main>
  );
}
