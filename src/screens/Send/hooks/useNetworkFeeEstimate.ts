import { useEffect, useMemo } from 'react';

import { useAppCurrency } from '@/realm/settings';
import { useTokenPrice } from '@/realm/tokenPrice';
import { useRealmWalletById } from '@/realm/wallets';
import { useFeeEstimates } from '@/screens/Send/hooks/useFeeEstimates';
import { useFeeOptions } from '@/screens/Send/hooks/useFeeOptions';
import { getDefaultFeeOption } from '@/screens/Send/utils/getDefaultFeeOption';
import { FeeOptionsData, getFeeOptionsData } from '@/screens/Send/utils/getFeeOptionsData';

export const useNetworkFeeEstimate = (walletId: string, disabled?: boolean): FeeOptionsData | undefined => {
  const wallet = useRealmWalletById(walletId);
  const defaultFeeOption = getDefaultFeeOption(wallet);
  const { currency } = useAppCurrency();

  const feePrice = useTokenPrice({ assetId: wallet.nativeTokenCaipId }) ?? 0;

  const { fees, setSelectedFee, selectedFee } = useFeeOptions(wallet, disabled);

  useEffect(() => {
    if (selectedFee) {
      return;
    }
    if (fees.length && !selectedFee) {
      setSelectedFee(defaultFeeOption ?? fees[0].kind);
    }
  }, [defaultFeeOption, fees, selectedFee, setSelectedFee]);

  const { feeEstimates } = useFeeEstimates(wallet, fees, false, null, selectedFee, false, disabled);

  return useMemo(() => {
    if (!selectedFee || !feeEstimates?.[selectedFee]) {
      return;
    }

    return getFeeOptionsData(fees, wallet, feeEstimates, currency, feePrice, true).filter(o => o.id === selectedFee)[0];
  }, [currency, feeEstimates, feePrice, fees, selectedFee, wallet]);
};
