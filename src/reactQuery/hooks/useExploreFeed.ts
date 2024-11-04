import { useQuery } from '@tanstack/react-query';

import { fetchExploreFeed } from '@/api/fetchExploreFeed';

const STALE_HOURS = 24;
const HOUR_IN_MILLISECONDS = 3600000;
export const useExploreFeed = (slug?: string) => {
  const queryKey: string = slug ? `explore/${slug}` : `explore`;
  return useQuery({
    queryKey: [queryKey],
    staleTime: STALE_HOURS * HOUR_IN_MILLISECONDS,
    gcTime: Infinity,
    queryFn: () => fetchExploreFeed(slug),
  });
};
