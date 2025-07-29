'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePaginatedApi } from '../hooks/usePaginatedApi';
import { useDataGridContext } from '@/contexts/DataGridContext';
import DataGrid from '@/components/DataGrid/DataGrid';
import DataGridSkeleton from '@/components/DataGrid/DataGridSkeleton';
import { Table } from 'lucide-react';

export default function Page() {
  const { data, loading, error, loadMore, hasMore } = usePaginatedApi('/api/users', 20);
  const { dispatch } = useDataGridContext();
  const loaderRef = useRef(null);

  useEffect(() => {
    if (data.length) {
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
   
    }
  }, [data]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    },
    {
      root: null,
      rootMargin: '200px', 
      threshold: 0.1,
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  return (
    <main className="p-4 space-y-6">
      <div className="flex items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
          <Table size={28} className="text-gray-700 dark:text-gray-300" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Custom Data Grid
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            View, filter, and manage dynamic data with responsive design.
          </p>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {loading && data.length === 0 ? (
        <DataGridSkeleton rows={10} columns={6} />
      ) : (
        <>
  
          <DataGrid />
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
            </div>
          )}

        </>
      )}
    </main>
  );
}
