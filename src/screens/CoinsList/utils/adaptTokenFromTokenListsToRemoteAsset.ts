import { RemoteAsset } from '@/types';

import { TokenFromTokenLists } from '../types';

export function adaptTokenFromTokenListsToRemoteAsset(tokenFromTokenLists: TokenFromTokenLists): RemoteAsset {
  const { decimals } = tokenFromTokenLists;

  return {
    assetId: tokenFromTokenLists.caipId,
    balance: '0',
    metadata: {
      label: tokenFromTokenLists.name ?? '',
      symbol: tokenFromTokenLists.symbol ?? '',
      
      
      decimals: typeof decimals === 'number' ? decimals : typeof decimals === 'string' ? Number(decimals) : 2,
      reputation: {
        whitelists: tokenFromTokenLists.lists,
        blacklists: [] ,
      },
    },
    type: 'remoteAsset',
  };
}
