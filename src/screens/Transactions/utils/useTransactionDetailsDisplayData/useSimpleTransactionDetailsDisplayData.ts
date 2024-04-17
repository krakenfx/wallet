import { useMemo } from 'react';

import { RealmTransaction } from '@/realm/transactions';
import { SimpleTransactionData } from '@/realm/transactions/getTransactionMetadata';

type Props = {
  assetAmount: string;
  appCurrencyValue: string;
  classifiedTx: SimpleTransactionData;
  description: string;
  item: RealmTransaction;
  title: string;
  symbol?: string;
};

export const useSimpleTransactionDetailsDisplayData = ({ assetAmount, appCurrencyValue, classifiedTx, description, symbol, item, title }: Props) => {
  const displayData = useMemo(() => {
    return {
      title,
      description,
      appCurrencyValue,
      tokenAmount: assetAmount === '' ? '0' : assetAmount,
      symbol: symbol,
      transactionType: classifiedTx.type,
      networkFee: item.fee,
    };
  }, [title, description, appCurrencyValue, assetAmount, symbol, classifiedTx.type, item.fee]);

  return displayData;
};
