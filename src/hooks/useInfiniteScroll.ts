import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({ loading, hasMore, onLoadMore }: UseInfiniteScrollProps) => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && !loading && hasMore) {
      onLoadMore();
    }
  }, [inView, loading, hasMore, onLoadMore]);

  return { ref };
};
