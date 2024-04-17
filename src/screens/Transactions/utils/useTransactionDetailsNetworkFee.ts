import { useMemo } from 'react';

import { NativeTokenSymbol } from '@/onChain/wallets/base';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useTokenPrice } from '@/realm/tokenPrice';
import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';

import { getDisplayNetworkFee } from '../utils/getDisplayNetworkFee';

type Props = {
  assetId: string;
  nativeTokenDecimals: number;
  nativeTokenSymbol: NativeTokenSymbol;
  networkFee?: string | null;
};

export const useTransactionDetailsNetworkFee = ({ assetId, nativeTokenDecimals, nativeTokenSymbol, networkFee }: Props) => {
  const tokenPrice = useTokenPrice({ assetId, realmQueueName: TRANSACTIONS_REALM_QUEUE_KEY });
  const { currency } = useAppCurrency();

  const networkFeeAmountAndPrice = useMemo(
    () => getDisplayNetworkFee({ nativeTokenDecimals, nativeTokenSymbol, networkFee, tokenPrice, currency }),
    [nativeTokenDecimals, nativeTokenSymbol, networkFee, tokenPrice, currency],
  );

  return networkFeeAmountAndPrice;
};
