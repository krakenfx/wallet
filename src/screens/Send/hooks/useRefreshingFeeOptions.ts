import { useIsFocused } from '@react-navigation/native';
import { useEffect, useMemo } from 'react';

import { FeeOptionKind } from '@/api/types';
import { RealmWallet } from '@/realm/wallets';

import { useFeeOptions } from './useFeeOptions';

import { handleError } from '/helpers/errorHandler';

export const useRefreshingFeeOptions = (wallet: RealmWallet, refreshInBackground?: boolean, defaultFeeOption?: FeeOptionKind) => {
  const { selectedFee, setSelectedFee, fetchFeeOptions, fees } = useFeeOptions(wallet);

  const refreshPeriodInSeconds = useMemo(() => {
    switch (wallet.type) {
      case 'HDsegwitBech32':
      case 'dogecoin':
        return 60;
      case 'ethereum':
      case 'polygon':
      case 'solana':
        return 15;
      default:
        return 30;
    }
  }, [wallet.type]);

  const isFocused = useIsFocused();

  const canRefresh = refreshInBackground || isFocused;

  useEffect(() => {
    if (selectedFee) {
      return;
    }

    if (defaultFeeOption) {
      setSelectedFee(defaultFeeOption);
    } else if (fees.length && !selectedFee) {
      setSelectedFee(defaultFeeOption ?? fees[0].kind);
    }
  }, [defaultFeeOption, fees, selectedFee, setSelectedFee]);

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    async function refreshEstimate() {
      if (canRefresh) {
        try {
          fetchFeeOptions();
        } catch (e) {
          handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
        }
      }
    }
    if (!interval) {
      interval = setInterval(refreshEstimate, refreshPeriodInSeconds * 1000);
    }
    return () => clearInterval(interval);
  }, [canRefresh, refreshPeriodInSeconds, fetchFeeOptions]);

  return {
    selectedFee,
    setSelectedFee,
    fees,
  };
};
