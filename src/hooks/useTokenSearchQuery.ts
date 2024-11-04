import { useMemo } from 'react';

import type { RealmToken } from '@/realm/tokens';
import type { RemoteAsset } from '@/types';

export const useTokenSearchQuery = <T extends RealmToken | RemoteAsset>(tokens: T[], searchQuery?: string) => {
  return useMemo(() => {
    if (searchQuery) {
      const searchQuery_ = searchQuery.toLowerCase();
      const filteredTokens = tokens.filter(t => {
        const testString = (t.metadata.label + ' ' + t.metadata.symbol + ' ' + t.metadata.tokenAddress).toLowerCase();
        
        return testString.startsWith(searchQuery_) || testString.includes(` ${searchQuery_}`);
      });

      return filteredTokens;
    }
    return tokens;
  }, [tokens, searchQuery]);
};
