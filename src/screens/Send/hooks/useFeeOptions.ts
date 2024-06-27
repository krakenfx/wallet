import { useCallback, useEffect, useMemo, useState } from 'react';

import { FeeOptionKind } from '@/api/types';
import { FeeOptions, RealmishWallet } from '@/onChain/wallets/base';
import { getImplForWallet } from '@/onChain/wallets/registry';

import { handleError } from '/helpers/errorHandler';

const order: Record<FeeOptionKind, number> = {
  fast: 0,
  medium: 1,
  slow: 2,
  default: 3,
};

export const useFeeOptions = (wallet: RealmishWallet, disabled?: boolean) => {
  const { network, transport } = useMemo(() => getImplForWallet(wallet), [wallet]);
  const [selectedFee, setSelectedFee] = useState<FeeOptionKind>();
  const [fetchedFees, setFetchedFees] = useState<FeeOptions['options']>([]);

  const fetchFeeOptions = useCallback(() => {
    transport
      .getFeesEstimate(network)
      .then(feeOptions => {
        setFetchedFees(feeOptions.options.sort((a, b) => order[a.kind] - order[b.kind]));
      })
      .catch(error => {
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
      });
  }, [network, transport]);

  useEffect(() => {
    if (!disabled) {
      fetchFeeOptions();
    }
  }, [disabled, fetchFeeOptions]);

  return {
    selectedFee,
    setSelectedFee,
    fees: fetchedFees,
    fetchFeeOptions,
  };
};
