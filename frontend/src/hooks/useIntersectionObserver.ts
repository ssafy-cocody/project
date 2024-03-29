import { InfiniteQueryObserverResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface IuseIntersectionObserverProps {
  threshold?: number;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => Promise<InfiniteQueryObserverResult>;
}

export const useIntersectionObserver = ({ hasNextPage, fetchNextPage }: IuseIntersectionObserverProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref.current]);

  return { ref };
};
