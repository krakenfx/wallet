import { useMemo } from 'react';

import { useTokenPrice } from '@/realm/tokenPrice';
import { getAvailableTokenBalance } from '@/realm/tokens/getAvailableTokenBalance';
import { RealmPendingTransaction } from '@/realm/transactions';
import { calculateBalance } from '@/utils/calculateBalance';

export const useAppCurrencyValue = (token: { assetId: string; metadata: { decimals: number } } | undefined, balance: string, realmQueueName?: string) => {
  const realmTokenPrice = useTokenPrice({ assetId: token?.assetId, realmQueueName });

  return useMemo(
    () =>
      token && realmTokenPrice
        ? calculateBalance({
            price: realmTokenPrice,
            balance,
            decimals: token.metadata.decimals,
          })
        : undefined,
    [balance, realmTokenPrice, token],
  );
};

export const useTokenBalanceConvertedToAppCurrency = (token: {
  balance: string;
  assetId: string;
  metadata: { decimals: number };
  pendingTransactions?: Realm.List<RealmPendingTransaction>;
}) => {
  const appCurrencyValue = useAppCurrencyValue(token, getAvailableTokenBalance(token));
  return (appCurrencyValue || 0) > 0 ? appCurrencyValue : 0;
};
