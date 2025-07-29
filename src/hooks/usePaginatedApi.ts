import { useState, useEffect, useCallback } from "react";

export function usePaginatedApi(url: string, limit: number = 20) {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`${url}?page=${page}&limit=${limit}`);
      const newData = await res.json();

      if (newData.length < limit) setHasMore(false);
      setData((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
    } catch (err: any) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [page, limit, url, hasMore, loading]);

  useEffect(() => {
    loadMore();
  }, []); // Load first page

  return { data, loading, error, loadMore, hasMore };
}
