import { useQuery } from '@tanstack/react-query';

import { fetchExploreFeed } from '@/api/fetchExploreFeed';
import { useCurrentAccountNumber } from '@/realm/accounts';

const STALE_HOURS = 24;
const HOUR_IN_MILLISECONDS = 3600000;
export const useExploreFeed = (slug?: string) => {
  const queryKey: string = slug ? `explore/${slug}` : `explore`;
  const accountNumber = useCurrentAccountNumber();

  return useQuery({
    queryKey: [queryKey, accountNumber],
    staleTime: STALE_HOURS * HOUR_IN_MILLISECONDS,
    gcTime: Infinity,
    queryFn: () => fetchExploreFeed(slug),
  });
};
