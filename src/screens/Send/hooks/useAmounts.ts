import BigNumber from 'bignumber.js';

import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useTokenPrice } from '@/realm/tokenPrice';
import { useRealmWalletById } from '@/realm/wallets';
import { formatCurrency } from '@/utils/formatCurrency';
import { unitConverter } from '@/utils/unitConverter';

import { Amounts, FeeEstimationMap, TransactionParams } from '../types';
import { totalFeeToFiatString } from '../utils/totalFeeToFiatString';

interface UseAmountsProps {
  transactionParams: TransactionParams;
  feeEstimates?: FeeEstimationMap;
  selectedFee?: 'slow' | 'medium' | 'fast' | 'default' | undefined;
  walletId: string;
  nativeTokenCaipId: string;
}

export const useAmounts = ({ nativeTokenCaipId, walletId, selectedFee, feeEstimates, transactionParams }: UseAmountsProps): Amounts | null => {
  const tokenPrice = useTokenPrice({ assetId: transactionParams.type !== 'nft' ? transactionParams.token.assetId : '' });
  const { currency } = useAppCurrency();
  const wallet = useRealmWalletById(walletId);
  const feePrice = useTokenPrice({ assetId: nativeTokenCaipId }) ?? 0;

  if (!feeEstimates || !selectedFee) {
    return null;
  }

  return {
    amountFiat:
      transactionParams.type !== 'nft' && tokenPrice
        ? formatCurrency(unitConverter.tokenUnit2Fiat(new BigNumber(transactionParams.amount), tokenPrice).toFixed(2), { currency })
        : undefined,
    feeFiat: totalFeeToFiatString(currency, feeEstimates[selectedFee], wallet, feePrice),
    fee: feeEstimates[selectedFee],
    feePrice,
  };
};
