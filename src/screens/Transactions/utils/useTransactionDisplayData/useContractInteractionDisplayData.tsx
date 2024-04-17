import { useMemo } from 'react';

import { Transaction } from '@/api/types';
import { AssetMetadata } from '@/realm/assetMetadata';
import { RealmToken } from '@/realm/tokens';
import { RealmTransaction } from '@/realm/transactions';
import { ContractInteractionData } from '@/realm/transactions/getTransactionMetadata';

import { DisplayData } from '../../components/types';

import { getTransactionDisplayData } from './getTransactionDisplayData';
import { useCommonTransactionDisplayData } from './useCommonTransactionDisplayData';

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
