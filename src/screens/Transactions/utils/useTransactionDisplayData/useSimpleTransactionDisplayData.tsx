import { useMemo } from 'react';

import type { Transaction } from '@/api/types';
import type { AssetMetadata } from '@/realm/assetMetadata';
import type { RealmToken } from '@/realm/tokens';
import type { RealmTransaction } from '@/realm/transactions';
import type { SimpleTransactionData } from '@/realm/transactions/getTransactionMetadata';

import { getTransactionDisplayData } from './getTransactionDisplayData';
import { useCommonTransactionDisplayData } from './useCommonTransactionDisplayData';

import type { DisplayData } from '../../components/types';

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
