import { useMemo } from 'react';

import { useAssetMetadata } from '@/realm/assetMetadata';
import { RealmTransaction } from '@/realm/transactions';
import { SwapTransactionData } from '@/realm/transactions/getTransactionMetadata';

import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';

import { getSwapMetadata } from './getSwapMetadata';

type Props = {
  assetAmount: string;
  appCurrencyValue: string;
  classifiedTx: SwapTransactionData;
  description: string;
  item: RealmTransaction;
  title: string;
  symbol?: string;
};

export const useSwapTransactionDetailsDisplayData = ({ assetAmount, appCurrencyValue, classifiedTx, description, item, title }: Props) => {
  const sentMetadata = useAssetMetadata({
    assetId: classifiedTx.sent.assetId,
    realmQueueName: TRANSACTIONS_REALM_QUEUE_KEY,
  });
  const receiveMetadata = useAssetMetadata({
    assetId: classifiedTx.receive.assetId,
    realmQueueName: TRANSACTIONS_REALM_QUEUE_KEY,
  });
  const swapMetadata = useMemo(() => getSwapMetadata(classifiedTx.type, { sentMetadata, receiveMetadata }), [classifiedTx.type, sentMetadata, receiveMetadata]);

  const displayData = useMemo(() => {
    return {
      title,
      description,
      appCurrencyValue,
      tokenAmount: assetAmount === '' ? '0' : assetAmount,
      transactionType: classifiedTx.type,
      networkFee: item.fee,
      swapMetadata,
    };
  }, [classifiedTx.type, item.fee, description, appCurrencyValue, title, assetAmount, swapMetadata]);

  return displayData;
};
