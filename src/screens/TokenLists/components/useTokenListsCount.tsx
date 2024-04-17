import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { fetchTokenLists } from '@/utils/fetchTokenLists';

import { BLACKLISTED } from '../const';

export const useTokenListsCount = (): Record<string, string> => {
  const [tokenListsCount, setTokenListsCount] = useState<Record<string, string>>({});

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const response = await fetchTokenLists();

        if (response?.content?.tokenCount) {
          const tokenCount = response?.content?.tokenCount;
          const nextState: Record<string, string> = {};

          const blacklistsTotal = tokenCount.blacklists?.total;

          if (blacklistsTotal) {
            nextState[BLACKLISTED] = String(blacklistsTotal);
          }

          const whitelists = tokenCount.whitelists;

          if (whitelists) {
            delete whitelists.total;

            Object.assign(nextState, whitelists);
          }

          setTokenListsCount(nextState);
        }
      })();
    }, []),
  );

  return tokenListsCount;
};
