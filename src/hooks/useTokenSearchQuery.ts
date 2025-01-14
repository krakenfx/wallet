import { compact } from 'lodash';
import { useMemo } from 'react';

import type { RealmToken } from '@/realm/tokens';
import { getSearchScore } from '@/screens/CoinsList/utils/getSearchScore';
import type { RemoteAsset } from '@/types';

export const useTokenSearchQuery = <T extends RealmToken | RemoteAsset | string>(
  tokens: T[],
  searchQuery?: string,
  transformSearchScore?: (t: RealmToken | RemoteAsset, score: number) => number,
) => {
  return useMemo(() => {
    if (searchQuery) {
      const searchQuery_ = searchQuery.toLowerCase();
      const filteredTokens = compact(
        tokens.map(token => {
          if (typeof token === 'string') {
            return undefined;
          }
          const score = getSearchScore(searchQuery_, token);
          return {
            token: token,
            score: transformSearchScore ? transformSearchScore(token, score) : score,
          };
        }),
      );

      return filteredTokens
        .filter(a => a.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ token }) => token);
    }

    return tokens;
  }, [searchQuery, tokens, transformSearchScore]);
};
