import { useTokenListsQuery } from '@/reactQuery/hooks/useTokenListsQuery';

export const useTokenListsCount = (): Record<string, number> => {
  const { data } = useTokenListsQuery();

  return data?.tokenCount.whitelists ?? {};
};
