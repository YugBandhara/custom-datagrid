'use client';

import { useEffect, useRef, useMemo } from 'react';
import { usePaginatedApi } from '../hooks/usePaginatedApi';

import DataGrid from '@/components/DataGrid/core/DataGrid';
import DataGridSkeleton from '@/components/DataGrid/core/DataGridSkeleton';
import { Table } from 'lucide-react';
import { useDataGridContext } from '@/contexts/DataGrid/DataGridContext';

export default function Page() {
  const { data, loading, error, loadMore, hasMore } = usePaginatedApi('/api/users', 20);
  const { dispatch } = useDataGridContext();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const columns = useMemo(() => {
    if (!data.length) return [];

    const baseColumns = Object.keys(data[0]).map((key) => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      visible: true,
      pinned: null,
      group: null,
    }));

    return [
      ...baseColumns,
      {
        field: 'actions',
        headerName: 'Actions',
        visible: true,
        pinned: null,
        group: null,
      },
    ];
  }, [data]);


  useEffect(() => {
    if (!data.length) return;

    dispatch({ type: 'SET_DATA', payload: data });
    dispatch({ type: 'SET_COLUMNS', payload: columns });
  }, [data, columns, dispatch]);


  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  return (
    <main className="p-4 space-y-6">
      <div className="flex items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="p-3 rounded-full bg-background">
          <Table size={28} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Custom Data Grid</h1>
          <p className="text-sm sm:text-base">
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
