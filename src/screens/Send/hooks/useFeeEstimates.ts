import { useFocusEffect } from '@react-navigation/native';
import { fromPairs } from 'lodash';
import { useCallback, useMemo, useState } from 'react';

import { FeeOption, FeeOptionKind } from '@/api/types';
import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import { FeeOptions, PreparedTransaction } from '@/onChain/wallets/base';
import { PrepareError } from '@/onChain/wallets/bitcoin';
import { EVMNetwork } from '@/onChain/wallets/evm';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { RealmWallet } from '@/realm/wallets';

import { FeeEstimationMap } from '../types';

import { handleError } from '/helpers/errorHandler';

type SimulationData = PreparedTransaction | ((fee: FeeOption) => Promise<PreparedTransaction | void>);

export const useFeeEstimates = (
  wallet: RealmWallet,
  options: FeeOptions['options'],
  isTxDataValid: boolean,
  simulation: SimulationData,
  selectedFee?: FeeOptionKind,
  isNFT?: boolean,
) => {
  const { network, transport } = useMemo(() => getImplForWallet(wallet), [wallet]);
  const getWalletStorage = useGetWalletStorage();
  const [useDefaultTx, setUseDefaultTx] = useState(!isTxDataValid && !isNFT);

  const [isLoading, setIsLoading] = useState(false);

  const [feeEstimates, setFeeEstimates] = useState<FeeEstimationMap>();

  const getTransaction = useCallback(async () => {
    if (typeof simulation === 'object') {
      return simulation;
    } else {
      const fee = options.find(o => o.kind === selectedFee) ?? options[0];
      if (!fee) {
        return;
      }
      return await simulation(fee);
    }
  }, [options, selectedFee, simulation]);

  const fetchEstimates = useCallback(async () => {
    if (!options.length) {
      return;
    }

    try {
      setIsLoading(true);
      const transaction = await getTransaction();
      if (!transaction) {
        return;
      }
      const pairs = await Promise.all(
        options.map(option => transport.estimateTransactionCost(network, wallet, transaction, option).then(totalFee => [option.kind, totalFee])),
      );
      setFeeEstimates(fromPairs(pairs) as FeeEstimationMap);
      if (useDefaultTx) {
        setUseDefaultTx(false);
      }
    } catch (error) {
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    } finally {
      setIsLoading(false);
    }
  }, [options, getTransaction, useDefaultTx, transport, network, wallet]);

  const isDefaultEstimateSupported = useMemo(() => {
    return !(network instanceof EVMNetwork) || !!network.defaultGasLimit;
  }, [network]);

  const fetchDefaultEstimates = useCallback(async () => {
    if (!options.length) {
      return;
    }

    try {
      setIsLoading(true);
      const store = await getWalletStorage(wallet);
      const pairs = await Promise.all(
        options.map(option => transport.estimateDefaultTransactionCost(network, wallet, store, option).then(totalFee => [option.kind, totalFee])),
      );
      setFeeEstimates(fromPairs(pairs) as FeeEstimationMap);
    } catch (error) {
      if (error instanceof PrepareError && error.reason === 'exceedingBalance') {
        return;
      }
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    } finally {
      setIsLoading(false);
    }
  }, [options, getWalletStorage, wallet, transport, network]);

  useFocusEffect(
    useCallback(() => {
      if (isTxDataValid || !useDefaultTx) {
        fetchEstimates();
      } else if (isDefaultEstimateSupported) {
        fetchDefaultEstimates();
      }
    }, [isTxDataValid, useDefaultTx, isDefaultEstimateSupported, fetchEstimates, fetchDefaultEstimates]),
  );

  return {
    fetchEstimates,
    feeEstimates,
    isLoading,
  };
};
