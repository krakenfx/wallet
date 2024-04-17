import { useMemo } from 'react';

import { Transaction } from '@/api/types';
import { AssetMetadata } from '@/realm/assetMetadata';
import { RealmToken } from '@/realm/tokens';
import { RealmTransaction } from '@/realm/transactions';
import { SimpleTransactionData } from '@/realm/transactions/getTransactionMetadata';

import { DisplayData } from '../../components/types';

import { getTransactionDisplayData } from './getTransactionDisplayData';
import { useCommonTransactionDisplayData } from './useCommonTransactionDisplayData';

type Props = {
  item: RealmTransaction;
  parsedTx: Transaction;
  classifiedTx: SimpleTransactionData;
  contextToken?: RealmToken;
  testID?: string;
  txMetadata?: AssetMetadata;
};

export const useSimpleTransactionDisplayData = ({ item, classifiedTx, parsedTx, contextToken, txMetadata, testID }: Props): DisplayData => {
  const data = useMemo(
    () =>
      getTransactionDisplayData({
        classifiedTx,
        contextToken,
        item,
        parsedTx,
        testID,
        txMetadata,
        wallet: item.wallet,
      }),
    [classifiedTx, contextToken, item, parsedTx, testID, txMetadata],
  );

  return useCommonTransactionDisplayData(data, classifiedTx);
};
