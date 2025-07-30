import { useState } from 'react';

export function useVirtualScroll<T>(data: T[], rowHeight = 40, containerHeight = 400) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = data.length * rowHeight;
  const visibleCount = Math.ceil(containerHeight / rowHeight);
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = startIndex + visibleCount;

  const visibleData = data.slice(startIndex, endIndex);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return {
    visibleData,
    totalHeight,
    scrollTop,
    startIndex,
    endIndex,
    onScroll,
  };
}
