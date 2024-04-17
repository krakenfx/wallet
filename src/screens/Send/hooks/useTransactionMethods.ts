import { useMemo } from 'react';

import { FeeOption } from '@/api/types';
import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import { RealmWallet } from '@/realm/wallets';

import { TransactionParams } from '../types';
import { getCoinTransactionMethods } from '../utils/getCoinTransactionMethods';
import { getNFTTransactionMethods } from '../utils/getNFTTransactionMethods';
import { getTokenTransactionMethods } from '../utils/getTokenTransactionMethods';

export function useTransactionMethods<TType, TRequest, TFeeOption extends FeeOption>(wallet: RealmWallet, params?: TransactionParams) {
  const getWalletStorage = useGetWalletStorage();

  const methods = useMemo(() => {
    if (!params) {
      return;
    }
    switch (params.type) {
      case 'coin':
        return getCoinTransactionMethods<TType, TRequest, TFeeOption>(wallet, getWalletStorage, params);
      case 'nft':
        return getNFTTransactionMethods<TType, TRequest, TFeeOption>(wallet, getWalletStorage, params);
      case 'token':
        return getTokenTransactionMethods<TType, TRequest, TFeeOption>(wallet, getWalletStorage, params);
    }
  }, [params, getWalletStorage, wallet]);

  return methods;
}
