import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type UseInfiniteScrollProps = {
  isFetching?: boolean;
  setFilters?: React.Dispatch<React.SetStateAction<any>>;
};

export const useInfiniteScroll = ({ isFetching, setFilters }: UseInfiniteScrollProps) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetching) {
      //@ts-ignore
      setFilters((prev: any) => ({
        ...prev,
        limit: prev?.limit ? prev.limit + 10 : 10,
      }));
    }
  }, [inView, isFetching, setFilters]);

  return { ref };
};
