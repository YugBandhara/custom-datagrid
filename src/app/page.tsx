'use client';

import { useEffect } from 'react';
import { useApi } from '../hooks/useAPi';
import { useDataGridContext } from '@/contexts/DataGridContext';
import DataGrid from '@/components/DataGrid/DataGrid';
import { Table } from 'lucide-react';

export default function Page() {
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
        group: null,
      }));

      const actionColumn = {
        field: "actions",
        headerName: "Actions",
        visible: true,
        pinned: null,
        group: null,
      };

      const allColumns = [...baseColumns, actionColumn];

      dispatch({ type: 'SET_COLUMNS', payload: allColumns });
      dispatch({ type: 'SET_VISIBLE_COLUMNS', payload: allColumns.map((c) => c.field) });
    }
  }, [data, dispatch]);

  return (
    <main className="p-4">
          <div className="flex items-center gap-4">
        <div className="p-3 rounded-full">
          <Table size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Custom Data Grid
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View, filter, and manage dynamic data with responsive design.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {/* Spinner */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500"></div>
          </div>


          <div className="space-y-3">
            {Array.from({ length: 15 }).map((_, idx) => (
              <div key={idx} className="grid grid-cols-10 gap-4">
                {Array.from({ length: 10 }).map((_, colIdx) => (
                  <div
                    key={colIdx}
                    className="h-10 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <DataGrid />
      )}
    </main>
  );
}
