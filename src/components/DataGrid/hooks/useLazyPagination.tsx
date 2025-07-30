import { User } from "@/types/api.types";
import { useCallback, useEffect, useRef, useState } from "react";

 const useLazyPagination=(data: User[], pageSize: number) =>{
  const [visibleCount, setVisibleCount] = useState(pageSize / 3);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const visibleData = data.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    if (isLoading || visibleCount >= data.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize / 3, data.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, visibleCount, data.length, pageSize]);

  useEffect(() => {
    if (!observerRef.current) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    });

    observer.current.observe(observerRef.current);
    return () => observer.current?.disconnect();
  }, [loadMore]);

  return { visibleData, observerRef, isLoading, setVisibleCount };
}
export default useLazyPagination
