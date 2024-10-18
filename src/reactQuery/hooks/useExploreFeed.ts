import { useQuery } from '@tanstack/react-query';

import { fetchExploreFeed } from '@/api/fetchExploreFeed';

const STALE_HOURS = 24;
const HOUR_IN_MILLISECONDS = 3600000;
export const useExploreFeed = () => {
  return useQuery({
    queryKey: ['explore'],
    staleTime: STALE_HOURS * HOUR_IN_MILLISECONDS,
    gcTime: Infinity,
    queryFn: () => fetchExploreFeed().then(res => res),
  });
};
