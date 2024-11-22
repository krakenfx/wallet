import { REPUTATION, getReputation } from '@/hooks/useReputation';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { Currency } from '@/screens/Settings/currency';
import { calculateBalance } from '@/utils/calculateBalance';

import type { PriceHistoryPeriod, RealmTokenPrice } from './schema';
import type { RealmToken, Token } from '../tokens';

export const getPriceHistoryId = (assetId: string, period: PriceHistoryPeriod) => `${assetId}:${period}`;

const MIN_USD_BALANCE_FOR_GALLERY = 1;

export const checkTokenGalleryChange = (token: RealmToken, price: RealmTokenPrice): Token['inGallery'] => {
  if (token.inGallery === 'manuallyAdded' || token.inGallery === 'manuallyRemoved') {
    return undefined;
  }
  const tokenReputation = getReputation(token.metadata);
  const isNativeToken = Object.values(ChainAgnostic).includes(token.assetId);
  if (tokenReputation === REPUTATION.WHITELISTED || isNativeToken) {
    if (parseFloat(token.balance) > 0) {
      return 'autoAdded';
    }
    return 'autoRemoved';
  }

  if (tokenReputation === REPUTATION.UNVERIFIED) {
    const priceUsdValue = price.fiatValue[Currency.USD].value;
    const value = priceUsdValue !== undefined ? parseFloat(priceUsdValue) : 0;
    const balanceInUsd = calculateBalance({ price: value, balance: token.balance, decimals: token.metadata.decimals });

    return balanceInUsd >= MIN_USD_BALANCE_FOR_GALLERY ? 'autoAdded' : 'autoRemoved';
  }

  return undefined;
};
