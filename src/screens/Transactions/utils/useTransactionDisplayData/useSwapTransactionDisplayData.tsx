import { useMemo } from 'react';

import { Transaction } from '@/api/types';
import { AssetMetadata, useAssetMetadata } from '@/realm/assetMetadata';
import { RealmToken } from '@/realm/tokens';
import { RealmTransaction } from '@/realm/transactions';
import { SwapTransactionData } from '@/realm/transactions/getTransactionMetadata';
import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';

import { DisplayData } from '../../components/types';

import { getTransactionDisplayData } from './getTransactionDisplayData';
import { useCommonTransactionDisplayData } from './useCommonTransactionDisplayData';

type Props = {
  item: RealmTransaction;
  parsedTx: Transaction;
  classifiedTx: SwapTransactionData;
  contextToken?: RealmToken;
  testID?: string;
  txMetadata?: AssetMetadata;
};

export const useSwapTransactionDisplayData = ({ item, classifiedTx, parsedTx, contextToken, testID }: Props): DisplayData => {
  const txSwapSentMetadata = useAssetMetadata({
    assetId: classifiedTx.sent.assetId,
    realmQueueName: TRANSACTIONS_REALM_QUEUE_KEY,
  });
  const txSwapReceiveMetadata = useAssetMetadata({
    assetId: classifiedTx.receive.assetId,
    realmQueueName: TRANSACTIONS_REALM_QUEUE_KEY,
  });

  const data = useMemo(
    () =>
      getTransactionDisplayData({
        classifiedTx,
        contextToken,
        item,
        parsedTx,
        testID,
        txSwapReceiveMetadata,
        txSwapSentMetadata,
        wallet: item.wallet,
      }),
    [classifiedTx, contextToken, item, parsedTx, testID, txSwapReceiveMetadata, txSwapSentMetadata],
  );

  return useCommonTransactionDisplayData(data, classifiedTx);
};
