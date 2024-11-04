import { useMemo } from 'react';

import type { Transaction } from '@/api/types';
import type { AssetMetadata } from '@/realm/assetMetadata';
import type { RealmToken } from '@/realm/tokens';
import type { RealmTransaction } from '@/realm/transactions';
import type { ContractInteractionData } from '@/realm/transactions/getTransactionMetadata';

import { getTransactionDisplayData } from './getTransactionDisplayData';
import { useCommonTransactionDisplayData } from './useCommonTransactionDisplayData';

import type { DisplayData } from '../../components/types';

type Props = {
  item: RealmTransaction;
  parsedTx: Transaction;
  classifiedTx: ContractInteractionData;
  contextToken?: RealmToken;
  testID?: string;
  txMetadata?: AssetMetadata;
};

export const useContractInteractionDisplayData = ({ item, classifiedTx, parsedTx, contextToken, testID }: Props): DisplayData => {
  const data = useMemo(
    () =>
      getTransactionDisplayData({
        classifiedTx,
        contextToken,
        item,
        parsedTx,
        testID,
        wallet: item.wallet,
      }),
    [classifiedTx, contextToken, item, parsedTx, testID],
  );

  return useCommonTransactionDisplayData(data, classifiedTx);
};
