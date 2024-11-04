import sortBy from 'lodash/sortBy';

import { Currency } from '@/screens/Settings/currency';
import type { RemoteAsset } from '@/types';
import { calculateBalance } from '@/utils/calculateBalance';

import { getNetworkNameFromAssetId } from './utils';

import type { RealmToken } from './schema';
import type { useTokenPrices } from '../tokenPrice';


export const sortTokensAlphabetically = {
  
  
  lodash: (token: Pick<RealmToken | RemoteAsset, 'assetId' | 'metadata'>) => {
    return [token.metadata.label.toLowerCase(), token.metadata.symbol.toLowerCase(), getNetworkNameFromAssetId(token.assetId)];
  },
  realm: ['metadata.label', 'metadata.symbol', 'wallet.type'],
};

const sortTokensByFiatValueDesc = (tokenPrices: ReturnType<typeof useTokenPrices>) => {
  return (token: RealmToken) => {
    if (token.balance === '0') {
      return 1; 
    }
    
    const tokenPriceInUsd: number = parseFloat(tokenPrices.find(tp => tp.assetId === token.assetId)?.fiatValue[Currency.USD].value ?? '0');
    const balanceInUsd = calculateBalance({ price: tokenPriceInUsd, balance: token.balance, decimals: token.metadata.decimals });

    return balanceInUsd * -1; 
  };
};

export const sortTokensByFiatValue = (tokens: RealmResults<RealmToken>, tokenPrices: ReturnType<typeof useTokenPrices>): RealmToken[] => {
  return sortBy(tokens.sorted(sortTokensAlphabetically.realm), sortTokensByFiatValueDesc(tokenPrices));
};
